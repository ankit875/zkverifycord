// import 'dotenv/config';
// import { InstallGlobalCommands } from './utils.js';
// import { APP_ID } from './constant.js';
const { InstallGlobalCommands } = require('./utils.js');
const { APP_ID } = require('./constant.js');


// Simple test command
const VERIFY_COMMAND = {
  name: 'verify',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};


const NFTS_COMMAND = {
  name: 'nfts',
  description: 'View your verified NFTs',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [VERIFY_COMMAND, NFTS_COMMAND];

InstallGlobalCommands(APP_ID, ALL_COMMANDS);