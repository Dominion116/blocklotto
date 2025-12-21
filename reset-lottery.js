import { makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import walletSdkPkg from '@stacks/wallet-sdk';
const { generateWallet, getStxAddress } = walletSdkPkg;
import dotenv from 'dotenv';

dotenv.config();

const network = STACKS_TESTNET;

async function resetLottery() {
  const mnemonic = process.env.STACKS_TESTNET_MNEMONIC;
  if (!mnemonic) {
    throw new Error('STACKS_TESTNET_MNEMONIC not found in .env');
  }
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  
  const account = wallet.accounts[0];
  const privateKey = account.stxPrivateKey;
  
  // Get current block and set target
  const response = await fetch('https://api.testnet.hiro.so/v2/info');
  const info = await response.json();
  const currentBlock = info.stacks_tip_height;
  const targetBlock = currentBlock + 15;
  
  console.log('Resetting lottery...');
  console.log('Current block:', currentBlock);
  console.log('Target block:', targetBlock);

  const txOptions = {
    contractAddress: 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY',
    contractName: 'block-lotto-v3',
    functionName: 'reset-lottery',
    functionArgs: [uintCV(targetBlock)],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  console.log('✅ Lottery reset!');
  console.log('Transaction ID:', broadcastResponse.txid);
  console.log(`View in explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
}

resetLottery().catch(console.error);
