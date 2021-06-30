const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require("node-fetch");

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

        try {
            console.log(endpoint)
            const res = await fetch(endpoint);
            const body = await res.json();
            console.log(body);
        } catch {}

    }
}

test()

