import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { SuccessDto } from 'src/core/dto/success.dto';

export class PlaylistAddSongsResponseDto extends SuccessDto {
  @ApiProperty()
  @IsNumber()
  addedSongsLength: number;

  @ApiProperty()
  @IsBoolean()
  duplicated: boolean;
}
