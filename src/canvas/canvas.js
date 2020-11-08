export default class CanvasChart {
    constructor(canvas, data) {
        if (canvas && data) {
            this.ctx = canvas.getContext("2d");
            this.crypt = data.currentCrypt;
            this.info = data.chartData;
            this.timeArr = [];
            this.init(canvas)
        }
    }

    init(canvas) {
        this.params = {
            w: canvas.width,
            h: canvas.height,
            pt: 120,
            pb: 100,
            pl: 120,
            pr: 120,
            m: 50,
            yDevideCount: 10
        };


        this.setText();
        this.render();
    }

    setText() {
        this.ctx.font = 'bold 20px serif';
        this.ctx.fillText(`CryptoCompare Index Bitcoin (${this.crypt}) - USDT Historical Price`, this.params.w / 2, 50);
        this.ctx.save();
        this.ctx.translate(50, this.params.h / 2);
        this.ctx.rotate(-0.5 * Math.PI);
        this.ctx.fillText(`USDT`, 0, 0);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.fillText(`DATE`, (this.params.w + this.params.pl - this.params.pr) / 2, this.params.h - 20);
        this.ctx.restore();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.params.w, this.params.h);
    }

    renderX() {
        let stepX = (this.params.w - this.params.pl - this.params.pr) / (this.info.length - 1);
        this.drowLine(this.params.pl, this.params.h - this.params.pb, this.params.w - this.params.pr, this.params.h - this.params.pb);
        for (let i = 0; i < this.info.length; i++) {
            this.timeArr.push(new Date(this.info[i].time * 1000));
            if (i !== 0) {
                this.drowLine(this.params.pl + stepX * i, this.params.h - this.params.pb - 3, this.params.pl + stepX * i, this.params.h - this.params.pb + 3);
            }
            this.ctx.textAlign = "center";
            this.ctx.fillText(`${this.timeArr[i].getDate()}.${this.timeArr[i].getMonth() + 1}`, this.params.pl + stepX * i, this.params.h - this.params.pb + 20)
        }
    }

    drowLine(startx, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startx, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    renderY() {
        this.drowLine(this.params.pl, this.params.h - this.params.pb, this.params.pl, this.params.pt);
        let stepY = (this.params.h - this.params.pb - this.params.pt) / (this.params.yDevideCount - 1);
        let shiftPrice = (this.getMaxPrice() - this.getMinPrice()) / (this.params.yDevideCount - 1);
        for (let i = 0; i < this.params.yDevideCount; i++) {
            if (i !== 0) {
                this.drowLine(this.params.pl - 3, (this.params.h - this.params.pb) - stepY * i, this.params.pl + 3, (this.params.h - this.params.pb) - stepY * i);
            }
            this.ctx.textAlign = "center";
            let price = this.getMinPrice() + shiftPrice * i < 1 ? (this.getMinPrice() + shiftPrice * i).toFixed(2) : (this.getMinPrice() + shiftPrice * i).toFixed(1);
            this.ctx.fillText(price, this.params.pl - 25, (this.params.h - this.params.pb) - stepY * i)
        }
    }

    getMaxPrice() {
        let max = 0;
        for (let i = 0; i < this.info.length; i++) {
            if (this.info[i].close > max) {
                max = this.info[i].close
            }
        }
        return max
    }

    renderGraph() {
        for (let i = 0; i < this.info.length; i++) {
            if (this.info[i + 1]) {
                let startX = (this.info[i].time - this.info[0].time) * (this.params.w - this.params.pl - this.params.pr) / (this.info[this.info.length - 1].time - this.info[0].time) + this.params.pl;
                let startY = this.params.h - this.params.pb - (this.info[i].close - this.getMinPrice()) * (this.params.h - this.params.pb - this.params.pt) / (this.getMaxPrice() - this.getMinPrice());
                let endX = (this.info[i + 1].time - this.info[0].time) * (this.params.w - this.params.pl - this.params.pr) / (this.info[this.info.length - 1].time - this.info[0].time) + this.params.pl;
                let endY = this.params.h - this.params.pb - (this.info[i + 1].close - this.getMinPrice()) * (this.params.h - this.params.pt - this.params.pb) / (this.getMaxPrice() - this.getMinPrice());
                this.ctx.save();
                this.ctx.strokeStyle = '#ff0000';
                this.drowLine(startX, startY, endX, endY);
                this.ctx.restore()
            }
        }
    }

    getMinPrice() {
        let min = Infinity;
        for (let i = 0; i < this.info.length; i++) {
            if (this.info[i].close < min) {
                min = this.info[i].close
            }
        }
        return min
    }

    render() {
        this.ctx.font = '10px serif';
        this.renderX();
        this.renderY();
        this.renderGraph()
    }


}