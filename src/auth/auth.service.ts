import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterRequestDto } from './dto/register.request.dto';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RevokeTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginResponseDto } from './dto/login.response.dto';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from './dto/login.request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token.response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';
import { LogoutRequestDto } from './dto/logout.request.dto';

type RefreshTokenResponse = {
  idToken: string;
  accessToken: string;
};

type LoginResponse = RefreshTokenResponse & {
  refreshToken: string;
};

type TokenResponse = LoginResponse | RefreshTokenResponse;

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({});
  }

  async register(signupRequest: RegisterRequestDto): Promise<void> {
    const { email, password, firstname, lastname } = signupRequest;

    await this.createUser(email, firstname, lastname);

    await this.changePassword(email, password);
  }

  async login({
    username,
    password,
  }: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.token(
      new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.configService.get('client_id'),
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    );
    if (this.isLoginResponse(response)) {
      return response;
    }
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.token(
      new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.configService.get('client_id'),
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      }),
    );
  }

  async logout({ refreshToken }: LogoutRequestDto): Promise<void> {
    try {
      await this.cognitoClient.send(
        new RevokeTokenCommand({
          Token: refreshToken,
          ClientId: this.configService.get('client_id'),
        }),
      );
    } catch (error) {
      throw new BadRequestException('Bad token!');
    }
  }

  private async changePassword(email: string, password: string) {
    const changePasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: this.configService.get('user_pool_id'),
      Username: email,
      Password: password,
      Permanent: true,
    });

    await this.cognitoClient.send(changePasswordCommand);
  }

  private async createUser(email: string, firstname: string, lastname: string) {
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: this.configService.get('user_pool_id'),
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: firstname },
        { Name: 'family_name', Value: lastname },
      ],
    });

    await this.cognitoClient.send(createCommand);
  }

  private isLoginResponse(
    response: TokenResponse,
  ): response is LoginResponseDto {
    return (response as LoginResponseDto).refreshToken !== undefined;
  }

  private async token(command: InitiateAuthCommand): Promise<TokenResponse> {
    let authResponse: InitiateAuthCommandOutput;
    try {
      authResponse = await this.cognitoClient.send(command);
    } catch (error) {
      throw new BadRequestException('Wrong credentials!');
    }

    const { IdToken, AccessToken, RefreshToken } =
      authResponse.AuthenticationResult;

    const result = {
      idToken: IdToken,
      accessToken: AccessToken,
    };

    if (RefreshToken) {
      return {
        ...result,
        refreshToken: RefreshToken,
      };
    }

    return result;
  }
}
