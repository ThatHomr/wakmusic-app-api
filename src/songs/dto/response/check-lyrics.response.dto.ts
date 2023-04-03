import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const StatusType = [200, 404];

export class CheckLyricsResponseDto {
  @ApiProperty({ description: '노래 가사 존재 여부 : ' + StatusType.join(',') })
  @IsNumber()
  @IsNotEmpty()
  @IsIn(StatusType)
  status: number;
}
