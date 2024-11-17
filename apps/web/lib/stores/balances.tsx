import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { Balance, BalancesKey, TokenId } from "@proto-kit/library";
import { CircuitString, Provable, PublicKey, UInt64 } from "o1js";
import { useCallback, useEffect } from "react";
import { useChainStore } from "./chain";
import { useWalletStore } from "./wallet";

export interface BalancesState {
  loading: boolean;
  balances: {
    // address - balance
    [key: string]: string;
  };
  loadBalance: (client: Client, address: string) => Promise<void>;
  faucet: (client: Client, address: string) => Promise<PendingTransaction>;
  mintToken: (client: Client, address: string) => Promise<PendingTransaction>;
  checkIfUserOwnsNFT: (client: Client, address: string) => Promise<boolean>;
}

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error("Transaction is not a PendingTransaction");
}

export const tokenId = TokenId.from(0);

export const useBalancesStore = create<
  BalancesState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: {},
    async loadBalance(client: Client, address: string) {
      set((state) => {
        state.loading = true;
      });

      const key = BalancesKey.from(tokenId, PublicKey.fromBase58(address));

      const balance = await client.query.runtime.Balances.balances.get(key);

      set((state) => {
        state.loading = false;
        state.balances[address] = balance?.toString() ?? "0";
      });
    },
    async faucet(client: Client, address: string) {
      const balances = client.runtime.resolve("Balances");
      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, async () => {
        await balances.addBalance(tokenId, sender, Balance.from(1000));
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
    async mintToken(client: Client, address: string) {
      const balances = client.runtime.resolve("Nfts");
      const sender = PublicKey.fromBase58(address);

      const tx1 = await client.transaction(sender, async () => {
        await balances.mint(CircuitString.fromString("SomeNFT"), CircuitString.fromString("NFT"), sender);
      });

      await tx1.sign();
      await tx1.send();

      isPendingTransaction(tx1.transaction);
      return tx1.transaction;
    },

    async checkIfUserOwnsNFT(client: Client, address: string) {
      // const balances = client.runtime.resolve("Nfts");
      const sender = PublicKey.fromBase58(address);

      const myNFT = await client.query.runtime.Nfts.nfts.get(sender);
      if(myNFT?.address.toBase58() === sender.toBase58()) {
        return true;
      }
      return false;
    },
    
  })),
);

export const useObserveBalance = () => {
  const client = useClientStore();
  const chain = useChainStore();
  const wallet = useWalletStore();
  const balances = useBalancesStore();

  useEffect(() => {
    if (!client.client || !wallet.wallet) return;

    balances.loadBalance(client.client, wallet.wallet);
  }, [client.client, chain.block?.height, wallet.wallet]);
};

export const useFaucet = () => {
  const client = useClientStore();
  const balances = useBalancesStore();
  const wallet = useWalletStore();

  return useCallback(async () => {
    if (!client.client || !wallet.wallet) return;
    const pendingTransaction = await balances.faucet(
      client.client,
      wallet.wallet,
    );

    wallet.addPendingTransaction(pendingTransaction);
  }, [client.client, wallet.wallet]);
};

export const useMintFaucet = (address:string) => {
  const client = useClientStore();
  const balances = useBalancesStore();
  const wallet = useWalletStore();
  // const sender = PublicKey.fromBase58(address);


  return useCallback(async () => {
    if (!client.client || !address) return;
   
    const pendingTransaction = await balances.mintToken (client.client, address);

    wallet.addPendingTransaction(pendingTransaction);
  }, [client.client, address]);
};

// export const useVerify = (address:string) => {
//   const client = useClientStore();
//   const balances = useBalancesStore();

//   return useCallback(async () => {
//     if (!client.client || !address) return;
//     const ownerShip = await balances.checkIfUserOwnsNFT(client.client, address);
//     return ownerShip;
//   }, [client.client, address]);
// }
