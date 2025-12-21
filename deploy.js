import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import walletSdkPkg from '@stacks/wallet-sdk';
const { generateWallet, getStxAddress } = walletSdkPkg;
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function deployContract() {
  const contractName = 'block-lotto-v3';
  const codeBody = fs.readFileSync('./contracts/block-lotto.clar', 'utf8');
  
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
  
  const txOptions = {
    contractName,
    codeBody,
    senderKey: privateKey,
    network: STACKS_TESTNET,
    anchorMode: AnchorMode.Any,
    clarityVersion: 2,
  };

  try {
    console.log('Deploying contract to testnet...');
    console.log('From address:', address);
    const transaction = await makeContractDeploy(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network: STACKS_TESTNET });
    
    console.log('✅ Contract deployed successfully!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('View in explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
    console.log('Contract address:', `${address}.${contractName}`);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

deployContract().catch(console.error);
