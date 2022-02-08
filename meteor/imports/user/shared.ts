import { User } from './types';

export const Users = Meteor.users as any as Mongo.Collection<User, User>;
