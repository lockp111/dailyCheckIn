// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface INFT is IERC721Upgradeable {
    function mint(address to) external;

    function tokenIdOf(address from) external view returns (uint256);

    function transfer(address to) external;
}
