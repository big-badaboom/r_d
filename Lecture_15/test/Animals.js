var Cow = artifacts.require("Cow");
var Horse = artifacts.require("Horse");
var Wolf = artifacts.require("Wolf");
var Farmer = artifacts.require("Farmer");
var StringComparer = artifacts.require("StringComparer");
var Dog = artifacts.require("Dog");

const PLANT = "plant";
const MEAT = "meat";
const notFood = "plastic";
const choco = "chocolate";

const REVERT = "VM Exception while processing transaction: revert ";

const expectedErrorChoco = "Dogs should not eat chocolate. It is toxic for them!";
const expectedErrorNotFood = "It doesn't eat that!";
const expectedErrorPlantFoodOnly = "Can only eat plant food";

let cow = null;
let horse = null;
let wolf = null;
let farmer = null;

let message = "";

contract("Horse and Farmer", async (account) => {
    it("Horse has the correct name.", async () => {
        horse = await Horse.deployed();
        let horseName = "Storm";
        let name = await horse.getName();
        assert.equal(horseName, name, "Names are not equal");
    });

    it("Horse can sleep.", async () => {
        let sleepFunc = await horse.sleep();
        assert.ok(sleepFunc, "Horse sleeps.");
    });

    it("Horse can eat “plant”.", async () => {
        let horseEat = await horse.eat(PLANT);
        assert.equal("Animal eats " + PLANT, horseEat, "Food is not equal");
    });

    it("Horse cannot eat “meat”, “not-food”, “plastic”.", async () => {
        try {
            let horseEat = await horse.eat(MEAT || notFood || choco);
        } catch (e) {
            message = e.message;
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorPlantFoodOnly, message, "Error messages are not equal!")
    });

    it("Farmer can call Horse, Horse responds correctly.", async () => {
        farmer = await Farmer.deployed();
        let horseSpeak = "Igogo";
        let farmerCall = await call(horse.address);
        assert.equal(farmerCall, horseSpeak, "That's not the sound horse makes.")
    });

    it("Farmer can feed Horse with plant.", async () => {
        let farmerFeed = await feed(horse.address, PLANT);
        assert.equal("Animal eats " + PLANT, farmerFeed, "Farmer cannot feed horse with this!");
    });

    it("Farmer cannot feed Horse with anything else.", async () => {
        try {
            let farmerFeed = await feed(horse.address, PLANT);
        } catch (e) {
            message = e.message;
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorPlantFoodOnly, message, "Error messages are not equal.")
    });
})

contract("Dog and Farmer", async (account) => {
    it("Dog has the correct name.", async () => {
        dog = await Dog.deployed();
        let dogName = "Bingo";
        let name = await dog.getName();
        assert.equal(dogName, name, "Names are not equal");
    });

    it("Dog can sleep.", async () => {
        let sleepFunc = await dog.sleep();
        assert.ok(sleepFunc, "Horse sleeps.");
    });

    it("Dog can eat “plant”.", async () => {
        let dogEat = await dog.eat(PLANT);
        assert.equal("Animal eats " + PLANT, dogEat, "Food is not equal");
    });

    it("Dog can eat ”meat”.", async () => {
        let dogEat = await dog.eat(MEAT);
        assert.equal("Animal eats " + MEAT, dogEat, "Food is not equal");
    })

    it("Dogs should not eat chocolate. It is toxic for them!", async () => {
        try {
            let dogEat = await dog.eat(choco);
        } catch (e) {
            message = e.message
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorChoco, message, "Errors are not equal")
    })

    it("Dog cannot eat ”not-food”, ”plastic”.", async () => {
        try {
            let dogEat = await dog.eat(notFood);
        } catch (e) {
            message = e.message
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorNotFood, message, "Errors are not equal")
    })

    it("Farmer can call Dog, Dog responds correctly.", async () => {
        let dogSpeak = "Woof";
        let farmerCall = await call(dog.address);
        assert.equal(dogSpeak, farmerCall, "That's not the sound dog makes.")
    })

    it("Farmer can feed Dog with ”meat”,”plant”.", async () => {
        let farmerFeed = await feed(dog.address, MEAT || PLANT);
        assert.equal("Animal eats " + MEAT || PLANT, farmerFeed, "Farmer cannot feed dog with this!");
    })

    it("Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else.", async () => {
        try {
            let farmerFeed = await feed(dog.address, notFood);
        } catch (e) {
            message = e.message
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorNotFood, message, "Error messages are not equal.");
    })

    it("Farmer should not feed Dig with ”chocolate”.", async () => {
        try {
            let farmerFeed = await feed(dog.address, choco);
        } catch (e) {
            message = e.message
        }
        assert.isTrue(message.startsWith(REVERT), "Error message differs from what is expected.");
        assert.equal(REVERT + expectedErrorChoco, message, "Errors are not equal")
    })

})  

async function call(animalAddress) {
    return await farmer.call(animalAddress);
}

async function feed(animalAddress, food) {
    return await farmer.feed(animalAddress, food);
}

async function getName() {
    return await getName();
}

async function sleep() {
    return await sleep();
}

async function eat(food) {
    return await eat(food);
}



