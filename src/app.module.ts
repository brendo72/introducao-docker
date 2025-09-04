import { Module } from '@nestjs/common';
import { CarrosModule } from './carros/carros.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CarrosModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
