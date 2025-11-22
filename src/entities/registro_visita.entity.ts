
import { Entity, PrimaryKey, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { Miembro } from './miembro.entity';


@Entity({ tableName: 'registro_visitas' })
export class RegistroVisita {

  @PrimaryKey()
  id!: number; // Clave Primaria (INT AUTO_INCREMENT)

  @Property({ length: 100, comment: 'Nombre(s) completo(s) del visitante' })
  nombres!: string; // VARCHAR(100) NOT NULL

  @Unique()
  @Property({ length: 20, comment: 'Número de cédula o identificación, único' })
  cedula!: string; // VARCHAR(20) UNIQUE NOT NULL

  @Property({ length: 150, nullable: true, comment: 'Empresa, Institución o Iglesia de procedencia' })
  institucion?: string; // VARCHAR(150) NULL

  @Property({ type: 'text', nullable: true, comment: 'Detalle del motivo de la visita' })
  motivo?: string; // TEXT NULL

  // RELACIÓN DE CLAVE FORÁNEA (FK)
  // Define la relación ManyToOne: Muchos registros de visita pueden ser recibidos por Un Miembro.
  @ManyToOne(() => Miembro, { fieldName: 'id_miembro_recibe' })
  idMiembroRecibe!: Miembro; // INT NOT NULL (referencia a la entidad Miembro)

  @Property({ type: 'datetime', comment: 'Fecha y hora de registro de entrada' })
  horaEntrada!: Date; // DATETIME NOT NULL

  @Property({ type: 'datetime', nullable: true, comment: 'Fecha y hora de registro de salida' })
  horaSalida?: Date; // DATETIME NULL

  @Property({ length: 255, nullable: true, comment: 'URL o ruta donde se almacena la fotografía del visitante' })
  urlFoto?: string; // VARCHAR(255) NULL

  @Property({ 
    type: 'timestamp', 
    defaultRaw: 'CURRENT_TIMESTAMP', 
    comment: 'Fecha de creación del registro' 
  })
  fechaCreacion!: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  // Opcional: Constructor para facilitar la creación de nuevos registros
  constructor(nombres: string, cedula: string, idMiembroRecibe: Miembro, horaEntrada: Date) {
    this.nombres = nombres;
    this.cedula = cedula;
    this.idMiembroRecibe = idMiembroRecibe;
    this.horaEntrada = horaEntrada;
  }
}