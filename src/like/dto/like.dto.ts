import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SongEntity } from 'src/core/entitys/main/song.entity';

export class LikeDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: () => SongEntity })
  @IsObject()
  @ValidateNested()
  @Type(() => SongEntity)
  song: SongEntity;

  @ApiProperty()
  @IsNumber()
  likes: number;
}
