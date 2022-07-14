import { getNamedAccounts, ethers, network } from "hardhat";
import { networkConfig } from "../helper-hardhat-config";
import { IWeth } from "../typechain-types";

export const AMOUNT = ethers.utils.parseEther("0.02").toString();

export async function getWeth() {
    const { deployer } = await getNamedAccounts();
    //call the deposit function on weth contract (Rinkeby weth https://rinkeby.etherscan.io/token/0xc778417e063141139fce010982780140aa0cd5ab#readContract)
    // to call external contract you need its address and abi.
    // To get ABI, you can use interface of the contract and compile it
    const iWeth: IWeth = await ethers.getContractAt(
        "IWeth",
        networkConfig[network.config.chainId!].wethToken,
        deployer
    );
    const txRx = await iWeth.deposit({ value: AMOUNT });
    await txRx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer);
    console.log(`Got ${wethBalance.toString()} WETH`);
}
