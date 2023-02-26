// SPDX-License-Identifier: GPL-3.0;
pragma solidity ^0.8.0;

import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";

contract BirthdayPayout {

// store name,address teammates
// get name, addresses of teammates
// send ether to address teammates on command only by owner

    string _name;

    address _owner;

    Teammate[] public _teammates;

    struct Teammate {
        string name;
        address account;
        uint256 birthday;
        uint256 last_payout;
    }

    uint256 constant PRESENT = 100000000000000000;

    constructor(string memory name) {
        _name = name;
        _owner = msg.sender;
    }

    function addTeammate(address account,string memory name, uint256 birthday) public onlyOwner {
        require(msg.sender != account,"Cannot add oneself");
        Teammate memory newTeammate = Teammate(name,account,birthday,0); 
        _teammates.push(newTeammate);
        emit NewTeammate(account,name);
    }

    function findBirthday() public onlyOwner{
        // it is a good idea to check whether therea are any teammates in the database
        require(getTeammatesNumber()>0,"No teammates in the database");
        // what are loops: https://www.youtube.com/watch?v=GwcisLY5avc
        // so basically we iterate over every Teammate in the _teammates array...
        for(uint256 i=0;i<getTeammatesNumber();i++){
        // and check their birthday
            if(checkBirthday(i) && checkLastPayout(i)){
            // if the birthday is today - send PRESENT
                birthdayPayout(i);                
            }
        }
    }

    // this function is instead of sendToTeammate
    function birthdayPayout(uint256 index) public onlyOwner {
        require(address(this).balance>=PRESENT, "Not enough balance");
        setLastPayout(index);
    	// send some money to the teammate
        sendToTeammate(index);
        // and emit a HeppyBirthday event(just in case)
        emit HappyBirthday(_teammates[index].name,_teammates[index].account);
    }

    function setLastPayout(uint256 index) public{
        _teammates[index].last_payout = block.timestamp;
    }

    function getDate(uint256 timestamp) pure public returns(uint256 year, uint256 month, uint256 day){
        (year, month, day) = BokkyPooBahsDateTimeLibrary.timestampToDate(timestamp);
    }

    function checkBirthday(uint256 index) view public returns(bool){
        // day & month of today's date == day & month of birthday teammate
        //block.timestamp = 1671560040
        //birthday = 877126202
        //BokkyPooBahsDateTimeLibrary.timestampToDate();
        uint256 birthday = getTeammate(index).birthday;
        (, uint256 birthday_month,uint256 birthday_day) = getDate(birthday);
        uint256 today = block.timestamp;
        (, uint256 today_month,uint256 today_day) = getDate(today);

        if(birthday_day == today_day && birthday_month==today_month){
            return true;
        }
        return false;
    }

    function checkLastPayout(uint256 index) view public returns(bool){
        uint256 last_payout = getTeammate(index).last_payout;
        (uint256 last_payout_year, uint256 last_payout_month, uint256 last_payout_day) = getDate(last_payout);
        uint256 today = block.timestamp;
        (uint256 today_year, uint256 today_month, uint256 today_day) = getDate(today);

        if(last_payout_year == today_year && last_payout_month == today_month && last_payout_day == today_day){
            return true;
        }
        return false;
    }

    function getTeammate(uint256 index) view public returns(Teammate memory){
        return _teammates[index];
    }

    function getTeam() view public returns(Teammate[] memory){
        return  _teammates;
    }

    function getTeammatesNumber() view public returns(uint256){
        return _teammates.length;
    }

    function sendToTeammate(uint256 index) public onlyOwner{
        payable(_teammates[index].account).transfer(PRESENT);
    }

    function deposit() public payable{

    }

    modifier onlyOwner{
        require(msg.sender == _owner,"Sender should be the owner of contract");
        _;
    }

    event NewTeammate(address account, string name);

    event HappyBirthday(string name, address account);
}