/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const DDQNContract = require("./lib/DDQNChaincode");

module.exports.DDQNContract = DDQNContract;

module.exports.contracts = [
  DDQNContract,
];
