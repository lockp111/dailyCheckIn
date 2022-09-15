import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployTest } from "../common/init";
import { expect } from "chai";
import { network } from "hardhat";

describe("DailyCheck", function () {
    it("Should check-in success", async function () {
        const { dailyCheck, player2 } = await loadFixture(deployTest);
        await expect(dailyCheck.connect(player2).checkIn()).to.
            emit(dailyCheck, "CheckIn").
            withArgs(player2.address, 1);
    });

    it("Should not check-in", async function () {
        const { dailyCheck, player1 } = await loadFixture(deployTest);
        await expect(dailyCheck.connect(player1).checkIn()).to.be.revertedWithCustomError(dailyCheck, 'InvalidBABT');
    });

    it("Should not check-in duplication", async function () {
        const { dailyCheck, player2 } = await loadFixture(deployTest);
        await dailyCheck.connect(player2).checkIn();
        await expect(dailyCheck.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheck, 'InvalidTime');
    });

    it("Should check-in 3 times", async function () {
        const { dailyCheck, player2 } = await loadFixture(deployTest);
        await expect(dailyCheck.connect(player2).checkIn()).to.
            emit(dailyCheck, "CheckIn").
            withArgs(player2.address, 1);
            
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await expect(dailyCheck.connect(player2).checkIn()).to.
            emit(dailyCheck, "CheckIn").
            withArgs(player2.address, 2);
            
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await expect(dailyCheck.connect(player2).checkIn()).to.
            emit(dailyCheck, "CheckIn").
            withArgs(player2.address, 3);

        await expect(dailyCheck.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheck, 'CheckInFinished');
    });

    it("Should not check-in when expire", async function () {
        const { dailyCheck, player2 } = await loadFixture(deployTest);
        await dailyCheck.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24 * 10]);
        await expect(dailyCheck.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheck, 'InvalidTime');
    });

    it("Should not check-in even after the token transfer", async function () {
        const { dailyCheck, bnft, player1, player2 } = await loadFixture(deployTest);
        await dailyCheck.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await dailyCheck.connect(player2).checkIn();
        await network.provider.send("evm_increaseTime", [3600 * 24])
        await dailyCheck.connect(player2).checkIn();
        bnft.connect(player2).transfer(player1);
        await expect(dailyCheck.connect(player2).checkIn()).to.be.revertedWithCustomError(dailyCheck, 'CheckInFinished');
    });
});
