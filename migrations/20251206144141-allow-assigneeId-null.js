"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, update any existing NULL values to a valid user ID or remove them
    // (Skip this if you're okay with existing rows having NULL)

    // Change assigneeId to allow NULL
    await queryInterface.changeColumn("tasks", "assigneeId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Make it nullable
    });
  },

  async down(queryInterface, Sequelize) {
    // Before making it NOT NULL, set a default value for any NULL rows
    await queryInterface.sequelize.query(
      `UPDATE tasks SET "assigneeId" = "userId" WHERE "assigneeId" IS NULL`
    );

    await queryInterface.changeColumn("tasks", "assigneeId", {
      type: Sequelize.INTEGER,
      allowNull: false, // Make it required again
    });
  },
};
