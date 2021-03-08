# Written Assignment

## Overview

At QuikNode, we value passion, progress, humility, trust and excellence. For the first part of our interview process, we have you write up a short strategy for deploying this repo to one hundred (100) machines by the end of this week. There is no coding necessary and we in fact _do not_ want you to write any code for this exercise, just tell us how you would get it live and what questions you considered.

What we're selecting for at this step is clarity of thought, ability to communicate and humility. How clear is your writing? What are the items that you consider when planning an infrastructure deployment? Are you willing to invest the time necessary to help us understand your abilities?

> Note: It's important to note that we will not use your work here for anything other than evaluation. This piece of software was created explicitly for the purpose of helping us understand candidate ability, is not in production and we have no plans to put it into production.

We would like for you to take 15-20 minutes to review this repo as it stands and 40-45 minutes to write up a strategy for deploying this to 100 machines by the end of the week. There are many things to consider and we want to hear every question you have and how you think about potential solutions to this.

Without further ado, here is the repo as it would be provided to you by one of our developers.

## QuikDex: A centralized cache of calls for the QuikNode network

To get started make sure you have a PostgreSQL install and run the following:

```sh
npm install && ./node_modules/.bin/sequelize db:create && ./node_modules/.bin/sequelize db:migrate
```

then you can run `npm start` and we will index all future blocks for the following methods:

- eth_getBlockByNumber
- eth_blockNumber
- net_peerCount
- more soon.
