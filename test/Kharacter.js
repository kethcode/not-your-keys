const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const colorLockDesc = "Color";
const colorLockKeylist = [
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("red")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pink")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("orange")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("yellow")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("purple")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("green")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("blue")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("brown")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("white")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("gray")),
];

describe("Kharacter", function () {
  async function deployKharacterFixture() {
    const [deployer, kred, khar, npc1, npc2, pc1, pc2] =
      await ethers.getSigners();

    const kreditContractFactory = await ethers.getContractFactory("Kredit");
    const kreditContract = await kreditContractFactory.deploy(khar.address);
    await kreditContract.deployed();

    const kharacterContractFactory = await ethers.getContractFactory(
      "Kharacter"
    );
    const kharacterContract = await kharacterContractFactory.deploy(
      kred.address
    );
    await kharacterContract.deployed();

    return {
      deployer,
      kreditContract,
      kharacterContract,
      kred,
      khar,
      npc1,
      npc2,
      pc1,
      pc2,
    };
  }

  async function deployLockFixture() {
    const lockContractFactory = await ethers.getContractFactory("Lock");

    const colorLock = await lockContractFactory.deploy(
      colorLockDesc,
      colorLockKeylist
    );
    await colorLock.deployed();

    return { colorLock };
  }

  describe("deployment", function () {
    it("should set the correctname", async function () {
      const { kharacterContract, khar } = await loadFixture(
        deployKharacterFixture
      );
      expect(await kharacterContract.name()).to.equal("Kharacter");
    });
  });

  describe("mint", function () {
    it("should create the corrent number of tokens", async function () {
      const { kharacterContract, npc1, npc2 } = await loadFixture(
        deployKharacterFixture
      );

      await kharacterContract.mint(npc1.address);
      await kharacterContract.mint(npc2.address);
      expect(await kharacterContract.ownerOf(1)).to.equal(npc2.address);
    });
  });

  describe("burn", function () {
    it("should burn the corrent number of tokens", async function () {
      const { kharacterContract, npc1, npc2 } = await loadFixture(
        deployKharacterFixture
      );

      await kharacterContract.mint(npc1.address);
      await kharacterContract.mint(npc2.address);
      await kharacterContract.burn(0);
      expect(await kharacterContract.balanceOf(npc1.address)).to.equal(0);
    });
  });

  describe("exploit", function () {
    it("should return true when no locks are present", async function () {
      const { deployer, kharacterContract, owner, npc1, npc2 } =
        await loadFixture(deployKharacterFixture);

      await kharacterContract.mint(npc1.address);
      await expect(kharacterContract.exploit(0, []))
        .to.emit(kharacterContract, "Cracked")
        .withArgs(npc1.address, deployer.address);
    });

    it("should return true when correct picks are provided", async function () {
      const { deployer, kharacterContract, npc1, npc2 } = await loadFixture(
        deployKharacterFixture
      );

      const { colorLock } = await loadFixture(deployLockFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [colorLock.address]);

      await expect(kharacterContract.exploit(0, ["red"]))
        .to.emit(kharacterContract, "Cracked")
        .withArgs(npc1.address, deployer.address);
    });

    it("should return false when wrong picks are provided", async function () {
      const { deployer, kharacterContract, npc1, npc2 } = await loadFixture(
        deployKharacterFixture
      );

      const { colorLock } = await loadFixture(deployLockFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [colorLock.address]);

      await expect(
        kharacterContract.exploit(0, ["pink"])
      ).to.be.revertedWithCustomError(kharacterContract, "Failed");
    });
  });
});
