// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * @title Lock Contract (LOCK)
 * @author Kethic <kethic@kethic.com>
 * @notice Lock is an in-game token for Not-Your-Keys.
 */

import "hardhat/console.sol";

contract Lock {

	string public desc;
	bytes32[] keylist;

	error Invalid();

    constructor(string memory _desc, bytes32[] memory _keylist) {
		desc = _desc;
		keylist = _keylist;
	}
	
	// function test(string calldata pick) public view returns (bool) {
    //     return validate(pick);
	// }

	function unlock(string calldata pick) public view returns (bool) {
        if (validate(pick) == true) {
            return true;
        } else {
            revert Invalid();
        }
	}

	function validate(string calldata pick) private view returns (bool) {
		// console.logBytes32(keccak256(abi.encodePacked(pick)));
		// console.logBytes32(keylist[0]);
		// console.log(keccak256(abi.encodePacked(pick)) == keylist[0]);

		if (keccak256(abi.encodePacked(pick)) == keylist[7]) {
            return true;
        } else {
            return false;
        }
	}

}
