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

    //Contract address as 1st parameter, voter address as 2nd and  delegated address as third Parameter
    const parameters = process.argv.slice(2);
    console.log(parameters.length);
    //Some checks
    console.log("\nChecking validity of parameters");
    if (!parameters || parameters.length !== 2)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0] as `0x${string}`;
    const delegatedAdress = parameters[1] as `0x${string}`;


    if (!contractAddress) throw new Error("Contract address not provided");
    if (!delegatedAdress) throw new Error("Delegated address not provided");

    if (!isAddress(contractAddress)) throw new Error("Invalid contract address");
    if (!isAddress(delegatedAdress)) throw new Error("Invalid contract address");

    //getchairPerson address from contract
    // We need a public Client
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });


    const accountVoter = privateKeyToAccount(`0x${voterPrivateKey}`);
    const voter = createWalletClient({
        account: accountVoter,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Voter address:", voter.account.address);

    console.log("\n********************************************");
    console.log("\nStep 3 : delegating votes");
    console.log("\n********************************************");

    console.log('\nVoterAdress delegates to : ', delegatedAdress);
    console.log('\ndelegatedAdress votes');


    const hashDeleg = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [delegatedAdress],
    });
    console.log("Transaction hash:", hashDeleg);
    console.log("Waiting for confirmations...");
    const receiptDeleg = await publicClient.waitForTransactionReceipt({ hash: hashDeleg });
    console.log("Transaction Delegate vote confirmed");


    const weightDelegAfter = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [delegatedAdress],
    })) as any;

    console.log('\nDeleg weigth  after delegation:', weightDelegAfter);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});