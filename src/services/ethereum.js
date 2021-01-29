import { ethers } from 'ethers';
import faucetDefinition from '~/artifacts/contracts/Faucet.sol/Faucet.json';
import detectEthereumProvider from '@metamask/detect-provider';

const gasLimit = 100000;
const gasPrice = ethers.utils.parseUnits('9', 'gwei');
const txDefaults = {
    gasLimit,
    gasPrice,
};

const address = process.env.VUE_APP_DEPLOYED_CONTRACT_ADDRESS;

let EthService = {
    faucet_balance: null,
    balance: null,
    signer: null,
    provider: null,
    faucet: null,

    async donate(amount) {
        let amount_wei = ethers.utils.parseEther(amount);
        let tx = await EthService.signer.sendTransaction({
            value: amount_wei,
            to: address,
            ...txDefaults,
        });
        return tx;
    },
    async withdraw(amount) {
        let amount_wei = ethers.utils.parseEther(amount);

        let tx = await EthService.faucet.withdraw(amount_wei, txDefaults);
        return tx;
    },
    async sync_balance() {
        EthService.signer = EthService.provider.getSigner();
        let balance = await EthService.signer.getBalance();
        EthService.balance = ethers.utils.formatEther(balance);
        console.log(EthService.balance);
    },
};

async function init() {
    const metamask_provider = await detectEthereumProvider();
    metamask_provider.on('accountsChanged', EthService.sync_balance);
    EthService.provider = new ethers.providers.Web3Provider(metamask_provider);
    EthService.signer = EthService.provider.getSigner();
    EthService.faucet = new ethers.Contract(address, faucetDefinition.abi, EthService.signer);
    EthService.faucet_balance = ethers.utils.formatEther(await EthService.provider.getBalance(address));
    await EthService.sync_balance();
}

init();

export default EthService;
