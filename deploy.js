import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import stacksNetwork from '@stacks/network';
import fs from 'fs';
import dotenv from 'dotenv';
import * as bip39 from '@scure/bip39';

const { StacksTestnet } = stacksNetwork;

dotenv.config();

const network = new StacksTestnet();

async function deployContract() {
  const contractName = 'block-lotto';
  const codeBody = fs.readFileSync('./contracts/block-lotto.clar', 'utf8');
  
  // Derive private key from mnemonic
  const mnemonic = process.env.STACKS_TESTNET_MNEMONIC;
  if (!mnemonic) {
    throw new Error('STACKS_TESTNET_MNEMONIC not found in .env');
  }
  
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const privateKey = seed.toString('hex').slice(0, 64);
  
  const txOptions = {
    contractName: contractName,
    codeBody: codeBody,
    senderKey: privateKey,
    network: network,
    anchorMode: AnchorMode.Any,
    fee: 500000n,
  };

  try {
    console.log('Deploying contract to testnet...');
    const transaction = await makeContractDeploy(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    console.log('✅ Contract deployed successfully!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('View in explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
    console.log('\nContract address will be: ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY.block-lotto');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
  }
}

deployContract();
