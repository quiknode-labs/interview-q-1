"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quikdex extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quikdex.init(
    {
      blockNumber: DataTypes.BIGINT,
      methodName: DataTypes.STRING,
      network: DataTypes.STRING,
      chain: DataTypes.STRING,
      client: DataTypes.STRING,
      version: DataTypes.STRING,
      params: DataTypes.JSONB,
      result: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "Quikdex",
      freezeTableName: true,
    }
  );
  return Quikdex;
};
