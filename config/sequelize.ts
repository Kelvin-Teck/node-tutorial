import { Sequelize } from "sequelize";

 const sequelize = new Sequelize('dummy-db', 'postgres', '1234567890', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
  logging: true
 });

 export default sequelize;