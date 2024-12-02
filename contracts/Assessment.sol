// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LuisCarCounter {
    int256 public counter; 

    // add car count
    function increment() public {
        require(counter < type(int256).max, "Counter overflow");
        counter++;
    }

    /// reduce car count
    function decrement() public {
        require(counter > type(int256).min, "Counter underflow");
        counter--;
    }

    /// total value
    function getCounter() public view returns (int256) {
        return counter;
    }
}