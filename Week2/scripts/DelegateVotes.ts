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

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const chairPerson = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("ChairPerson address:", chairPerson.account.address);

    const accountVoter = privateKeyToAccount(`0x${voterPrivateKey}`);
    const voter = createWalletClient({
        account: accountVoter,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Voter address:", chairPerson.account.address);

    const accountDeleg = privateKeyToAccount(`0x${delegPrivateKey}`);
    const deleg = createWalletClient({
        account: accountDeleg,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Deleg address:", deleg.account.address);


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


    console.log('\nChairPerson give vote right to :', delegatedAdress);


    const hashRightDeleg = await chairPerson.writeContract({
        address: contractAddress,
        abi,
        functionName: "giveRightToVote",
        args: [delegatedAdress],
    });
    console.log("Transaction hash:", hashRightDeleg);
    console.log("Waiting for confirmations...");
    const receiptRightDeleg = await publicClient.waitForTransactionReceipt({ hash: hashRightDeleg });
    console.log("Transaction Give vote right to Voter confirmed");


    const weightDeleg = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [delegatedAdress],
    })) as any;

    console.log('\nDeleg weigth  before delegation:', weightDeleg);


    console.log("\n********************************************");
    console.log("\nStep 2 : casting votes(normal votes)");
    console.log("\n********************************************");
    //TODO

    /*  const proposalIndex = 1; //TODO should be parameter of castvotes script
     console.log("Proposal selected: ");
     const proposal = (await publicClient.readContract({
         address: contractAddress,
         abi,
         functionName: "proposals",
         args: [BigInt(proposalIndex)],
     })) as any[];
     const name = hexToString(proposal[0], { size: 32 });
     console.log("Voting to proposal", name);
     console.log("Confirm? (Y/n)");
 
     const stdin = process.openStdin();
     stdin.addListener("data", async function (d) {
         if (d.toString().trim().toLowerCase() != "n") {
             const hash = await voter.writeContract({
                 address: contractAddress,
                 abi,
                 functionName: "vote",
                 args: [BigInt(proposalIndex)],
             });
             console.log("Transaction hash:", hash);
             console.log("Waiting for confirmations...");
             const receipt = await publicClient.waitForTransactionReceipt({ hash });
             console.log("Transaction confirmed");
         } else {
             console.log("Operation cancelled");
         }
         process.exit();
     }); */



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
    console.log("Transaction DELEGATE vote confirmed");


    const weightDelegAfter = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [delegatedAdress],
    })) as any;

    console.log('\nDeleg weigth  after delegation:', weightDelegAfter);


    console.log("\n********************************************");
    console.log("\nStep 4 : casting votes(delegated votes)");
    console.log("\n********************************************");


    //TODO
    console.log("\nStep 5 : querying results");
    //TODO

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});