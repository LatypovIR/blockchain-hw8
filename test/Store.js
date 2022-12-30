const { ethers } = require('hardhat')
const { expect } = require('chai')

const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const HASH = 'randomHASH'

describe('Store contract', function () {
    async function deployStore() {
        const [user] = await ethers.getSigners()
        const Store = await ethers.getContractFactory('Store')
        const contract = await Store.deploy()
        await contract.deployed()

        return { contract, user }
    }

    it('Deployment',
        async function () {
            await loadFixture(deployStore)
        })

    it('Success save and get file hash',
        async function () {
            const { contract, user } = await loadFixture(deployStore)            
            await contract.connect(user).setFile(HASH)
            expect(await contract.connect(user).getFile()).to.equal(HASH)
        })

    it('Produce event on hash saving',
        async function () {
            const { contract, user } = await loadFixture(deployStore)
            await expect(contract.connect(user).setFile(HASH))
                .to.emit(contract, "FileAdded")
                .withArgs(user.address, HASH)
        })
        
    it('No files for new users',
    async function () {
        const { contract, user } = await loadFixture(deployStore)
        expect(await contract.connect(user).getFile()).to.equal('')
    })

    it('Success save and get on hash re-saving',
    async function () {
        const { contract, user } = await loadFixture(deployStore)
        await expect(contract.connect(user).setFile(HASH))
            .to.emit(contract, "FileAdded")
            .withArgs(user.address, HASH)
        expect(await contract.connect(user).getFile()).to.equal(HASH)

        const HASH2 = 'randomHASH2'
        await expect(contract.connect(user).setFile(HASH2))
            .to.emit(contract, "FileAdded")
            .withArgs(user.address, HASH2)
        expect(await contract.connect(user).getFile()).to.equal(HASH2)
    })

})