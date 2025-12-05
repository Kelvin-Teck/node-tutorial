import sequelize from "../config/sequelize";
import User from "./user";

// Import other models here
// import Post from './Post';

const models = {
  User,
};



export { sequelize };
export default models;
