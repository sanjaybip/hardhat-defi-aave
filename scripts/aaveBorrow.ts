import { ethers, getNamedAccounts, network } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { BigNumber } from "ethers";
import { getWeth, AMOUNT } from "./getWeth";
import { networkConfig } from "../helper-hardhat-config";
import {
    ILendingPool,
    ILendingPoolAddressesProvider,
    IERC20,
    AggregatorV3Interface,
} from "../typechain-types";

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    //we need lending pool to deposit
    const lendingPool: ILendingPool = await getLendingPool(deployer);

    // Now we need to deposit, but before that we need to approve aave so that it can take our asset
    const wethTokenAddress = networkConfig[network.config.chainId!].wethToken;
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer); //approving

    //depositing
    console.log(
        `Depositing WETH using ${wethTokenAddress} as WETH token and ${deployer} as address`
    );
    lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log("Desposited!");

    // Now next step is to borrow against the deposited WETH
    // In order to borrow, we should know how much we have already borrowed, how much collatral we have and how much we can borrow
    let borrowReturnData = await getBorrowUserData(lendingPool, deployer);
    let availableBorrowsETH = borrowReturnData[0];

    // Now figure out how much of DAI we can borrow based on value of ETH. To do so, we need to find the DAI price first.
    const daiPrice = await getDaiPrice();
    //lets figure out much DAI we can borrow against our deposit
    const amountDaiToBorrow = availableBorrowsETH.div(daiPrice); //normal price
    const amountDaiToBorrowWei = ethers.utils.parseEther(
        amountDaiToBorrow.toString()
    ); //wei price
    // Since we have DAI amount in WEI, lets start borrowing now
    console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`);
    await borrowDAI(
        lendingPool,
        networkConfig[network.config.chainId!].daiToken!,
        amountDaiToBorrowWei.toString(),
        deployer
    );
    //check our data after we borrowed
    await getBorrowUserData(lendingPool, deployer);

    // Time to repay the borrowed amount.
    await repay(
        lendingPool,
        networkConfig[network.config.chainId!].daiToken!,
        amountDaiToBorrowWei.toString(),
        deployer
    );
    await getBorrowUserData(lendingPool, deployer);
}

async function repay(
    lendingPool: ILendingPool,
    diaAddress: string,
    daiAmountToPay: string,
    account: Address
) {
    // frist we need to approve dai token so that aave can have it.
    await approveERC20(
        diaAddress,
        lendingPool.address,
        daiAmountToPay,
        account
    );
    // and now repay
    const repayTx = await lendingPool.repay(
        diaAddress,
        daiAmountToPay,
        1,
        account
    );
    await repayTx.wait(1);
    console.log(`Borrow amount repaid!`);
}

async function borrowDAI(
    lendingPool: ILendingPool,
    diaAddress: string,
    daiAmountToBorrow: string,
    account: Address
) {
    const borrowTx = await lendingPool.borrow(
        diaAddress,
        daiAmountToBorrow,
        1,
        0,
        account
    );
    await borrowTx.wait(1);
    console.log("You've borrowed!");
}
async function getDaiPrice(): Promise<BigNumber> {
    //we don't need deployer as third argument, because we are not doing transaction.Reading data don't need signer
    const daiEthPriceFeed: AggregatorV3Interface = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId!].daiEthPriceFeed!
    );
    const daiPrice = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${daiPrice.toString()}`);
    return daiPrice;
}
async function getBorrowUserData(
    lendingPool: ILendingPool,
    account: Address
): Promise<[BigNumber, BigNumber]> {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account);
    console.log(`------------------------`);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`);
    return [availableBorrowsETH, totalDebtETH];
}

async function approveERC20(
    erc20Address: string,
    spenderAddress: string,
    amount: string,
    signer: Address
) {
    const erc20Token: IERC20 = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        signer
    );
    const txResponse = await erc20Token.approve(spenderAddress, amount);
    await txResponse.wait();
    console.log(`Aave address is Approved`);
}
async function getLendingPool(account: Address): Promise<ILendingPool> {
    const lendingPoolAddressProvider: ILendingPoolAddressesProvider =
        await ethers.getContractAt(
            "ILendingPoolAddressesProvider",
            networkConfig[network.config.chainId!]
                .lendingPoolAddressesProvider!,
            account
        );
    const lendingPoolAddress: Address =
        await lendingPoolAddressProvider.getLendingPool();
    const lendingPool: ILendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    );
    return lendingPool;
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
