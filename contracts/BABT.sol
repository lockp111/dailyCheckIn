// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./interfaces/INFT.sol";

contract BABT is ERC721Upgradeable, INFT {
    uint256 private _tokenIndex;
    address private _owner;

    mapping(address => uint256) private _ownerTokenIds;

    function initialize() public initializer {
        __ERC721_init("Binance Account Bound Token", "BABT");
        _owner = msg.sender;
    }

    function mint(address to) external {
        require(msg.sender == _owner, "unauth");
        require(balanceOf(to) == 0, "already mint");

        _tokenIndex++;
        _ownerTokenIds[to] = _tokenIndex;
        _mint(to, _tokenIndex);
    }

    function tokenIdOf(address from) external view returns (uint256) {
        return _ownerTokenIds[from];
    }

    function transfer(address to) external {
        uint256 tokenId = _ownerTokenIds[msg.sender];
        _transfer(msg.sender, to, tokenId);
        _ownerTokenIds[to] = tokenId;
        delete _ownerTokenIds[msg.sender];
    }
}
