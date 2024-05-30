import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health.response.dto';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get('/')
  @HttpCode(200)
  @ApiExtraModels(HealthResponseDto)
  @ApiResponse({
    status: 200,
    description: 'Health check',
    schema: {
      $ref: getSchemaPath(HealthResponseDto),
    },
  })
  async status(): Promise<HealthResponseDto> {
    return { status: 'ok' };
  }
}
