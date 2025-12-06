import sequelize from "../config/sequelize";
import User from "./user";
import Task from "./task";

// Import other models here
// import Post from './Post';

const models = {
  User,
Task
};



export { sequelize };
export default models;
