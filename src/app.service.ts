import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entitys/main/news.entity';
import { Repository } from 'typeorm';
import { TeamsEntity } from './entitys/main/teams.entity';
import { AppCheckQueryDto } from './core/dto/query/appCheck.query.dto';
import { VersionEntity } from './entitys/app/version.entity';
import { EventEntity } from './entitys/app/event.entity';
import { AppCheckResDto } from './core/dto/response/appCheck.res';
import { AppCheckFlagTypes } from './core/constants';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    @InjectRepository(TeamsEntity)
    private readonly teamsRepository: Repository<TeamsEntity>,
    @InjectRepository(VersionEntity, 'app')
    private readonly versionRepository: Repository<VersionEntity>,
    @InjectRepository(EventEntity, 'app')
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async findNews(start = 0): Promise<Array<NewsEntity>> {
    const news = await this.newsRepository.find({
      order: {
        time: {
          direction: 'desc',
        },
      },
    });
    return news.slice(start, start + 30);
  }

  async findAllTeams(): Promise<Array<TeamsEntity>> {
    return await this.teamsRepository.find();
  }

  async appCheck(query: AppCheckQueryDto): Promise<AppCheckResDto> {
    const latestEvent = await this.eventRepository.findOne({
      where: {
        active: true,
      },
      order: {
        createAt: 'desc',
      },
    });
    if (latestEvent !== null) {
      return {
        flag: AppCheckFlagTypes.EVENT,
        title: latestEvent.name,
        description: latestEvent.description,
      };
    }

    const version = await this.versionRepository.findOne({
      where: {
        os: query.os,
      },
      order: {
        createAt: 'desc',
      },
    });
    if (version === null || version === undefined)
      throw new InternalServerErrorException('an unexpected error occurred.');

    if (version.version !== query.version) {
      if (version.force === true) {
        return {
          flag: AppCheckFlagTypes.VERSION_FORCE,
          version: version.version,
        };
      }

      return {
        flag: AppCheckFlagTypes.VERSION,
        version: version.version,
      };
    }

    return {
      flag: AppCheckFlagTypes.SUCCESS,
    };
  }
}
