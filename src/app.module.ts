import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitantesModule } from './visitantes/visitantes.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/mysql';
import { Miembro } from './entities/miembro.entity';
import { RegistroVisita } from './entities/registro_visita.entity';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      // Usamos useFactory para construir el objeto de configuración de forma asíncrona
      useFactory: () => defineConfig({
        // 🚨 Ya no se necesita 'type', el driver lo da defineConfig

        // 1. Credenciales de Conexión
        host: '127.0.0.1', 
        port: 3306,
        user: 'remoto', 
        password: 'P@ss4930', // ¡CAMBIA ESTO!
        dbName: 'iec', // ¡CAMBIA ESTO!
        
        // 2. Definición de Entidades
        // Usamos las clases de entidades importadas
        entities: [Miembro, RegistroVisita], 
        entitiesTs: ['./src/**/*.entity.ts'],
        
        // 3. Opciones Generales
        debug: true, 
        allowGlobalContext: true, // Útil en NestJS
        
      }),
      // Opcional: Definir las inyecciones si la configuración dependiera de otros servicios.
      // inject: [], 
    }),
    VisitantesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
