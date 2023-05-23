import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistModule } from '../artist/artist.module';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongsEntity]), ArtistModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
