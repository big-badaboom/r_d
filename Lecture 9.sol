// SPDX-License-Identifier: GPL 3.0.

pragma solidity 0.8.17;

interface Living{

    function eat(string memory food) external returns(string memory);
}

contract HasName{
    string _name;

    constructor(string memory name){
        _name=name;
    }

    function getName() view public returns(string memory){
        return _name;
    }
}

abstract contract Animal is Living{
    string constant PLANT = "plant";
    string constant MEAT = "meat";

    function eat(string memory food) view virtual public returns(string memory){
        return string.concat(string.concat("Animal eats ",food));
    }

    function speak() view virtual public returns(string memory){
        return "...";
    }

}

library StringComparer{
    function compare(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}

abstract contract Herbivore is Animal, HasName{

    modifier eatOnlyPlant(string memory food){
        require(StringComparer.compare(food,PLANT),"Can only eat plant food");
        _;
    }

    function eat(string memory food) view override virtual public eatOnlyPlant(food) returns(string memory){
        return super.eat(food);
    }
}

abstract contract Carnivore is Animal, HasName{

    function eat(string memory food) view override virtual public returns(string memory){
        require(StringComparer.compare(food,MEAT),"Can only eat meat!");
        return super.eat(food);
    }
}

abstract contract Omnivore is Animal, HasName{

    function eat(string memory food) view override virtual public returns(string memory){
        require(StringComparer.compare(food,MEAT) || StringComparer.compare(food,PLANT), "It doesn't eat that!");
        return super.eat(food);
    }
}

contract Cow is Herbivore{

    constructor(string memory name) HasName(name){
    }

    function speak() pure override public returns(string memory){
        return "Mooo";
    }
}

contract Horse is Herbivore{

    constructor(string memory name) HasName(name){
    }

    function speak() pure override public returns(string memory){
        return "Igogo";
    }
}

contract Wolf is Carnivore{

    constructor(string memory name) HasName(name){
    }

    function speak() pure override public returns(string memory){
        return "Awoo";
    }
}

contract Dog is  Omnivore{

    string choco = "chocolate";
    
    constructor(string memory name) HasName(name){
    }

    function speak() pure override public returns(string memory){
        return "Woof";
    }

    function eat(string memory food) view override public returns(string memory){
        require(!StringComparer.compare(food,"chocolate"), "Dogs should not eat chocolate. It is toxic for them!");
        return super.eat(food);
    }

}

contract Farmer{
    function feed(address animal, string memory food) view public returns(string memory){
        return Animal(animal).eat(food);
    }

    function call(address animal) view public returns(string memory){
        return Animal(animal).speak();
    }
}