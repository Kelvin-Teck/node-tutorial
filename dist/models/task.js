"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("../config/sequelize"));
const sequelize_2 = require("sequelize");
class Task extends sequelize_2.Model {
}
Task.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    assigneeId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "User",
            key: "id",
        },
    },
    description: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_2.DataTypes.ENUM("pending", "in-progress", "completed"),
        defaultValue: "pending",
        allowNull: false,
    },
    isDeleted: {
        type: sequelize_2.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.default,
    modelName: "Task",
    timestamps: true,
    tableName: "tasks"
});
exports.default = Task;
