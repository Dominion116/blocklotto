#!/bin/bash

echo "🚀 BlockLotto Setup Script"
echo "=========================="
echo ""

# Check if contract is deployed
echo "📝 Step 1: Initialize the lottery (wait 10 seconds for deployment to confirm)"
sleep 10
npm run init

echo ""
echo "✅ Contract deployed and initialized!"
echo ""

# Install chainhook server dependencies
echo "📦 Step 2: Installing chainhook server dependencies..."
cd chainhooks
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the chainhook server:"
echo "   cd chainhooks && npm start"
echo ""
echo "2. In another terminal, expose local server with ngrok:"
echo "   brew install ngrok"
echo "   ngrok http 3001"
echo ""
echo "3. Register chainhook at https://platform.hiro.so"
echo "   - Use your ngrok URL (e.g., https://abc123.ngrok.io/chainhook)"
echo "   - Upload chainhooks/chainhook-config.json"
echo ""
echo "4. Start the frontend:"
echo "   cd web && npm run dev"
echo ""
echo "📚 Full guide: ./CHAINHOOKS_GUIDE.md"
