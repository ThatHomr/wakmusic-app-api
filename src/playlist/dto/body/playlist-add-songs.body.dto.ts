import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PlaylistAddSongsBodyDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  songs: Array<string>;
}
