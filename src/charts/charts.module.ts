import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from 'src/core/entitys/main/song.entity';
import { ChartUpdatedEntity } from 'src/core/entitys/main/chartUpdated.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity, ChartUpdatedEntity])],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
