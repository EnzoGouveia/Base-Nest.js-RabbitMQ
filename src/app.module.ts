import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RabbitMQService],
})
export class AppModule {}