// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Paywall {
address payable public owner;

event AccessGranted(address _user);

constructor() {
owner = payable(msg.sender);
}

function grantAccess() public payable {
require(msg.value >= 0.01 ether, "Not enough Ether sent.");
owner.transfer(msg.value);
emit AccessGranted(msg.sender);
}
}
