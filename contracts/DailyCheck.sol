// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/INFT.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

error InvalidTime(uint start, uint end);
error CheckInFinished();
error InvalidBABT(uint256 tokenId, uint8 times);

contract DailyCheck {
    struct Log {
        uint8 checkTimes;
        uint lastCheck;
    }

    mapping(address => Log) _logs;
    mapping(uint256 => uint8) _tokenIds;

    uint public _start;
    uint constant _gap = 1 days;
    INFT private _BABT;

    event CheckIn(address indexed account, uint8 times);

    constructor(address tokenAddress, uint start) {
        _BABT = INFT(tokenAddress);
        _start = _startOfDay(start);
    }

    function _startOfDay(uint timestamp) internal pure returns (uint) {
        return ((timestamp - 8 hours) / _gap) * _gap + 8 hours;
    }

    function checkIn() external {
        if (_start > block.timestamp || (_start + 10 days) < block.timestamp) {
            revert InvalidTime(_start, _start + 10 days);
        }

        uint256 tokenId = _BABT.tokenIdOf(msg.sender);
        uint8 times = _tokenIds[tokenId];
        if (tokenId == 0 || times >= 3) {
            revert InvalidBABT(tokenId, times);
        }

        Log storage log = _logs[msg.sender];
        if (log.checkTimes >= 3) {
            revert CheckInFinished();
        }

        if ((log.lastCheck + 1 days) > block.timestamp) {
            revert InvalidTime(log.lastCheck + 1 days, _start + 10 days);
        }

        log.lastCheck = _startOfDay(block.timestamp);
        log.checkTimes++;
        emit CheckIn(msg.sender, log.checkTimes);
    }
}
