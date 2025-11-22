import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VisitantesService } from './visitantes.service';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { RegistroVisita } from 'src/entities/registro_visita.entity';

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

  @Post()
  create(@Body() createVisitanteDto: CreateVisitanteDto) {
    return this.visitantesService.create(createVisitanteDto);
  }

  @Get()
  findAll() {
    return this.visitantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitantesService.findOne(+id);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitantesService.remove(+id);
  }
}
