import { runtimeModule, state, runtimeMethod, RuntimeModule } from "@proto-kit/module";
import { Option, State, StateMap, assert } from "@proto-kit/protocol";
<<<<<<< Updated upstream
import { Bool, Provable, CircuitString, PublicKey, Struct, UInt64 } from "o1js";
=======
import { Bool, CircuitString, PublicKey, Struct, UInt64 } from "o1js";
import { boolean } from "yargs";
>>>>>>> Stashed changes


export class NftData extends Struct({
  tokenName: CircuitString,
  tokenSymbol: CircuitString,
  address: PublicKey,
<<<<<<< Updated upstream
  nftId: UInt64,
=======
>>>>>>> Stashed changes
}) {}

// Response structure for ownership check
export class NftDataWithOwnership extends Struct({
    nftData: NftData,
    isOwner: Bool,
  }) {}
  

@runtimeModule()
export class Nfts extends RuntimeModule {
//   @state() public circulatingSupply = State.from<Balance>(Balance);
<<<<<<< Updated upstream
  @state() public nfts = StateMap.from<PublicKey, NftData>(PublicKey, NftData);
=======
  @state() public nfts = StateMap.from<UInt64, NftData>(UInt64, NftData);
>>>>>>> Stashed changes
  @state() public lastNftId = State.from<UInt64>(UInt64);

  init() {
    this.lastNftId.set(UInt64.from(0));
  }

  @runtimeMethod()
  public async mint(
    tokenName: CircuitString,
    tokenSymbol: CircuitString,
    address: PublicKey,
    ): Promise<void> {
        const lastNftId = (await this.lastNftId.get()).orElse(UInt64.from(0));
<<<<<<< Updated upstream
        await this.nfts.set(address, new NftData({
            tokenName,
            tokenSymbol,
            address,
            nftId: lastNftId,
        }));
        await this.lastNftId.set(lastNftId.add(UInt64.from(1)));
  }
=======
        await this.nfts.set(lastNftId, new NftData({
            tokenName,
            tokenSymbol,
            address
        }));
        await this.lastNftId.set(lastNftId.add(UInt64.from(1)));
  }
  @runtimeMethod()
  public async check(nftId: UInt64, checkAddress: PublicKey): Promise<NftDataWithOwnership | undefined> {
    const nft = await this.nfts.get(UInt64.from(nftId));
    if (!nft) {
      return undefined;
    } 

    const nftData = nft.value;
    return new NftDataWithOwnership({
        nftData: nftData,
        isOwner: nftData.address.equals(checkAddress)
    });
  }

// Helper method to just get NFT data without ownership check
@runtimeMethod()
public async getNftData(nftId: UInt64): Promise<Option<NftData>> {
  return await this.nfts.get(nftId);
}

// Method to verify if an address is the owner of an NFT
@runtimeMethod()
public async isOwner(nftId: UInt64, checkAddress: PublicKey): Promise<Bool> {
  const nftData = await this.nfts.get(UInt64.from(nftId));
  
  if (!nftData) {
    return Bool(false);
  }
  return nftData.value.address.equals(checkAddress);
}
>>>>>>> Stashed changes
}
