import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  password?: string;

  @IsIn(['admin', 'user'])
  @IsOptional()
  role?: string;
}
