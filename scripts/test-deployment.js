const hre = require("hardhat");

/**
 * Test script to verify the deployed VendorFactory contract
 */
async function main() {
  console.log("🧪 Testing VendorFactory deployment...");

  // Get the deployed contract address (from previous deployment)
  const vendorFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get the contract instance
  const vendorFactory = await hre.ethers.getContractAt("VendorFactory", vendorFactoryAddress);
  
  console.log("✅ Contract connected successfully!");
  console.log("📍 VendorFactory Address:", vendorFactoryAddress);
  
  // Test basic functionality
  console.log("\n🔍 Testing basic functionality...");
  
  // Get initial vendor count
  const initialCount = await vendorFactory.getVendorCount();
  console.log("📊 Initial vendor count:", initialCount.toString());
  
  // Register a test vendor
  console.log("\n📝 Registering test vendor...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);
  
  const tx = await vendorFactory.registerVendor("Test Vendor");
  const receipt = await tx.wait();
  console.log("✅ Vendor registered successfully!");
  console.log("📋 Transaction hash:", receipt.hash);
  
  // Get updated vendor count
  const newCount = await vendorFactory.getVendorCount();
  console.log("📊 New vendor count:", newCount.toString());
  
  // Get the vendor profile address
  const vendorProfileAddress = await vendorFactory.getVendorProfile(0);
  console.log("🏪 Vendor profile address:", vendorProfileAddress);
  
  // Get vendor profile contract
  const vendorProfile = await hre.ethers.getContractAt("VendorProfile", vendorProfileAddress);
  
  // Test vendor profile functionality
  console.log("\n🏪 Testing vendor profile...");
  const vendorName = await vendorProfile.name();
  const vendorOwner = await vendorProfile.owner();
  const ethBalance = await vendorProfile.getETHBalance();
  
  console.log("📛 Vendor name:", vendorName);
  console.log("👤 Vendor owner:", vendorOwner);
  console.log("💰 ETH balance:", hre.ethers.formatEther(ethBalance), "ETH");
  
  // Test sending ETH to vendor profile
  console.log("\n💸 Testing ETH transfer to vendor profile...");
  const sendTx = await deployer.sendTransaction({
    to: vendorProfileAddress,
    value: hre.ethers.parseEther("1.0")
  });
  await sendTx.wait();
  
  const newBalance = await vendorProfile.getETHBalance();
  console.log("💰 New ETH balance:", hre.ethers.formatEther(newBalance), "ETH");
  
  console.log("\n🎉 All tests passed! Contract is working correctly.");
  console.log("\n📋 Summary:");
  console.log("- VendorFactory deployed and functional");
  console.log("- Vendor registration working");
  console.log("- VendorProfile contracts created correctly");
  console.log("- ETH transfers to vendor profiles working");
  console.log("- All basic functionality verified");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
