const ethers = require("ethers");
const express = require("express");
const { OpenEthereum } = require("../indexers");

let oe = new OpenEthereum();
(async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_PROVIDER_URL
  );
  const clientVersion = await provider.send("web3_clientVersion");
  const client = clientVersion.split("//")[0];
  const version = clientVersion.split("//")[1].split("-")[0];
  oe.runForward({ client, version });

  // for monitoring
  const app = express();

  app.get("/ping", (req, res) => {
    res.send("alive");
  });

  app.listen(3001, () => {
    console.log("PING server running on localhost:3001");
  });
})();
