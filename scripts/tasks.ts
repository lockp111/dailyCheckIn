import { task } from "hardhat/config";
import { Contracts } from "../common/utils";

const opAccount = process.env.OP_ACCOUNT;

task("mint", "Mint a BABT to account", async (_, hre) => {
    const { NFTAddress } = Contracts(hre.network.name);
    const bnft = await hre.ethers.getContractAt('BNFT', NFTAddress);
    const op = await hre.ethers.getSigner(opAccount!);
    const tx = await bnft.mint(op.address);
    console.log("mint BABT success:", tx);
});

task("tokenId", "Show account BABT tokenId", async (_, hre) => {
    const { NFTAddress } = Contracts(hre.network.name);
    const bnft = await hre.ethers.getContractAt('BNFT', NFTAddress);
    const op = await hre.ethers.getSigner(opAccount!);
    const tokenId = await bnft.tokenIdOf(op.address);
    console.log("BABT tokenId:", tokenId);
});

task("checkIn", "Daily check-in", async (_, hre) => {
    const { ContractAddress } = Contracts(hre.network.name);
    const dailyCheck = await hre.ethers.getContractAt('DailyCheck', ContractAddress);
    const op = await hre.ethers.getSigner(opAccount!);
    const tx = await dailyCheck.connect(op).checkIn();
    console.log("check-in success:", tx);
});