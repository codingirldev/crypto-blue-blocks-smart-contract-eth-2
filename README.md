# Vendor Factory Smart Contract System

A comprehensive smart contract system for managing vendors with individual profile contracts, built on Ethereum using Solidity ^0.8.20.

## 🏗️ Architecture

- **VendorFactory**: Main factory contract that deploys and manages individual vendor profiles
- **VendorProfile**: Individual contracts for each vendor with asset management capabilities
- **No Proxy Pattern**: Direct deployment without upgradeability for simplicity and security

## 🧩 Features

### VendorFactory Contract
- Deploy new vendor profiles via `registerVendor(string memory name)`
- Incremental indexing system for easy frontend integration
- Event emission for vendor registration tracking
- Multiple query functions for vendor discovery

### VendorProfile Contract
- Owner-only access control using OpenZeppelin's `Ownable`
- Secure withdrawal functions for ETH, ERC20, and ERC721 tokens
- Reentrancy protection using `ReentrancyGuard`
- Safe transfer patterns using `SafeERC20`
- Metadata management for vendor information

## 🔒 Security Features

- **Access Control**: Only contract owners can perform sensitive operations
- **Reentrancy Protection**: All withdrawal functions are protected against reentrancy attacks
- **Safe Transfers**: Uses OpenZeppelin's SafeERC20 for secure token transfers
- **Input Validation**: Comprehensive checks for addresses, amounts, and ownership
- **Event Logging**: All important operations emit events for transparency

## 📦 Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

## 🚀 Deployment

### Local Development
```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network (in another terminal)
npm run deploy
```

### Testnet/Mainnet Deployment
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Ethereum mainnet
npm run deploy:mainnet
```

### Environment Variables
Create a `.env` file with:
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
MAINNET_URL=https://mainnet.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 💻 Usage Examples

### Registering a Vendor
```javascript
const vendorFactory = await ethers.getContractAt('VendorFactory', factoryAddress);
const tx = await vendorFactory.registerVendor("My Vendor Name");
const receipt = await tx.wait();
```

### Getting All Vendors
```javascript
const vendorCount = await vendorFactory.getVendorCount();
const allVendors = await vendorFactory.getAllVendorProfiles();

// Iterate through vendors
for (let i = 0; i < vendorCount; i++) {
  const vendorAddress = await vendorFactory.getVendorProfile(i);
  const vendorProfile = await ethers.getContractAt('VendorProfile', vendorAddress);
  const vendorName = await vendorProfile.name();
  console.log(`Vendor ${i}: ${vendorName} at ${vendorAddress}`);
}
```

### Vendor Asset Management
```javascript
const vendorProfile = await ethers.getContractAt('VendorProfile', vendorAddress);

// Withdraw ETH
await vendorProfile.withdrawETH(recipientAddress, ethers.parseEther("1.0"));

// Withdraw ERC20 tokens
await vendorProfile.withdrawERC20(tokenAddress, recipientAddress, amount);

// Withdraw NFT
await vendorProfile.withdrawNFT(nftContractAddress, tokenId, recipientAddress);
```

## 📋 Contract Functions

### VendorFactory Functions
- `registerVendor(string name)` - Deploy new vendor profile
- `getVendorProfile(uint256 index)` - Get vendor address by index
- `getVendorProfileByAddress(address vendor)` - Get vendor profile by owner address
- `getAllVendorProfiles()` - Get all vendor addresses
- `getVendorCount()` - Get total number of vendors
- `isVendor(address vendor)` - Check if address is registered vendor

### VendorProfile Functions
- `withdrawETH(address to, uint256 amount)` - Withdraw ETH
- `withdrawERC20(address token, address to, uint256 amount)` - Withdraw ERC20 tokens
- `withdrawNFT(address nftContract, uint256 tokenId, address to)` - Withdraw NFT
- `updateMetadata(string metadata)` - Update vendor metadata
- `getETHBalance()` - Get ETH balance
- `getERC20Balance(address token)` - Get ERC20 token balance

## 🎯 Events

### VendorFactory Events
- `VendorRegistered(address indexed vendor, address indexed profile, string name, uint256 indexed index)`
- `VendorCountUpdated(uint256 newCount)`

### VendorProfile Events
- `VendorProfileCreated(address indexed owner, string name)`
- `ETHWithdrawn(address indexed to, uint256 amount)`
- `ERC20Withdrawn(address indexed token, address indexed to, uint256 amount)`
- `NFTWithdrawn(address indexed nftContract, uint256 tokenId, address indexed to)`
- `MetadataUpdated(string newMetadata)`

## 🔍 Frontend Integration

The system is designed for easy frontend integration:

```javascript
// Get all vendors for display
async function getAllVendors(vendorFactoryAddress) {
  const vendorFactory = await ethers.getContractAt('VendorFactory', vendorFactoryAddress);
  const vendorCount = await vendorFactory.getVendorCount();
  
  const vendors = [];
  for (let i = 0; i < vendorCount; i++) {
    const profileAddress = await vendorFactory.getVendorProfile(i);
    const profile = await ethers.getContractAt('VendorProfile', profileAddress);
    const name = await profile.name();
    const metadata = await profile.metadata();
    
    vendors.push({
      index: i,
      profileAddress,
      name,
      metadata
    });
  }
  
  return vendors;
}
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with gas reporting
REPORT_GAS=true npm run test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.
