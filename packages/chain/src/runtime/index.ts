import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";
import { Nfts } from "./modules/nfts";

export const modules = VanillaRuntimeModules.with({
  Balances,
  Nfts
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  Nfts: {
    // no config
  }
};

export default {
  modules,
  config,
};
