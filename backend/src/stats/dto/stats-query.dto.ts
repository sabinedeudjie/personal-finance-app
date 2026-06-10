import { IsOptional, IsString } from 'class-validator';

export class StatsQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  period?: 'day' | 'week' | 'month' | 'year';
}
