import { Controller, Get, HttpCode } from '@nestjs/common';

type HealthResponseType = {
  status: string;
};

@Controller('health')
export class HealthController {
  @Get('/')
  @HttpCode(200)
  async status(): Promise<HealthResponseType> {
    return { status: 'ok' };
  }
}
