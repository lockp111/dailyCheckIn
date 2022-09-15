import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployTest } from "../common/init";
import { expect } from "chai";
import { network } from "hardhat";

describe("DailyCheckIn", function () {
    it("Should check-in success", async function () {
        const { dailyCheckIn, player2 } = await loadFixture(deployTest);
        await expect(dailyCheckIn.connect(player2).checkIn()).to.
            emit(dailyCheckIn, "CheckIn").
            withArgs(player2.address, 1);
    });

    it("Should not check-in", async function () {
        const { dailyCheckIn, player1 } = await loadFixture(deployTest);
        await expect(dailyCheckIn.connect(player1).checkIn()).to.be.revertedWithCustomError(dailyCheckIn, 'InvalidBABT');
    });

    it("Should not check-in duplication", async function () {
        const { dailyCheckIn, player2 } = await loadFixture(deployTest);
        await dailyCheckIn.connect(player2).checkIn();
        await expect(dailyCheckIn.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheckIn, 'InvalidTime');
    });

    it("Should check-in 3 times", async function () {
        const { dailyCheckIn, player2 } = await loadFixture(deployTest);
        await expect(dailyCheckIn.connect(player2).checkIn()).to.
            emit(dailyCheckIn, "CheckIn").
            withArgs(player2.address, 1);
            
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await expect(dailyCheckIn.connect(player2).checkIn()).to.
            emit(dailyCheckIn, "CheckIn").
            withArgs(player2.address, 2);
            
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await expect(dailyCheckIn.connect(player2).checkIn()).to.
            emit(dailyCheckIn, "CheckIn").
            withArgs(player2.address, 3);

        await expect(dailyCheckIn.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheckIn, 'CheckInFinished');
    });

    it("Should not check-in when expire", async function () {
        const { dailyCheckIn, player2 } = await loadFixture(deployTest);
        await dailyCheckIn.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24 * 10]);
        await expect(dailyCheckIn.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheckIn, 'InvalidTime');
    });

    it("Should not check-in even after the token transfer", async function () {
        const { dailyCheckIn, babt, player1, player2 } = await loadFixture(deployTest);
        await dailyCheckIn.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await dailyCheckIn.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await dailyCheckIn.connect(player2).checkIn();
        babt.connect(player2).transfer(player1);
        await expect(dailyCheckIn.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheckIn, 'CheckInFinished');
    });
});
