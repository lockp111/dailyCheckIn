import { network } from "hardhat";
import { deployDailyCheck } from "../common/init";
import { Contracts } from "../common/utils";

async function main() {
  const { NFTAddress } = Contracts(network.name);
  const dailyCheck = await deployDailyCheck(NFTAddress, Math.floor(Date.now() / 1000));
  console.log("[%s]DailyCheck deployed to: %s", network.name, dailyCheck.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
