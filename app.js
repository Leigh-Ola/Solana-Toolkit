// express app
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()
const { error, info, success, infoWithArgument } = require('./lib/helpers/log');

app.set('port', process.env.PORT || 3000) // changed
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support url-encoded bodies
app.use(cors())

// controllers for each route
const getNftHolders = require('./controllers/get-nft-holders');
const getTokenHolders = require('./controllers/get-token-holders');

app.get('/', (req, res) => {
    res.send('Hello Solana!')
})

app.get('/get-nft-holder', async (req, res) => {
    let {address} = req.query; // 6gPcytnZyNvcWqJ1oUQBXS8hdEB1L3fgqidrVy388qwV
    info(`Getting NFT holder for ${address}`);
    await getNftHolders(address).then(owner=>{
        success(`SUCCESS!`);
        // infoWithArgument("Holder is %o", owner); 
        res.json({data: owner[0].data.parsed.info.owner});    
    }).catch(e=>{
        console.log("failed")
        error(e);
        res.send("An error occured");
    });
/* owner[0].data.parsed: {
    info: { 
          isNative: false,
          mint: '6gPcytnZyNvcWqJ1oUQBXS8hdEB1L3fgqidrVy388qwV', <= nft address
          owner: 'JCapwSzWyHkjuVrT5ZTyKwBHzV9oYrTNhZguAMc9PiEc', <= owner of the nft
          state: 'initialized',
          tokenAmount: { amount: '1', decimals: 0, uiAmount: 1, uiAmountString: '1' }
        },
    type: 'account'
} */
})

app.get('/get-token-holder', async (req, res) => {
    let {address, page} = req.query; // FBdRvc9CmHUf8ib2sV8PDv2oiFAmyxoftjid3Uv9e4kK, 18
    page = isNaN(Number(page)) || page < 1? 1 : Number(page); // if page is not a number or less than 1, set page to 1
    info(`Getting Token holders for ${address}, offset to page ${page}`);
    const getData = (owners, page) => owners.slice((50*page)-50, 50*page);
    await getTokenHolders(address).then(owners=>{
        success(`SUCCESS!`);
        // infoWithArgument("Holder is %o", owners); 
        let ans = {total: owners.length}; 
        /* ans = {  total: total number of owners, data: list of owners for current page, 
                    count: amount of currently shown owners, pages: total number of pages } */
        if(ans.total>=50){ // if total owners is more than or equal to 50
            ans.data = getData(owners, page); // show only 50 owners according to the requested page
            if(ans.data.length == 0 & owners.length > 0){
                page = Math.ceil(ans.total/50); // if requested page is empty, show last page
                ans.data = getData(owners, page);
            }
        }else{ // if total owners is less than 50
            ans.data = owners; // show all owners
        }
        ans.count = ans.data.length; // calculate amount of currently shown owners
        ans.totalPages = Math.ceil(ans.total/50); // calculate total pages
        ans.currentPage = page // set current page

        res.json({data: ans});    
    }).catch(e=>{
        error(e);
        res.send("An error occured");
    });
})

app.listen(app.get('port'), () => {
    console.log(`Running 9tunes server at port ${app.get('port')}`)
})
