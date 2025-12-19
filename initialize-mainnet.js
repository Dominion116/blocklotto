import { makeContractCall, broadcastTransaction, AnchorMode, uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import walletSdkPkg from '@stacks/wallet-sdk';
const { generateWallet, getStxAddress } = walletSdkPkg;
import dotenv from 'dotenv';

dotenv.config();

async function initializeLotteryMainnet() {
  const mnemonic = process.env.STACKS_MAINNET_MNEMONIC;
  if (!mnemonic || mnemonic === 'your-mainnet-24-word-mnemonic-here') {
    throw new Error('STACKS_MAINNET_MNEMONIC not set in .env file');
  }
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  
  const account = wallet.accounts[0];
  const privateKey = account.stxPrivateKey;
  const address = getStxAddress({ account, transactionVersion: 0x16 }); // 0x16 for mainnet
  
  // Get current block height and set target to current + 100 blocks (~100 minutes)
  const response = await fetch('https://api.hiro.so/v2/info');
  const info = await response.json();
  const currentBlock = info.stacks_tip_height;
  const targetBlock = currentBlock + 100; // 100 blocks from now (~100 minutes on mainnet)
  
  const txOptions = {
    contractAddress: address,
    contractName: 'block-lotto',
    functionName: 'init',
    functionArgs: [uintCV(targetBlock)],
    senderKey: privateKey,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
  };

  try {
    console.log('🚀 Initializing lottery on MAINNET...');
    console.log('⚠️  WARNING: This will initialize on MAINNET!');
    console.log('From address:', address);
    console.log('Current block:', currentBlock);
    console.log('Target block:', targetBlock, '(~100 blocks from now)');
    console.log('\nPress Ctrl+C within 5 seconds to cancel...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({transaction, network: new StacksMainnet()});
    
    console.log('\n✅ Lottery initialized on MAINNET!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('View in explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    if (error.response) {
      const text = await error.response.text();
      console.error('Response:', text);
    }
    throw error;
  }
}

initializeLotteryMainnet().catch(console.error);
