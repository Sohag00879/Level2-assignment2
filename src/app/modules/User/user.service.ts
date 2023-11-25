import { TOrder, TUser } from './user.interface';
import { UserModel } from './user.model';

//create user service
const createUserIntoDB = async (user: TUser) => {
  if (await UserModel.isUserExists(user.userId)) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(user);
  return result;
};

//get all user service
const getAllUserFromDb = async () => {
  const result = await UserModel.aggregate([
    {
      $project: {
        _id: 0,
        userId: 0,
        password: 0,
        isActive: 0,
        hobbies: 0,
        'fullName._id': 0,
        'address._id': 0,
        isDeleted: 0,
        orders: 0,
        __v: 0,
      },
    },
  ]);
  return result;
};


// get single user service
const getSingleUserFromDb = async (userId: number) => {
  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  const result = await UserModel.findOne(
    { userId },
    { _id: 0, password: 0, isDeleted: 0, orders: 0, __v: 0 },
  );
  return result;
};


// update user service
const updateUserIntoDb = async (userId: number, data: TUser) => {

  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }
  const result = await UserModel.updateOne({ userId }, { $set: data });
  return result;
};


//delete user service
const deleteUserFromDb = async (userId: number) => {

  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  const result = await UserModel.updateOne({ userId }, { isDeleted: true });
  return result;
};


//order product service
const orderProductByUser = async (userId: number, newOrder: TOrder) => {

  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  const result = await UserModel.updateOne(
    { userId },
    { $push: { orders: newOrder } },
  );
  return result;
};


//get all order service
const getAllOrdersFromUser = async (userId: number) => {
  
  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  const result = await UserModel.findOne({ userId }, { orders: 1, _id: 0 });
  return result;
};


//calculate total price service
const calculateTotalPriceFromOrders = async (userId: number) => {
  const existingUser = await UserModel.isUserExists(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  const result = await UserModel.findOne({ userId }, { orders: 1, _id: 0 });
  return result;
};


export const userServices = {
  createUserIntoDB,
  getAllUserFromDb,
  getSingleUserFromDb,
  updateUserIntoDb,
  deleteUserFromDb,
  orderProductByUser,
  getAllOrdersFromUser,
  calculateTotalPriceFromOrders,
};
