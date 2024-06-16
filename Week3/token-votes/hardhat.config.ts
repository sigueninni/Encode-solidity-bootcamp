import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const acc1 = process.env.PRIVATE_KEY_1 || "";
const acc2 = process.env.PRIVATE_KEY_2 || "";
const acc3 = process.env.PRIVATE_KEY_3 || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey, acc1, acc2, acc3],
    }
  },
};


export default config;
