const hre = require("hardhat");

async function main() {
  const LuisCarCounter = await hre.ethers.getContractFactory("LuisCarCounter");
  const counter = await LuisCarCounter.deploy();
  await counter.deployed();

  console.log(`LuisCarCounter deployed to ${counter.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});