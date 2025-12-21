const { callReadOnlyFunction, cvToJSON } = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');

const network = STACKS_TESTNET;
const contractAddress = 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY';
const contractName = 'block-lotto';

async function checkState() {
  try {
    console.log('Checking lottery state...\n');
    
    // Get lottery info
    const lotteryInfo = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName: 'get-lottery-info',
      functionArgs: [],
      senderAddress: contractAddress,
    });
    
    const info = cvToJSON(lotteryInfo);
    console.log('Lottery Info:', JSON.stringify(info, null, 2));
    
    // Get ticket count
    const ticketCount = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName: 'get-ticket-count',
      functionArgs: [],
      senderAddress: contractAddress,
    });
    
    console.log('\nTicket Count:', cvToJSON(ticketCount).value);
    
    // Get contract balance
    const balance = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName: 'get-balance',
      functionArgs: [],
      senderAddress: contractAddress,
    });
    
    console.log('Contract Balance:', cvToJSON(balance).value / 1000000, 'STX');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkState();
