import { Neo4jogmService } from '@app/neo4jorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private neo4jogmService: Neo4jogmService) {}
  getHello() {
    // return this.neo4jogmService
    //   .update({
    //     nodeName: 'player',
    //     updatedData: { name: 'kakaa', assists: 30 },
    //   })
    //   .whereId({ id: 16, nodeName: 'player' })
    //   .exec();
    return this.neo4jogmService
      .findOne({ nodeName: 'player' })
      .whereId({ id: 18 });

    // return this.neo4jormService
    //   .removeRelation({
    //     node1Name: 'player',
    //     relationName: 'plays_at',
    //     node2Name: 'team',
    //   })
    //   .exec();
    // return this.neo4jormService
    //   .find({ nodeName: 'player' })
    //   .relatedTo({ relatedNode: 'team', relationName: 'plays_at' })
    //   .build()
    //   .orderBy({ nodeName: 'player', propertieName: 'assists', desc: true })
    //   .limit(3);
    // return this.neo4jormService
    //   .delete({ node: 'player', where: { name: 'coentrao2' } })
    //   .exec();
    // return this.neo4jogmService
    //   .create({ nodeName: 'player', data: { name: 'kaka' } })
    //   .relatedTo({
    //     relatedNode: 'team',
    //     relationName: 'plays_at',
    //     relatedNodeData: { name: 'milan', assists: 12 },
    //   })
    //   .exec();
  }
}
