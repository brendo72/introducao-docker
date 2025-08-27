import { Module } from '@nestjs/common';
import { CarrosModule } from './carros/carros.module';

@Module({
  imports: [CarrosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
