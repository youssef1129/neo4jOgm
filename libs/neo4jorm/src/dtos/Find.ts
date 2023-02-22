/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import {
  IcreateProps,
  IorderByProps,
  IrelatedToProps,
} from '../interfaces/Iprops';

export class Find {
  private query: string;
  private nodes = [];
  private relations = [];
  constructor(
    { nodeName, where }: IcreateProps,
    @Inject('neo4jDriver') private driver?,
  ) {
    const wh = where
      ? JSON.stringify(where).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    this.nodes.push(nodeName);
    this.query = `match (${nodeName}:${nodeName}${wh})`;
  }

  relatedTo({
    relatedNode,
    relationName,
    whereRelatedNodeData,
    whereRelationData,
  }: IrelatedToProps): Find {
    this.nodes.push(relatedNode);
    this.relations.push(relationName);
    const wrnd = whereRelatedNodeData
      ? JSON.stringify(whereRelatedNodeData).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    const wrld = whereRelationData
      ? JSON.stringify(whereRelationData).replace(/"(\w+)"\s*:/g, '$1:')
      : '';
    this.query += `-[${this.relations.at(-1)}:${relationName}${
      wrld && wrld
    }]->(${this.nodes.at(-1)}:${relatedNode}${wrnd && wrnd})`;
    return this;
  }

  build(): Find {
    this.query += ` return ${this.nodes.map((n) => n)}${
      this.relations && this.relations.map((r) => ',' + r + ',')
    }`.slice(0, -1);
    return this;
  }

  orderBy({ nodeName, propertyName, desc }: IorderByProps): Find {
    this.query += ` order by ${nodeName}.${propertyName} ${
      desc ? 'desc' : ''
    }`;
    return this;
  }

  limit(limit: number) {
    this.query += ` limit ${Number(limit)}`;
    return this.exec();
  }

  exec() {
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
        let obj = {};
        record.length &&
          this.nodes.forEach((n) => {
            obj = {
              ...obj,
              [n]: {
                ...record.get(n).properties,
                id: record.get(n).identity,
              },
            };
          });
        this.relations.forEach(
          (r) =>
            (obj = {
              ...obj,
              [r]: {
                ...record.get(r).properties,
              },
            }),
        );
        data.push(obj);
      });
    } catch (error) {
      console.error('Something went wrong: ', error);
    } finally {
      await session.close();
    }
    return data;
  }
}
