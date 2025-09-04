import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
    @ApiBody({type: RegisterUserDto})
    @ApiCreatedResponse({
        description: "Usuário registrado com sucesso!"
    })
    @ApiConflictResponse({
        description: "Email já em uso!"
    })
    async registerUser(@Body() userData: RegisterUserDto){
        return this.authService.registerUser(userData)
    }
    
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Usuário logado com sucesso',
    type: LoginResponseDto,
  })
login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}

}
