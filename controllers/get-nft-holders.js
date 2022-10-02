#!/usr/bin/env node
const { reject } = require('lodash');
const getNftOwner = require('../lib/get-nft-owner');
const { error, info, success, infoWithArgument } = require('../lib/helpers/log');

async function run(address='') {
    return getNftOwner([address]);
}

module.exports = run;