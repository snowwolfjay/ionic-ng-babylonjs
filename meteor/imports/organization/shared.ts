import { Organization, ORG_COL } from "./types";

export const Organizations = new Mongo.Collection<Organization>(ORG_COL);
