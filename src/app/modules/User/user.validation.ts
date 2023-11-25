import { z } from "zod";

const userNameValidationSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "First name must be a string",
  }).max(20, { message: "First name can't be more than 20 characters long" }).trim(),
  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be a string",
  }).max(20, { message: "Last name can't be  more than 20 characters long" }).trim(),
});


const addressValidationSchema = z.object({
  street: z.string({
    required_error: "Street is required",
  }).trim(),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: "City must be a string",
  }).trim(),
  country: z.string({
    required_error: "Country is required",
    invalid_type_error: "Country must be a string",
  }).trim(),
});

const orderValidationSchema = z.object({
  productName: z.string({
    required_error: "Product Name is required",
    invalid_type_error: "Invalid Product Name,  must be in string",
  }).trim().min(1).max(255),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Invalid price,  must be in number",
  }).positive({message:"Price can't be negative"}),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Invalid quantity,  must be in number",
  }).positive({message:"Quantity can't be negative, must be postive"}),
});

const userValidationSchema = z.object({
  userId: z.number({
    required_error: "User Id is required",
    invalid_type_error: "User Id is invalid, must be in number",
  }).int().positive(),

  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username is invalid, must be in string",
  }),

  password: z.string().trim(),

  fullName: userNameValidationSchema,

  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }).int().positive({message:"Age can't be negative, must be positve"}),

  email: z.string().email({ message: "Invalid email address" }).trim(),

  isActive: z.boolean({
    required_error: "isActive is required",
    invalid_type_error: "isActive must be a boolean",
  }),

  hobbies: z.array(z.string({invalid_type_error:'Hobby must be string'}).trim(),{required_error:'Hobbies is required'}),

  address: addressValidationSchema,

  isDeleted: z.boolean({
    required_error: "isActive is required",
    invalid_type_error: "isActive must be a boolean",
  }).default(false),

});

export const validation = {
  userValidationSchema,
  orderValidationSchema,
}
