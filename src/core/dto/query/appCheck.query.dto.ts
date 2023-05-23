import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

const OS_TYPES = ['ios', 'android'];

export class AppCheckQueryDto {
  @IsString()
  @IsIn(OS_TYPES)
  @IsNotEmpty()
  os: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9]{1,3}\.){2}([0-9]{1,3})$/, {
    message: `version don't have a valid format`,
  })
  version: string;
}
