import fetch from 'node-fetch';

const contractAddress = 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY';
const contractName = 'block-lotto';
const apiUrl = 'https://api.testnet.hiro.so';

async function checkState() {
  try {
    console.log('Checking lottery state...\n');
    
    // Get lottery info
    const infoResponse = await fetch(`${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-lottery-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: []
      })
    });
    
    const infoData = await infoResponse.json();
    console.log('Lottery Info:', JSON.stringify(infoData, null, 2));
    
    // Get ticket count
    const ticketResponse = await fetch(`${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-ticket-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: []
      })
    });
    
    const ticketData = await ticketResponse.json();
    console.log('\nTicket Count:', ticketData.result);
    
    // Get balance
    const balanceResponse = await fetch(`${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: []
      })
    });
    
    const balanceData = await balanceResponse.json();
    console.log('Contract Balance:', balanceData.result);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkState();
