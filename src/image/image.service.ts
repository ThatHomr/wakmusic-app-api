import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistVersionEntity } from 'src/entitys/version/playlist.entity';
import { ProfileVersionEntity } from 'src/entitys/version/profile.entity';
import { RecommendedPlaylistVersionEntity } from 'src/entitys/version/recommended-playlist.entitiy';
import { Repository } from 'typeorm';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ArtistVersionEntity, 'version')
    private readonly artistRepository: Repository<ArtistVersionEntity>,
    @InjectRepository(RecommendedPlaylistVersionEntity, 'version')
    private readonly recommendedPlaylistRepository: Repository<RecommendedPlaylistVersionEntity>,
    @InjectRepository(PlaylistVersionEntity, 'version')
    private readonly playlistRepository: Repository<PlaylistVersionEntity>,
    @InjectRepository(ProfileVersionEntity, 'version')
    private readonly profileRepository: Repository<ProfileVersionEntity>,
  ) {}

  async getArtistImageVersion(artist: string): Promise<ArtistVersionEntity> {
    return await this.artistRepository.findOne({
      where: {
        artist: artist,
      },
    });
  }

  async getAllArtistImageVersion(): Promise<Array<ArtistVersionEntity>> {
    return await this.artistRepository.find({});
  }

  async getRecommendedPlaylistImageVersion(
    playlistId: string,
  ): Promise<RecommendedPlaylistVersionEntity> {
    return await this.recommendedPlaylistRepository.findOne({
      where: {
        name: playlistId,
      },
    });
  }

  async getAllRecommendedPlaylistImageVersion(): Promise<
    Array<RecommendedPlaylistVersionEntity>
  > {
    return await this.recommendedPlaylistRepository.find({});
  }

  async getPlaylistImageVersion(
    imageId: string,
  ): Promise<PlaylistVersionEntity> {
    return await this.playlistRepository.findOne({
      where: {
        type: imageId,
      },
    });
  }

  async getAllPlaylistImageVersion(): Promise<Array<PlaylistVersionEntity>> {
    return await this.playlistRepository.find({});
  }

  async getProfileImageVersion(
    profileType: string,
  ): Promise<ProfileVersionEntity> {
    const profileVersion = await this.profileRepository.findOne({
      where: {
        type: profileType,
      },
    });
    if (!profileVersion)
      throw new BadRequestException('profile version not found');

    return profileVersion;
  }

  async getAllProfileImageVersion(): Promise<Array<ProfileVersionEntity>> {
    return await this.profileRepository.find({});
  }
}
