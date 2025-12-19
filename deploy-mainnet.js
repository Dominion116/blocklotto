import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import walletSdkPkg from '@stacks/wallet-sdk';
const { generateWallet, getStxAddress } = walletSdkPkg;
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

async function deployToMainnet() {
  const mnemonic = process.env.STACKS_MAINNET_MNEMONIC;
  if (!mnemonic || mnemonic === 'your-mainnet-24-word-mnemonic-here') {
    throw new Error('STACKS_MAINNET_MNEMONIC not set in .env file. Add your mainnet wallet mnemonic.');
  }
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  
  const account = wallet.accounts[0];
  const privateKey = account.stxPrivateKey;
  const address = getStxAddress({ account, transactionVersion: 0x80 }); // Use testnet address format
  
  const contractSource = readFileSync('./contracts/block-lotto.clar', 'utf-8');
  
  const txOptions = {
    contractName: 'block-lotto',
    codeBody: contractSource,
    senderKey: privateKey,
    network: STACKS_MAINNET,
    anchorMode: AnchorMode.Any,
    clarityVersion: 2,
  };

  try {
    console.log('🚀 Deploying contract to MAINNET...');
    console.log('⚠️  WARNING: This will deploy to MAINNET and cost real STX!');
    console.log('From address:', address);
    console.log('\nMake sure you have enough STX for deployment fees (~0.5 STX)');
    console.log('\nPress Ctrl+C within 5 seconds to cancel...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const transaction = await makeContractDeploy(txOptions);
    const broadcastResponse = await broadcastTransaction({transaction, network: STACKS_MAINNET});
    
    console.log('\n✅ Contract deployed successfully to MAINNET!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('View in explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
    console.log('Contract address:', `${address}.block-lotto`);
    console.log('\n⏳ Wait 10-20 minutes for confirmation before initializing...');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    if (error.response) {
      const text = await error.response.text();
      console.error('Response:', text);
    }
    throw error;
  }
}

deployToMainnet().catch(console.error);
