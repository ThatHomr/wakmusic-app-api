import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { SuccessDto } from 'src/core/dto/success.dto';

export class LikeResponseDto extends SuccessDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  likes: number;
}
