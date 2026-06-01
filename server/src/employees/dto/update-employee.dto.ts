import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  position?: string;
}
