import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RequestsModule } from './modules/requests/requests.module';

@Module({
  imports: [UsersModule, RequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
