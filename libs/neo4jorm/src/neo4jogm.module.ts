import { Module, DynamicModule } from '@nestjs/common';
import { Neo4jogmService } from './neo4jogm.service';
import neo4j from 'neo4j-driver';
import { neo4jOptions } from './interfaces/neo4jOptions';

@Module({
  providers: [Neo4jogmService],
  exports: [Neo4jogmService, Neo4jogmModule],
})
export class Neo4jogmModule {
  static forRoot({ uri, username, password }: neo4jOptions): DynamicModule {
    const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      disableLosslessIntegers: true,
    });
    return {
      module: Neo4jogmModule,
      providers: [
        {
          provide: 'neo4jDriver',
          useValue: driver,
        },
      ],
    };
  }
}
