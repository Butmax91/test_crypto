<template>
    <table>
        <thead>
        <tr>
            <td>img</td>
            <td>coin</td>
            <td>price</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for=" item in getAllExchanges" :key="item.id" @click="handleClick(item)"
            :class="item.CoinInfo.Name ===getCurrentCrypt? 'active': ''">
            <td><img :src="'https://www.cryptocompare.com/' +item.CoinInfo.ImageUrl" :alt="item.Name" width="30"
                     height="30"></td>
            <td>{{item.CoinInfo.Name}}</td>
            <td>{{item.CoinInfo.Name === getCurrentCrypt && getActiveCurrencyPrice ? "$ "+ getActiveCurrencyPrice :item.DISPLAY[getCurrency].PRICE}}</td>
        </tr>
        </tbody>

    </table>

</template>

<script>
    export default {
        name: 'Table',
        methods: {
            handleClick(item) {
                this.$store.commit('updateCurrentCrypt', item.CoinInfo.Name);
                this.$store.commit('setActiveCurrencyPriceInExchanges',item);
                this.$store.dispatch('loadDailyPair');
                this.$store.dispatch('loadSomeInfo');

            }
        },
        computed: {
            getAllExchanges() {
                return this.$store.getters.getExchanges
            },
            getCurrentCrypt() {
                return this.$store.getters.getCurrentCrypt
            },
            getCurrency() {
                return this.$store.getters.getCurrency
            },
            getActiveCurrencyPrice () {
                return this.$store.getters.getActiveCurrencyPrice
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    table {
        width: 400px;
        display: flex;
        flex-direction: column;
        tr {
            display: flex;
            cursor: pointer;
            //border-bottom: 1px solid rgba(0, 188, 188, 0.3);

            &.active {
                background: #ebebeb;
            }

            td {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px 7px;
                border: 1px solid #ababab;
            }
        }
    }
</style>
