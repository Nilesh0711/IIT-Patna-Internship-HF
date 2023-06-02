/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");
let initLedger = require("./initLedger.json");
let DQNmodel = require("./DQNmodel");

class DQNContract extends Contract {
  // Init Ledger issues a new assets to the world state which runs only on deploy of chaincode
  async initLedger(ctx) {
    for (const dqnreward of initLedger) {
      // dqnreward.docType = "dqnreward";
      await ctx.stub.putState(
        dqnreward.episode,
        Buffer.from(JSON.stringify(dqnreward))
      );
      console.info(`DQN ${dqnreward.episode} initialized`);
    }
  }

  async createDQN(
    ctx,
    episode,
    learningRate_0_1,
    learningRate_0_0_1,
    learningRate_0_0_0_1
  ) {
    let data = { episode: episode };
    const exists = await this.dqnExists(ctx, JSON.stringify(data));
    if (exists) {
      return `The dqn ${episode} already exist`;
    }
    let dqnreward = new DQNmodel(
      episode,
      learningRate_0_1,
      learningRate_0_0_1,
      learningRate_0_0_0_1
    );
    ctx.stub.putState(episode, Buffer.from(JSON.stringify(dqnreward)));
    return JSON.stringify(dqnreward);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  async dqnExists(ctx, args) {
    args = JSON.parse(args);
    let episode = args.episode;
    const dataJSON = await ctx.stub.getState(episode);
    return dataJSON && dataJSON.length > 0;
  }

  // ReadAsset returns the asset stored in the world state with given id.
  async readDQN(ctx, args) {
    args = JSON.parse(args);
    let episode = args.episode;
    const dataJSON = await ctx.stub.getState(episode); // get the asset from chaincode state
    if (!dataJSON || dataJSON.length === 0) {
      throw new Error(`The dqn ${episode} does not exist`);
    }
    return dataJSON.toString();
  }

  // GetAllAssets returns all assets found in the world state.
  async getAllDQN(ctx, args) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({
        episode: record.episode,
        learningRate_0_1: record.learningRate_0_1,
        learningRate_0_0_1: record.learningRate_0_0_1,
        learningRate_0_0_0_1: record.learningRate_0_0_0_1,
      });
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = DQNContract;
