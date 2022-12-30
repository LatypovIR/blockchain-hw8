const { ethers, artifacts } = require("hardhat")

const path = require('path')
const fs = require('fs')

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploy using account:", await deployer.getAddress())
    const Store = await ethers.getContractFactory('Store')
    const store = await Store.deploy()
    await store.deployed()
    console.log("Store deployed success!")
    console.log("Store's address:", store.address)

    prepeareForFrontend(store.address)
}

function write(dir, file, data) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  fs.writeFileSync(
    path.join(dir, file),
    data
  )
}

function prepeareForFrontend(address) {
  const dir = path.join(__dirname, '..', 'frontend', 'src', 'contracts')
  const Store = artifacts.readArtifactSync("Store")

  write(dir, 'deploy-address.json', JSON.stringify({ Store: address }, undefined, 2))
  write(dir, 'Store.json', JSON.stringify(Store, null, 2))
}

main()
    .then(
        () => {
            process.exit(0);
        }
    )
    .catch(
        (message) => {
            console.error(message);
            process.exit(1);
        }
    );