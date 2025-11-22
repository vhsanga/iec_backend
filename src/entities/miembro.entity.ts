import { Entity, PrimaryKey, Property, Collection, OneToMany } from '@mikro-orm/core';
import { RegistroVisita } from './registro_visita.entity';

@Entity({ tableName: 'miembros' })
export class Miembro {

  @PrimaryKey()
  id!: number; // Clave Primaria (INT AUTO_INCREMENT)

  @Property({ length: 100, comment: 'Nombre(s) del miembro de la iglesia' })
  nombres!: string; // VARCHAR(100) NOT NULL

  // Propiedad inversa: Opcional, pero muy útil.
  // Permite acceder a todos los registros de visitas que este miembro ha recibido.
  @OneToMany(() => RegistroVisita, registro => registro.idMiembroRecibe)
  registrosRecibidos = new Collection<RegistroVisita>(this);

  // El constructor es una buena práctica en MikroORM
  constructor(nombres: string) {
    this.nombres = nombres;
  }
}