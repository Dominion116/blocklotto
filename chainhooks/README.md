# BlockLotto Chainhooks - Real-time Notifications

This service listens to BlockLotto contract events and sends real-time notifications via WebSocket.

## Features

- 🎫 **Entry Notifications**: Alert when someone enters the lottery
- ✅ **Min Players Reached**: Notify when lottery is ready to draw
- 🎉 **Winner Drawn**: Instant notification when winner is selected
- 💰 **Prize Claimed**: Alert when winner claims their prize

## Setup

### 1. Install Dependencies

```bash
cd chainhooks
npm install
```

### 2. Configure Environment

Edit `.env` file:
```env
CHAINHOOK_SECRET=your-secret-token-here
PORT=3001
```

### 3. Update Chainhook Config

Edit `chainhook-config.json` and update:
- Contract address (if different)
- Webhook URL (your public URL or ngrok tunnel)
- Authorization token

### 4. Register Chainhook

Using Hiro Platform:
1. Go to https://platform.hiro.so
2. Navigate to Chainhooks
3. Upload `chainhook-config.json`
4. Start the chainhook

OR using Chainhook CLI:
```bash
chainhook predicates apply chainhook-config.json
```

### 5. Start the Server

```bash
npm start
```

Server runs on:
- HTTP: `http://localhost:3001`
- WebSocket: `ws://localhost:3002`

## Testing

### Test Notification
```bash
curl -X POST http://localhost:3001/test-notification \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"Testing notifications"}'
```

### Health Check
```bash
curl http://localhost:3001/health
```

## Frontend Integration

Add to your React app:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3002');

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notification:', notification);
  
  // Show notification (use your preferred notification library)
  showNotification(notification.title, notification.message);
};
```

## Production Deployment

For production, you need a public endpoint:

1. **Deploy to cloud** (Railway, Render, Fly.io, etc.)
2. **Use ngrok for testing**:
   ```bash
   ngrok http 3001
   ```
3. Update `chainhook-config.json` with your public URL

## Event Types

- `enter-lottery`: User enters lottery
- `min-players-reached`: Lottery ready to draw
- `draw-winner`: Winner selected
- `claim-prize`: Prize claimed

Each notification includes:
- `type`: Event type
- `title`: Notification title
- `message`: Human-readable message
- `sender`: Transaction sender
- `txid`: Transaction ID
- `timestamp`: ISO timestamp
- `explorerUrl`: Link to block explorer
