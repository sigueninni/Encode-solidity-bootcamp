"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const viem_1 = require("viem");
const hardhat_1 = require("hardhat");
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
async function deployContract() {
    const publicClient = await hardhat_1.viem.getPublicClient();
    const [deployer, otherAccount] = await hardhat_1.viem.getWalletClients();
    const ballotContract = await hardhat_1.viem.deployContract("Ballot", [
        PROPOSALS.map((prop) => (0, viem_1.toHex)(prop, { size: 32 })),
    ]);
    return { publicClient, deployer, otherAccount, ballotContract };
}
async function deployContractStateDelegate() {
    const publicClient = await hardhat_1.viem.getPublicClient();
    const [chairpersonAccount, voterAccount, delegatedAccount] = await hardhat_1.viem.getWalletClients();
    const ballotContract = await hardhat_1.viem.deployContract("Ballot", [
        PROPOSALS.map((prop) => (0, viem_1.toHex)(prop, { size: 32 })),
    ]);
    return { publicClient, chairpersonAccount, voterAccount, delegatedAccount, ballotContract };
}
describe("Ballot", async () => {
    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            const { ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.read.proposals([BigInt(index)]);
                (0, chai_1.expect)((0, viem_1.hexToString)(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
            }
        });
        it("has zero votes for all proposals", async () => {
            const { ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.read.proposals([BigInt(index)]);
                (0, chai_1.expect)(proposal[1]).to.eq(0n);
            }
        });
        it("sets the deployer address as chairperson", async () => {
            const { ballotContract, deployer } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            const chairperson = await ballotContract.read.chairperson();
            (0, chai_1.expect)(chairperson.toLowerCase()).to.eq(deployer.account.address);
        });
        it("sets the voting weight for the chairperson as 1", async () => {
            const { ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            const chairperson = await ballotContract.read.chairperson();
            const chairpersonVoter = await ballotContract.read.voters([chairperson]);
            (0, chai_1.expect)(chairpersonVoter[0]).to.eq(1n);
        });
    });
    describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
        it("gives right to vote for another address", async () => {
            // TODO
            throw Error("Not implemented");
        });
        it("can not give right to vote for someone that has voted", async () => {
            // TODO
            throw Error("Not implemented");
        });
        it("can not give right to vote for someone that has already voting rights", async () => {
            // TODO
            throw Error("Not implemented");
        });
    });
    describe("when the voter interacts with the vote function in the contract", async () => {
        // TODO
        it("should register the vote", async () => {
            throw Error("Not implemented");
        });
    });
    describe("when the voter interacts with the delegate function in the contract", async () => {
        it("should transfer voting power", async () => {
            const { publicClient, chairpersonAccount, voterAccount, delegatedAccount, ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContractStateDelegate);
            //chairpersonAccount add voterAccount as voter
            const txHash = await ballotContract.write.giveRightToVote([
                voterAccount.account.address,
            ]);
            const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
            (0, chai_1.expect)(receipt.status).to.equal("success");
            //check if voter has now voting weight
            const voter = await ballotContract.read.voters([voterAccount.account.address]);
            (0, chai_1.expect)(voter[0]).to.eq(1n);
            //check that delegatedVoter has no voting weight before being added by chairperson and delegation
            let delegated = await ballotContract.read.voters([delegatedAccount.account.address]);
            (0, chai_1.expect)(delegated[0]).to.eq(0n);
            //chairpersonAccount add delegated as voter
            const txHashAddDelegated = await ballotContract.write.giveRightToVote([
                delegatedAccount.account.address,
            ]);
            const receiptAddDelegated = await publicClient.getTransactionReceipt({ hash: txHashAddDelegated });
            (0, chai_1.expect)(receiptAddDelegated.status).to.equal("success");
            //check if voter has now voting weight
            delegated = await ballotContract.read.voters([delegatedAccount.account.address]);
            (0, chai_1.expect)(delegated[0]).to.eq(1n);
            //Delegate now from Voter to delegatedAccount
            const txHashDelegation = await ballotContract.write.delegate([delegatedAccount.account.address], {
                account: voterAccount.account.address
            });
            const receiptDelegation = await publicClient.getTransactionReceipt({ hash: txHashDelegation });
            (0, chai_1.expect)(receiptDelegation.status).to.equal("success");
            //check if delegatedVoter has now voting weight eq 2
            delegated = await ballotContract.read.voters([delegatedAccount.account.address]);
            (0, chai_1.expect)(delegated[0]).to.eq(2n);
        });
    });
    describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            throw Error("Not implemented");
        });
    });
    describe("when an account without right to vote interacts with the vote function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            throw Error("Not implemented");
        });
    });
    describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            const { publicClient, chairpersonAccount, voterAccount, delegatedAccount, ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContractStateDelegate);
            //Delegate from voter to another address before being added as a voter by chairPerson
            await (0, chai_1.expect)(ballotContract.write.delegate([delegatedAccount.account.address], {
                account: voterAccount.account.address
            })).to.be.rejectedWith("You have no right to vote");
        });
    });
    describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            const { publicClient, chairpersonAccount, voterAccount, delegatedAccount, ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContractStateDelegate);
            //Delegate from voter to another address before being added as a voter by chairPerson
            await (0, chai_1.expect)(ballotContract.write.delegate([delegatedAccount.account.address], {
                account: voterAccount.account.address
            })).to.be.rejectedWith("You have no right to vote");
        });
    });
    describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
        it("should return 0", async () => {
            const { ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            const winningProposal = await ballotContract.winningProposal();
            (0, chai_1.expect)(winningProposal).to.equal(0);
        });
    });
    describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
        it("should return 0", async () => {
            const { ballotContract, deployer } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            // delegrate the deployer the right to vote
            await ballotContract.giveRightToVote(deployer.address);
            //cast a vote for the first proposal 
            await ballotContract.connect(deployer).vote(0);
            const winningProposal = await ballotContract.winningProposal();
            (0, chai_1.expect)(winningProposal).to.equal(0);
        });
    });
    describe("when someone interacts with the winnerName function before any votes are cast", async () => {
        it("should return name of proposal 0", async () => {
            const { ballotContract } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            const winnerName = await ballotContract.winnerName();
            (0, chai_1.expect)((0, viem_1.hexToString)(winnerName)).to.equal(PROPOSALS[0]);
        });
    });
    describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
        it("should return name of proposal 0", async () => {
            const { ballotContract, deployer } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            // deployer right to vote
            await ballotContract.giveRightToVote(deployer.address);
            //vote for the first proposal (index 0)
            await ballotContract.connect(deployer).vote[0];
            const winnerName = await ballotContract.winnerName();
            (0, chai_1.expect)((0, viem_1.hexToString)(winnerName)).to.equal(PROPOSALS[0]);
        });
    });
    describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
        it("should return the name of the winner proposal", async () => {
            const { ballotContract, deployer, otherAccount } = await (0, hardhat_network_helpers_1.loadFixture)(deployContract);
            const [voter1, voter2, voter3, voter4, voter5] = await hardhat_1.viem.getWalletClients();
            // give right to vote or 5 different accounts
            await ballotContract.giveRightToVote(deployer.address);
            await ballotContract.giveRightToVote(otherAccount.address);
            await ballotContract.giveRightToVote(voter1.address);
            await ballotContract.giveRightToVote(voter2.address);
            await ballotContract.giveRightToVote(voter3.address);
            // cast random votes
            await ballotContract.connect(deployer).vote(0); //vote for proposal 1
            await ballotContract.connect(otherAccount).vote(1); //vote for proposal 2
            await ballotContract.connect(voter1).vote(0); //vote for proposal 1
            await ballotContract.connect(voter2).vote(3); // vote for poropsal 3 
            await ballotContract.connect(voter3).vote(0); //vote for proposal 1
            const winningProposal = await ballotContract.winningProposal();
            const winnerName = await ballotContract.winnerName();
            (0, chai_1.expect)(winningProposal).to.equal(0);
            (0, chai_1.expect)((0, viem_1.hexToString)(winnerName)).to.equal(PROPOSALS[0]);
        });
    });
});
