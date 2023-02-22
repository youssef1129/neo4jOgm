/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { IcreateProps, IcreateRelationProps } from '../interfaces/Iprops';

export class Create {
  private query: string;
  constructor(
    { nodeName, data, duplacte }: IcreateProps,
    @Inject('neo4jDriver') private driver,
  ) {
    this.query = `${
      duplacte ? 'create' : 'merge'
    } (:${nodeName}${JSON.stringify(data).replace(/"(\w+)"\s*:/g, '$1:')})`;
  }

  relatedTo({
    relatedNode,
    relationName,
    relatedNodeData,
    relationData,
  }: IcreateRelationProps): Create {
    const rnd = relatedNodeData
      ? JSON.stringify(relatedNodeData).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    const rld = relationData
      ? JSON.stringify(relationData).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    this.query += `-[:${relationName}${rld ? rld : ''}]->(:${relatedNode}${
      rnd ? rnd : ''
    })`;
    return this;
  }

  async exec() {
    await this.transaction();    
    return 'Created';
  }

  private async transaction() {
    const session = this.driver.session();
    await session.writeTransaction((fx) => fx.run(this.query));
    await session.close();
  }
}
