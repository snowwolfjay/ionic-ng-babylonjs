import { Meteor } from "meteor/meteor";
import { Users } from "./shared";
import { USER_METHODS, USER_PUBLISH } from "./types";
export * from "./shared";
export * from "./types";
const defaultAdminAcount = {
  username: "edtadmin",
  password: "edtadmin",
};

const userCheck = (uid: string | null) => {
  if (!uid) throw new Meteor.Error(403);
  return uid;
};
Meteor.methods({
  /**
   * 更新用户资料
   */
  [USER_METHODS.update]: function (data = {}) {
    console.log(
      `更新用户资料userId[${this.userId}]->profile[${JSON.stringify(data)}]`
    );
    const uid = userCheck(this.userId);
    if (!this.userId) {
      return [1, "未登录用户"];
    }
    const uo = {} as any;
    if (data.password) {
      const res = Accounts._checkPassword(Users.findOne(uid)!, data.password);
      // same password not change
      if (!res.error) {
        console.log(`set password to ${data.password}`);
        Accounts.setPassword(this.userId, data.password, { logout: false });
      }
    }
    if (Object.keys(uo).length > 0)
      Users.update(uid, {
        $set: uo,
      });
    return [0];
  },
});

Meteor.publish(USER_PUBLISH.mineInfo, function () {
  console.log(`publish user inof of ${this.userId}`);
  return Meteor.users.find(this.userId!, {
    fields: { profile: 1, username: 1 },
  });
});

Meteor.startup(() => {
  const admin = Users.findOne({ role: "admin" });
  if (!admin) {
    const id = Accounts.createUser(defaultAdminAcount);
    Users.update(id, { $set: { role: "admin" } });
    console.log(`create default admin user edtadmin - `);
  }
});
