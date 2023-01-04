// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC721} from "solmate/src/tokens/ERC721.sol";

import {Kredit} from "./Kredit.sol";
import {Lock} from "./Lock.sol";

import "hardhat/console.sol";

/**
 * @title Kharacter Token (KHAR)
 * @author Kethic <kethic@kethic.com>
 * @notice Kharacter is an in-game NFT for Not-Your-Keys.
 */

contract Kharacter is ERC721("Kharacter", "KHAR") {

	event Cracked(address indexed victim, address indexed hacker);
	error Failed();

    Kredit public immutable kredit;

	uint256 public totalSupply = 0;

	// number of locks currently installed on this tokenId
	mapping (uint256 => uint256) lockCount;

	// address of the locks installed on this tokenId
	mapping (uint256 => address[]) lock;

    constructor(Kredit _kredit) {
        kredit = _kredit;
    }

	function tokenURI(uint256) public pure virtual override returns (string memory) {}

    function mint(address to) public {
		// restrict to one per wallet
		_mint(to, totalSupply);
		totalSupply++;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
		totalSupply--;
    }

    // function safeMint(address to, uint256 tokenId) public virtual {
    //     _safeMint(to, tokenId);
    // }

    // function safeMint(
    //     address to,
    //     uint256 tokenId,
    //     bytes memory data
    // ) public virtual {
    //     _safeMint(to, tokenId, data);
    // }

	// need getLockNames and getLockAddresses?

	// by tokenId
	// todo: need one by address
	function getLocks(uint256 id) public view returns (address[] memory) {
		return lock[id];
	}

	function setLocks(uint256 id, address[] calldata locks) public {
		lockCount[id] = locks.length;
		lock[id] = locks;
	}

	// exploiting a tokenId always extracts all available tokens from that tokenId
	function exploit(uint256 id, string[] calldata picks) public returns (bool) {
		bool cracked = false;
		if(lockCount[id] > 0) {
			uint passCount = 0;
			for(uint i = 0; i < lockCount[id]; i++) {
				(bool success,) = 
					lock[id][i].staticcall(
						abi.encodeWithSignature("unlock(string)", 
						picks[i])
					);
				if(success) {
					// normally I'd look at the result in data, but unlocks reverts if it fails
					passCount++;
				}
			}

			cracked = (passCount == lockCount[id]);
		}
		else
		{
			cracked = true;
		}
		
		if(cracked) 
		{
			// mint token reward for player, and send them to them
			// console.log("mint rewards to user");
			
			kredit.mint(msg.sender, 10);
			emit Cracked(ownerOf(id), msg.sender);
		}
		else
		{ 
			revert Failed();
		}
		return cracked;
	}
}
