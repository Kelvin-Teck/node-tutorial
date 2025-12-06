import sequelize from "../config/sequelize";
import { DataTypes, Model } from "sequelize";

class Task extends Model {
    id: number;
    title: string;
    userId: number;
    assigneeId: number;
    description: string;
    status: "pending" | "in-progress" | "completed";
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
          autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
        },
    userId: {
      type: DataTypes.INTEGER,
        allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    assigneeId: {
      type: DataTypes.INTEGER,
        allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "in-progress", "completed"),
        defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    sequelize,
      modelName: "Task",
     timestamps: true,
     tableName: "tasks"
  }
);

export default Task;