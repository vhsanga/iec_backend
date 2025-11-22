import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Miembro } from 'src/entities/miembro.entity';
import { RegistroVisita } from 'src/entities/registro_visita.entity';


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

  create(createVisitanteDto: CreateVisitanteDto) {
    return 'This action adds a new visitante';
  }

  findAll() {
    return `This action returns all visitantes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitante`;
  }


  remove(id: number) {
    return `This action removes a #${id} visitante`;
  }
}
