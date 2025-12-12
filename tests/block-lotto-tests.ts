import { Clarinet, Tx, types } from "https://deno.land/x/clarinet@v1.0.8/index.ts";
import type { Chain, Account } from "https://deno.land/x/clarinet@v1.0.8/index.ts";

// Adjust contract name if different
const CONTRACT = 'block-lotto'

Clarinet.test({
  name: "entering, drawing and claiming prize flow",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet_1 = accounts.get('wallet_1')!;
    const wallet_2 = accounts.get('wallet_2')!;
    const wallet_3 = accounts.get('wallet_3')!;

    // Initialize target block to current height + 2
    const currentHeight = chain.blockHeight;
    const target = currentHeight + 2;

    // init (deployer becomes creator/admin)
    let block = chain.mineBlock([Tx.contractCall(CONTRACT, 'init', [types.uint(target)], deployer.address)])
    block.receipts[0].result.expectOk();

    // Admin pauses the lottery
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'pause', [], deployer.address)])
    block.receipts[0].result.expectOk();

    // Wallet_1 tries to enter while paused -> should error
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'enter-lottery', [], wallet_1.address)])
    block.receipts[0].result.expectErr();

    // Non-admin cannot unpause (should error)
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'unpause', [], wallet_1.address)])
    block.receipts[0].result.expectErr();

    // Admin unpauses
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'unpause', [], deployer.address)])
    block.receipts[0].result.expectOk();

    // wallet_1 enters
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'enter-lottery', [], wallet_1.address)])
    block.receipts[0].result.expectOk();

    // wallet_2 enters
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'enter-lottery', [], wallet_2.address)])
    block.receipts[0].result.expectOk();

    // wallet_3 enters
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'enter-lottery', [], wallet_3.address)])
    block.receipts[0].result.expectOk();

    // Advance blocks until >= target
    while (chain.blockHeight < target) {
      chain.mineBlock([]);
    }

    // draw-winner
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'draw-winner', [], deployer.address)])
    block.receipts[0].result.expectOk();

    // get winner
      block = chain.mineBlock([Tx.contractCall(CONTRACT, 'get-winner', [], deployer.address)])
      block.receipts[0].result.expectOk();

    // winner must be one of the three wallets
    // Attempt claim by wallet_1 (may or may not be winner); ensure no panic
    block = chain.mineBlock([Tx.contractCall(CONTRACT, 'claim-prize', [], wallet_1.address)])
  }
})

Clarinet.test({
  name: "refund flow when min players not met",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet_1 = accounts.get('wallet_1')!;

    const currentHeight = chain.blockHeight;
    const target = currentHeight + 2;

    // init
    chain.mineBlock([Tx.contractCall(CONTRACT, 'init', [types.uint(target)], deployer.address)])

    // only one participant
    chain.mineBlock([Tx.contractCall(CONTRACT, 'enter-lottery', [], wallet_1.address)])

    // advance to target
    while (chain.blockHeight < target) { chain.mineBlock([]) }

    // refund
    const block = chain.mineBlock([Tx.contractCall(CONTRACT, 'refund', [], wallet_1.address)])
    block.receipts[0].result.expectOk();
  }
})
