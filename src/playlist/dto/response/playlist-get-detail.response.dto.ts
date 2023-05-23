import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

export class PlaylistGetDetailResponseDto {
  @ApiProperty({ description: '플레이리스트 고유 key' })
  @IsString()
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  @IsString()
  title: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  @IsString()
  creator_id: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  @IsString()
  image: string;

  @ApiProperty({
    description: '플레이리스트 노래 목록',
    type: () => SongsEntity,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongsEntity)
  songs: Array<SongsEntity>;

  @ApiProperty()
  @IsNumber()
  image_version: number;
}
