var ERC20 = artifacts.require("ERC20");
var LizToken = artifacts.require("LizToken");

let ownerAccount = "";
let ownerBalance = "";
let erc20 = "";
let token = "";
let message = "";

// const REVERT = "VM Exception while processing transaction: revert ";

contract("LizToken", async (accounts) => {
    // it("When the contract deployed, totalSupply() = 0.", async () => {
    //     erc20 = await ERC20.deployed();
    //     token = await LizToken.deployed();
    //     let tokenTotalSupply = await token.totalSupply();

    //     try {
    //         let ownerAccount = await token.owner();
    //         ownerBalance = await token.balanceOf(ownerAccount);
    //         // console.log(ownerBalance.toNumber())
    //     } catch (e) {
    //         console.log(e.message);
    //     }

    //     assert.equal(0, tokenTotalSupply.toNumber(), "Total supply is incorrect.");
    //     assert.equal(tokenTotalSupply.toNumber(), ownerBalance, "Total supply and owner's balance are not equal.")
    // });

    it("Only owner can mint tokens.", async () => {
        erc20 = await ERC20.deployed();
        token = await LizToken.deployed();

        // let expectedMinter = await token.owner(); // set the owner of the contract
        let faultMinter = accounts[5]; //set the fault account
        console.log(BigInt(await token.balanceOf(faultMinter)));

        let totalSupplyStart = await token.totalSupply(); //check total supply on a start
        console.log(BigInt(totalSupplyStart));

        try {
            let supply = BigInt(1600000000000000000);
            await token.mint.call(faultMinter, supply);
        } catch (e) {
            message = e.message
            console.log(message)
        }

        console.log(BigInt(await token.balanceOf(faultMinter)));
        console.log(BigInt(await token.totalSupply()));


        // console.log(await token.mint(faultMinter, totalSupply));
        // // Mint total supply
        // let totalSupply = BigInt(1600000000000000000);
        // await token.mint(expectedMinter, totalSupply);
        // senderAccountBalanceAfterMint = await token.balanceOf.call(expectedMinter);
        // console.log(BigInt(await totalSupply()));
    });

    // it("_totalSupply cannot be set beyond the value of _cap.", async () => {
    //     // checking total supply of the token
    //     await totalSupply();
    //     // console.log(BigInt(await totalSupply()));
        
    //     // checking token cap
    //     await token.cap();
    //     // console.log(BigInt(await token.cap()));
        
    //     //set account
    //     let ownerAccount = await token.owner();

    //     // set exceeding amount to check revert
    //     let exceedingCap = 1600000000000001000;
    //     // console.log(exceedingCap)
        
    //     try {
    //         await token.mint(ownerAccount, BigInt(exceedingCap));
    //     } catch (e) {
    //         message = e.message;
    //         // console.log(message);
    //     }

    //     assert.isTrue(message.toString().indexOf("revert") >=0, "Expected Error message differs from what is expected.");
    // });


    // it("Transfer() function works correctly: sender's balance decreases and the recipient's balance increases when transfer().", async () => {
    //     // Setup 2 accounts
    //     let sender = await token.owner();
    //     let recipient = await accounts[1];

    //     // Get initial balance of the second account
    //     let recipientAccountStartingBalance = await token.balanceOf.call(recipient);
    
    //     // Mint total supply
    //     // let totalSupply = BigInt(1600000000000000000);
    //     // await token.mint(sender, totalSupply);
    //     // senderAccountBalanceAfterMint = await token.balanceOf.call(sender);
    //     // console.log(senderAccountBalanceAfterMint.toString())

    //     // Make transaction from first account to second
    //     let testAmount = 1;
    //     await transfer(recipient, testAmount);

    //     // Get balances of first and second account after the transactions
    //     let senderAccountEndingBalance = await token.balanceOf.call(sender);
    //     let recipientAccountEndingBalance = await token.balanceOf.call(recipient);
        
    //     assert.equal(senderAccountEndingBalance, senderAccountBalanceAfterMint - testAmount, "Amount wasn't correctly taken from the sender.");
    //     assert.equal(recipientAccountEndingBalance.toNumber(), recipientAccountStartingBalance + testAmount, "Amount wasn't correctly sent to the receiver.");
    // });
        
    // it("When approve() is executed, allowance() is correctly changed.", async () => {
    //     let owner = await token.owner();
    //         // "0x4dca19e12A6c16A33Aac7335F0535ACcf94BeD98";
    //     let spender = accounts[2];
    //         // "0xd7e842fF8637C4b6bD9D6076D27553F31eF8c1B4";
    //     let value = 100;
        
    //     let approveResult = await token.approve.call(spender, value, { from: owner });
    //     assert.isTrue(approveResult, "approve() not true");

    //     let receipt = await token.approve(spender, value, {from: owner});
    //     assert.equal(receipt.logs.length, 1, 'triggers one event');
    //     assert.equal(receipt.logs[0].event, 'Approval', "Incorrect event is shown. Should be the 'Approval()' event");
    //     assert.equal(receipt.logs[0].args.owner, accounts[0], "Error! Should log the account the tokens/funds are authorized by.");
    //     assert.equal(receipt.logs[0].args.spender, accounts[2], "Error! Should log the account the tokens/funds are authorized to.");
    //     assert.equal(receipt.logs[0].args.value.toNumber(), 100, "Error! Should log the transfer amount");

    //     let allowanceResult = await allowance(owner, spender);
    //     // console.log(allowanceResult.toString())
    //     assert.equal(100, allowanceResult.toString(), "ERROR! allowanceResult isn't correct.");
    // });

    // it("When transferFrom() by the spender, the owner's balance correctly decreases and the spender's balance increases.", async () => {
    //     // set accounts
    //     let owner = accounts[0];
    //     let spender = accounts[2];
    //     let value = 100;

    //     //check balance of the owner
    //     ownerBalanceStart = await token.balanceOf.call(owner);
    //     spenderBalanceStart = await token.balanceOf.call(spender);
    //     // console.log(ownerBalanceStart.toString());
    //     // console.log(spenderBalanceStart.toString());

    //     // let allowanceResult = await allowance(owner, spender);
    //     // console.log(BigInt(allowanceResult));


    //     //Transfer funds from the owner's account to the spender's.
    //     let transferFrom = await token.transferFrom(owner, spender, value, { from: spender });
    //     // console.log(transferFrom.toString());

    //     let spenderBalanceEnd = await token.balanceOf.call(spender);
    //     let ownerBalanceEnd = await token.balanceOf.call(owner);
    //     // console.log(BigInt(spenderBalanceEnd));
    //     // console.log(BigInt(ownerBalanceEnd));

    //     assert.equal(spenderBalanceStart + value, spenderBalanceEnd.toNumber(), "Spender's new balance is incorrect.");
    //     assert.equal(ownerBalanceStart - value, ownerBalanceEnd, "Owner's new balance is incorrect.");
    // });

    // it("A user without sufficient allowance cannot perform transferFrom().", async () => {
    //     let owner = accounts[0];
    //     let spender = accounts[3];
        
    //     // Ensure that spender cannot spend more funds than approved
    //     try {
    //         let insufficientAllowanceCheck = await token.transferFrom.call(owner, spender, 101);
    //         // console.log(insufficientAllowanceCheck);
    //     } catch (e) {
    //         message = e.message;
    //         // console.log(e.message);
    //     }

    //     assert.isTrue(message.toString().indexOf("revert") >= 0, "Expected Error message differs from what is expected.");
    // });

    // it("burn() works correctly.", async () => {
    //     // checking totalSupply before burn() function executed
    //     let tokenTotalSupplyStart = await totalSupply();
    //     // console.log(BigInt(tokenTotalSupplyStart));
            
    //     let burnToken = await token.burn(50000);
        
    //     // checking totalSupply after burn()
    //     let tokenTotalSupplyEnd = await totalSupply();
    //     // console.log(BigInt(tokenTotalSupplyEnd));

    //     assert.equal(tokenTotalSupplyStart - 50000, tokenTotalSupplyEnd, "burn() works incorrectly.");
    //     assert.isTrue(tokenTotalSupplyStart - 50000 == tokenTotalSupplyEnd, "The result is incorrect.");
    // });

    // it("The owner account corresponds to the one which deployed the contract.", async () => {
    //     // web3.eth.Contract.defaultAccount
    //     let owner = await token.owner();
    //     // web3.eth.defaultAccount == web3.eth.getAccounts()[0]
    //     // console.log(web3.eth.defaultAccount,web3.eth.accounts[0])
    //     // assert.isTrue(web3.eth.defaultAccount == web3.eth.accounts[0], "Default account is false.")
    //     assert.isTrue(owner == accounts[0], "The owner's account doesn't correspond to the first default account in ganache.");
    // });


    // // it("Other users cannot mint tokens.", async () => {

    // // });



        
    
    
        
    //     // only owner can mint
    //     // console.log(ownerBalance.toNumber());
    //     // assert.equal(ownerBalance.toNumber(), 0, "Initial balance is incorrect.");

    
    //     // it("transfer() function works correctly: sender's balance decreases and the recipient's balance increases when transfer().", async () => {

    //     // })

    // // })

    // // it("ownerAccount balance holds the same totalSupply() as LIZ token", async () => {
    // //     ownerAccount = (await web3.eth.getAccounts());
    // //     let tokenBalance = await balanceOf(ownerAccount[0]);
    // //     assert.equal(testTotalSupply, tokenBalance, "Balances are not equal.")
    // // })

});

// async function totalSupply() {
//     return token.totalSupply();
// }

// async function mint(address, amount) {
//     return token.mint(address, amount);
// }

// async function transfer(toAddress, amount) {
//     return token.transfer(toAddress, amount);
// }
    
// async function balanceOf(address) {
//     return token.valueOf[address];
// }

// async function approve(toAddress, valueOf) {
//     return true;
// }

// async function allowance(fromAddress, toAddress) {
//     return token.allowance(fromAddress, toAddress);
// }

// async function transferFrom(fromAddress, toAddress, amount) {
//     return 
// }


