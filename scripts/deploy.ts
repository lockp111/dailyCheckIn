import { network } from "hardhat";
import { deployDailyCheckIn } from "../common/init";
import { Contracts } from "../common/utils";

async function main() {
  const { NFTAddress } = Contracts(network.name);
  const dailyCheckIn = await deployDailyCheckIn(NFTAddress, Math.floor(Date.now() / 1000));
  console.log("[%s]DailyCheck deployed to: %s", network.name, dailyCheckIn.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
