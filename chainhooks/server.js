import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { cvToValue, deserializeCV } from '@stacks/transactions';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Create HTTP server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Chainhook server running on port ${port}`);
  console.log(`📡 WebSocket server running on same port ${port}`);
  console.log(`💡 Connected clients: ${clients.size}`);
});

// WebSocket server attached to HTTP server (same port)
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
function broadcast(notification) {
  const message = JSON.stringify(notification);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Chainhook webhook endpoint
app.post('/chainhook', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.CHAINHOOK_SECRET || 'YOUR_SECRET_TOKEN_HERE'}`;
    
    if (authHeader !== expectedAuth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = req.body;
    console.log('Received chainhook event:', JSON.stringify(event, null, 2));

    // Process different contract call types
    if (event.apply && event.apply.length > 0) {
      for (const application of event.apply) {
        for (const transaction of application.transactions) {
          if (transaction.metadata?.kind === 'ContractCall') {
            const contractCall = transaction.metadata;
            const method = contractCall.method;
            const sender = transaction.metadata.sender;
            const txid = transaction.transaction_identifier.hash;

            let notification = {
              type: method,
              sender,
              txid,
              timestamp: new Date().toISOString(),
              explorerUrl: `https://explorer.hiro.so/txid/${txid}?chain=testnet`
            };

            switch (method) {
              case 'enter-lottery':
                notification.title = '🎫 New Lottery Entry!';
                notification.message = `${sender.slice(0, 8)}... just entered the lottery`;
                
                // Fetch lottery info to check if min players reached
                const lotteryInfo = await fetchLotteryInfo();
                if (lotteryInfo && lotteryInfo.total_participants >= lotteryInfo.min_players) {
                  const minPlayersNotif = {
                    type: 'min-players-reached',
                    title: '✅ Lottery Ready!',
                    message: `Minimum ${lotteryInfo.min_players} players reached! Winner can be drawn.`,
                    participants: lotteryInfo.total_participants,
                    prizePool: `${lotteryInfo.prize_pool / 1000000} STX`,
                    timestamp: new Date().toISOString()
                  };
                  broadcast(minPlayersNotif);
                  console.log('Min players reached notification sent');
                }
                break;

              case 'draw-winner':
                // Extract winner from result
                const result = transaction.metadata.result;
                if (result && result.hex) {
                  try {
                    const cv = deserializeCV(result.hex);
                    const value = cvToValue(cv);
                    notification.winner = value.value;
                    notification.title = '🎉 Winner Drawn!';
                    notification.message = `Winner: ${value.value.slice(0, 8)}...`;
                  } catch (e) {
                    console.error('Error parsing winner:', e);
                    notification.title = '🎲 Draw Winner Called';
                    notification.message = 'Winner selection in progress';
                  }
                } else {
                  notification.title = '🎲 Draw Winner Called';
                  notification.message = 'Winner selection in progress';
                }
                break;

              case 'claim-prize':
                notification.title = '💰 Prize Claimed!';
                notification.message = `${sender.slice(0, 8)}... claimed their prize`;
                break;
            }

            broadcast(notification);
            console.log('Notification sent:', notification.title);
          }
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing chainhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch lottery info from contract
async function fetchLotteryInfo() {
  try {
    const contractAddress = 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY';
    const contractName = 'block-lotto-v3';
    const apiUrl = 'https://api.testnet.hiro.so';
    
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

    if (!response.ok) return null;

    const data = await response.json();
    if (data.okay && data.result) {
      const cv = deserializeCV(data.result);
      const value = cvToValue(cv);
      return {
        total_participants: Number(value.value.total_participants.value),
        min_players: Number(value.value.min_players.value),
        prize_pool: Number(value.value.prize_pool.value),
        status: Number(value.value.status.value)
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching lottery info:', error);
    return null;
  }
}

// Root endpoint for WebSocket upgrade
app.get('/', (req, res) => {
  if (req.headers.upgrade === 'websocket') {
    // WebSocket upgrade will be handled by the ws library
    return;
  }
  res.json({ 
    status: 'ok',
    message: 'BlockLotto Notifications Server',
    connectedClients: clients.size
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedClients: clients.size,
    timestamp: new Date().toISOString()
  });
});

// Test notification endpoint (for development)
app.post('/test-notification', (req, res) => {
  const notification = req.body;
  broadcast(notification);
  res.json({ status: 'sent', clients: clients.size });
});
