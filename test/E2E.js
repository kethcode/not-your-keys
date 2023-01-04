/* end to end test quite for building demos and exercising changes and
 * new features during development
 */

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

const primeLockDesc = "Prime";
const primeLockKeylist = [
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("2")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("3")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("5")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("7")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("11")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("13")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("17")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("19")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("23")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("29")),
];

describe("Not Your Keys Jan3 Demo", function () {
  async function deployFixture() {
    const [deployer, npc1, npc2, pc1, pc2] = await ethers.getSigners();

    const kreditContractFactory = await ethers.getContractFactory("Kredit");
    const kreditContract = await kreditContractFactory.deploy();
    await kreditContract.deployed();

    const kharacterContractFactory = await ethers.getContractFactory(
      "Kharacter"
    );
    const kharacterContract = await kharacterContractFactory.deploy(
      kreditContract.address
    );
    await kharacterContract.deployed();

    const lockContractFactory = await ethers.getContractFactory("Lock");

    const colorLockContract = await lockContractFactory.deploy(
      colorLockDesc,
      colorLockKeylist
    );
    await colorLockContract.deployed();

    const primeLockContract = await lockContractFactory.deploy(
      primeLockDesc,
      primeLockKeylist
    );
    await primeLockContract.deployed();

    return {
      deployer,
      kreditContract,
      kharacterContract,
      colorLockContract,
      primeLockContract,
      npc1,
      npc2,
      pc1,
      pc2,
    };
  }

  describe("deployment", function () {
    it("should deploy without errors", async function () {
      await loadFixture(deployFixture);
    });
  });

  describe("minting a kharacter", function () {
    it("should emit a mint event", async function () {
      const {
        kreditContract,
        kharacterContract,
        colorLockContract,
        primeLockContract,
        npc1,
      } = await loadFixture(deployFixture);

      await expect(kharacterContract.mint(npc1.address))
        .to.emit(kharacterContract, "Transfer")
        .withArgs(
          ethers.utils.getAddress("0x0000000000000000000000000000000000000000"),
          npc1.address,
          0
        );
    });
  });

  describe("installing a lock", function () {
    it("should show the locks when requested", async function () {
      const {
        kreditContract,
        kharacterContract,
        colorLockContract,
        primeLockContract,
        npc1,
      } = await loadFixture(deployFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [
        colorLockContract.address,
        primeLockContract.address,
      ]);

      expect(await kharacterContract.getLocks(0)).to.deep.equal([
        colorLockContract.address,
        primeLockContract.address,
      ]);
    });
  });

  describe("getting lock names", function () {
    it("should return lock names", async function () {
      const {
        deployer,
        kreditContract,
        kharacterContract,
        colorLockContract,
        primeLockContract,
        npc1,
      } = await loadFixture(deployFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [
        colorLockContract.address,
        primeLockContract.address,
      ]);

      let locks = await kharacterContract.getLocks(0);

      const abi = ["function desc() public view returns (string)"];

      const lock0 = new ethers.Contract(locks[0], abi, deployer);
      const lock1 = new ethers.Contract(locks[1], abi, deployer);
      expect([await lock0.desc(), await lock1.desc()]).to.deep.equal([
        "Color",
        "Prime",
      ]);
    });
  });

  describe("exploiting the locks", function () {
    it("should work", async function () {
      const {
        deployer,
        kreditContract,
        kharacterContract,
        colorLockContract,
        primeLockContract,
        npc1,
      } = await loadFixture(deployFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [
        colorLockContract.address,
        primeLockContract.address,
      ]);

      await expect(kharacterContract.exploit(0, ["brown", "19"]))
        .to.emit(kharacterContract, "Cracked")
        .withArgs(npc1.address, deployer.address);
    });
  });

  describe("exploiting the locks", function () {
    it("should mint rewards to player", async function () {
      const {
        deployer,
        kreditContract,
        kharacterContract,
        colorLockContract,
        primeLockContract,
        npc1,
      } = await loadFixture(deployFixture);

      await kharacterContract.mint(npc1.address);
      await kharacterContract.setLocks(0, [
        colorLockContract.address,
        primeLockContract.address,
      ]);
	//   console.log(await kreditContract.balanceOf(deployer.address))
      await kharacterContract.exploit(0, ["brown", "19"]);
	//   console.log(await kreditContract.balanceOf(deployer.address))
      expect(await kreditContract.balanceOf(deployer.address)).to.equal(10);
    });
  });
});
