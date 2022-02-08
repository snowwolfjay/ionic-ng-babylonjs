export * from "./shared";
export * from "./types";
export const login = (username: string, password: string) => {
  return new Promise((res, rej) => {
    Meteor.loginWithPassword(username, password, (err) => {
      err ? rej(err) : res(Meteor.userId());
    });
  });
};
