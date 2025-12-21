# BlockLotto with Real-time Notifications 🔔

Complete setup guide for BlockLotto with Chainhooks integration.

## Quick Start

### 1. Deploy Contract to Testnet

```bash
npm run deploy
npm run init
```

### 2. Start Notification Server

```bash
cd chainhooks
npm install
npm start
```

Server will run on:
- HTTP: http://localhost:3001
- WebSocket: ws://localhost:3002

### 3. Register Chainhook

**Option A: Using Hiro Platform (Easiest)**
1. Go to https://platform.hiro.so
2. Sign in/create account
3. Navigate to "Chainhooks"
4. Click "New Chainhook"
5. Upload `chainhooks/chainhook-config.json`
6. Make sure your webhook URL is publicly accessible (use ngrok for local testing)

**Option B: Using Chainhook CLI**
```bash
# Install chainhook
brew install hirosystems/tap/chainhook

# Apply chainhook
chainhook predicates apply chainhooks/chainhook-config.json --testnet
```

### 4. Expose Local Server (For Testing)

```bash
# Install ngrok
brew install ngrok

# Expose port 3001
ngrok http 3001

# Update chainhooks/chainhook-config.json with ngrok URL
# e.g., "url": "https://abc123.ngrok.io/chainhook"
```

### 5. Start Frontend

```bash
cd web
npm run dev
```

Visit http://localhost:5173

## Features

### Real-time Notifications 📱

The notification bell (🔔) in the header shows:
- **Red badge**: Number of unread notifications
- **Green dot**: Connected to notification service
- **Gray dot**: Disconnected

Click the bell to see notification history.

### Notification Types

1. **🎫 New Entry**: Someone enters the lottery
2. **✅ Min Players Reached**: Lottery ready to draw
3. **🎉 Winner Drawn**: Winner selected
4. **💰 Prize Claimed**: Prize collected

### Browser Notifications

The app requests browser notification permission on first load. Accept to receive notifications even when the tab is in the background.

## Testing

### Test Notification Manually
```bash
curl -X POST http://localhost:3001/test-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎫 Test Notification",
    "message": "This is a test notification",
    "timestamp": "2025-12-21T10:00:00Z"
  }'
```

### Check Server Health
```bash
curl http://localhost:3001/health
```

### View Connected Clients
The health endpoint shows how many WebSocket clients are connected.

## Production Deployment

### Deploy Notification Server

**Recommended platforms:**
- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io

**Environment variables to set:**
- `CHAINHOOK_SECRET`: Your secret token
- `PORT`: 3001 (or platform default)

### Update Frontend

In `web/.env`:
```env
VITE_WS_URL=wss://your-server.com
```

In `web/src/components/notifications.tsx`, update default:
```typescript
wsUrl = 'wss://your-production-server.com'
```

### Update Chainhook Config

In `chainhooks/chainhook-config.json`:
```json
"url": "https://your-production-server.com/chainhook"
```

## Troubleshooting

### No notifications received

1. **Check server is running**: `curl http://localhost:3001/health`
2. **Check WebSocket connection**: Look for "📡 Connected" in browser console
3. **Verify chainhook is registered**: Check Hiro Platform dashboard
4. **Test webhook manually**: Use curl to POST to /chainhook endpoint

### Notifications not showing in browser

1. **Check permission**: Browser settings → Notifications → Allow for localhost
2. **Check WebSocket**: Browser console should show connection
3. **Test notification**: Use the test endpoint

### Chainhook not triggering

1. **Verify contract address** in chainhook-config.json
2. **Check webhook URL** is publicly accessible
3. **Verify authorization token** matches in both config and .env
4. **Check Hiro Platform logs** for errors

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Stacks    │         │     Hiro     │         │  Chainhook  │
│ Blockchain  │────────▶│   Platform   │────────▶│   Server    │
└─────────────┘         └──────────────┘         └──────┬──────┘
                                                         │
                                                         │ WebSocket
                                                         │
                                                  ┌──────▼──────┐
                                                  │   Frontend  │
                                                  │  (Browser)  │
                                                  └─────────────┘
```

1. Contract events happen on Stacks blockchain
2. Hiro Platform Chainhook detects events
3. Webhook POSTs to your server
4. Server broadcasts via WebSocket
5. Frontend receives and displays notifications

## Next Steps

- Add email notifications
- Add SMS notifications (Twilio)
- Add Discord/Telegram bot
- Store notification history in database
- Add notification preferences/settings

## Support

Questions? Open an issue on GitHub!
