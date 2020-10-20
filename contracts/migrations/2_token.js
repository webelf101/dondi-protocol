// ============ Contracts ============

// Token
// deployed first
const TIMETRAVELImplementation = artifacts.require("TIMETRAVELDelegate");
const TIMETRAVELProxy = artifacts.require("TIMETRAVELDelegator");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployToken(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============


async function deployToken(deployer, network) {
  await deployer.deploy(TIMETRAVELImplementation);
  if (network != "mainnet") {
    await deployer.deploy(TIMETRAVELProxy,
      "TIMETRAVEL",
      "TIMETRAVEL",
      18,
      "200000000000000000000000", // print extra few mil for user
      TIMETRAVELImplementation.address,
      "0x"
    );
  } else {
    await deployer.deploy(TIMETRAVELProxy,
      "TIMETRAVEL",
      "TIMETRAVEL",
      18,
      "50000000000000000000000",
      TIMETRAVELImplementation.address,
      "0x"
    );
  }
}
