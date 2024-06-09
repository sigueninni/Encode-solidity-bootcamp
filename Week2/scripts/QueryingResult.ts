import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const voterPrivateKey = process.env.PRIVATE_KEY_VOTER || "";
const delegPrivateKey = process.env.PRIVATE_KEY_DELEG || "";

async function main() {

    //Contract address as 1st parameter
    const parameters = process.argv.slice(2);
    //Some checks
    console.log("\nChecking validity of parameters");
    if (!parameters || parameters.length !== 1)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0] as `0x${string}`;

    if (!contractAddress) throw new Error("Contract address not provided");
    if (!isAddress(contractAddress)) throw new Error("Invalid contract address");

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    console.log("\n********************************************");
    console.log("\nStep 5 : Querying result");
    console.log("\n********************************************");

    console.log(" ");
    const winingProposal = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "winnerName",

    })) as any;

    const nameWiningProposal = hexToString(winingProposal, { size: 32 });
    console.log("wining proposal:", nameWiningProposal);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});