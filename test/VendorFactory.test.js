const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VendorFactory and VendorProfile", function () {
  let vendorFactory;
  let owner, vendor1, vendor2, recipient;
  let mockERC20, mockERC721;

  beforeEach(async function () {
    [owner, vendor1, vendor2, recipient] = await ethers.getSigners();

    // Deploy VendorFactory
    const VendorFactory = await ethers.getContractFactory("VendorFactory");
    vendorFactory = await VendorFactory.deploy();
    await vendorFactory.waitForDeployment();

    // Deploy mock ERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MOCK");
    await mockERC20.waitForDeployment();

    // Deploy mock ERC721 token
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockERC721 = await MockERC721.deploy("Mock NFT", "MNFT");
    await mockERC721.waitForDeployment();
  });

  describe("VendorFactory", function () {
    it("Should register a new vendor", async function () {
      const tx = await vendorFactory.connect(vendor1).registerVendor("Test Vendor");
      const receipt = await tx.wait();

      expect(await vendorFactory.getVendorCount()).to.equal(1);
      expect(await vendorFactory.getVendorProfile(0)).to.not.equal(ethers.ZeroAddress);
      expect(await vendorFactory.isVendor(vendor1.address)).to.be.true;

      // Check event emission
      const event = receipt.logs.find(log => {
        try {
          const parsed = vendorFactory.interface.parseLog(log);
          return parsed.name === "VendorRegistered";
        } catch (e) {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
    });

    it("Should prevent duplicate vendor registration", async function () {
      await vendorFactory.connect(vendor1).registerVendor("Test Vendor");
      
      await expect(
        vendorFactory.connect(vendor1).registerVendor("Another Vendor")
      ).to.be.revertedWith("VendorFactory: Vendor already registered");
    });

    it("Should get all vendor profiles", async function () {
      await vendorFactory.connect(vendor1).registerVendor("Vendor 1");
      await vendorFactory.connect(vendor2).registerVendor("Vendor 2");

      const allVendors = await vendorFactory.getAllVendorProfiles();
      expect(allVendors).to.have.length(2);
    });

    it("Should get vendor profile by address", async function () {
      await vendorFactory.connect(vendor1).registerVendor("Test Vendor");
      
      const profileAddress = await vendorFactory.getVendorProfileByAddress(vendor1.address);
      expect(profileAddress).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("VendorProfile", function () {
    let vendorProfile;

    beforeEach(async function () {
      await vendorFactory.connect(vendor1).registerVendor("Test Vendor");
      const profileAddress = await vendorFactory.getVendorProfile(0);
      vendorProfile = await ethers.getContractAt("VendorProfile", profileAddress);
    });

    it("Should have correct owner and name", async function () {
      expect(await vendorProfile.owner()).to.equal(vendor1.address);
      expect(await vendorProfile.name()).to.equal("Test Vendor");
    });

    it("Should allow owner to update metadata", async function () {
      await vendorProfile.connect(vendor1).updateMetadata("Updated metadata");
      expect(await vendorProfile.metadata()).to.equal("Updated metadata");
    });

    it("Should prevent non-owner from updating metadata", async function () {
      await expect(
        vendorProfile.connect(vendor2).updateMetadata("Unauthorized update")
      ).to.be.revertedWithCustomError(vendorProfile, "OwnableUnauthorizedAccount");
    });

    it("Should withdraw ETH", async function () {
      // Send ETH to the vendor profile
      await vendor1.sendTransaction({
        to: await vendorProfile.getAddress(),
        value: ethers.parseEther("1.0")
      });

      const initialBalance = await ethers.provider.getBalance(recipient.address);
      
      await vendorProfile.connect(vendor1).withdrawETH(recipient.address, ethers.parseEther("0.5"));
      
      const finalBalance = await ethers.provider.getBalance(recipient.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("0.5"));
    });

    it("Should withdraw ERC20 tokens", async function () {
      // Mint tokens to vendor profile
      await mockERC20.mint(await vendorProfile.getAddress(), ethers.parseEther("100"));
      
      const initialBalance = await mockERC20.balanceOf(recipient.address);
      
      await vendorProfile.connect(vendor1).withdrawERC20(
        await mockERC20.getAddress(),
        recipient.address,
        ethers.parseEther("50")
      );
      
      const finalBalance = await mockERC20.balanceOf(recipient.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("50"));
    });

    it("Should withdraw NFT", async function () {
      // Mint NFT to vendor profile
      await mockERC721.mint(await vendorProfile.getAddress(), 1);
      
      expect(await mockERC721.ownerOf(1)).to.equal(await vendorProfile.getAddress());
      
      await vendorProfile.connect(vendor1).withdrawNFT(
        await mockERC721.getAddress(),
        1,
        recipient.address
      );
      
      expect(await mockERC721.ownerOf(1)).to.equal(recipient.address);
    });

    it("Should prevent non-owner from withdrawing", async function () {
      await expect(
        vendorProfile.connect(vendor2).withdrawETH(recipient.address, ethers.parseEther("1.0"))
      ).to.be.revertedWithCustomError(vendorProfile, "OwnableUnauthorizedAccount");
    });

    it("Should handle insufficient balance", async function () {
      await expect(
        vendorProfile.connect(vendor1).withdrawETH(recipient.address, ethers.parseEther("1.0"))
      ).to.be.revertedWith("VendorProfile: Insufficient ETH balance");
    });
  });
});

// Mock contracts for testing
const MockERC20 = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        return true;
    }
}
`;

const MockERC721 = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockERC721 {
    string public name;
    string public symbol;
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address to, uint256 tokenId) external {
        require(to != address(0), "Invalid address");
        require(_owners[tokenId] == address(0), "Token already exists");
        
        _owners[tokenId] = to;
        _balances[to]++;
    }
    
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _owners[tokenId];
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        require(_owners[tokenId] == from, "Not owner");
        require(to != address(0), "Invalid address");
        
        _owners[tokenId] = to;
        _balances[from]--;
        _balances[to]++;
    }
}
`;
