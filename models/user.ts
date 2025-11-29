import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class User extends Model {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

User.init(
    {
        // Model attributes are defined 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
      
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            // allowNull defaults to true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
      timestamps: true,
     tableName: "users"
  }
);

export default User;