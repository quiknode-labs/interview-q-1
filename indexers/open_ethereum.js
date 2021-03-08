const ethers = require("ethers");
const sequelize = require("sequelize");
const BaseIndexer = require("./base");
const { Quikdex } = require("../models");

const provider = new ethers.providers.WebSocketProvider(
  process.env.WSS_PROVIDER_URL
);

class OpenEthereum extends BaseIndexer {
  constructor() {
    super();
  }

  methods() {
    return [
      {
        method: "eth_getBlockByNumber",
        calls: (blockNumber) => {
          return [
            {
              iterative: false,
              dbParams: [blockNumber, false],
              run: () => {
                return provider.getBlock(blockNumber);
              },
            },
            {
              iterative: false,
              dbParams: [blockNumber, true],
              run: () => {
                return provider.getBlockWithTransactions(blockNumber);
              },
            },
          ];
        },
      },
      {
        method: "eth_blockNumber",
        calls: () => {
          return [
            {
              dbParams: [],
              iterative: false,
              run: () => {
                return provider.getBlockNumber();
              },
            },
          ];
        },
      },
      {
        method: "net_peerCount",
        calls: () => {
          return [
            {
              dbParams: [],
              iterative: false,
              run: () => {
                return provider.send("net_peerCount");
              },
            },
          ];
        },
      },
      {
        method: "eth_getTransactionByHash",
        calls: (blockNumber) => {
          return [
            {
              dbParams: [],
              iterative: true,
              run: async function* () {
                const block = await provider.getBlock(blockNumber);
                let i = 0;
                while (i <= block.transactions.length) {
                  let txHash = block.transactions[i];
                  yield {
                    dbParams: [txHash],
                    result: await provider.waitForTransaction(txHash),
                  };
                  i++;
                }
              },
            },
          ];
        },
      },
    ];
  }

  async storeResult(context, info) {
    const [quikdexresult, created] = await Quikdex.findOrBuild({
      where: info,
    });
    const dbRecord = await quikdexresult.save();
    console.log(`[${context}] Saved record: ${dbRecord.id}`);
    return dbRecord.id;
  }

  async runBackward({
    network = "ethereum",
    chain = "mainnet",
    client,
    version,
  }) {
    console.log("[runBackward] Getting earliest block from DB...");
    const queryResult = await Quikdex.findAll({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("blockNumber")), "earliestBlockNum"],
      ],
    });
    const blockHeight = queryResult[0].dataValues.earliestBlockNum;
    const endBlock = blockHeight - 18000; //180000;
    let currentBlock = blockHeight;
    console.log(`[runBackward] Going backward from block: ${blockHeight}`);
    console.log(`[runBackward] Will stop at block: ${endBlock}`);
    while (currentBlock >= endBlock) {
      this.methods().forEach(async (eth) => {
        console.log(`[runBackward] About to process method: ${eth.method}`);
        eth.calls(currentBlock).forEach(async (method, i) => {
          console.log(`[runBackward] currentBlock is: ${currentBlock}`);
          /// demarcation
          let result;
          console.log(`[runBackward] Processing ${eth.method}!`);
          if (method.iterative) {
            console.log(
              `[runBackward] Iteration about to begin ${eth.method}!`
            );
            const generator = method.run();
            let res = await generator.next();
            while (res.done === false) {
              let { result, dbParams } = res.value;
              console.log(
                `[runBackward] ${eth.method} RESULT: ${JSON.stringify(result)}`
              );
              const storedRecord = await this.storeResult("runBackward", {
                methodName: eth.method,
                params: dbParams,
                blockNumber: currentBlock,
                result: JSON.stringify(result),
                network,
                chain,
                client,
                version,
              });
              res = await generator.next();
            }
          } else {
            result = await method.run();
            console.log(
              `[runBackward] ${eth.method} RESULT: ${JSON.stringify(result)}`
            );
            const storedRecord = await this.storeResult("runBackward", {
              methodName: eth.method,
              params: method.dbParams,
              blockNumber: currentBlock,
              result: JSON.stringify(result),
              network,
              chain,
              client,
              version,
            });
          }
        });
      });
      currentBlock--;
    }
  }

  runForward({ network = "ethereum", chain = "mainnet", client, version }) {
    console.log("[runForward] Listening for new blocks...");
    provider.on("block", (blockNumber) => {
      console.log(`[runForward] New block: ${blockNumber}`);
      this.methods().forEach((eth) => {
        console.log(`[runForward] About to process method: ${eth.method}`);
        eth.calls(blockNumber).forEach(async (method, i) => {
          let result;
          console.log(`[runForward] Processing ${eth.method}!`);
          if (method.iterative) {
            console.log(`[runForward] Iteration about to begin ${eth.method}!`);
            const generator = method.run();
            let res = await generator.next();
            while (res.done === false) {
              let { result, dbParams } = res.value;
              console.log(
                `[runForward] ${eth.method} RESULT: ${JSON.stringify(result)}`
              );
              const storedRecord = await this.storeResult("runForward", {
                methodName: eth.method,
                params: dbParams,
                blockNumber,
                result: JSON.stringify(result),
                network,
                chain,
                client,
                version,
              });
              res = await generator.next();
            }
          } else {
            result = await method.run();
            console.log(
              `[runForward] ${eth.method} RESULT: ${JSON.stringify(result)}`
            );
            const storedRecord = await this.storeResult("runForward", {
              methodName: eth.method,
              params: method.dbParams,
              blockNumber,
              result: JSON.stringify(result),
              network,
              chain,
              client,
              version,
            });
          }
        });
      });
    });
  }
}

module.exports = OpenEthereum;
