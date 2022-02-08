import { getColName } from "../core";
export const ORG_COL = getColName("orgs");

export interface OrgnizationMember {
  id: string;
  title?: string;
  role?: any;
  [key: string]: any;
}
export enum OrganizationState {
  INVALID,
  VALID,
  CHECKING,
}
export interface Organization {
  _id?: any;
  id?: any;
  name: string;
  parents?: string[];
  admin?: string;
  members: string[];
  // org special data map
  membersData: {
    [key: string]: OrgnizationMember;
  };
  state?: OrganizationState;
  createdAt: Date;
  createdBy: string;
}

export enum METHODS {
  CREATE = "org.create",
  DELETE = "org.del",
  MEMBER_ADD = "org.member.add",
  MEMBER_DEL = "org.member.del",
  MEMBER_REORD = "org.member.reorder",
}

export enum PUBLISHES {
  LIST = "org.list",
}
