"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const indexers = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const indexer = require(path.join(__dirname, file));
    indexers[indexer.name] = indexer;
  });

Object.keys(indexers).forEach((indexerName) => {
  if (indexers[indexerName].associate) {
    indexers[indexerName].associate(indexers);
  }
});

module.exports = indexers;
