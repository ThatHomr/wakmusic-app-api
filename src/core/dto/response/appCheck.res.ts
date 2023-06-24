import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppCheckFlagTypes } from 'src/core/constants';

export class AppCheckResDto {
  @IsEnum(AppCheckFlagTypes)
  flag: AppCheckFlagTypes;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
