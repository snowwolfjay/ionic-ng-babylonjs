// import { NgZone } from "@angular/core";
// import { UserService } from "./user.service";
// import { Users } from "api/client";
// import { firstValueFrom, Observable } from "rxjs";
// import { sleep } from "src/utils";
// import { APIService } from "../api.service";

// class MockOverlayService {
//   showLoading() {}
//   hideLoading() {}
//   confirm() {}
// }

// describe("User service", () => {
//   const overlay = new MockOverlayService();
//   const api = new APIService(overlay as any, new NgZone({}));
//   const service = new UserService(overlay as any, api);
//   Users.insert({ _id: "1", username: "1", profile: { name: "1" } });
//   Users.insert({ _id: "2", username: "2", profile: { name: "2" } });

//   it("应该能够获取推送了的用户的profile", () => {
//     expect(service.getUserProfile("1")?.name).toEqual("1");
//     expect(service.getUserProfile("3")?.name).toEqual(undefined);
//   });

//   it("能够成功获取到某个已存在用户的可观察对象", async () => {
//     const user$ = service.user$("1") as any;
//     expect(user$ instanceof Observable).toBeTrue();
//     expect((await firstValueFrom<any>(user$))?._id).toEqual("1");
//   });

//   (Accounts as any).connection._userId = "2";
//   it("能够成功订阅自己的信息", async () => {
//     service.subInfo();
//     const v: any = await firstValueFrom(service.mineInfo$);
//     expect(v._id === "2").toBeTruthy();
//     expect(service.isMe("2")).toBeTruthy();
//     expect(service.isMe("3")).toBeFalsy();
//     expect(service.userInfo.id==="2").toBeTruthy();
//   });

//   it("能够调用Meteor.loginWithPassword登录", () => {
//     const spy = spyOn(Meteor, "loginWithPassword");
//     service.login("1", "1");
//     expect(spy).toHaveBeenCalled();
//   });

//   it("自己的信息更新时能够获得及时更新", async () => {
//     Users.update(
//       { _id: "2" },
//       {
//         $set: {
//           profile: { name: "n2" },
//         },
//       }
//     ).subscribe((v) => console.log(v));
//     await sleep(0.4);
//     const v = await firstValueFrom(service.mineInfo$);
//     expect(v.name).toEqual("n2");
//   });
//   // it("更新信息调用了api", () => {
//   //   const spy = spyOn(overlay, "showLoading");
//   //   service.update({ username: "a", password: "", name: "" });
//   //   expect(spy).toHaveBeenCalledWith("userUpdate");
//   // });
// });
