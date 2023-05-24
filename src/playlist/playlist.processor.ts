import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PlaylistJobDto } from './dto/playlist-job.dto';
import { moment } from '../utils/moment.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistCopyEntity } from 'src/core/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogsEntity } from 'src/core/entitys/main/playlistCopyLogs.entity';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { UserEntity } from 'src/core/entitys/main/user.entity';

@Processor('playlist')
export class PlaylistProcessor {
  private readonly logger = new Logger(PlaylistProcessor.name);

  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(PlaylistCopyEntity)
    private readonly playlistCopyRepository: Repository<PlaylistCopyEntity>,
    @InjectRepository(PlaylistCopyLogsEntity)
    private readonly playlistCopyLogRepository: Repository<PlaylistCopyLogsEntity>,
  ) {}

  @Process('add_to_my_playlist')
  async addToMyPlaylistHandler(job: Job<PlaylistJobDto>): Promise<void> {
    const date = parseInt(moment(job.data.datetime).format('YYYYMM'));

    if (
      await this.checkIfUsersPlaylistAlreadyExist(
        date,
        job.data.playlist_key,
        job.data.new_playlist_owner_id,
      )
    )
      return;

    const playlistData = await this.getPlaylistData(
      date,
      job.data.playlist_key,
      job.data.playlist_owner_id,
      job.data.datetime,
    );
    await this.playlistCopyRepository.update(
      { id: playlistData.id },
      { count: () => 'count + 1' },
    );

    const playlistDataLog = this.playlistCopyLogRepository.create({
      date: date,
      playlistKey: job.data.playlist_key,
      newPlaylistKey: job.data.new_playlist_key,
      playlistOwnerId: job.data.playlist_owner_id,
      newPlaylistOwnerId: job.data.new_playlist_owner_id,
      createAt: job.data.datetime,
    });
    await this.playlistCopyLogRepository.insert(playlistDataLog);
  }

  private async checkIfUsersPlaylistAlreadyExist(
    date: number,
    playlistKey: string,
    newPlaylistOwnerId: string,
  ): Promise<boolean> {
    const playlistDataLog = await this.playlistCopyLogRepository.findOne({
      where: {
        playlistKey: playlistKey,
        newPlaylistOwnerId: newPlaylistOwnerId,
        date: date,
      },
    });

    return !!playlistDataLog;
  }

  private async getPlaylistData(
    date: number,
    key: string,
    ownerId: string,
    createAt: number,
  ): Promise<PlaylistCopyEntity> {
    let playlistData = await this.playlistCopyRepository.findOne({
      where: {
        date: date,
        playlist: {
          key: key,
        },
        owner: {
          userId: ownerId,
        },
      },
      relations: {
        playlist: true,
        owner: true,
      },
    });
    if (!playlistData)
      playlistData = await this.createPlaylistData(
        date,
        key,
        ownerId,
        createAt,
      );

    return playlistData;
  }

  private async createPlaylistData(
    date: number,
    key: string,
    ownerId: string,
    createAt: number,
  ): Promise<PlaylistCopyEntity> {
    const playlistData = this.playlistCopyRepository.create();
    playlistData.date = date;
    playlistData.playlist = await this.playlistRepository.findOne({
      where: {
        key: key,
      },
    });
    playlistData.owner = await this.userRepository.findOne({
      where: {
        userId: ownerId,
      },
    });
    playlistData.count = 0;
    playlistData.createAt = createAt;

    await this.playlistCopyRepository.insert(playlistData);
    return await this.playlistCopyRepository.findOne({
      where: {
        createAt: createAt,
      },
    });
  }

  @OnQueueActive()
  onActive(job: Job<PlaylistJobDto>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with key ${job.data.playlist_key}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<PlaylistJobDto>, error: Error) {
    this.logger.log(`Error job ${job.id} of type ${job.name} error: ${error}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<PlaylistJobDto>) {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }
}
