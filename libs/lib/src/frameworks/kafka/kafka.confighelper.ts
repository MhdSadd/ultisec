let brokers: string | string[] = process.env.KAFKA_BROKER || 'localhost:9092';
brokers = brokers.split(',');

export const kafkaOptionInit = (clientId: string, groupId: string) => ({
  client: { clientId, brokers },
  consumer: { groupId },
});
