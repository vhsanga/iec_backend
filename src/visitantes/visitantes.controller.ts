import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { VisitantesService } from './visitantes.service';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { RegistroVisita } from 'src/entities/registro_visita.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('visitantes')
export class VisitantesController {
  constructor(private readonly visitantesService: VisitantesService) {}

  @Post('entrada')
  async registrarEntrada(@Body() data: CreateVisitanteDto): Promise<RegistroVisita> {
    try {
      return await this.visitantesService.registrarEntrada(data);
    } catch (error) {
      // Manejamos las excepciones específicas del servicio (NotFound, BadRequest)
      if (error instanceof HttpException) {
        throw error;
      }
      // Manejo genérico de otros errores de base de datos o lógica
      throw new HttpException('Error interno al procesar el registro de entrada.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('imagen/:id') // 1. 🚨 CAMBIO: Incluye el parámetro de ruta ':id'
  @UseInterceptors(FileInterceptor('img'))
  async setVisitaImg(
    @UploadedFile(
      new ParseFilePipe({ /* ... opciones de validación ... */ })
    ) file: Express.Multer.File, 
    @Param('id') visitanteId: string 
    
  ) {
    const id = parseInt(visitanteId, 10); 
    return this.visitantesService.guardarFoto(id, file); 
  }

}
