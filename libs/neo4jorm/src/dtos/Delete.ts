/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { IdeleteProps } from '../interfaces/Iprops';
type data = object | string;

export class Delete {
  private query: string;

  constructor(
    {node,where,withRelations}:IdeleteProps,
    @Inject('neo4jDriver') private driver,
  ) {
    const wh = JSON.stringify(where).replace(/"(\w+)"\s*:/g, '$1:')
    this.query = `match(n:${node}${wh?wh:''}) ${withRelations ? 'detach':''} delete n`;
  }

  async exec() {
    await this.transaction();
    return 'Deleted';
  }

  private async transaction() {
    const session = this.driver.session();
    await session.writeTransaction((fx) => fx.run(this.query));
    await session.close();
  }
}
