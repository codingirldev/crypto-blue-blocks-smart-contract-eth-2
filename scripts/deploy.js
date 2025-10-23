const hre = require("hardhat");

/**
 * Deployment script for VendorFactory contract
 * This script deploys the VendorFactory contract and provides deployment information
 */
async function main() {
  console.log("🚀 Starting deployment of VendorFactory...");

  // Get the contract factory
  const VendorFactory = await hre.ethers.getContractFactory("VendorFactory");

  // Deploy the contract
  console.log("📦 Deploying VendorFactory...");
  const vendorFactory = await VendorFactory.deploy();
  
  // Wait for deployment to complete
  await vendorFactory.waitForDeployment();
  
  const vendorFactoryAddress = await vendorFactory.getAddress();
  
  console.log("✅ VendorFactory deployed successfully!");
  console.log("📍 Contract Address:", vendorFactoryAddress);
  console.log("🔗 Network:", hre.network.name);
  
  // Verify the contract on Etherscan (if not on localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await vendorFactory.deploymentTransaction().wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: vendorFactoryAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    vendorFactoryAddress: vendorFactoryAddress,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log("Network:", deploymentInfo.network);
  console.log("VendorFactory Address:", deploymentInfo.vendorFactoryAddress);
  console.log("Deployment Time:", deploymentInfo.deploymentTime);
  console.log("Block Number:", deploymentInfo.blockNumber);

  console.log("\n🎯 Next Steps:");
  console.log("1. Copy the VendorFactory address for your frontend");
  console.log("2. Use the registerVendor() function to create vendor profiles");
  console.log("3. Each vendor will get their own VendorProfile contract");
  console.log("4. Use getVendorProfile(index) to retrieve vendor addresses");
  console.log("5. Use getAllVendorProfiles() to get all vendor addresses");

  console.log("\n💡 Example Usage:");
  console.log("const vendorFactory = await ethers.getContractAt('VendorFactory', '" + vendorFactoryAddress + "');");
  console.log("await vendorFactory.registerVendor('My Vendor Name');");
  console.log("const vendorCount = await vendorFactory.getVendorCount();");
  console.log("const allVendors = await vendorFactory.getAllVendorProfiles();");
}

// Handle deployment errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
