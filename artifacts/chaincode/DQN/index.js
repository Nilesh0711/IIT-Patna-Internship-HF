/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const DQNContract = require("./lib/DQNChaincode");

module.exports.DQNContract = DQNContract;

module.exports.contracts = [
  DQNContract,
];
