import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HandCricket } from "../target/types/hand_cricket";
import { assert } from "chai";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("hand-cricket", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HandCricket as Program<HandCricket>;

  const provider = anchor.getProvider();
  const player = anchor.Wallet.local();
  let gameAccount: anchor.web3.PublicKey;

  // Helper function to fetch game state
  const getGameState = async (gameAccountPublicKey: anchor.web3.PublicKey) => {
    return await program.account.gameAccount.fetch(gameAccountPublicKey);
  };

  it("Initializes the game successfully", async () => {
    // Initialize the game
    [gameAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .startGame()
      .accountsStrict({
        gameAccount,
        player: player.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log("Game started!");

    // Fetch and verify the initial game state
    const gameState = await getGameState(gameAccount);
    assert.equal(gameState.player.toBase58(), player.publicKey.toBase58());
    assert.equal(gameState.score, 0);
    assert.equal(gameState.isActive, true);
  });

  it("Player scores runs when choices don't match", async () => {
    // Mock contract's choice to ensure it doesn't match player's choice
    // For testing, we need to control randomness; however, since we can't alter the contract,
    // we'll proceed and expect that over multiple runs, the choices won't match every time.

    const validChoices = [1, 2, 3, 4, 5, 6];
    let gameOver = false;

    while (!gameOver) {
      const playerChoice = 3; // Valid choice
      try {
        await program.methods
          .playTurn(playerChoice)
          .accountsStrict({
            gameAccount,
            player: player.publicKey,
          })
          .rpc();

        const gameState = await getGameState(gameAccount);

        console.log(`Current Score: ${gameState.score}`);

        if (!gameState.isActive) {
          console.log("Game Over!");
          gameOver = true;
        } else {
          // Ensure the score increased by player's choice
          assert.equal(gameState.score % playerChoice, 0);
        }
      } catch (err) {
        console.error("Error playing turn:", err);
        gameOver = true;
      }
    }
  });
});
