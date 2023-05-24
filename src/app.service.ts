import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './core/entitys/main/news.entity';
import { Repository } from 'typeorm';
import { TeamsEntity } from './core/entitys/main/teams.entity';
import { AppCheckQueryDto } from './core/dto/query/appCheck.query.dto';
import { VersionEntity } from './core/entitys/app/version.entity';
import { EventEntity } from './core/entitys/app/event.entity';
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

    let versions = await this.versionRepository.find({
      where: {
        os: query.os,
      },
      order: {
        createAt: 'desc',
      },
    });

    if (versions.length === 0) {
      throw new InternalServerErrorException('an unexpected error occurred.');
    }

    versions = versions.filter((value: VersionEntity) =>
      this.isHigherVersion(query.version, value.version),
    );

    if (versions.length === 0) {
      throw new BadRequestException('invalid app version.');
    }

    const forceVersion = versions.find((version) => version.force);

    if (forceVersion !== undefined) {
      return {
        flag: AppCheckFlagTypes.VERSION_FORCE,
        version: versions[0].version,
      };
    }

    if (versions.length >= 1) {
      return {
        flag: AppCheckFlagTypes.VERSION,
        version: versions[0].version,
      };
    }

    return {
      flag: AppCheckFlagTypes.SUCCESS,
    };
  }

  isHigherVersion(current: string, compare: string): boolean {
    const currArray = current.split('.');
    const compareArray = compare.split('.');

    for (let i = 0; i < 3; i++) {
      const currInt = parseInt(currArray[i]);
      const compareInt = parseInt(compareArray[i]);

      if (currInt === compareInt) continue;
      if (currInt > compareInt) return false;
      if (currInt < compareInt) return true;
    }

    return true;
  }
}
