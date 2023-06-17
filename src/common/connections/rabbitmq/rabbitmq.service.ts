import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
  }

  async createQueue(queueName: string) {
    return await this.channel.assertQueue(queueName);
  }

  async deleteQueue(queueName: string) {
    return await this.channel.deleteQueue(queueName);
  }

  publishMessage(queueName: string, message: string) {
    return this.channel.sendToQueue(queueName, Buffer.from(message));
  }

  async consumeMessages(
    queueName: string,
    callback: (message: string) => void,
  ) {
    this.channel.consume(queueName, (message) => {
      if (message) {
        const content = message.content.toString();
        callback(content);
        this.channel.ack(message);
      }
    });
  }

  async disconnect(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
