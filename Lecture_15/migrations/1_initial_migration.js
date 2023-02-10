var Cow = artifacts.require("Cow");
var Horse = artifacts.require("Horse");
var Wolf = artifacts.require("Wolf");
var Farmer = artifacts.require("Farmer");
var StringComparer = artifacts.require("StringComparer");
var Dog = artifacts.require("Dog");

const PLANT = "plant";
const MEAT = "meat";

let cow = null;
let horse = null;
let wolf = null;
let farmer = null;

module.exports = async (deployer) => {

    await deployer.deploy(StringComparer);
    await deployer.link(StringComparer, [Cow, Horse, Wolf, Dog]);

    await deployer.deploy(Cow, "Rosita"); 
    cow = await Cow.deployed();

    await deployer.deploy(Horse, "Storm");
    horse = await Horse.deployed();

    await deployer.deploy(Wolf, "Bluey");
    wolf = await Wolf.deployed();

    await deployer.deploy(Dog, "Bingo");
    dog = await Dog.deployed();

    await deployer.deploy(Farmer);
    farmer = await Farmer.deployed();
    
}

async function call(animalAddress) {
    return await farmer.call(animalAddress);
}

async function feed(animalAddress, food) {
    return await farmer.feed(animalAddress, food);
}



