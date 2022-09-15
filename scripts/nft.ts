import { network } from "hardhat";
import { deployNFT } from "../common/init";

async function main() {
  const babt = await deployNFT()
  console.log("[%s]BABT deployed to: %s", network.name, babt.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
