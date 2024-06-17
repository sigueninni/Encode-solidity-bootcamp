import { viem } from "hardhat";
import { Account } from "viem";
import { loadParamsFromEnv } from "../utils/loadenv";

export async function tokenMinting(
  contract: `0x${string}`,
  amount: bigint,
  account: Account
) {
  const tokenContract = await viem.getContractAt("MyToken", contract);
  for (const address of addressesToSendTokens) {
    console.log(`Minting ${amount} tokens to ${address}`);
    await tokenContract.write.mint([address as `0x${string}`, amount], {
      account,
    });
  }
}

async function mintingWorker() {
  const publicClient = await viem.getPublicClient();

  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Params not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const amountToMintForEachAddress = BigInt(parameters[1]);
  console.log(`Minting ${amountToMintForEachAddress} tokens to each address`);
  const [account] = loadParamsFromEnv();
  console.log(`Account address: ${account.address} `);
  const balance = await publicClient.getBalance({
    address: account.address,
  });
  console.log("balance:", balance);
  tokenMinting(contractAddress, amountToMintForEachAddress, account);
}

mintingWorker().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

const addressesToSendTokens = [
  "0x63aBE7624B3F2f995b4981a514A6140255DB7342", //Chris
  "0xBd6766814799d7deA4aC4d33dEDD7195E37EaC67", //Saad
];
