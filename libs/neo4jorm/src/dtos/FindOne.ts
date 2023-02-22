/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { IfindOne } from '../interfaces/Iprops';

export class FindOne {
  private query: string;
  private nodeName: string;
  constructor(
    { nodeData, nodeName }: IfindOne,
    @Inject('neo4jDriver') private driver?,
  ) {
    const d = nodeData
      ? JSON.stringify(nodeData).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    this.nodeName = nodeName;
    this.query = `match (${nodeName}:${nodeName}${d}) `;
  }

  whereId({ id }: { id: number }) {
    this.query += ` where id(${this.nodeName})=${id} `;
    return this.exec();
  }
  exec() {
    this.query += ` return ${this.nodeName}`;
    return this.transaction();
  }

  private async transaction() {
    const session = this.driver.session();
    const data = [];
    try {
      const readResult = await session.readTransaction((tx) =>
        tx.run(this.query),
      );
      readResult.records.forEach((record: any) => {
        record.length &&
          data.push({
            ...record.get(this.nodeName).properties,
            id: record.get(this.nodeName).identity,
          });
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
    } finally {
      await session.close();
    }
    return data[0];
  }
}
