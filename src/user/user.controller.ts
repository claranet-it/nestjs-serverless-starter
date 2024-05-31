import { Controller, Get, HttpCode, UseGuards, Headers } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import JwtAuthGuard from '../auth/jwt/jwt.auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiTags('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @HttpCode(200)
  @ApiExtraModels(UserInfoResponseDto)
  @ApiResponse({
    status: 200,
    description: 'User information',
    schema: {
      $ref: getSchemaPath(UserInfoResponseDto),
    },
  })
  async me(
    @Headers('Authorization') authorization: string,
  ): Promise<UserInfoResponseDto> {
    const accessToken = authorization.split(' ')[1];

    return await this.authService.getUserInfo(accessToken);
  }
}
