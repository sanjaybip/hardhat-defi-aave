export interface networkConfigItem {
    name: string;
    wethToken: string;
    lendingPoolAddressesProvider?: string;
    daiEthPriceFeed?: string;
    daiToken?: string;
}
export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}
export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        lendingPoolAddressesProvider:
            "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    42: {
        name: "kovan",
        wethToken: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        lendingPoolAddressesProvider:
            "0x88757f2f99175387aB4C6a4b3067c77A695b0349",
        daiEthPriceFeed: "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
        daiToken: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    },
    4: {
        name: "rinkeby",
        wethToken: "0xc778417e063141139fce010982780140aa0cd5ab",
        daiEthPriceFeed: "0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D",
        daiToken: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
    },
};

export const developmentChains = ["hardhat", "localhost"];
