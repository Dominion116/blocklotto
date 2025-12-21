import { makeContractCall, broadcastTransaction, AnchorMode, uintCV } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import walletSdkPkg from '@stacks/wallet-sdk';
const { generateWallet, getStxAddress } = walletSdkPkg;
import dotenv from 'dotenv';

dotenv.config();

async function initializeLottery() {
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
  const address = getStxAddress({ account, transactionVersion: 0x80 });
  
  const response = await fetch('https://api.testnet.hiro.so/v2/info');
  const info = await response.json();
  const currentBlock = info.stacks_tip_height;
  const targetBlock = currentBlock + 10;
  
  const txOptions = {
    contractAddress: address,
    contractName: 'block-lotto',
    functionName: 'init',
    functionArgs: [uintCV(targetBlock)],
    senderKey: privateKey,
    network: STACKS_TESTNET,
    anchorMode: AnchorMode.Any,
  };

  try {
    console.log('Initializing lottery...');
    console.log('From address:', address);
    console.log('Target block:', targetBlock);
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
    
    console.log('✅ Lottery initialized!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('View in explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    throw error;
  }
}

initializeLottery().catch(console.error);
