import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const NewSongsGroups = [
  'all',
  'woowakgood',
  'isedol',
  'gomem',
  'academy',
];
export class FindNewSongsParamDto {
  @ApiProperty({ description: `그룹 목록 : ${NewSongsGroups.join(', ')}` })
  @IsString()
  @IsNotEmpty()
  @IsIn(NewSongsGroups)
  group: string;
}
