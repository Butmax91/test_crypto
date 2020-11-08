import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        list: [],
        perPage: 20,
        currency: "USD",
        dayCount: 10,
        currentCrypt: null,
        chartData: [],
        loading: false,
        socket: null,
        activeCurrencyPrice: 0


    },
    getters: {
        getExchanges: state => state.list,
        getCurrentCrypt: state => state.currentCrypt,
        getCurrency: state => state.currency,
        getChartData: state => state.chartData,
        getLoading: state => state.loading,
        getSocket: state => state.socket,
        getActiveCurrencyPrice: state => state.activeCurrencyPrice

    },
    mutations: {
        setActiveCurrencyPrice: (state, data) => {
            state.activeCurrencyPrice = data
        },
        setActiveCurrencyPriceInExchanges: (state, data) => {
            try {
                state.list.find((el) => {
                    return el.CoinInfo.Id === data.CoinInfo.Id
                }).DISPLAY[state.currency].PRICE = data.DISPLAY[state.currency].PRICE
            } catch (e) {
                console.log(e);
            }

        },
        loadExchanges: (state, data) => {
            state.list = data.Data;
            state.currentCrypt = data.Data[0].CoinInfo.Name
        },
        updateCurrentCrypt: (state, data) => {
            state.currentCrypt = data
        },
        loadDailyPair: (state, data) => {
            state.chartData = data.Data
        },
        updateLoading: (state, data) => {
            state.loading = data
        },
        setSocket: (state, data) => {
            state.socket = data
        },

    },
    actions: {
        loadExchanges({commit, state, dispatch}) {
            commit("updateLoading", true);
            let config = {
                Apikey: '78aa2882f2b8c76bb473bec5c4a6a528f379295355dc1871543bba2192b69d23',
                params: {
                    limit: state.perPage,
                    tsym: state.currency
                },
            };
            axios.get(`https://min-api.cryptocompare.com/data/top/totalvolfull`, config)
                .then(r => {
                    commit("loadExchanges", r.data);
                    dispatch('loadDailyPair')
                })

        },
        loadDailyPair({commit, state}) {
            axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
                Apikey: '78aa2882f2b8c76bb473bec5c4a6a528f379295355dc1871543bba2192b69d23',
                params: {
                    limit: state.dayCount,
                    fsym: state.currentCrypt,
                    tsym: state.currency
                }
            })
                .then(r => {
                    commit("loadDailyPair", r.data.Data)
                    commit("updateLoading", false);
                })

        },
        loadSomeInfo({commit, getters}) {
            let apiKey = "78aa2882f2b8c76bb473bec5c4a6a528f379295355dc1871543bba2192b69d23";
            if (getters.getSocket) {
                getters.getSocket.close()
            }
            let ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey);
            commit('setSocket', ccStreamer);

            ccStreamer.onopen = function onStreamOpen() {
                let subRequest = {
                    "action": "SubAdd",
                    "subs": [`0~Coinbase~${getters.getCurrentCrypt}~${getters.getCurrency}`]
                };
                ccStreamer.send(JSON.stringify(subRequest));
            };

            ccStreamer.onmessage = function onStreamMessage(message) {
                if (message.data) {
                    commit('setActiveCurrencyPrice', JSON.parse(message.data).P)
                }
            }
        }

    },
    modules: {}
})
