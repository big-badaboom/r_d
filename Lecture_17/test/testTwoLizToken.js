var ERC20 = artifacts.require("ERC20");
var LizToken = artifacts.require("LizToken");

let ownerAccount = "";
let ownerBalance = "";
let erc20 = "";
let token = "";
let message = "";

// const REVERT = "VM Exception while processing transaction: revert ";

contract("LizToken", async (accounts) => {
    it("When the contract deployed, totalSupply() = 0.", async () => {
        erc20 = await ERC20.deployed();
        token = await LizToken.deployed();
        let tokenTotalSupply = await token.totalSupply();

        try {
            let ownerAccount = await token.owner();
            ownerBalance = await token.balanceOf(ownerAccount);
            // console.log(ownerBalance.toNumber())
        } catch (e) {
            console.log(e.message);
        }

        assert.equal(0, tokenTotalSupply.toNumber(), "Total supply is incorrect.");
        assert.equal(tokenTotalSupply.toNumber(), ownerBalance, "Total supply and owner's balance are not equal.")
    });

    it("_totalSupply cannot be set beyond the value of _cap.", async () => {
        // checking total supply of the token
        await token.totalSupply();
        // console.log(BigInt(await token.totalSupply()));
        
        // checking token cap
        await token.cap();
        // console.log(BigInt(await token.cap()));
        
        //set account
        let ownerAccount = await token.owner();

        // set exceeding amount to check revert
        let exceedingCap = 1600000000000001000;
        // console.log(exceedingCap)
        
        try {
            await token.mint(ownerAccount, BigInt(exceedingCap));
        } catch (e) {
            message = e.message;
            // console.log(message);
        }

        assert.isTrue(message.toString().indexOf("revert") >= 0, "Expected Error message differs from what is expected.");
    });

    it("Other users cannot mint tokens.", async () => {
        let faultMinter = accounts[5]; //set the fault account to mint

        let faultMinterBalanceBeforeMint = await token.balanceOf(faultMinter);
        // console.log(BigInt(faultMinterBalanceBeforeMint));

        let totalSupplyBeforeMint = await token.totalSupply(); //check total supply on the start
        // console.log(BigInt(totalSupplyBeforeMint));

        // mint total supply by fault minter
        try {
            let supply = BigInt(1600000000000000000);
            await token.mint(faultMinter, supply, { from: faultMinter });
        } catch (e) {
            revertMessage = e.message;
            // console.log(revertMessage)
        }

        let faultMinterBalanceAfterMint = await token.balanceOf(faultMinter);
        // console.log(BigInt(faultMinterBalanceAfterMint));

        let totalSupplyAfterFaultMint = await token.totalSupply();
        // console.log(BigInt(totalSupplyAfterFaultMint));

        assert.isTrue(revertMessage.toString().indexOf("revert") >= 0, "Revert of Ownable.sol works incorrectly");
        assert.equal(BigInt(faultMinterBalanceBeforeMint), BigInt(faultMinterBalanceAfterMint), "mint() works incorrectly: totalSupply was minted with fault account.");
        assert.equal(BigInt(totalSupplyBeforeMint), BigInt(totalSupplyAfterFaultMint), "totalSupply() isn't 0: mint function was executed by fault minter.");
    })

    it("Only owner can mint tokens.", async () => {
        let expectedMinter = await token.owner(); // set the owner of the contract

        // let expectedMinterBalanceBeforeMint = await token.balanceOf(expectedMinter);
        // console.log(BigInt(expectedMinterBalanceBeforeMint));

        // Mint total supply by expected minter
        try {
            let supply = BigInt(1600000000000000000);
            await token.mint(expectedMinter, supply, { from: expectedMinter });
        } catch (e) {
            message = e.message;
            // console.log(message)
        }

        let expectedMinterBalanceAfterMint = await token.balanceOf(expectedMinter);
        // console.log(BigInt(expectedMinterBalanceAfterMint));

        let totalSupplyAfterExpectedMint = await token.totalSupply();
        // console.log(BigInt(totalSupplyAfterExpectedMint));

        
        assert.equal(BigInt(totalSupplyAfterExpectedMint), 1600000000000000000, "total supply was minted incorrectly.");
        assert.equal(BigInt(totalSupplyAfterExpectedMint), BigInt(expectedMinterBalanceAfterMint), "total supply != minter balance after mint.")
    });

    it("Transfer() function works correctly: sender's balance decreases and the recipient's balance increases when transfer().", async () => {
        // Setup 2 accounts
        let sender = await token.owner();
        let recipient = accounts[1];

        // Get initial balance of the second account
        let recipientAccountStartingBalance = await token.balanceOf(recipient);
    
        let senderAccountStartingBalance = await token.balanceOf(sender);
        // console.log(senderAccountStartingBalance.toString())

        // Make transaction from first account to second
        let testAmount = 1;
        await token.transfer(recipient, testAmount);

        // Get balances of first and second account after the transactions
        let senderAccountEndingBalance = await token.balanceOf(sender);
        let recipientAccountEndingBalance = await token.balanceOf(recipient);
        
        assert.equal(senderAccountEndingBalance, senderAccountStartingBalance - testAmount, "Amount wasn't correctly taken from the sender.");
        assert.equal(recipientAccountEndingBalance.toNumber(), recipientAccountStartingBalance + testAmount, "Amount wasn't correctly sent to the receiver.");
    });
        
    it("When approve() is executed, allowance() is correctly changed.", async () => {
        let owner = await token.owner();
        // "0x4dca19e12A6c16A33Aac7335F0535ACcf94BeD98";
        let spender = accounts[2];
        // "0xd7e842fF8637C4b6bD9D6076D27553F31eF8c1B4";
        let value = 100;
        
        let approveResult = await token.approve(spender, value, { from: owner });

        // let receipt = await token.approve(spender, value, {from: owner});
        assert.equal(approveResult.logs.length, 1, 'triggers one event');
        assert.equal(approveResult.logs[0].event, 'Approval', "Incorrect event is shown. Should be the 'Approval()' event");
        assert.equal(approveResult.logs[0].args.owner, accounts[0], "Error! Should log the account the tokens/funds are authorized by.");
        assert.equal(approveResult.logs[0].args.spender, accounts[2], "Error! Should log the account the tokens/funds are authorized to.");
        assert.equal(approveResult.logs[0].args.value.toNumber(), 100, "Error! Should log the transfer amount");

        let allowanceResult = await token.allowance(owner, spender);
        // console.log(allowanceResult.toString())
        assert.equal(100, allowanceResult.toString(), "ERROR! allowanceResult isn't correct.");
    });

    it("When transferFrom() by the spender, the owner's balance correctly decreases and the spender's balance increases.", async () => {
        // set accounts
        let owner = accounts[0];
        let spender = accounts[2];
        let value = 100;

        //check balance of the owner
        let ownerBalanceStart = await token.balanceOf(owner);
        let spenderBalanceStart = await token.balanceOf(spender);
        // console.log(ownerBalanceStart.toString());
        // console.log(spenderBalanceStart.toString());

        // let allowanceResult = await allowance(owner, spender);
        // console.log(BigInt(allowanceResult));


        //Transfer funds from the owner's account to the spender's.
        let transferFrom = await token.transferFrom(owner, spender, value, { from: spender });
        // console.log(transferFrom.toString());

        let spenderBalanceEnd = await token.balanceOf(spender);
        let ownerBalanceEnd = await token.balanceOf(owner);
        // console.log(BigInt(spenderBalanceEnd));
        // console.log(BigInt(ownerBalanceEnd));

        assert.equal(spenderBalanceStart + value, spenderBalanceEnd.toNumber(), "Spender's new balance is incorrect.");
        assert.equal(ownerBalanceStart - value, ownerBalanceEnd, "Owner's new balance is incorrect.");
    });

    it("A user without sufficient allowance cannot perform transferFrom().", async () => {
        let owner = accounts[0];
        let spender = accounts[3];
        
        // Ensure that spender cannot spend more funds than approved
        try {
            let insufficientAllowanceCheck = await token.transferFrom.call(owner, spender, 101);
            // console.log(insufficientAllowanceCheck);
        } catch (e) {
            message = e.message;
            // console.log(e.message);
        }

        assert.isTrue(message.toString().indexOf("revert") >= 0, "Expected Error message differs from what is expected.");
    });

    it("burn() works correctly.", async () => {
        // checking totalSupply before burn() function executed
        let tokenTotalSupplyStart = await token.totalSupply();
        // console.log(BigInt(tokenTotalSupplyStart));
            
        let burnToken = await token.burn(50000);
        
        // checking totalSupply after burn()
        let tokenTotalSupplyEnd = await token.totalSupply();
        // console.log(BigInt(tokenTotalSupplyEnd));

        assert.equal(tokenTotalSupplyStart - 50000, tokenTotalSupplyEnd, "burn() works incorrectly.");
        assert.isTrue(tokenTotalSupplyStart - 50000 == tokenTotalSupplyEnd, "The result is incorrect.");
    });

    it("The owner account corresponds to the one which deployed the contract.", async () => {
        // web3.eth.Contract.defaultAccount
        let owner = await token.owner();
        // web3.eth.defaultAccount == web3.eth.getAccounts()[0]
        // console.log(web3.eth.defaultAccount,web3.eth.accounts[0])
        // assert.isTrue(web3.eth.defaultAccount == web3.eth.accounts[0], "Default account is false.")
        assert.isTrue(owner == accounts[0], "The owner's account doesn't correspond to the first default account in ganache.");
    });
})