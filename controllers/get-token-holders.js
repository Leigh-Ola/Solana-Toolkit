#!/usr/bin/env node
require('dotenv').config();
const getTokenOwners = require('../lib/get-token-owners');
const fs = require('fs');
const path = require('path');

const { error, success, info, infoWithArgument } = require('../lib/helpers/log');


async function run(address='') {
    return getTokenOwners(address);
}

module.exports = run;