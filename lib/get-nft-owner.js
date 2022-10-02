// import and use dotenv
require('dotenv').config();
const { PublicKey, Connection } = require('@solana/web3.js');
const { get } = require('lodash');
const connection = new Connection(process.env.RPC_HOST);
const axios = require('axios');
const bs58 = require('bs58')

function getNftOwner(addresses, retries = 0) {
  return new Promise(async (resolve, reject) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    const data = addresses.map(address => {
      return {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "getTokenLargestAccounts",
        "params": [
          address,
          {
            commitment: 'finalized',
          }
        ]
      }
    })

    const res = await axios.post(process.env.RPC_HOST, data, { headers })

    const accounts = res.data.map((item, i) => {
      if (item.result.value[0] && item.result.value[0].uiAmount === 1) {
        return {
          account: item.result.value[0].address,
          address: addresses[i]
        }
      } else {
        return null
      }
    }).filter(Boolean)

    const mutlipleAccData = {
      "jsonrpc": "2.0",
      "id": 3,
      "method": "getMultipleAccounts",
      "params": [
        accounts.map(a => a.account),
        {
          commitment: 'finalized',
          encoding: 'jsonParsed'
        }
      ]
    }

    const info = await axios.post(process.env.RPC_HOST, mutlipleAccData, { headers })
    const infos = info.data.result.value;

    return resolve(infos);
  } catch (err) {
    console.log("Error:", err);
    if(retries > 5) {
      console.log("Maximum retries reached.");
      return reject("Maximum retries reached.")
    }else{
      setTimeout(() => {
        console.log("Retrying....");
        getNftOwner(addresses, retries + 1);
      }, 1000);
    }
  }
})
}

module.exports = getNftOwner;
