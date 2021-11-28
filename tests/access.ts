import * as assert from "assert";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Access } from "../target/types/access";

describe("access", () => {
  const provider = anchor.Provider.local();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Access as Program<Access>;

  const counter = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    await program.rpc.initialize(provider.wallet.publicKey, {
      accounts: {
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [counter],
    });

    const account = await program.account.counter.fetch(counter.publicKey);
    assert.ok(account.authority.equals(provider.wallet.publicKey));
    console.log("555");
    assert.ok(account.count.toNumber() === 0);
    console.log("666");
  });

  it("Updates a counter", async () => {
    await program.rpc.increment({
      accounts: {
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      },
    });

    const account = await program.account.counter.fetch(counter.publicKey);

    assert.ok(account.authority.equals(provider.wallet.publicKey));
    assert.ok(account.count.toNumber() == 1);
  });
});
