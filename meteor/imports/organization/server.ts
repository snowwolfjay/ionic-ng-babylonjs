import { Meteor } from "meteor/meteor";
import { Organizations } from "./shared";
import { METHODS, OrganizationState, PUBLISHES } from "./types";
export * from "./shared";
export * from "./types";

const userCheck = (uid: string | null) => {
  if (!uid) throw new Meteor.Error(403);
  return uid;
};
// 组织操作
Meteor.methods({
  /**
   * 更新用户资料
   */
  [METHODS.CREATE]: function (data = {}) {
    const uid = userCheck(this.userId);
    const parent =
      data.super &&
      Organizations.findOne({ _id: data.super }, { fields: { parents: 1 } });
    if (data.super && !parent) {
      return [1, "错误的父级组织"];
    }
    const parents = (parent && parent.parents) || [];
    if (data.super && !parents.includes(data.super)) {
      parents.push(data.super);
    }
    const newOne = {
      name: data.name,
      members: [],
      admin: uid,
      super: data.super || null,
      parents,
      membersData: {},
      createdBy: uid,
      createdAt: new Date(),
      state: parents.length
        ? OrganizationState.VALID
        : OrganizationState.CHECKING,
    };
    const _id = Organizations.insert(newOne);
    return [0, _id];
  },
  [METHODS.DELETE]: function (orgId: string) {
    const uid = userCheck(this.userId);
    const org = Organizations.findOne(
      { _id: orgId, admin: uid },
      { fields: { _id: 1 } }
    );
    if (!org) return [1, "没有找到组织或者无权限"];

    const count = Organizations.update(
      {
        $or: [
          {
            _id: orgId,
          },
          {
            parents: orgId,
          },
        ],
      },
      {
        $set: {
          state: OrganizationState.INVALID,
        },
      },
      { multi: true }
    );
    const err = !count;
    return [err, err ? "更新失败" : "删除组织成功"];
  },
});
// 组织成员操作
Meteor.methods({
  [METHODS.MEMBER_DEL]: function (orgId: string, users: string[]) {
    const uid = userCheck(this.userId);
    const $unset = {} as any;
    users.forEach((u: string) => {
      $unset[`membersData.${u}`] = 1;
    });
    const un = Organizations.update(
      { _id: orgId, admin: uid },
      {
        $pull: {
          members: {
            $in: users,
          } as any,
        },
        $unset,
      }
    );
    return [un !== 1];
  },
});
Meteor.publish(PUBLISHES.LIST, function () {
  console.log(`publish user inof of ${this.userId}`);
  return Organizations.find(
    { admin: this.userId!, state: OrganizationState.VALID },
    {
      fields: { profile: 1, username: 1 },
    }
  );
});

Meteor.startup(() => {});
