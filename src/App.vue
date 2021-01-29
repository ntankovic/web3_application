<template>
    <div id="app">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold leading-tight text-gray-900">
                    Faucet
                </h1>
            </div>
        </header>
        <div class="mx-auto p-4 sm:max-w-lg">
            <div v-if="EthService.balance" class="mb-4 rounded-lg p-4 bg-green-200">
                Stanje na mom računu: {{ EthService.balance | eth }} ETH
            </div>
            <t-alert variant="success" v-if="success_message" show>
                {{ success_message }}
            </t-alert>
            <t-alert variant="danger" v-if="error_message" show>
                Došlo je do greške u radu...
                {{ error_message }}
            </t-alert>
            <h2 class="my-4 text-gray-400 font-bold">Donacija</h2>
            <t-input-group label="Unesi iznos">
                <t-input class="" type="number" v-model="donation_amount"></t-input>
            </t-input-group>
            <t-button variant="error" @click="donate()" class="my-4 mx-auto min-w-full">Doniraj</t-button>
            <h2 class="mt-12 my-4 text-gray-400 font-bold">Povlačenje sredstava</h2>
            <t-input-group label="Unesi iznos">
                <t-input class="" type="number" v-model="amount"></t-input>
            </t-input-group>
            <t-button @click="withdraw()" class="my-4 mx-auto min-w-full">Povuci</t-button>
            <div v-if="EthService.faucet_balance" class="mb-4 rounded-lg p-4 bg-green-200">
                Stanje na računu Fauceta: {{ EthService.faucet_balance | eth }} ETH
            </div>
        </div>
    </div>
</template>

<script>
import EthService from '@/services/ethereum';

export default {
    name: 'App',
    data() {
        return {
            amount: '0',
            error_message: null,
            success_message: null,
            donation_amount: '0',
            EthService,
        };
    },
    methods: {
        reset_messages() {
            this.error_message = this.success_message = null;
        },
        async donate() {
            try {
                this.reset_messages();
                let tx = await EthService.donate(this.donation_amount);
                this.success_message = 'Trasakcija poslana na obradu';
                await tx.wait();
                this.success_message = 'Transakcija izvršena';
                await EthService.sync_balance();
            } catch (e) {
                console.error(e);
                this.error_message = e.message;
            }
        },
        async withdraw() {
            try {
                this.reset_messages();
                let tx = await EthService.withdraw(this.amount);
                this.success_message = 'Trasakcija poslana na obradu';
                await tx.wait();
                this.success_message = 'Transakcija izvršena';
                await EthService.sync_balance();
            } catch (e) {
                console.error(e);
                this.error_message = e.message;
            }
        },
    },
    components: {},
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
