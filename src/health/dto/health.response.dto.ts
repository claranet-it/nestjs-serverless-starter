import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum HealthStatus {
  ok = 'ok',
}

export class HealthResponseDto {
  @IsEnum(HealthStatus)
  @ApiProperty({
    description: 'Health status',
    enum: HealthStatus,
  })
  status: string;
}
