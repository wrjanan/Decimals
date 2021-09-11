const Contract = artifacts.require("./Decimals.sol");
module.exports = async function(deployer) {
  await deployer.deploy(Contract);
};
