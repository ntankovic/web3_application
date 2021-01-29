//SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract Faucet {
    // funkcija za doniranje
    function withdraw(uint256 amount) public {
        console.log("Calling withdraw: ", amount);
        require(amount <= 0.01 ether);
        msg.sender.transfer(amount);
    }

    // za donacije
    receive() external payable {
        console.log("Default payable");
    }
}
