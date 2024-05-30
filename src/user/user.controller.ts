import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserDto } from '../auth/dto/user.dto';
import JwtAuthGuard from '../auth/jwt/jwt.auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiTags('user')
export class UserController {
  @Get('/me')
  @HttpCode(200)
  @ApiExtraModels(UserDto)
  @ApiResponse({
    status: 200,
    description: 'User information',
    schema: {
      $ref: getSchemaPath(UserDto),
    },
  })
  async me(@Request() request): Promise<UserDto> {
    return request.user;
  }
}
