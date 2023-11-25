import Joi from 'joi'

const userNameValidationSchema = Joi.object({
  firstName: Joi.string().max(20).trim().required().label('First Name'),
  lastName: Joi.string().max(20).trim().required().label('Last Name'),
});

const addressValidationSchema = Joi.object({
  street: Joi.string().trim().required().label('Street'),
  city: Joi.string().trim().required().label('City'),
  country: Joi.string().trim().required().label('Country'),
});

const orderValidationSchema = Joi.object({
  productName: Joi.string().trim().required().label('Product Name'),
  price: Joi.number().required().label('Price'),
  quantity: Joi.number().required().label('Quantity'),
});

const userValidationSchema = Joi.object({
  userId: Joi.number().required().label('User Id'),
  username: Joi.string().trim().required().label('User Name'),
  password: Joi.string().trim().required().label('Password'),
  fullName: userNameValidationSchema.required().label('Full Name'),
  age: Joi.number().required().label('Age'),
  email: Joi.string().email().trim().required().label('Email'),
  isActive: Joi.boolean().required().label('Is Active'),
  hobbies: Joi.array().items(Joi.string().trim()).required().label('Hobbies'),
  address: addressValidationSchema.required().label('Address'),
  isDeleted: Joi.boolean().default(false),
  orders: Joi.array().items(orderValidationSchema).required().label('Orders'),
});

// export default userValidationSchema;