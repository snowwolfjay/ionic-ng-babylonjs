import "../imports/core/server";
import "../imports/user/server";

Meteor.onConnection((v) => {
  console.log(`${v.id} connected`);
});
