/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { IremoveRelation } from '../interfaces/Iprops';

export class RemoveRelation {
  private query: string;
  constructor(
    {
      node1Name,
      relationName,
      node2Name,
      node2Data,
      node1Data,
      relationData,
    }: IremoveRelation,
    @Inject('neo4jDriver') private driver,
  ) {
    const n1d = JSON.stringify(node1Data).replace(/"(\w+)"\s*:/g, '$1:')
    const n2d = JSON.stringify(node2Data).replace(/"(\w+)"\s*:/g, '$1:')
    const rd = JSON.stringify(relationData).replace(/"(\w+)"\s*:/g, '$1:')

    this.query = `match(:${node1Name}${
      node1Data ? n1d : ''
    })-[r:${relationName}${relationData ? rd : ''}]->(:${
      node2Name ? node2Name : ''
    }${node2Data ? n2d : ''}) delete r`;
  }

  async exec() {
    await this.transaction();
    return 'Relation Deleted';
  }

  private async transaction() {
    const session = this.driver.session();
    await session.writeTransaction((fx) => fx.run(this.query));
    await session.close();
  }
}
