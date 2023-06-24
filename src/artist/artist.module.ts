import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/core/entitys/main/artist.entity';
import { SongEntity } from 'src/core/entitys/main/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, SongEntity])],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
