// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * @title Lock Contract (LOCK)
 * @author Kethic <kethic@kethic.com>
 * @notice Lock is an in-game token for Not-Your-Keys.
 */

import "hardhat/console.sol";

contract Lock {

	// text string that describes the lock to the user
	string public desc;

	// array of hash results that can unlock the lock
	bytes32[] keylist;

	// number of milliseconds between keylist index updates
	// recommended default is 300000 (5 minutes)
	uint256 private update_rate;

	error Invalid();

    constructor(uint256 _rate, string memory _desc, bytes32[] memory _keylist) {
		update_rate = _rate;
		desc = _desc;
		keylist = _keylist;
	}

	function unlock(string calldata pick) public view returns (bool) {
        if (validate(pick) == true) {
            return true;
        } else {
            revert Invalid();
        }
	}

	function validate(string calldata pick) private view returns (bool) {

		if (keccak256(abi.encodePacked(pick)) == keylist[7]) {
            return true;
        } else {
            return false;
        }
	}



	function getKeyIndex() internal view returns (uint256) {
		return (block.timestamp / update_rate) % keylist.length;

	}

}
