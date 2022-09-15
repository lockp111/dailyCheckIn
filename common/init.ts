import { ethers, upgrades } from "hardhat";

export async function deployDailyCheck(nftAddr: string, start: number) {
    const DailyCheck = await ethers.getContractFactory("DailyCheck");
    const dailyCheck = await DailyCheck.deploy(nftAddr, start);
    await dailyCheck.deployed();
    return dailyCheck;
}

export async function deployNFT() {
    const BNFT = await ethers.getContractFactory("BNFT");
    const bnft = await upgrades.deployProxy(BNFT, [], { initializer: 'initialize' });
    await bnft.deployed();
    return bnft;
}

export async function deployTest() {
    const [_, player1, player2] = await ethers.getSigners();
    const bnft = await deployNFT()
    const now = Math.floor(Date.now() / 1000);
    const dailyCheck = await deployDailyCheck(bnft.address, now);
    await bnft.mint(player2.address);
    return { dailyCheck, bnft, player1, player2 };
}