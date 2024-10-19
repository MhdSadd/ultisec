import { AUTH_SERVICE, USER_SERVICE } from '@eskrow/lib/utils/constants';
import { Transport } from '@nestjs/microservices';
import { kafkaOptionInit } from './kafka.confighelper';

export const kafkaConfig = [
  {
    name: AUTH_SERVICE,
    transport: Transport.KAFKA,
    options: kafkaOptionInit('auth', 'auth_consumer'),
  },
  {
    name: USER_SERVICE,
    transport: Transport.KAFKA,
    options: kafkaOptionInit('user', 'user_consumer'),
  },
] as const as any;
