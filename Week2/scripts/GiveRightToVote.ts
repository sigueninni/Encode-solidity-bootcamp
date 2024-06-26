import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    //Contract address as 1st parameter, voter address as 2nd and  delegated address as third Parameter
    const parameters = process.argv.slice(2);
    console.log(parameters.length);
    //Some checks
    console.log("\nChecking validity of parameters");
    if (!parameters || parameters.length !== 2)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0] as `0x${string}`;
    const voterAdress = parameters[1] as `0x${string}`;

    if (!contractAddress) throw new Error("Contract address not provided");
    if (!voterAdress) throw new Error("Voter address not provided");
    if (!isAddress(contractAddress)) throw new Error("Invalid contract address");
    if (!isAddress(voterAdress)) throw new Error("Invalid voter address");


    //getchairPerson address from contract
    // We need a public Client
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const chairPerson = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("ChairPerson address:", chairPerson.account.address);


    //This needs to be done on script 'give voting rights'
    console.log("\n********************************************");
    console.log("\nStep 1 : give voting rights");
    console.log("\n********************************************");
    const chairPersonAddress = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "chairperson",
        //args: [],
    })) as any;

    console.log('\nChairPerson :', chairPersonAddress);
    console.log('\nChairPerson give vote right to :', voterAdress);

    const hash = await chairPerson.writeContract({
        address: contractAddress,
        abi,
        functionName: "giveRightToVote",
        args: [voterAdress],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction Give vote right to Voter confirmed");


    const weightVoter1 = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [voterAdress],
    })) as any;

    console.log('\nvoterAdress weigth  :', weightVoter1);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});