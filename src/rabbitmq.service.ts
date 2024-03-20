import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { MessageDto } from './message.dto';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isConnected: boolean = false;

  async ensureConnection() {
    if (!this.isConnected) {
      try {
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
        
        await this.channel.assertQueue('messages');
        
        console.log('Conexão com RabbitMQ estabelecida com sucesso!');
        this.isConnected = true;
      } catch (error) {
        console.error('Erro ao conectar com RabbitMQ:', error.message);
      }
    }
  }

  async sendMessage(message: MessageDto) {
    await this.ensureConnection();
    const messageBuffer = Buffer.from(JSON.stringify(message));
    if (this.channel) {
      await this.channel.sendToQueue('messages', messageBuffer);
      await this.channel.publish('amq.direct', 'rota', messageBuffer);
    } else {
      console.error('Não foi possível enviar a mensagem. Canal não está definido.');
    }
  }

  async consumeMessage(callback: (message: MessageDto) => void) {
    await this.ensureConnection();
    await this.channel.consume('messages', (message) => {
      const messageContent = JSON.parse(message.content.toString());
      callback(messageContent);
      this.channel.ack(message);
    });
  }
}