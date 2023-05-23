import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';
import { ChartUpdatedEntity } from 'src/core/entitys/main/chartUpdated.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongsEntity, ChartUpdatedEntity])],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
