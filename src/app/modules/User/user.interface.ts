import { Model } from "mongoose";

export type TUserName = {
  firstName: string;
  lastName: string
}

export type TAddress = {
  street: string;
  city: string;
  country: string;
}

export type TOrder = {
  productName: string;
  price: number;
  quantity: number;
}

export type TUser = {
  userId: number;
  username: string;
  password: string;
  fullName: TUserName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address:TAddress;
  isDeleted:boolean;
  orders?:TOrder[];
}

export interface userModel extends Model<TUser> {
  isUserExists(userId: number): Promise<TUser | null>;
}