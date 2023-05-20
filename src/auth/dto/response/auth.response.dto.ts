import { IsBoolean, IsInstance, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from 'src/entitys/main/profile.entity';

export class AuthResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsInstance(ProfileEntity)
  profile: ProfileEntity;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsNumber()
  firstLoginTime: number;

  @ApiProperty()
  @IsBoolean()
  first: boolean;
}
