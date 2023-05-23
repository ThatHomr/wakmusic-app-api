import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LikeResponseDto } from './dto/response/like.response.dto';
import { LikeEntity } from 'src/core/entitys/main/like.entity';

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: '좋아요 수', description: '좋아요를 가져옵니다.' })
  @ApiOkResponse({ description: '좋아요 entity', type: () => LikeEntity })
  @Get('/:songId')
  async getLike(@Param('songId') songId: string): Promise<LikeEntity> {
    return await this.likeService.getLike(songId);
  }

  @ApiOperation({ summary: '좋아요 추가', description: '좋아요를 추가합니다.' })
  @ApiOkResponse({
    description: '성공',
    type: () => LikeResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/:songId/addLike')
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Req() req,
    @Param('songId') songId: string,
  ): Promise<LikeResponseDto> {
    const like = await this.likeService.addLike(
      songId,
      (req.user as JwtPayload).id,
    );
    if (!like) throw new InternalServerErrorException();

    return {
      status: 200,
      likes: like.likes,
    };
  }

  @ApiOperation({ summary: '좋아요 제거', description: '좋아요를 제거합니다.' })
  @ApiOkResponse({
    description: '성공',
    type: () => LikeResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/:songId/removeLike')
  @UseGuards(JwtAuthGuard)
  async removeLike(
    @Req() req,
    @Param('songId') songId: string,
  ): Promise<LikeResponseDto> {
    const like = await this.likeService.removeLike(
      songId,
      (req.user as JwtPayload).id,
    );
    if (!like) throw new InternalServerErrorException();

    return {
      status: 200,
      likes: like.likes,
    };
  }
}
