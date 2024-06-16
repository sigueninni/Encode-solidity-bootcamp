import { viem } from "hardhat";
import { parseEther, toHex, hexToString } from "viem";

const MINT_VALUE = 1000n;
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];


async function main() {

    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2, acc3] = await viem.getWalletClients();

    console.log("\n********************************************");
    console.log("\nStep 1 : Deploy MyToken");
    console.log("\n********************************************");

    const contract = await viem.deployContract("MyToken");
    console.log(`Token contract deployed at ${contract.address}\n`);


    console.log("\n********************************************");
    console.log("\nStep 2 : Giving vote right to acc1,acc2");
    console.log("\n********************************************");

    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account1 ${acc1.account.address
        }\n`
    );
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
        `Account1 ${acc1.account.address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );


    const mintTx2 = await contract.write.mint([acc2.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account2 ${acc2.account.address
        }\n`
    );
    const balanceBN2 = await contract.read.balanceOf([acc2.account.address]);
    console.log(
        `Account2 ${acc2.account.address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );


    console.log("\n********************************************");
    console.log("\nStep 3 : Self delegation acc1 and acc2 & Delegation from acc2 to acc3  ");
    console.log("\n********************************************");

    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account1 ${acc1.account.address
        } has ${votes.toString()} units of voting power before self delegating\n`
    );

    const votes2 = await contract.read.getVotes([acc2.account.address]);
    console.log(
        `Account2 ${acc2.account.address
        } has ${votes2.toString()} units of voting power before delegating\n`
    );

    const votes3 = await contract.read.getVotes([acc3.account.address]);
    console.log(
        `Account3 ${acc3.account.address
        } has ${votes3.toString()} units of voting power before getting the delegating\n`
    );


    //self delegation acc1
    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });

    //Delegation from acc2 to acc3
    const delegateTx23 = await contract.write.delegate([acc3.account.address], {
        account: acc2.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx23 });

    //Self delegation acc2  --> do we need it if we delegate to other?
    /*     const votes2 = await contract.read.getVotes([acc1.account.address]);
        console.log(
            `Account ${acc1.account.address
            } has ${votes.toString()} units of voting power before self delegating\n`
        );
    
        const delegateTx2 = await contract.write.delegate([acc1.account.address], {
            account: acc1.account,
        });
        await publicClient.waitForTransactionReceipt({ hash: delegateTx2 });
        const votesAfter2 = await contract.read.getVotes([acc1.account.address]);
        console.log(
            `Account ${acc1.account.address
            } has ${votesAfter.toString()} units of voting power after self delegating\n`
        );
     */

    console.log("\n********************************************");
    console.log("\nStep 4 : Checking vote power  ");
    console.log("\n********************************************");

    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account1 ${acc1.account.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );

    const votesAfter2 = await contract.read.getVotes([acc2.account.address]);
    console.log(
        `Account2 ${acc2.account.address
        } has ${votesAfter.toString()} units of voting power after  delegating to Account3 ${acc3.account.address
        }\n`
    );

    const votesAfter23 = await contract.read.getVotes([acc3.account.address]);
    console.log(
        `Account3 ${acc3.account.address
        } has ${votesAfter23.toString()} units of voting power after delegation from Account2 ${acc2.account.address
        } \n`
    );


    console.log("\n********************************************");
    console.log("\nStep 5 : Deploy TokenizedBallot  ");
    console.log("\n********************************************");
    const lastBlockNumber = await publicClient.getBlockNumber();
    const contractTokenizedBallot = await viem.deployContract("TokenizedBallot", [
        PROPOSALS.map((prop) => toHex(prop, { size: 32 })), contract.address, lastBlockNumber
    ]);
    console.log(`TokenizedBallot contract deployed at ${contractTokenizedBallot.address}\n`);


    console.log("\n********************************************");
    console.log("\nStep 6 : Cast votes  ");
    console.log("\n********************************************");
    //Cast votes acc2 and acc3
    const vote1Tx = await contractTokenizedBallot.write.vote([1n, MINT_VALUE / 2n], {
        account: acc1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: vote1Tx });
    console.log(
        `Account1 ${acc1.account.address
        } has voted for proposal 2 with  ${MINT_VALUE / 2n
        } power voting \n`
    );


    /*     const vote2Tx = await contractTokenizedBallot.write.vote([0n, MINT_VALUE], {
            account: acc2.account,
        });
        await publicClient.waitForTransactionReceipt({ hash: vote2Tx });
        console.log(
            `Account2 ${acc2.account.address
            } has voted for proposal 2 with  ${MINT_VALUE
            } power voting \n`
        ); */



    const vote3Tx = await contractTokenizedBallot.write.vote([0n, MINT_VALUE], {
        account: acc3.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: vote3Tx });
    console.log(
        `Account1 ${acc3.account.address
        } has voted for proposal 1 with  ${MINT_VALUE
        } power voting \n`
    );

    console.log("\n********************************************");
    console.log("\nStep 7 : Querying results  ");
    console.log("\n********************************************");


    const winingProposal = await contractTokenizedBallot.read.winnerName();
    const nameWiningProposal = hexToString(winingProposal, { size: 32 });
    console.log("wining proposal:", nameWiningProposal);



    /*     //Historical vote power
        const lastBlockNumber = await publicClient.getBlockNumber();
        for (let index = lastBlockNumber - 1n; index > 0n; index--) {
            const pastVotes = await contract.read.getPastVotes([
                acc1.account.address,
                index,
            ]);
            console.log(
                `Account ${acc1.account.address
                } had ${pastVotes.toString()} units of voting power at block ${index}\n`
            );
        } */

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});





/* const transferTx = await contract.write.transfer(
    [acc2.account.address, MINT_VALUE / 2n],
    {
        account: acc1.account,
    }
);
await publicClient.waitForTransactionReceipt({ hash: transferTx });
const votes1AfterTransfer = await contract.read.getVotes([
    acc1.account.address,
]);
console.log(
    `Account ${acc1.account.address
    } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
);
const votes2AfterTransfer = await contract.read.getVotes([
    acc2.account.address,
]);
console.log(
    `Account ${acc2.account.address
    } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
);
*/