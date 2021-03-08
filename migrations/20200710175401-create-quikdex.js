"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Quikdex", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      blockNumber: {
        type: Sequelize.BIGINT,
      },
      methodName: {
        type: Sequelize.STRING,
      },
      network: {
        type: Sequelize.STRING,
      },
      chain: {
        type: Sequelize.STRING,
      },
      client: {
        type: Sequelize.STRING,
      },
      version: {
        type: Sequelize.STRING,
      },
      params: {
        type: Sequelize.JSONB,
      },
      result: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Quikdex");
  },
};
