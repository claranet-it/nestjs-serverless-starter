import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from './dto/register.request.dto';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { ConfigService } from '@nestjs/config';

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

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const { username, password } = loginRequest;

    const authCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get('client_id'),
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const authResponse = await this.cognitoClient.send(authCommand);

    const { IdToken, AccessToken, RefreshToken } =
      authResponse.AuthenticationResult;

    return {
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    };
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
}
