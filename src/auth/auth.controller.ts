import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { GoogleService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleService: GoogleService
  ) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
      @Post('google')
    @ApiBody({
        description: 'Google ID Token',
        schema: {
            type: 'object',
            properties: {
                idToken: { type: 'string' }
            }
        }
    })
    async loginWithGoogle(@Body() body: {idToken: string}){
        const access_token = await this.googleService.verify(
            body.idToken
        )

        return { access_token }
    }

}
