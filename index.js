const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require("node-fetch");
const ethers = require('ethers');
require('dotenv').config()

// config go to file later
const rpc = process.env.RPC
const pk= process.env.PK

let wallet = new ethers.Wallet(pk);
const provider = new ethers.providers.JsonRpcProvider(rpc);

let walletWithProvider = new ethers.Wallet(pk, provider);

console.log(walletWithProvider.address)

async function test() {

    // Initialize the sheet
    const doc = new GoogleSpreadsheet('1syqS8Gpl7ZS9UC_Wr6giY057XebJu3bZKXhIDsN-DJ0');
    await doc.useApiKey("AIzaSyCWfTF6dkEhBTK_4ypPeV5kGz2F8L73RXE");

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows(); // can pass in { limit, offset }

    let i;
    for (i=0; i < rows.length; i++) {
        let feedname = rows[i]["_rawData"][0]
        let feedid= rows[i]["_rawData"][1]
        let endpoint = rows[i]["_rawData"][2]
        let freq = rows[i]["_rawData"][3]
        let decimals = rows[i]["_rawData"][4]
        let parser = rows[i]["_rawData"][5]
        let parsingargs = []

        try {
            parsingargs = parser.split(",");
        } catch {}

        try {
            console.log(endpoint)
            const res = await fetch(endpoint);
            const body = await res.json();

            let j;
            let toParse = body;
            for (j=0; j < parsingargs.length; j++) {
                toParse = toParse[parsingargs[j]]
            }
            console.log(toParse)
            toParse = parseFloat(toParse) * (10 ** decimals)
            console.log(Math.round(toParse))

        } catch {}

    }
}

test()

