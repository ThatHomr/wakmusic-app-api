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

    const playlist_data = await this.getPlaylistData(
      date,
      job.data.playlist_key,
      job.data.playlist_owner_id,
    );
    playlist_data.count += 1;
    await this.playlistCopyRepository.save(playlist_data);

    const playlist_data_log = this.playlistCopyLogRepository.create({
      date: date,
      playlist_key: job.data.playlist_key,
      new_playlist_key: job.data.new_playlist_key,
      playlist_owner_id: job.data.playlist_owner_id,
      new_playlist_owner_id: job.data.new_playlist_owner_id,
      created_at: job.data.datetime,
    });
    await this.playlistCopyLogRepository.save(playlist_data_log);
  }

  private async checkIfUsersPlaylistAlreadyExist(
    date: number,
    playlist_key: string,
    new_playlist_owner_id: string,
  ): Promise<boolean> {
    const playlist_data_log = await this.playlistCopyLogRepository.findOne({
      where: {
        playlist_key: playlist_key,
        new_playlist_owner_id: new_playlist_owner_id,
        date: date,
      },
    });

    return !!playlist_data_log;
  }

  private async getPlaylistData(
    date: number,
    key: string,
    owner_id: string,
  ): Promise<PlaylistCopyEntity> {
    let playlistData = await this.playlistCopyRepository.findOne({
      where: {
        date: date,
        playlist_key: key,
        owner_id: owner_id,
      },
    });
    if (!playlistData)
      playlistData = await this.createPlaylistData(date, key, owner_id);

    return playlistData;
  }

  private async createPlaylistData(
    date: number,
    key: string,
    owner_id: string,
  ): Promise<PlaylistCopyEntity> {
    const playlist_data = this.playlistCopyRepository.create();
    playlist_data.date = date;
    playlist_data.playlist_key = key;
    playlist_data.owner_id = owner_id;
    playlist_data.count = 0;

    return await this.playlistCopyRepository.save(playlist_data);
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
