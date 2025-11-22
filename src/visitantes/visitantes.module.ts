import { Module } from '@nestjs/common';
import { VisitantesService } from './visitantes.service';
import { VisitantesController } from './visitantes.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RegistroVisita } from 'src/entities/registro_visita.entity';
import { Miembro } from 'src/entities/miembro.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    // Importamos las entidades que usará este módulo.
    MikroOrmModule.forFeature([RegistroVisita, Miembro]),
    AwsModule
  ],
  controllers: [VisitantesController],
  providers: [VisitantesService],
})
export class VisitantesModule {}
