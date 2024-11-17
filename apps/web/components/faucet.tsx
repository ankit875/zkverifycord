"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Balance, Balances } from "@proto-kit/library";
import { useBalancesStore, useMintFaucet } from "@/lib/stores/balances";
import { useState } from "react";
import { client } from "chain";
import { PublicKey } from "o1js";

export interface FaucetProps {
  wallet?: string;
  loading: boolean;
  onConnectWallet: () => void;
  onDrip: () => void;
}

export function Faucet({
  wallet,
  onConnectWallet,
  onDrip,
  loading,
}: FaucetProps) {
  const form = useForm();
  // const balances = useBalancesStore();
  const [destAddress,setDestAddress] = useState("");
  const balances = client.runtime.resolve("Balances");
  const mint = useMintFaucet(destAddress);
  const tokenMint =async () =>{
   

  }
  // const getbalance = () =>{
  //  balances.balances[]
  // }

  return (
    <Card className="w-full p-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold">Faucet</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Get testing (L2) MINA tokens for your wallet
        </p>
      </div>
      <Form {...form}>
        <div className="pt-3">
          <FormField
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  To{" "}
                  <span className="text-sm text-zinc-500">(your wallet)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder={wallet ?? "Please connect a wallet first"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="Destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Destination{" "}
                  <span className="text-sm text-zinc-500">(Address)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={wallet ?? "Please connect a wallet first"}
                    value={destAddress}
                    onChange={(e)=>{setDestAddress(e.target.value)}}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
        size={'lg'}
        type="submit"
        className="mt-6 w-full"
        loading={loading}
        onClick={mint}
          >Mint Account</Button>
          {/* <Button
        size={'lg'}
        type="submit"
        className="mt-6 w-full"
        loading={loading}
        onClick={()=>onDrip()}
          >Get Balance</Button> */}
        <Button
          size={"lg"}
          type="submit"
          className="mt-6 w-full"
          loading={loading}
          onClick={() => {
            wallet ?? onConnectWallet();
            wallet && onDrip();
          }}
        >
          {wallet ? "Drip 💦" : "Connect wallet"}
        </Button>
      </Form>
    </Card>
  );
}


