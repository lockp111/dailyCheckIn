import { ethers, upgrades } from "hardhat";

export async function deployDailyCheckIn(nftAddr: string, start: number) {
    const DailyCheckIn = await ethers.getContractFactory("DailyCheckIn");
    const dailyCheckIn = await DailyCheckIn.deploy(nftAddr, start);
    await dailyCheckIn.deployed();
    return dailyCheckIn;
}

export async function deployNFT() {
    const BABT = await ethers.getContractFactory("BABT");
    const babt = await upgrades.deployProxy(BABT, [], { initializer: 'initialize' });
    await babt.deployed();
    return babt;
}

export async function deployTest() {
    const [_, player1, player2] = await ethers.getSigners();
    const babt = await deployNFT()
    const now = Math.floor(Date.now() / 1000);
    const dailyCheckIn = await deployDailyCheckIn(babt.address, now);
    await babt.mint(player2.address);
    return { dailyCheckIn, babt, player1, player2 };
}