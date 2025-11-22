import { IsString, IsNotEmpty, IsInt, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateVisitanteDto {
    @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres.' })
  nombres: string;

  @IsNotEmpty({ message: 'El número de cédula es obligatorio.' })
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @Length(5, 20, { message: 'La cédula debe tener entre 5 y 20 caracteres.' })
  cedula: string;

  @IsOptional()
  @IsString({ message: 'La institución debe ser una cadena de texto.' })
  @Length(1, 150, { message: 'La institución no debe exceder los 150 caracteres.' })
  institucion?: string;

  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto.' })
  motivo?: string;

  @IsNotEmpty({ message: 'El ID del miembro que recibe es obligatorio.' })
  @IsInt({ message: 'El ID del miembro debe ser un número entero.' })
  idMiembroRecibe: number; // Recibimos el ID numérico

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la foto no es válida.' })
  urlFoto?: string;
}
