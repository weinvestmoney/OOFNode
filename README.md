# OOFNode
00FNode's a simple, lightweight and easy to use open source node to use with the Open Oracle Framework to automate feed submission for onchain oracles and provide feeds, using a google spreadsheet for collaborative and transparent queries and making feed management easy for users. The node is simple to setup and will run autonomously, pulling from APIs in the spreadsheet and submitting the transactions to update the onchain feeds for any network via customizable RPC. 

## Installation
Simply clone into this repo

`git clone https://github.com/ConjureFi/OOFNode`

Then create a .env with the following parameters

PK=PRIVATEKEY

RPC=RPCURLWITHAPIKEY

OOFAddress=OOFCONTRACTADDRESS

SHEETID=ID / 1syqS8Gpl7ZS9UC_Wr6giY057XebJu3bZKXhIDsN-DJ0

SHEETTITLE=Ethereum or Polygon

SHEETAPI=KEY


Then cd into the dir and run

`node OOFNode.js`

The node will automatically start submitting feeds every hour from the provided private key to the provided OOF address.

## Feeds Setup
Feeds can be created and setup based on the linked spreadhsheet by simply running
setupFeeds
which will then check and if needed create the feeds in the Oracle Feeds struct

Sample Spreadsheet template to fork
https://docs.google.com/spreadsheets/d/1syqS8Gpl7ZS9UC_Wr6giY057XebJu3bZKXhIDsN-DJ0

## Disclaimer
This program like any software might contain bugs. We are not responsible for any bugs or losses from it's use in any way if you choose to use the node or contracts.
