import { Schema, model } from 'mongoose';
import {
  TAddress,
  TOrder,
  TUser,
  TUserName,
  userModel,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      maxlength: [20, 'Frist Name can not be more than 20 Characters'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      maxlength: [20, 'Frist Name can not be more than 20 Characters'],
      trim: true,
    },
  },
  { _id: false },
);

const addressSchema = new Schema<TAddress>(
  {
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>({
  productName: {
    type: String,
    required: [true, 'Product Name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    trim: true,
  },
});

const userSchema = new Schema<TUser, userModel>({
  userId: {
    type: Number,
    unique: true,
    required: [true, 'User Id is required'],
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'User Name is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
  },
  fullName: userNameSchema,
  age: {
    type: Number,
    required: [true, 'Age is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: [true, 'Is Active is required'],
  },
  hobbies: {
    type: [String],
    required: [true, 'Hobbies is required'],
    trim: true,
  },
  address: addressSchema,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  orders: {
    type: [orderSchema],
    required: false,
  },
});

userSchema.pre('save', async function (next) {
  //hashing password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExists = async function (userId: number) {
  const existingUser = await UserModel.findOne({ userId });
  return existingUser;
};

export const UserModel = model<TUser, userModel>('User', userSchema);
