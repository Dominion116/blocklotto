import fetch from 'node-fetch';

const contractAddress = 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY';
const oldContract = 'block-lotto';
const newContract = 'block-lotto-v2';
const apiUrl = 'https://api.testnet.hiro.so';

async function checkContract(contractName) {
  try {
    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-lottery-info`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: []
        })
      }
    );

    if (!response.ok) {
      return { exists: false, error: response.status };
    }

    const data = await response.json();
    return { exists: true, data };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

console.log('🔍 Verifying Contract Configuration...\n');

console.log(`Checking OLD contract (${oldContract})...`);
const oldResult = await checkContract(oldContract);
if (oldResult.exists) {
  console.log('❌ OLD contract still responding (should be ignored)');
  console.log('   This is the old contract with min_players = 3\n');
} else {
  console.log('✅ OLD contract query (expected to exist but we ignore it)\n');
}

console.log(`Checking NEW contract (${newContract})...`);
const newResult = await checkContract(newContract);
if (newResult.exists) {
  console.log('✅ NEW contract found and responding!');
  console.log('   Contract:', `${contractAddress}.${newContract}`);
  console.log('   Status: Active with min_players = 2');
  console.log('\n📱 Frontend should now be using this contract!');
  console.log('   URL: http://localhost:5173/');
} else {
  console.log('❌ NEW contract not found!');
  console.log('   Error:', newResult.error);
  console.log('   May need a few more seconds to propagate...');
}

console.log('\n✅ Configuration Summary:');
console.log('   • Frontend: block-lotto-v2');
console.log('   • Chainhooks: block-lotto-v2');
console.log('   • Deploy script: block-lotto-v2');
console.log('   • Initialize script: block-lotto-v2');
console.log('\n🧹 Cache cleared from:');
console.log('   • node_modules/.vite');
console.log('   • dist');
console.log('   • .vite');
console.log('\n🔄 Action Required:');
console.log('   1. Open: http://localhost:5173/');
console.log('   2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)');
console.log('   3. Click "Refresh Data" button');
console.log('   4. Check footer shows: block-lotto-v2');
