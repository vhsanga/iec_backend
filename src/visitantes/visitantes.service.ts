import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Miembro } from 'src/entities/miembro.entity';
import { RegistroVisita } from 'src/entities/registro_visita.entity';
import { extname } from 'path';
import { AwsService } from 'src/aws/aws.service';


@Injectable()
export class VisitantesService {
  constructor(
    // Inyección del EntityManager para transacciones
    private readonly em: EntityManager, 
    // Inyección de los repositorios de las entidades
    @InjectRepository(RegistroVisita)
    private readonly registroRepository: EntityRepository<RegistroVisita>,
    @InjectRepository(Miembro)
    private readonly miembroRepository: EntityRepository<Miembro>,
    private readonly awsService: AwsService,
  ) {}

  /**
   * Registra una nueva entrada de visitante.
   * @param data Datos del visitante a registrar.
   * @returns El objeto de registro creado.
   */
  async registrarEntrada(data: CreateVisitanteDto): Promise<RegistroVisita> {
    const { cedula, idMiembroRecibe, nombres, institucion, motivo, urlFoto } = data;

    // 1. Verificar si el visitante ya tiene un registro de entrada pendiente (hora_salida NULL)
    const visitaPendiente = await this.registroRepository.findOne({ 
      cedula: cedula, 
      horaSalida: null // Buscamos registros donde aún no hay hora de salida
    });

    if (visitaPendiente) {
      throw new BadRequestException(`El visitante con cédula ${cedula} ya tiene una entrada registrada a las ${visitaPendiente.horaEntrada.toLocaleTimeString()} y aún no ha marcado su salida.`);
    }

    // 2. Verificar que el Miembro que recibe exista (Integridad de la FK)
    const miembro = await this.miembroRepository.findOne(idMiembroRecibe);
    if (!miembro) {
      throw new NotFoundException(`El Miembro con ID ${idMiembroRecibe} no fue encontrado.`);
    }
    
    // 3. Crear y persistir el nuevo registro
    const nuevoRegistro = this.registroRepository.create({
      nombres,
      cedula,
      institucion,
      motivo,
      idMiembroRecibe: miembro, 
      horaEntrada: new Date(),
      urlFoto,
      fechaCreacion: new Date(),
    });

    // Guardar en la base de datos
    await this.em.persistAndFlush(nuevoRegistro);
    
    return nuevoRegistro;
  }

  async guardarFoto(idusuario:number, file: Express.Multer.File){
        if (!file) {
            throw new Error('No se ha subido ningún archivo');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Formato no soportado. Solo se permiten imágenes.');
        }
        const visita = await this.registroRepository.findOne(idusuario);
        if (!visita) {
          throw new NotFoundException(`Registro de visitante con ID ${idusuario} no encontrado.`);
        }
        const carpetaS3 = 'visitas/';
        const extension = extname(file.originalname); 
        const s3Key = `${carpetaS3}${idusuario}${extension}`;
        let urlImagen = await this.awsService.subirArchivoToAWSs3(s3Key, file.buffer);
        visita.urlFoto = urlImagen;
        await this.em.persistAndFlush(visita);
        return visita;
    }

}
