import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

export class FindPlaylistRecommendedResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: () => SongsEntity, isArray: true })
  songs: Array<SongsEntity>;

  @ApiProperty()
  @IsBoolean()
  public: boolean;

  @ApiProperty()
  @IsNumber()
  image_square_version: number;
}
