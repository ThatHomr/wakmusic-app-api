import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from '../auth/auth.service';
import { LikeDto } from '../like/dto/like.dto';
import { SuccessDto } from '../core/dto/success.dto';
import { EditUserLikesBodyDto } from './dto/body/edit-user-likes.body.dto';
import { EditUserPlaylistsBodyDto } from './dto/body/edit-user-playlists.body.dto';
import { PlaylistEntity } from '../core/entitys/main/playlist.entity';
import { GetProfileImagesResponseDto } from './dto/response/get-profile-images.response.dto';
import { DeleteUserPlaylistsBodyDto } from './dto/body/delete-user-playlists.body.dto';
import { DeleteUserLikesBodyDto } from './dto/body/delete-user-likes.body.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '프로필 목록',
    description: '가능한 프로필 사진 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    type: 'string',
    isArray: true,
  })
  @Get('/profile/list')
  async getProfileImages(): Promise<Array<GetProfileImagesResponseDto>> {
    return await this.userService.getProfileImages();
  }

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @ApiCreatedResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Post('/profile/set')
  @UseGuards(JwtAuthGuard)
  async setProfile(
    @Req() { user }: { user: JwtPayload },
    @Body() body: SetProfileBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.setProfile(user.id, body.image);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '닉네임 변경',
    description: '닉네임을 변경합니다.',
  })
  @ApiCreatedResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Post('/username')
  @UseGuards(JwtAuthGuard)
  async setUsername(
    @Req() { user }: { user: JwtPayload },
    @Body('username') username: string,
  ): Promise<SuccessDto> {
    await this.userService.setUsername(user.id, username);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '유저가 구독중인 플레이리스트 목록',
    description: '유저가 구독중인 플레이리스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트 목록',
    type: () => PlaylistEntity,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/playlists')
  @UseGuards(JwtAuthGuard)
  async getUserPlaylists(
    @Req() { user }: { user: JwtPayload },
  ): Promise<Array<PlaylistEntity>> {
    return await this.userService.getUserPlaylists(user.id);
  }

  @ApiOperation({
    summary: '유저의 플레이리스트 목록 편집',
    description: '유저의 플레이리스트 목록을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Patch('/playlists/edit')
  @UseGuards(JwtAuthGuard)
  async editUserPlaylists(
    @Req() { user }: { user: JwtPayload },
    @Body() body: EditUserPlaylistsBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.editUserPlaylists(user.id, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '유저의 플레이리스트 목록 삭제',
    description: '유저의 플레이리스트 목록을 삭제합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Delete('/playlists/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUserPlaylists(
    @Req() { user }: { user: JwtPayload },
    @Body() body: DeleteUserPlaylistsBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.deleteUserPlaylists(user.id, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '유저가 좋아요를 누른 노래 목록',
    description: '유저가 좋아요를 누른 노래 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '노래 목록',
    type: () => LikeDto,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/likes')
  @UseGuards(JwtAuthGuard)
  async getUserLikes(
    @Req() { user }: { user: JwtPayload },
  ): Promise<Array<LikeDto>> {
    return await this.userService.getUserLikes(user.id);
  }

  @ApiOperation({
    summary: '유저의 좋아요 목록 편집',
    description: '유저의 좋아요 목록을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Patch('/likes/edit')
  @UseGuards(JwtAuthGuard)
  async editUserLikes(
    @Req() { user }: { user: JwtPayload },
    @Body() body: EditUserLikesBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.editUserLikes(user.id, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '유저의 좋아요 목록 1개 이상 삭제',
    description: '유저의 좋아요 목록을 1개 이상 삭제합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Delete('/likes/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUserLikes(
    @Req() { user }: { user: JwtPayload },
    @Body() body: DeleteUserLikesBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.deleteUserLikes(user.id, body);

    return {
      status: 200,
    };
  }
}
