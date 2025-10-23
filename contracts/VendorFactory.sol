// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VendorProfile.sol";

/**
 * @title VendorFactory
 * @dev Factory contract that deploys and manages VendorProfile contracts
 * @author Your Name
 */
contract VendorFactory {
    /// @notice Mapping from vendor index to vendor profile address
    mapping(uint256 => address) public vendorProfiles;
    
    /// @notice Total number of registered vendors
    uint256 public vendorCount;
    
    /// @notice Mapping from vendor address to their profile index
    mapping(address => uint256) public vendorToIndex;
    
    /// @notice Mapping to check if an address is already a registered vendor
    mapping(address => bool) public isRegisteredVendor;
    
    /// @notice Event emitted when a new vendor is registered
    event VendorRegistered(
        address indexed vendor, 
        address indexed profile, 
        string name,
        uint256 indexed index
    );
    
    /// @notice Event emitted when vendor count is updated
    event VendorCountUpdated(uint256 newCount);

    /**
     * @dev Registers a new vendor by deploying a VendorProfile contract
     * @param name The vendor's display name
     * @return profileAddress The address of the deployed VendorProfile contract
     * @return index The index of the newly registered vendor
     */
    function registerVendor(string memory name) 
        external 
        returns (address profileAddress, uint256 index) 
    {
        require(bytes(name).length > 0, "VendorFactory: Name cannot be empty");
        require(bytes(name).length <= 100, "VendorFactory: Name too long");
        require(!isRegisteredVendor[msg.sender], "VendorFactory: Vendor already registered");
        
        // Deploy new VendorProfile contract
        VendorProfile newProfile = new VendorProfile(msg.sender, name);
        profileAddress = address(newProfile);
        
        // Store the vendor profile address
        vendorProfiles[vendorCount] = profileAddress;
        
        // Update mappings and counters
        vendorToIndex[msg.sender] = vendorCount;
        isRegisteredVendor[msg.sender] = true;
        
        index = vendorCount;
        vendorCount++;
        
        emit VendorRegistered(msg.sender, profileAddress, name, index);
        emit VendorCountUpdated(vendorCount);
    }

    /**
     * @dev Gets the address of a vendor profile by index
     * @param index The index of the vendor profile
     * @return The address of the vendor profile contract
     */
    function getVendorProfile(uint256 index) external view returns (address) {
        require(index < vendorCount, "VendorFactory: Invalid vendor index");
        return vendorProfiles[index];
    }

    /**
     * @dev Gets the vendor profile address for a specific vendor
     * @param vendor The vendor's address
     * @return The address of the vendor's profile contract
     */
    function getVendorProfileByAddress(address vendor) external view returns (address) {
        require(isRegisteredVendor[vendor], "VendorFactory: Vendor not registered");
        uint256 index = vendorToIndex[vendor];
        return vendorProfiles[index];
    }

    /**
     * @dev Gets the index of a vendor
     * @param vendor The vendor's address
     * @return The index of the vendor
     */
    function getVendorIndex(address vendor) external view returns (uint256) {
        require(isRegisteredVendor[vendor], "VendorFactory: Vendor not registered");
        return vendorToIndex[vendor];
    }

    /**
     * @dev Gets all vendor profile addresses
     * @dev WARNING: This function may fail with gas limit if vendorCount is very large
     * @dev Consider using getVendorProfilesRange() for pagination instead
     * @return An array of all vendor profile addresses
     */
    function getAllVendorProfiles() external view returns (address[] memory) {
        require(vendorCount <= 1000, "VendorFactory: Too many vendors, use pagination");
        address[] memory profiles = new address[](vendorCount);
        for (uint256 i = 0; i < vendorCount; i++) {
            profiles[i] = vendorProfiles[i];
        }
        return profiles;
    }

    /**
     * @dev Gets vendor profile addresses in a range
     * @param start The starting index (inclusive)
     * @param end The ending index (exclusive)
     * @return An array of vendor profile addresses in the specified range
     */
    function getVendorProfilesRange(uint256 start, uint256 end) 
        external 
        view 
        returns (address[] memory) 
    {
        require(start < vendorCount, "VendorFactory: Start index out of bounds");
        require(end <= vendorCount, "VendorFactory: End index out of bounds");
        require(start < end, "VendorFactory: Start must be less than end");
        
        address[] memory profiles = new address[](end - start);
        for (uint256 i = start; i < end; i++) {
            profiles[i - start] = vendorProfiles[i];
        }
        return profiles;
    }

    /**
     * @dev Checks if an address is a registered vendor
     * @param vendor The address to check
     * @return True if the address is a registered vendor
     */
    function isVendor(address vendor) external view returns (bool) {
        return isRegisteredVendor[vendor];
    }

    /**
     * @dev Gets the total number of registered vendors
     * @return The total number of vendors
     */
    function getVendorCount() external view returns (uint256) {
        return vendorCount;
    }
}
