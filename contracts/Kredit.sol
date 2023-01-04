// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from "solmate/src/tokens/ERC20.sol";

/**
 * @title Kredit Token (KRED)
 * @author Kethic <kethic@kethic.com>
 * @notice Kredit is an in-game token for Not-Your-Keys.
 */

contract Kredit is ERC20("Kredit", "KRED", 18) {

    constructor() {}

	error Unauthorized();

	// Stolen from GOO. t11s is smart.
    // modifier only(address user) {
    //     if (msg.sender != user) revert Unauthorized();
    //     _;
    // }

    function mint(address to, uint256 value) external {
        _mint(to, value);
    }

    function burn(address from, uint256 value) external {
        _burn(from, value);
    }

	// function transfer(address to, uint256 amount) public override only(kharacter) returns (bool) {
    //     balanceOf[msg.sender] -= amount;

    //     // Cannot overflow because the sum of all user
    //     // balances can't exceed the max uint256 value.
    //     unchecked {
    //         balanceOf[to] += amount;
    //     }

    //     emit Transfer(msg.sender, to, amount);

    //     return true;
    // }

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) public override only(kharacter) returns (bool) {
    //     uint256 allowed = allowance[from][msg.sender]; // Saves gas for limited approvals.

    //     if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;

    //     balanceOf[from] -= amount;

    //     // Cannot overflow because the sum of all user
    //     // balances can't exceed the max uint256 value.
    //     unchecked {
    //         balanceOf[to] += amount;
    //     }

    //     emit Transfer(from, to, amount);

    //     return true;
    // }

}
