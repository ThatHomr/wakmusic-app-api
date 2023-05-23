import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsEntity } from 'src/core/entitys/main/artists.entity';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistsEntity, SongsEntity])],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
