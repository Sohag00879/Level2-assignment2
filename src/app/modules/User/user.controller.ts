import { Request, Response } from 'express';
import { userServices } from './user.service';
import { UserModel } from './user.model';
import { validation } from './user.validation';


//create a user
const createUser = async (req: Request, res: Response) => {

  try {
    const user = req.body;

    //data validation using zod
    const zodParsedData = validation.userValidationSchema.parse(user);

    const data = await userServices.createUserIntoDB(zodParsedData);
    const result = {
      ...data.toObject(),
      password: undefined,
      orders: undefined,
      isDeleted: undefined,
      _id: undefined,
      __v: undefined,
    };

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });

  } catch (error: any) {

    if (error.issues && error.message) {
      res.status(500).json({
        success: false,
        messsage: 'Something went wrong',
        error: error.issues[0].message,
      });
    } else {

      res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',

      });
    }
  }
};


//get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUserFromDb();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,

    });
  }
};


// get single user
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await userServices.getSingleUserFromDb(userId);

    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data: result,
    });
  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: 'User not Found',
      error: {
        code: 404,
        description: error.message,
        
      },
    });
  }
};



const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = req.body;

    const zodParsedData = validation.userValidationSchema.parse(user);

    await userServices.updateUserIntoDb(userId, zodParsedData);
    const updatedUser = await UserModel.find(
      { userId: userId },
      {
        _id: 0,
        password: 0,
        'fullName._id': 0,
        'address._id': 0,
        isDeleted: 0,
        orders: 0,
        __v: 0,
      },
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.issues && error.message) {
      res.status(500).json({
        success: false,
        messsage: 'Something went wrong',
        error: error.issues[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'User not found',
        error: {
          code: 404,
          description: error.message,
        },
      });
    }
  }
};



const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await userServices.deleteUserFromDb(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};



const orderProdcuct = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const newOrder = req.body;
    const zodParsedData = validation.orderValidationSchema.parse(newOrder);
    await userServices.orderProductByUser(userId, zodParsedData);

    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: null,
    });
  } catch (error: any) {
    if (error.issues && error.message) {
      res.status(500).json({
        success: false,
        messsage: 'Something went wrong',
        error: error.issues[0].message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: error.message,
        },
      });
    }
  }
};


const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const result:any= await userServices.getAllOrdersFromUser(userId);
    const order:any = result?.orders.map((order:any) => ({
      productName: order.productName,
      price: order.price,
      quantity: order.quantity,
    }));

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully!',
      data: {
        orders: order,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};



const calculateTotalPrice = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const orders:any = await userServices.calculateTotalPriceFromOrders(userId);
    const multiplyPriceQuantity: number[] | undefined = orders?.orders.map(
      (order:any) => order.price * order.quantity,
    );
    let totalPrice: number = 0;
    if (multiplyPriceQuantity) {
      for (const price of multiplyPriceQuantity) {
        totalPrice = totalPrice + price;
        totalPrice.toFixed(2);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched price!',
      data: {
        totalPrice,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};



export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  orderProdcuct,
  getAllOrders,
  calculateTotalPrice,
};
