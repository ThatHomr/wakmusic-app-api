import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Req,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { PlaylistCreateResponseDto } from './dto/response/playlist-create.response.dto';
import { PlaylistEditBodyDto } from './dto/body/playlist-edit.body.dto';
import { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { SuccessDto } from '../core/dto/success.dto';
import { PlaylistEditTitleBodyDto } from './dto/body/playlist-edit-title.body.dto';
import { PlaylistEditTitleResponseDto } from './dto/response/playlist-edit-title.response.dto';
import { PlaylistAddSongsBodyDto } from './dto/body/playlist-add-songs.body.dto';
import { PlaylistAddSongsResponseDto } from './dto/response/playlist-add-songs.response.dto';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { getError } from 'src/utils/error.utils';
import { PlaylistOwnerResDto } from './dto/response/playlist-owner.response.dto';

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistController {
  private logger = new Logger(PlaylistController.name);
  constructor(private readonly playlistService: PlaylistService) {}

  // @ApiOperation({
  //   summary: '모든 플레이리스트 목록',
  //   description: '모든 플레이리스트 목록을 가져옵니다.',
  // })
  // @ApiOkResponse({
  //   description: '플레이리스트 목록',
  //   type: () => PlaylistEntity,
  //   isArray: true,
  // })
  // @Get('/')
  // async fineAll(): Promise<Array<PlaylistEntity>> {
  //   return await this.playlistService.findAll();
  // }

  @ApiOperation({
    summary: '추천 플레이리스트 목록',
    description: '왁타버스 뮤직팀이 추천하는 플레이리스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '추천 플레이리스트 목록',
    type: () => OmitType(RecommendedPlaylistEntity, ['songs'] as const),
    isArray: true,
  })
  @Get('/recommended')
  async findAllPlaylistRecommended(): Promise<
    Array<RecommendedPlaylistEntity>
  > {
    return await this.playlistService.findAllPlaylistRecommended();
  }

  @ApiOperation({
    summary: '추천 플레이리스트 세부 정보',
    description: '왁타버스 뮤직팀이 추천하는 플레이리스트를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '추천 플레이리스트',
    type: () => RecommendedPlaylistEntity,
  })
  @Get('/recommended/:key')
  async findPlaylistRecommended(
    @Param('key') key: string,
  ): Promise<RecommendedPlaylistEntity> {
    const playlist = await this.playlistService.findPlaylistRecommended(key);
    if (!playlist) throw new NotFoundException('플레이리스트가 없습니다.');

    return playlist;
  }

  // @ApiOperation({
  //   summary: 'key를 통해 플레이리스트 조회',
  //   description: 'key를 통해 플레이리스트를 가져옵니다.',
  // })
  // @ApiOkResponse({
  //   description: '플레이리스트',
  //   type: () => PlaylistEntity,
  // })
  // @Get('/:key')
  // async findOne(@Param('key') key: string): Promise<PlaylistEntity> {
  //   const playlist = await this.playlistService.findOne(key);
  //   if (!playlist) throw new NotFoundException();

  //   return playlist;
  // }

  @ApiOperation({
    summary: '플레이리스트 생성.',
    description: '플레이리스트를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistCreateResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() { user }: { user: JwtPayload },
    @Body() body: PlaylistCreateBodyDto,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.create(user.id, body);
    if (!playlist) {
      this.logger.error(getError('failed to generate playlist key.'));
      throw new InternalServerErrorException(
        '플레이리스트를 생성하는데 실패하였습니다.',
      );
    }

    return {
      status: 200,
      key: playlist.key,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 세부정보',
    description: 'key에 맞는 플레이리스트의 세부정보를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트 세부정보',
    type: () => PlaylistEntity,
  })
  @Get('/:key/detail')
  async getDetail(@Param('key') key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.getDetail(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @ApiOperation({
    summary: '플레이리스트 소유 여부',
    description: '플레이리스트의 소유자인지 확인합니다.',
  })
  @ApiCreatedResponse({
    description: '소유자 여부',
    type: () => PlaylistAddSongsResponseDto,
  })
  @Get('/:key/isOwner')
  @UseGuards(JwtAuthGuard)
  async isOwner(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
  ): Promise<PlaylistOwnerResDto> {
    const isOwner = await this.playlistService.isOwner(user.id, key);

    return {
      owner: isOwner,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 노래 추가',
    description: '플레이리스트에 노래를 추가합니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트 노래 추가',
    type: () => PlaylistAddSongsResponseDto,
  })
  @Post('/:key/songs/add')
  @UseGuards(JwtAuthGuard)
  async addSongsToPlaylist(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
    @Body() body: PlaylistAddSongsBodyDto,
  ): Promise<PlaylistAddSongsResponseDto> {
    return await this.playlistService.addSongsToPlaylist(
      user.id,
      key,
      body.songs,
    );
  }

  // @ApiOperation({
  //   summary: '플레이리스트 노래 삭제',
  //   description: '플레이리스트에 있는 노래를 삭제합니다.',
  // })
  // @ApiOkResponse({
  //   description: '플레이리스트 노래 삭제',
  //   type: () => SuccessDto,
  // })
  // @Patch('/:key/songs/remove')
  // @UseGuards(JwtAuthGuard)
  // async removeSongsToPlaylist(
  //   @Req() { user }: { user: JwtPayload },
  //   @Param('key') key: string,
  //   @Body() body: PlaylistAddSongsBodyDto,
  // ): Promise<SuccessDto> {
  //   await this.playlistService.removeSongsToPlaylist(user.id, key, body.songs);

  //   return {
  //     status: 200,
  //   };
  // }

  @ApiOperation({
    summary: '플레이리스트 곡 목록 수정',
    description: '플레이리스트의 곡 목록을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Patch('/:key/edit')
  @UseGuards(JwtAuthGuard)
  async editPlaylist(
    @Req() req: Request,
    @Param('key') key: string,
    @Body() body: PlaylistEditBodyDto,
  ): Promise<SuccessDto> {
    await this.playlistService.edit((req.user as JwtPayload).id, key, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 이름 수정',
    description: '플레이리스트의 이름을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => PlaylistEditTitleResponseDto,
  })
  @Patch('/:key/edit/title')
  @UseGuards(JwtAuthGuard)
  async editPlaylistTitle(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
    @Body() body: PlaylistEditTitleBodyDto,
  ): Promise<PlaylistEditTitleResponseDto> {
    const playlist = await this.playlistService.edit(user.id, key, body);

    return {
      status: 200,
      title: playlist.title,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 삭제',
    description: '플레이리스트를 삭제합니다',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Delete('/:key/delete')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @Req() req: Request,
    @Param('key') key: string,
  ): Promise<SuccessDto> {
    const playlist = await this.playlistService.delete(
      key,
      (req.user as JwtPayload).id,
    );
    if (!playlist) {
      this.logger.error(getError('failed to delete playlist.'));
      throw new InternalServerErrorException('failed to delete playlist.');
    }

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 가져오기',
    description: '다른 사람의 플레이리스트를 가져옵니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistCreateResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/:key/addToMyPlaylist')
  @UseGuards(JwtAuthGuard)
  async addToMyPlaylist(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.addToMyPlaylist(key, user.id);

    if (!playlist) {
      this.logger.error('failed to copy playlist to my playlists.');
      throw new InternalServerErrorException(
        'failed to copy playlist to my playlists.',
      );
    }

    return {
      status: 200,
      key: playlist.key,
    };
  }
}
