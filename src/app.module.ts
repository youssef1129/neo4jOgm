import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jogmModule } from '@app/neo4jorm';

@Module({
  imports: [
    Neo4jogmModule.forRoot({
      uri: 'neo4j://localhost:7687',
      username: 'neo4j',
      password: 'football',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
