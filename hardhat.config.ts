import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "dotenv/config";
import "./scripts/tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP,
    token: "BNB",
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
    enabled: (process.env.GAS_REPORT) ? true : false,
  },
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      chainId: 97,
      from: process.env.TESTNET_ADDRESS,
      accounts: process.env.TESTNET_PRIVATE_KEY?.split(","),
    },
    mainnet: {
      url: "https://bsc-dataseed1.binance.org/",
      chainId: 56,
      from: process.env.MAINNET_ADDRESS,
      accounts: process.env.MAINNET_PRIVATE_KEY?.split(","),
    },
  },
};

export default config;

task("accounts", "Prints account list", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const acc of accounts) {
    console.log(acc.address);
  }
})