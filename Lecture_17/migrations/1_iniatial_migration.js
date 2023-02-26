var ERC20 = artifacts.require("ERC20");
var LizToken = artifacts.require("LizToken");

let erc20 = "";
let token = "";

module.exports = async (deployer) => {
    await deployer.deploy(ERC20, "Liz Token", "LIZ");
    erc20 = await ERC20.deployed();

    await deployer.deploy(LizToken);
    token = await LizToken.deployed();
}

