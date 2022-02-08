import { Organizations } from "./shared";
import { METHODS } from "./types";

export * from "./shared";
export * from "./types";
export const createOrg = (name: string, parent?: string) => {
  return new Promise((res, rej) => {
    Meteor.call(METHODS.CREATE, name, parent, (err: any, d: unknown) => {
      err ? rej(err) : res(d);
    });
  });
};
