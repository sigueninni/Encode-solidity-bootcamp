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
    if (!parameters || parameters.length !== 3)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0] as `0x${string}`;
    const voterAdress = parameters[1] as `0x${string}`;
    const delegatedAdress = parameters[2] as `0x${string}`;


    if (!contractAddress) throw new Error("Contract address not provided");
    if (!voterAdress) throw new Error("Voter address not provided");
    if (!delegatedAdress) throw new Error("Delegated address not provided");

    if (!isAddress(contractAddress)) throw new Error("Invalid contract address");
    if (!isAddress(voterAdress)) throw new Error("Invalid contract address");
    if (!isAddress(delegatedAdress)) throw new Error("Invalid contract address");

    //getchairPerson address from contract
    // We need a public Client
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

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
    console.log('\nChairPerson give vote right to :', delegatedAdress);

    console.log("\n********************************************");
    console.log("\nStep 2 : casting votes(normal votes)");
    console.log("\n********************************************");
    //TODO

    console.log("\n********************************************");
    console.log("\nStep 3 : delegating votes");
    console.log("\n********************************************");

    console.log('\nVoterAdress delegates to : ', delegatedAdress);
    console.log('\delegatedAdress votes');


    console.log("\n********************************************");
    console.log("\nStep 4 : casting votes(delegated votes)");
    console.log("\n********************************************");


    console.log("\nStep 5 : querying results");
    //TODO

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});