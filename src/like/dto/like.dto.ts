import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

export class LikeDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: () => SongsEntity })
  @IsObject()
  @ValidateNested()
  @Type(() => SongsEntity)
  song: SongsEntity;

  @ApiProperty()
  @IsNumber()
  likes: number;
}
