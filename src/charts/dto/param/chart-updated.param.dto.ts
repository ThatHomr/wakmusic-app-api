import { IsIn, IsString } from 'class-validator';

const ChartTypes = ['hourly', 'daily', 'weekly', 'monthly', 'total'];

export class ChartUpdatedParamDto {
  @IsString()
  @IsIn(ChartTypes)
  chartType: string;
}
