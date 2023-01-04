const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Kredit", function () {
  async function deployKreditFixture() {
    const [owner, kred, khar, npc1, npc2, pc1, pc2] = await ethers.getSigners();

    const kreditContractFactory = await ethers.getContractFactory("Kredit");
    const kreditContract = await kreditContractFactory.deploy(khar.address);
    await kreditContract.deployed();

    return { kreditContract, khar, npc1, npc2 };
  }

  describe("deployment", function () {
    it("should set the correct kharacter address", async function () {
      const { kreditContract, khar } = await loadFixture(deployKreditFixture);
      expect(await kreditContract.kharacter()).to.equal(khar.address);
    });
  });

  describe("mint", function () {
    it("should create the corrent number of tokens", async function () {
      const { kreditContract, npc1, npc2 } = await loadFixture(
        deployKreditFixture
      );
      await kreditContract.mint(npc1.address, 10000);
      await kreditContract.mint(npc2.address, 10000);
      expect(await kreditContract.balanceOf(npc1.address)).to.equal(10000);
    });
  });

  describe("burn", function () {
    it("should burn the corrent number of tokens", async function () {
      const { kreditContract, npc1, npc2 } = await loadFixture(
        deployKreditFixture
      );
      await kreditContract.mint(npc1.address, 10000);
      await kreditContract.mint(npc2.address, 10000);
      await kreditContract.burn(npc1.address, 5000);
      await kreditContract.burn(npc2.address, 1000);
      expect(await kreditContract.balanceOf(npc1.address)).to.equal(5000);
    });
  });

  describe("transfer", function () {
    it("is complicated", async function () {
    });
  });

  describe("transferFrom", function () {
    it("is complicated", async function () {
    });
  });
});
