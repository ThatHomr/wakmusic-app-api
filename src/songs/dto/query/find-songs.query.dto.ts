import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const SongsType = ['title', 'artist', 'remix', 'ids'];
const SongsSortType = ['popular', 'new', 'old'];

export class FindSongsQueryDto {
  @ApiProperty({ description: '검색 타입 : ' + SongsType.join(',') })
  @IsString()
  @IsNotEmpty()
  @IsIn(SongsType)
  type: string;

  @ApiProperty({ description: '정렬 타입 : ' + SongsSortType.join(',') })
  @IsString()
  @IsNotEmpty()
  @IsIn(SongsSortType)
  sort: string;

  @ApiProperty({ description: '검색어' })
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
