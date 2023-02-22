/* eslint-disable prettier/prettier */
type data = object | string;
export interface IcreateProps {
  nodeName: string;
  where?: data;
}

export interface IrelatedToProps {
  relatedNode: string;
  relationName: string;
  whereRelatedNodeData?: data;
  whereRelationData?: data;
}

export interface IorderByProps {
  nodeName: string;
  propertyName: string;
  desc?: boolean;
}

export interface IdeleteProps {
  node: string;
  where?: data;
  withRelations?: boolean;
}

export interface IcreateProps {
  nodeName: string;
  data?: data;
  duplacte?: boolean;
}

export interface IcreateRelationProps {
  relatedNode: string;
  relationName: string;
  relatedNodeData?: data;
  relationData?: data;
}

export interface IremoveRelation {
  node1Name: string;
  node1Data?: data;
  node2Name?: string;
  node2Data?: data;
  relationName: string;
  relationData?: data;
}

export interface IfindOne {
  nodeName: string;
  nodeData?: data;
}

export interface IupdateProps {
  nodeName: string;
  updatedData?: data;
  where?: data;
}

export interface IrelatedUpdateProps {
  relatedNode: string;
  relationName: string;
  updatedNodeData?: data;
  updatedRelationData?: data;
  whereRelatedNodeData?: data;
  whereRelationData?: data;
}

export interface Icondition {
  nodeOrRelationName: string;
  where: string;
}

export interface whereId {
  nodeName: string;
  id: number;
}
