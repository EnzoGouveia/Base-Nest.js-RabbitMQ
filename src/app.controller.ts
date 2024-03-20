import { Controller, Get, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { MessageDto } from './message.dto';

@Controller()
export class AppController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('send')
  async sendMessage(@Body() message: MessageDto) {
    await this.rabbitMQService.sendMessage(message);
    return 'Message sent successfully';
  }

  @Get('receive')
  async receiveMessage() {
    let receivedMessage: MessageDto;
    await this.rabbitMQService.consumeMessage((message) => {
      receivedMessage = message;
    });
    return receivedMessage;
  }
}