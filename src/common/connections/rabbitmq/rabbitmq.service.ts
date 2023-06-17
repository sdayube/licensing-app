import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;
  private connectionPromise: Promise<void>;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connectionPromise = new Promise<void>(async (resolve) => {
      this.connection = await connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      this.createQueue('robot.response');
      resolve();
    });
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
    await this.connectionPromise;
    console.log(`Consuming messages from ${queueName}`);
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
