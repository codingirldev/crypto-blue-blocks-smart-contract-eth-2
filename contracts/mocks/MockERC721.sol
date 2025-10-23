// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockERC721
 * @dev Mock ERC721 token for testing purposes
 */
contract MockERC721 {
    string public name;
    string public symbol;
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address to, uint256 tokenId) external {
        require(to != address(0), "Invalid address");
        require(_owners[tokenId] == address(0), "Token already exists");
        
        _owners[tokenId] = to;
        _balances[to]++;
        emit Transfer(address(0), to, tokenId);
    }
    
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }
    
    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "Invalid address");
        return _balances[owner];
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        require(_owners[tokenId] == from, "Not owner");
        require(to != address(0), "Invalid address");
        
        _owners[tokenId] = to;
        _balances[from]--;
        _balances[to]++;
        
        emit Transfer(from, to, tokenId);
    }
    
    function transferFrom(address from, address to, uint256 tokenId) external {
        require(_owners[tokenId] == from, "Not owner");
        require(to != address(0), "Invalid address");
        
        _owners[tokenId] = to;
        _balances[from]--;
        _balances[to]++;
        
        emit Transfer(from, to, tokenId);
    }
}
