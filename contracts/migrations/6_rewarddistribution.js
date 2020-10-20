var fs = require('fs')

// ============ Contracts ============


// Protocol
// deployed second
const TIMETRAVELImplementation = artifacts.require("TIMETRAVELDelegate");
const TIMETRAVELProxy = artifacts.require("TIMETRAVELDelegator");

// deployed third
const TIMETRAVELReserves = artifacts.require("TIMETRAVELReserves");
const TIMETRAVELRebaser = artifacts.require("TIMETRAVELRebaser");

const Gov = artifacts.require("GovernorAlpha");
const Timelock = artifacts.require("Timelock");

// deployed fourth
const TIMETRAVEL_ETHPool = artifacts.require("TIMETRAVELETHPool");
const TIMETRAVEL_uAMPLPool = artifacts.require("TIMETRAVELAMPLPool");
const TIMETRAVEL_YFIPool = artifacts.require("TIMETRAVELYFIPool");
const TIMETRAVEL_LINKPool = artifacts.require("TIMETRAVELLINKPool");
const TIMETRAVEL_MKRPool = artifacts.require("TIMETRAVELMKRPool");
const TIMETRAVEL_LENDPool = artifacts.require("TIMETRAVELLENDPool");
const TIMETRAVEL_COMPPool = artifacts.require("TIMETRAVELCOMPPool");
const TIMETRAVEL_SNXPool = artifacts.require("TIMETRAVELSNXPool");


// deployed fifth
const TIMETRAVELIncentivizer = artifacts.require("TIMETRAVELIncentivizer");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    // deployTestContracts(deployer, network),
    deployDistribution(deployer, network, accounts),
    // deploySecondLayer(deployer, network)
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  console.log(network)
  let timetravel = await TIMETRAVELProxy.deployed();
  let yReserves = await TIMETRAVELReserves.deployed()
  let yRebaser = await TIMETRAVELRebaser.deployed()
  let tl = await Timelock.deployed();
  let gov = await Gov.deployed();
  if (network != "test") {

    let eth_pool = new web3.eth.Contract(TIMETRAVEL_ETHPool.abi, TIMETRAVEL_ETHPool.address);
    let ampl_pool = new web3.eth.Contract(TIMETRAVEL_uAMPLPool.abi, TIMETRAVEL_uAMPLPool.address);
    let yfi_pool = new web3.eth.Contract(TIMETRAVEL_YFIPool.abi, TIMETRAVEL_YFIPool.address);
    let lend_pool = new web3.eth.Contract(TIMETRAVEL_LENDPool.abi, TIMETRAVEL_LENDPool.address);
    let mkr_pool = new web3.eth.Contract(TIMETRAVEL_MKRPool.abi, TIMETRAVEL_MKRPool.address);
    let snx_pool = new web3.eth.Contract(TIMETRAVEL_SNXPool.abi, TIMETRAVEL_SNXPool.address);
    let comp_pool = new web3.eth.Contract(TIMETRAVEL_COMPPool.abi, TIMETRAVEL_COMPPool.address);
    let link_pool = new web3.eth.Contract(TIMETRAVEL_LINKPool.abi, TIMETRAVEL_LINKPool.address);
    let ycrv_pool = new web3.eth.Contract(TIMETRAVELIncentivizer.abi, TIMETRAVELIncentivizer.address);

    console.log("setting distributor");
    await Promise.all([
        eth_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        ampl_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        yfi_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        ycrv_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        lend_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        mkr_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        snx_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        comp_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        link_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
        ycrv_pool.methods.setRewardDistribution("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      ]);

    let two_fifty = web3.utils.toBN(10**3).mul(web3.utils.toBN(10**18)).mul(web3.utils.toBN(250));
    let one_five = two_fifty.mul(web3.utils.toBN(6));

    console.log("transfering and notifying");
    console.log("eth");
    await Promise.all([
      timetravel.transfer(TIMETRAVEL_ETHPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_uAMPLPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_YFIPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_LENDPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_MKRPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_SNXPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_COMPPool.address, two_fifty.toString()),
      timetravel.transfer(TIMETRAVEL_LINKPool.address, two_fifty.toString()),
      timetravel._setIncentivizer(TIMETRAVELIncentivizer.address),
    ]);

    await Promise.all([
      eth_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      ampl_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      yfi_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      lend_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      mkr_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      snx_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      comp_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),
      link_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:"0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84"}),

      // incentives is a minter and prepopulates itself.
      ycrv_pool.methods.notifyRewardAmount("0").send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 500000}),
    ]);

    await Promise.all([
      eth_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      ampl_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      yfi_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      lend_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      mkr_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      snx_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      comp_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      link_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      ycrv_pool.methods.setRewardDistribution(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
    ]);
    await Promise.all([
      eth_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      ampl_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      yfi_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      lend_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      mkr_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      snx_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      comp_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      link_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
      ycrv_pool.methods.transferOwnership(Timelock.address).send({from: "0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84", gas: 100000}),
    ]);
  }

  await Promise.all([
    timetravel._setPendingGov(Timelock.address),
    yReserves._setPendingGov(Timelock.address),
    yRebaser._setPendingGov(Timelock.address),
  ]);

  await Promise.all([
      tl.executeTransaction(
        TIMETRAVELProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        TIMETRAVELReserves.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        TIMETRAVELRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
  ]);
  await tl.setPendingAdmin(Gov.address);
  await gov.__acceptAdmin();
  await gov.__abdicate();
}
