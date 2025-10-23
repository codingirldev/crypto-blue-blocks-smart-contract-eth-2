# 🚀 Deployment Guide - Vendor Factory System

## ✅ Local Deployment (COMPLETED)

Your contracts have been successfully deployed to the local Hardhat network:

- **VendorFactory Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Network**: localhost (Hardhat)
- **Status**: ✅ Working and tested

## 🌐 Deploy to Testnet (Sepolia)

### Step 1: Set up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
```bash
# Your private key (NEVER commit this!)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Sepolia RPC URL (get from Infura, Alchemy, or QuickNode)
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Step 2: Get Testnet ETH

Get Sepolia ETH from a faucet:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### Step 3: Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### Step 4: Verify Contracts

The deployment script will automatically verify contracts on Etherscan.

## 🏭 Deploy to Mainnet

### Step 1: Update Environment Variables

```bash
# Add mainnet RPC URL
MAINNET_URL=https://mainnet.infura.io/v3/your_project_id
```

### Step 2: Deploy to Mainnet

```bash
# Deploy to Ethereum mainnet
npm run deploy:mainnet
```

## 📋 Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy to localhost |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:mainnet` | Deploy to Ethereum mainnet |
| `npm run compile` | Compile contracts |
| `npm run test` | Run test suite |

## 🔧 Manual Deployment

If you prefer manual deployment:

```javascript
// scripts/manual-deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const VendorFactory = await hre.ethers.getContractFactory("VendorFactory");
  const vendorFactory = await VendorFactory.deploy();
  
  await vendorFactory.waitForDeployment();
  console.log("VendorFactory deployed to:", await vendorFactory.getAddress());
}

main().catch(console.error);
```

## 🧪 Testing Your Deployment

### Test Vendor Registration
```javascript
const vendorFactory = await ethers.getContractAt('VendorFactory', 'YOUR_FACTORY_ADDRESS');
await vendorFactory.registerVendor("My Test Vendor");
```

### Test Vendor Profile
```javascript
const vendorProfile = await ethers.getContractAt('VendorProfile', 'YOUR_PROFILE_ADDRESS');
const name = await vendorProfile.name();
const owner = await vendorProfile.owner();
```

## 📊 Gas Estimates

| Operation | Gas Cost (Estimated) |
|-----------|---------------------|
| Deploy VendorFactory | ~1,200,000 gas |
| Register Vendor | ~800,000 gas |
| Withdraw ETH | ~50,000 gas |
| Withdraw ERC20 | ~60,000 gas |
| Withdraw NFT | ~80,000 gas |

## 🔍 Verification

After deployment, verify your contracts:

1. **Etherscan**: Check your contract on Etherscan
2. **Function Testing**: Test all contract functions
3. **Event Monitoring**: Monitor emitted events
4. **Gas Usage**: Check gas consumption

## 🚨 Security Checklist

Before mainnet deployment:

- [ ] Private keys secured
- [ ] Environment variables set
- [ ] Testnet deployment successful
- [ ] All functions tested
- [ ] Gas estimates confirmed
- [ ] Contract verification completed
- [ ] Frontend integration tested

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Verify your environment variables
3. Ensure you have sufficient ETH for gas
4. Check network connectivity
5. Review contract compilation errors

## 🎯 Next Steps

After successful deployment:

1. **Frontend Integration**: Connect your DApp to the deployed contracts
2. **User Testing**: Test with real users on testnet
3. **Monitoring**: Set up monitoring and alerting
4. **Documentation**: Update your project documentation
5. **Mainnet**: Deploy to mainnet when ready

---

**Happy Deploying! 🚀**
