# QuikDex

## A centralized cache of calls for the QuikNode network

To get started make sure you have a PostgreSQL install and run the following:

```sh
npm install && ./node_modules/.bin/sequelize db:create && ./node_modules/.bin/sequelize db:migrate
```

then you can run `npm start` and we will index all future blocks for the following methods:

- eth_getBlockByNumber
- eth_blockNumber
- net_peerCount
- more soon.
