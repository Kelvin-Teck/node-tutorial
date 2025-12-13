const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tasks = [];
    const statuses = ["pending", "in-progress", "completed"];

    // Generate 100 tasks
    for (let i = 0; i < 100; i++) {
      tasks.push({
        title: faker.helpers.arrayElement([
          faker.hacker.phrase(),
          faker.company.catchPhrase(),
          `${faker.hacker.verb()} ${faker.hacker.noun()}`,
          `${faker.word.verb()} ${faker.word.noun()}`,
        ]),
        userId: 1,
        assigneeId: faker.helpers.arrayElement([1, null]),
        description: faker.lorem.sentence({ min: 5, max: 15 }),
        status: faker.helpers.arrayElement(statuses),
        isDeleted: faker.datatype.boolean({ probability: 0.1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("tasks", tasks, {});

    console.log(`✅ Successfully seeded ${tasks.length} tasks for user ID 1`);

    // Log statistics
    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const inProgressCount = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const deletedCount = tasks.filter((t) => t.isDeleted).length;
    const assignedCount = tasks.filter((t) => t.assigneeId !== null).length;

    console.log("\n📊 Statistics:");
    console.log(`   Pending: ${pendingCount}`);
    console.log(`   In Progress: ${inProgressCount}`);
    console.log(`   Completed: ${completedCount}`);
    console.log(`   Deleted: ${deletedCount}`);
    console.log(`   Assigned: ${assignedCount}`);
    console.log(`   Unassigned: ${tasks.length - assignedCount}`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tasks", { userId: 1 }, {});
    console.log("✅ Successfully removed all tasks for user ID 1");
  },
};
