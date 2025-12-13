"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("../config/sequelize"));
exports.sequelize = sequelize_1.default;
const user_1 = __importDefault(require("./user"));
const task_1 = __importDefault(require("./task"));
// Import other models here
// import Post from './Post';
const models = {
    User: user_1.default,
    Task: task_1.default
};
exports.default = models;
