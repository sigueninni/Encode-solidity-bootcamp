import { viem } from "hardhat";
import { parseEther } from "viem";

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    // TODO
    const tokenContract = await viem.deployContract("MyToken");
    console.log(`Contract deployed at ${tokenContract.address}`);

    const totalSupply2 = await tokenContract.read.totalSupply();
    console.log({ totalSupply2 });


    const code = await tokenContract.read.MINTER_ROLE();
    console.log(code);

    //Give // Giving role
    const roleTx = await tokenContract.write.grantRole([
        code,
        account2.account.address,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: roleTx });


    //
    const mintTx = await tokenContract.write.mint(
        [deployer.account.address, parseEther("10")],
        { account: account2.account }
    );
    await publicClient.waitForTransactionReceipt({ hash: mintTx });


    const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.read.name(),
        tokenContract.read.symbol(),
        tokenContract.read.decimals(),
        tokenContract.read.totalSupply(),
    ]);
    console.log({ name, symbol, decimals, totalSupply });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});