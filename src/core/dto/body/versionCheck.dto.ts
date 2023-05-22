import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const OS_TYPES = ['ios', 'android'];

export class VersionCheckDto {
  @IsString()
  @IsIn(OS_TYPES)
  @IsNotEmpty()
  os: string;

  @IsString()
  @IsNotEmpty()
  version: string;
}
