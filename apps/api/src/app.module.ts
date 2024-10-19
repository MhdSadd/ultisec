import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DB } from '@eskrow/lib';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from '@eskrow/lib/frameworks/kafka/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([...kafkaConfig]),
    DB.DBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
