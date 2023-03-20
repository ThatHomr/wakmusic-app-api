import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistJobDto {
  @ApiProperty()
  @IsString()
  playlist_key: string;

  @ApiProperty()
  @IsString()
  new_playlist_key: string;

  @ApiProperty()
  @IsString()
  playlist_owner_id: string;

  @ApiProperty()
  @IsString()
  new_playlist_owner_id: string;

  @ApiProperty()
  @IsNumber()
  datetime: number;
}
