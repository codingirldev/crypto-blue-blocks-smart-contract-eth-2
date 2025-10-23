// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title VendorProfile
 * @dev Individual vendor profile contract that manages vendor assets and withdrawals
 * @author Your Name
 */
contract VendorProfile is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Vendor's display name
    string public name;
    
    /// @notice Optional metadata string for additional vendor information
    string public metadata;
    
    /// @notice Event emitted when vendor profile is created
    event VendorProfileCreated(address indexed owner, string name);
    
    /// @notice Event emitted when ETH is withdrawn
    event ETHWithdrawn(address indexed to, uint256 amount);
    
    /// @notice Event emitted when ERC20 tokens are withdrawn
    event ERC20Withdrawn(address indexed token, address indexed to, uint256 amount);
    
    /// @notice Event emitted when NFT is withdrawn
    event NFTWithdrawn(address indexed nftContract, uint256 tokenId, address indexed to);
    
    /// @notice Event emitted when metadata is updated
    event MetadataUpdated(string newMetadata);

    /**
     * @dev Constructor that sets the owner and initial vendor information
     * @param _owner The address that will own this vendor profile
     * @param _name The vendor's display name
     */
    constructor(address _owner, string memory _name) Ownable(_owner) {
        name = _name;
        emit VendorProfileCreated(_owner, _name);
    }

    /**
     * @dev Updates the vendor's metadata
     * @param _metadata New metadata string
     */
    function updateMetadata(string memory _metadata) external onlyOwner {
        require(bytes(_metadata).length <= 1000, "VendorProfile: Metadata too long");
        metadata = _metadata;
        emit MetadataUpdated(_metadata);
    }

    /**
     * @dev Withdraws ETH from the vendor profile
     * @param to The address to send ETH to
     * @param amount The amount of ETH to withdraw (in wei)
     */
    function withdrawETH(address payable to, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(to != address(0), "VendorProfile: Cannot withdraw to zero address");
        require(amount > 0, "VendorProfile: Amount must be greater than zero");
        require(amount <= address(this).balance, "VendorProfile: Insufficient ETH balance");
        require(amount <= type(uint128).max, "VendorProfile: Amount too large");
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "VendorProfile: ETH transfer failed");
        
        emit ETHWithdrawn(to, amount);
    }

    /**
     * @dev Withdraws ERC20 tokens from the vendor profile
     * @param token The ERC20 token contract address
     * @param to The address to send tokens to
     * @param amount The amount of tokens to withdraw
     */
    function withdrawERC20(address token, address to, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(token != address(0), "VendorProfile: Invalid token address");
        require(to != address(0), "VendorProfile: Cannot withdraw to zero address");
        require(amount > 0, "VendorProfile: Amount must be greater than zero");
        
        IERC20 tokenContract = IERC20(token);
        require(tokenContract.balanceOf(address(this)) >= amount, "VendorProfile: Insufficient token balance");
        
        tokenContract.safeTransfer(to, amount);
        
        emit ERC20Withdrawn(token, to, amount);
    }

    /**
     * @dev Withdraws an ERC721 NFT from the vendor profile
     * @param nftContract The ERC721 NFT contract address
     * @param tokenId The ID of the NFT to withdraw
     * @param to The address to send the NFT to
     */
    function withdrawNFT(address nftContract, uint256 tokenId, address to) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(nftContract != address(0), "VendorProfile: Invalid NFT contract address");
        require(to != address(0), "VendorProfile: Cannot withdraw to zero address");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == address(this), "VendorProfile: NFT not owned by this contract");
        
        nft.safeTransferFrom(address(this), to, tokenId);
        
        emit NFTWithdrawn(nftContract, tokenId, to);
    }

    /**
     * @dev Allows the contract to receive ETH
     */
    receive() external payable {}

    /**
     * @dev Allows the contract to receive ERC721 tokens
     * @return bytes4 The function selector
     */
    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure returns (bytes4) {
        // Return the function selector for ERC721Receiver
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @dev Returns the current ETH balance of the vendor profile
     * @return The ETH balance in wei
     */
    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns the ERC20 token balance of the vendor profile
     * @param token The ERC20 token contract address
     * @return The token balance
     */
    function getERC20Balance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
