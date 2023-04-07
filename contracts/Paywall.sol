// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Paywall {
address payable public owner;

event AccessGranted(address _user);

constructor() {
owner = payable(msg.sender);
}


function grantAccess() public payable {
require(msg.value >= 1.00 ether, "Not enough Ether sent.");
owner.transfer(msg.value);
emit AccessGranted(msg.sender);
}

function getBalance() public view returns(uint) {
    return address(this).balance;
}

function withdrawAll(address payable _to) public {
require(owner == _to);
_to.transfer(address(this).balance);
}

}
