# Programmatically Deposit, Borrow and Repay on AAVE.

This is sample web3 application that allows anyone to deposit WETH as collateral on [AAVE](https://aave.com/) and borrow DIA stable coin against it. The application show Amount of WETH we own, Amount that we can take borrow in DAI, and Amount that we already have borrowed. At the end of application you can also repay the borrowed amount.

Application also allow to converts Regular ETH to equivalent ERC20 WETH token so that we can deposit it on AAVE.

To interact with smart contract methods we have used `interfaces` to generate ABI. 

This web3 application is developed using `Hardhat` and `TypeScript` while following Patrick Collins course.

## Running the code
To run and test the code in your local development machine copy the repository with the following command. We have used `yarn` package manager to install all dependencies. You can use `NPM`.

```shell
git clone https://github.com/sanjaydefidev/hardhat-defi-aave
```
Installing all the dependencies
```shell
yarn install
```
Check out this [link](https://github.com/PatrickAlphaC/hardhat-defi-fcc) for more information about this tutorial.

## Note
Thanks to @PatrickAlphaC for creating such a helpful tutorial.
