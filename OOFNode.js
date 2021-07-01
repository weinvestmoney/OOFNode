const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require("node-fetch");
const ethers = require('ethers');
require('dotenv').config()
const ABI = require('./abi/oof.json')
const {Contract} = require("ethers");

// config go to file later
const rpc = process.env.RPC
const pk= process.env.PK
const oofAddress= process.env.OOFAddress
const sheetapi= process.env.SpreadsheetAPIKey
const sheetid= process.env.SpreadsheetID

const provider = new ethers.providers.JsonRpcProvider(rpc);
const walletWithProvider = new ethers.Wallet(pk, provider);

const oofContract =  !!ABI && !!walletWithProvider
        ? new Contract(oofAddress, ABI, walletWithProvider)
        : undefined;

// store the feed inventory
let feedInventory = [];

// start building inventory
async function startNode() {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetid);
    await doc.useApiKey(sheetapi);

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

        if (feedname === "Oracle Address" ) continue;
        if (feedname === "Feed Name") continue;
        if (feedname === "CCMCAP/USD") continue;
        if (feedname === "TVLDEFI/USD") continue;

        try {
            parsingargs = parser.split(",");
        } catch {}

        let tempInv = {
            "feedName": feedname,
            "feedId": feedid,
            "endpoint": endpoint,
            "frequency": freq,
            "decimals": decimals,
            "parsingargs": parsingargs
        }

        // process into global feed array
        feedInventory.push(tempInv)
    }

    // process first time then every hour
    await processFeeds(feedInventory)
    setInterval(processFeeds, 3600 * 1000, feedInventory);
}

async function processFeeds(feedInput) {

    let feedIdArray = []
    let feedValueArray = []

    let i;
    console.log("checking feed APIs")

    for (i=0; i < feedInput.length;i++) {
        try {
            console.log(feedInput[i]["endpoint"])
            const res = await fetch(feedInput[i]["endpoint"]);
            const body = await res.json();

            let j;
            let toParse = body;
            for (j=0; j < feedInput[i]["parsingargs"].length; j++) {
                toParse = toParse[feedInput[i]["parsingargs"][j]]
            }
            toParse = parseFloat(toParse) * (10 ** feedInput[i]["decimals"])
            console.log(Math.round(toParse))

            // push values
            feedIdArray.push(feedInput[i]["feedId"])
            feedValueArray.push(Math.round(toParse).toString())

        } catch(e) {
            console.log(e)
        }
    }

    //start web 3 call
    console.log('submitting feeds...')
    try {
        await oofContract.submitFeed(feedIdArray,feedValueArray)
        console.log("submitted feed ids: " + feedIdArray + "with values: " + feedValueArray + " at " + Date.now())
    } catch (e) {
        console.log(e)
    }
}

// start building inventory
async function setupFeeds() {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetapi);
    await doc.useApiKey(sheetid);

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

        if (feedname === "Oracle Address" ) continue;
        if (feedname === "Feed Name") continue;

        try {
            parsingargs = parser.split(",");
        } catch {}

        let tempInv = {
            "feedName": feedname,
            "feedId": feedid,
            "endpoint": endpoint,
            "frequency": freq,
            "decimals": decimals,
            "parsingargs": parsingargs
        }

        // process into global feed array
        feedInventory.push(tempInv)
    }

    let names = []
    let descriptions=[]
    let decimals = []
    let timeslots = []
    let feedCosts = []
    let revenueModes = []

    let x;
    for (x=0; x < feedInventory.length; x++ ) {
        names.push(feedInventory[x]["feedName"])
        descriptions.push("test")
        decimals.push(feedInventory[x]["decimals"])
        timeslots.push(feedInventory[x]["frequency"])
        feedCosts.push(0)
        revenueModes.push(0)
    }

    console.log("creating feeds...")

        try {
        await oofContract.createNewFeeds(names,descriptions,decimals,timeslots,feedCosts,revenueModes)
            console.log("feeds created")
    } catch (e) {
        console.log(e)
    }
}

// starts the node script
//setupFeeds()
startNode()

