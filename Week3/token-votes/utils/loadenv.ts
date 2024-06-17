import * as dotenv from "dotenv";
dotenv.config();

import {
  mnemonicToAccount,
  privateKeyToAccount,
  PrivateKeyAccount,
  HDAccount,
} from "viem/accounts";

export function loadParamsFromEnv(): [PrivateKeyAccount | HDAccount, string] {
  const mnemonic = process.env.MNEMONIC;
  const privateKey = process.env.PRIVATE_KEY;
  if (mnemonic) {
    return [mnemonicToAccount(mnemonic, { accountIndex: 0 }), mnemonic];
  } else if (privateKey) {
    return [privateKeyToAccount(`0x${privateKey}`), privateKey];
  } else {
    throw new Error(
      "Couldn't find either MNEMONIC or PRIVATE_KEY in your .env"
    );
  }
}

export type API = {
  apiKey: string | null;
  url: string;
};

export function load_api_sepolia(): API {
  const alchemy = process.env.ALCHEMY_API_KEY;
  const infura = process.env.INFURA_API_KEY;

  if (alchemy) {
    return {
      apiKey: alchemy,
      url: `https://eth-sepolia.g.alchemy.com/v2/${alchemy}`,
    };
  } else if (infura) {
    return {
      apiKey: infura,
      url: `https://sepolia.infura.io/v3/${infura}`,
    };
  }

  return {
    apiKey: null,
    url: "https://ethereum-sepolia-rpc.publicnode.com",
  };
}
