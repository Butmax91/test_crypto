<template>
    <div class="chart">
        <canvas ref="canvas" width="800" height="600" v-if="getChartData"></canvas>
    </div>
</template>

<script>
    import CanvasChart from '../canvas/canvas'

    export default {
        name: 'chart',
        methods: {
            updateCanvas() {
                this.canvas.clearCanvas();
                this.canvas = new CanvasChart(this.$refs.canvas, {
                    chartData: this.$store.getters.getChartData,
                    currentCrypt: this.$store.getters.getCurrentCrypt
                })
            }
        },
        computed: {
            getChartData() {
                return this.$store.getters.getChartData
            },
        },
        watch: {
            getChartData() {
                this.updateCanvas()
            }
        },
        mounted() {
            this.$store.dispatch('loadDailyPair');
            this.canvas = new CanvasChart(this.$refs.canvas, {
                chartData: this.$store.getters.getChartData,
                currentCrypt: this.$store.getters.getCurrentCrypt
            })

        }
    }
</script>

<style lang="scss" scoped>
    canvas {
        border: 1px solid black;
        display: flex;
    }
</style>