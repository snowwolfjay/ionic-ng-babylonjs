import { readFileSync } from "fs";
import { getColName } from ".";
import { Users } from "../user/shared";

export const settings = JSON.parse(
  readFileSync(Assets.absoluteFilePath("settings.json"), { encoding: "utf-8" })
);
const AppConfig = new Mongo.Collection<{
  name: string;
  key: string;
  [key: string]: any;
}>(getColName("app-config"));

Object.assign(Meteor.settings, settings);
Meteor.startup(() => {
  if (AppConfig.find({ key: "janus" }).count() === 0) {
    AppConfig.insert({
      key: "janus",
      name: "janus 配置",
      servers: ["http://192.168.10.70:8088/janus"],
    });
  }
  var userCount = Users.find().count();
  console.log(`total user ${userCount}`);
});
