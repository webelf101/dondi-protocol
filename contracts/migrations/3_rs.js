// ============ Contracts ============

// Token
// deployed first
const TIMETRAVELImplementation = artifacts.require("TIMETRAVELDelegate");
const TIMETRAVELProxy = artifacts.require("TIMETRAVELDelegator");

// Rs
// deployed second
const TIMETRAVELReserves = artifacts.require("TIMETRAVELReserves");
const TIMETRAVELRebaser = artifacts.require("TIMETRAVELRebaser");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployRs(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============


async function deployRs(deployer, network) {
  let reserveToken = "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8";
  let uniswap_factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  await deployer.deploy(TIMETRAVELReserves, reserveToken, TIMETRAVELProxy.address);
  await deployer.deploy(TIMETRAVELRebaser,
      TIMETRAVELProxy.address,
      reserveToken,
      uniswap_factory,
      TIMETRAVELReserves.address
  );
  let rebase = new web3.eth.Contract(TIMETRAVELRebaser.abi, TIMETRAVELRebaser.address);

  let pair = await rebase.methods.uniswap_pair().call();
  console.log(pair)
  let timetravel = await TIMETRAVELProxy.deployed();
  await timetravel._setRebaser(TIMETRAVELRebaser.address);
  let reserves = await TIMETRAVELReserves.deployed();
  await reserves._setRebaser(TIMETRAVELRebaser.address)
}
