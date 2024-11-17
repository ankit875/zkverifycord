import { TestingAppChain } from "@proto-kit/sdk";
import { CircuitString, PrivateKey, UInt64 } from "o1js";
import { Nfts } from "../../../src/runtime/modules/nfts"; // adjust path as needed
import { Balances } from "../../../src/runtime/modules/balances";
import { log } from "@proto-kit/common";
import { UInt64 as ProtoUInt64} from "@proto-kit/library";

log.setLevel("ERROR");

const dummyNFT = {
    name: "CoolNFT",
    symbol: "CNFT",
}

describe("nfts", () => {
  it("should demonstrate how NFTs work", async () => {
    const appChain = TestingAppChain.fromRuntime({
      Nfts
    });

    appChain.configurePartial({ 
      Runtime: {
        Nfts: {},
        Balances: {}
      },
    });

    await appChain.start();

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    const alice1PrivateKey = PrivateKey.random();
    const alice1 = alice1PrivateKey.toPublicKey();

    appChain.setSigner(alicePrivateKey);

    const nfts = appChain.runtime.resolve("Nfts");

    // Test minting first NFT
    const tx1 = await appChain.transaction(alice, async () => {
      await nfts.mint(
        CircuitString.fromString(dummyNFT.name),
        CircuitString.fromString(dummyNFT.symbol),
        alice
      );
    });

    await tx1.sign();
    await tx1.send();

    const block1 = await appChain.produceBlock();

    const myNFT = await appChain.query.runtime.Nfts.nfts.get(alice1);
    console.log(myNFT)
     
    //   expect(block1?.transactions[0].status.toBoolean()).toBe(true);
      expect(myNFT?.tokenName.toString()).toBe(dummyNFT.name);


    // // Check first NFT
    // const nft1 = await nfts.getNftData(UInt64.from(0));
    // expect(myNFT?.tokenName.toString()).toBe("CoolNFT");
    // expect(myNFT?.tokenSymbol.toString()).toBe("CNFT");
    // expect(myNFT?.address.toBase58()).toBe(alice.toBase58());
    // expect(nft1.value.tokenName.toString()).toBe("CoolNFT")

    // // Test minting second NFT
    // const tx2 = await appChain.transaction(alice, async () => {
    //   await nfts.mint(
    //     CircuitString.fromString("SecondNFT"),
    //     CircuitString.fromString("SNFT"),
    //     alice
    //   );
    // });

    // await tx2.sign();
    // await tx2.send();

    // const block2 = await appChain.produceBlock();

    // // Check second NFT
    // const nftData2 = await nfts.check(UInt64.from(1));
    // const nftValue2 = nftData2.value;

    // expect(block2?.transactions[0].status.toBoolean()).toBe(true);
    // expect(nftValue2?.tokenName.toString()).toBe("SecondNFT");
    // expect(nftValue2?.tokenSymbol.toString()).toBe("SNFT");
    // expect(nftValue2?.address.toBase58()).toBe(alice.toBase58());

    // // Verify incrementing NFT IDs
    // const lastNftId = await appChain.query.runtime.Nfts.lastNftId.get();
    // expect(lastNftId?.toBigInt()).toBe(2n);

  }, 1_000_000);
});