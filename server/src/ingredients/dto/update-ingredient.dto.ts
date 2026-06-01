import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsInt()
  @IsOptional()
  employeeId?: number | null;
}
