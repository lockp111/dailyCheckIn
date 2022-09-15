import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployNFT } from "../common/init";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT", function () {
    it("Should set the right owner", async function () {
        const bnft = await loadFixture(deployNFT);
        const [_, player1, player2] = await ethers.getSigners();
        await expect(bnft.connect(player1).mint(player2.address))
            .to.be.revertedWith('unauth');
    });

    it("Should set the right tokenId", async function () {
        const bnft = await loadFixture(deployNFT);
        const [owner, player1, player2] = await ethers.getSigners();
        await bnft.connect(owner).mint(player1.address);
        await bnft.connect(owner).mint(player2.address);
        expect(await bnft.tokenIdOf(player1.address)).to.eq(1);
        expect(await bnft.tokenIdOf(player2.address)).to.eq(2);
    });

    it("Should mint the addree once", async function () {
        const bnft = await loadFixture(deployNFT);
        const [owner, player1] = await ethers.getSigners();
        await bnft.connect(owner).mint(player1.address);
        await expect(bnft.connect(owner).mint(player1.address))
            .to.be.revertedWith('already mint');
    });

    it("Should transfer success", async function () {
        const bnft = await loadFixture(deployNFT);
        const [owner, player1, player2] = await ethers.getSigners();
        await bnft.connect(owner).mint(player1.address);
        const tokenId = await bnft.tokenIdOf(player1.address);
        await bnft.connect(player1).transfer(player2.address);
        expect(await bnft.tokenIdOf(player2.address)).to.eq(tokenId);
        expect(await bnft.tokenIdOf(player1.address)).to.eq(0);
    });
});