import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PlaylistJobDto } from './dto/playlist-job.dto';
import { moment } from '../utils/moment.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistCopyEntity } from '../entitys/data/playlist_copy.entity';
import { Repository } from 'typeorm';
import { PlaylistCopyLogEntity } from '../entitys/data/playlist_copy_log.entity';

@Processor('playlist')
export class PlaylistProcessor {
  private readonly logger = new Logger(PlaylistProcessor.name);

  constructor(
    @InjectRepository(PlaylistCopyEntity, 'data')
    private readonly playlistCopyRepository: Repository<PlaylistCopyEntity>,

    @InjectRepository(PlaylistCopyLogEntity, 'data')
    private readonly playlistCopyLogRepository: Repository<PlaylistCopyLogEntity>,
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
    );
    playlistData.count += 1;
    await this.playlistCopyRepository.save(playlistData);

    const playlistDataLog = this.playlistCopyLogRepository.create({
      date: date,
      playlist_key: job.data.playlist_key,
      new_playlist_key: job.data.new_playlist_key,
      playlist_owner_id: job.data.playlist_owner_id,
      new_playlist_owner_id: job.data.new_playlist_owner_id,
      created_at: job.data.datetime,
    });
    await this.playlistCopyLogRepository.save(playlistDataLog);
  }

  private async checkIfUsersPlaylistAlreadyExist(
    date: number,
    playlistKey: string,
    newPlaylistOwnerId: string,
  ): Promise<boolean> {
    const playlistDataLog = await this.playlistCopyLogRepository.findOne({
      where: {
        playlist_key: playlistKey,
        new_playlist_owner_id: newPlaylistOwnerId,
        date: date,
      },
    });

    return !!playlistDataLog;
  }

  private async getPlaylistData(
    date: number,
    key: string,
    ownerId: string,
  ): Promise<PlaylistCopyEntity> {
    let playlistData = await this.playlistCopyRepository.findOne({
      where: {
        date: date,
        playlist_key: key,
        owner_id: ownerId,
      },
    });
    if (!playlistData)
      playlistData = await this.createPlaylistData(date, key, ownerId);

    return playlistData;
  }

  private async createPlaylistData(
    date: number,
    key: string,
    ownerId: string,
  ): Promise<PlaylistCopyEntity> {
    const playlistData = this.playlistCopyRepository.create();
    playlistData.date = date;
    playlistData.playlist_key = key;
    playlistData.owner_id = ownerId;
    playlistData.count = 0;

    return await this.playlistCopyRepository.save(playlistData);
  }

  @OnQueueActive()
  onActive(job: Job<PlaylistJobDto>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with key ${job.data.playlist_key}`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job<PlaylistJobDto>) {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }
}
