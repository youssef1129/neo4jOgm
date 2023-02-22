import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Create } from './dtos/Create';
import { Delete } from './dtos/Delete';
import { Find } from './dtos/Find';
import { FindOne } from './dtos/FindOne';
import { RemoveRelation } from './dtos/removeRelation';
import { Update } from './dtos/Update';
import {
  IcreateProps,
  IdeleteProps,
  IfindOne,
  IremoveRelation,
  IupdateProps,
} from './interfaces/Iprops';

@Injectable()
export class Neo4jogmService {
  constructor(@Inject('neo4jDriver') private driver) {}

  create(Icreate: IcreateProps) {
    const create = new Create(Icreate, this.driver);
    return create;
  }

  delete(deleteProps: IdeleteProps) {
    const dlt = new Delete(deleteProps, this.driver);
    return dlt;
  }

  find(createProps: IcreateProps) {
    const find = new Find(createProps, this.driver);
    return find;
  }

  removeRelation(rl: IremoveRelation) {
    const removeRelation = new RemoveRelation(rl, this.driver);
    return removeRelation;
  }

  findOne(fo: IfindOne) {
    const findOne = new FindOne(fo, this.driver);
    return findOne;
  }

  update(updatProps: IupdateProps) {
    const update = new Update(updatProps, this.driver);
    return update;
  }
  // async add(nodeName: string, data: object) {
  //   return data;
  // }

  // async addRelation(
  //   node1Name: string,
  //   data?: object,
  //   node2Name: string,
  //   data2?: object,
  //   relationName?: string,
  //   relationData: object,
  // ) {}

  // async query(query: string) {}
}
