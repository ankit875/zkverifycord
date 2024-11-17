// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import { Client } from "./client"; // adjust import path based on your setup
// import { CircuitString, PublicKey, UInt64 } from "o1js";
// import { PendingTransaction } from "@proto-kit/sequencer";

// interface NFTState {
//   loading: boolean;
//   nfts: {
//     [tokenId: string]: {
//       tokenName: string;
//       tokenSymbol: string;
//       owner: string;
//     };
//   };
//   mintNFT: (
//     client: Client,
//     tokenName: string,
//     tokenSymbol: string,
//     address: string
//   ) => Promise<PendingTransaction>;
//   getNFT: (client: Client, tokenId: number) => Promise<void>;
// }

// export const useNftStore = create<NFTState>()(
//   immer((set) => ({
//     loading: false,
//     nfts: {},

//     async mintNFT(client: Client, tokenName: string, tokenSymbol: string, address: string) {
//       const nfts = client.runtime.resolve("NFTs");
//       const sender = PublicKey.fromBase58(address);

//       const tx = await client.transaction(sender, async () => {
//         await nfts.mint(
//           CircuitString.fromString(tokenName),
//           CircuitString.fromString(tokenSymbol),
//         );
//       });

//       await tx.sign();
//       await tx.send();

//       return tx.transaction;
//     },

//   }))
// );