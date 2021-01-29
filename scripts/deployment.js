const hre = require('hardhat');

async function deploy() {
    // Dohvati ugovor koji treba deployati - koristimo "ethers"
    // dostupan kroz hardhat

    const Faucet = await hre.ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    await faucet.deployed();

    console.log('Faucet deployed to:', faucet.address);
}

async function main() {
    try {
        await deploy();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(0);
    }
}

main(); // izvršavanje
