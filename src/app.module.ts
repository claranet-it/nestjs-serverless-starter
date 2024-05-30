import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
