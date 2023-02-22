import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jogmService } from './neo4jogm.service';

describe('Neo4jogmService', () => {
  let service: Neo4jogmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Neo4jogmService],
    }).compile();

    service = module.get<Neo4jogmService>(Neo4jogmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
