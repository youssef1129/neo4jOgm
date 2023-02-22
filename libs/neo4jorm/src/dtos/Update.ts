/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { Icondition, IrelatedUpdateProps, IupdateProps, whereId } from '../interfaces/Iprops';

export class Update {
  private query: string;
  private nodes = [];
  private relations = [];
  private sets = [];
  private wheres = [];
  private isWhere = false;
  private isSets = false;
  constructor(
    { nodeName, updatedData, where }: IupdateProps,
    @Inject('neo4jDriver') private driver,
  ) {
    this.query = `match(${nodeName}:${nodeName})`;
    this.nodes.push(nodeName);
    updatedData && this.sets.push({ nodeName: nodeName, data: updatedData });
    where && this.wheres.push({ nodeName: nodeName, where: where });
  }

  relatedTo({
    relatedNode,
    relationName,
    whereRelatedNodeData,
    whereRelationData,
    updatedNodeData,
    updatedRelationData,
  }: IrelatedUpdateProps): Update {
    this.nodes.push(relatedNode);
    this.relations.push(relationName);
    updatedNodeData &&
      this.sets.push({ nodeName: relatedNode, data: updatedNodeData });
    updatedRelationData &&
      this.sets.push({ nodeName: relationName, data: updatedRelationData });
    whereRelatedNodeData &&
      this.wheres.push({ nodeName: relatedNode, where: whereRelatedNodeData });
    whereRelationData &&
      this.wheres.push({ nodeName: relationName, where: whereRelationData });

    this.query += `-[${this.relations.at(
      -1,
    )}:${relationName}]->(${this.nodes.at(-1)}:${relatedNode})`;
    return this;
  }

  condition({nodeOrRelationName,where}:Icondition):Update{
    this.query += ` ${this.isWhere?' and':'where '} ${nodeOrRelationName}.${where} `
    this.isWhere=true;
    return this;
  }
  whereId({id,nodeName}:whereId):Update{
    this.query += ` ${this.isWhere?' and':'where '} id(${nodeName})=${id} `
    this.isWhere=true;
    return this;
  }

  async exec() {
   
    this.wheres.forEach((s) => {
      for (const key in s.where) {
        this.query += ` ${this.isWhere?' and':'where '} ${s.nodeName}.${key}=${typeof s.where[key] === 'string'? `'${s.where[key]}'`:s.where[key]}`;
        this.isWhere = true;
      }
    });

    this.sets.forEach((s) => {
      for (const key in s.data) {
        this.query += ` ${this.isSets?' ,':'set '} ${s.nodeName}.${key}=${typeof s.data[key] === 'string'? `'${s.data[key]}'`:s.data[key]}`;
        this.isSets = true;
      }
    });
    await this.transaction();
    return 'updated'
  }

  private async transaction() {
    const session = this.driver.session();
    await session.writeTransaction((fx) => fx.run(this.query));
    await session.close();
    
  }
}
