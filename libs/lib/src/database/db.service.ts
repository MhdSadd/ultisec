import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cassandra from 'cassandra-driver';

@Injectable()
export class DbService {
  constructor(private configService: ConfigService) {}

   client = new cassandra.Client({
    contactPoints: (
      this.configService.get<string>('CONTACT_POINTS') as string
    ).split(','),
    localDataCenter: this.configService.get<string>('DATACENTER'),
    keyspace: this.configService.get<string>('KEYSPACE'),
  });

  connectDB = async () => {
    try {
      await this.client.connect();
      console.log('✅✅✅ DB connection established successfully');
    } catch (error) {
      console.error('❌❌❌ DB connection failed', error);
      process.exit(1);
    }
  };
}
