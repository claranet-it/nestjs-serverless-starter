import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RevokeTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginResponseDto } from './dto/login.response.dto';
import { ConfigService } from '@nestjs/config';

type RegisterParams = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

type LoginParams = {
  username: string;
  password: string;
};

type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
};

type RefreshTokenResponse = {
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

  async register({
    email,
    password,
    firstname,
    lastname,
  }: RegisterParams): Promise<void> {
    await this.createUser(email, firstname, lastname);

    await this.changePassword(email, password);
  }

  async login({ username, password }: LoginParams): Promise<LoginResponse> {
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

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
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

  async logout(refreshToken: string): Promise<void> {
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

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    try {
      const result = await this.cognitoClient.send(
        new GetUserCommand({
          AccessToken: accessToken,
        }),
      );

      return {
        email: result.Username,
        firstName: result.UserAttributes.find((attr) => attr.Name === 'name')
          ?.Value,
        lastName: result.UserAttributes.find(
          (attr) => attr.Name === 'family_name',
        )?.Value,
      };
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
    return (response as LoginResponse).refreshToken !== undefined;
  }

  private async token(command: InitiateAuthCommand): Promise<TokenResponse> {
    let authResponse: InitiateAuthCommandOutput;
    try {
      authResponse = await this.cognitoClient.send(command);
    } catch (error) {
      throw new BadRequestException('Wrong credentials!');
    }

    const { AccessToken, RefreshToken } = authResponse.AuthenticationResult;

    const result = {
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
