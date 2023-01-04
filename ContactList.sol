// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// set owner's address and name
// set addresses, names (contacts) and indexes of other people
// get contact (name) by index or address
// only owner can add new contacts
// show "new contact" event when new contact added

contract ContactList {

    string _name;
    address _owner;
    uint256 _contactIndex;
    address[] _contactAddresses;
    mapping(address=>string) _contactNames;

    constructor(string memory name){
        _name = name;
        _owner = msg.sender;
    }

    function setName(string memory name) public onlyOwner{
		_name = name;
	}

	function getName() view public returns(string memory){
		return _name;
	}

	function setAddress(address account) public onlyOwner{
		_owner = account;
	}

	function getAddress() view public returns(address){
		return _owner;
	}

    function addContact(address account, string memory name, uint256 index) public onlyOwner{
        require(msg.sender != account, "Cannot add oneself");
        _contactAddresses.push(account);
        _contactNames[account] = name;
        _contactIndex = index;
        emit NewContact (account, name);
    }

    function getContactAddressByIndex(uint256 index) view public returns(address){
        return _contactAddresses[index];
    }

    function getContactNameByAddress(address account) view public returns(string memory){
        return _contactNames[account];
    }

    modifier onlyOwner{
        require(msg.sender == _owner, "Sender should be the owner of the contract");
        _;
    }

    event NewContact (address account, string name);

}
