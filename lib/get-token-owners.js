const { PublicKey, Connection } = require('@solana/web3.js');
const { get } = require('lodash');

async function getTokenOwners(address) {
  const connection = new Connection(process.env.RPC_HOST);

  const TOKEN_PUBKEY = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: address,
      },
    },
    {
      dataSize: 165,
    }
  ];
  const programAccountsConfig = {
    filters,
    encoding: 'jsonParsed'
  };
  const listOfTokens = await connection.getParsedProgramAccounts(
    TOKEN_PUBKEY,
    programAccountsConfig
  );

  return listOfTokens.map(token => {
    const info = get(token, 'account.data.parsed.info');
    let {uiAmount, amount} = info.tokenAmount
    const address = info.owner;
    amount = Number(amount);

    return {
      address,
      amount, 
      uiAmount
    }
  }).sort((a, b) => b.amount - a.amount);
}

module.exports = getTokenOwners;
