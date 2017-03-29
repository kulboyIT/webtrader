﻿/**
 * Created by amin on October 15,2015.
 */

/**
    Key is instrumentCode+timePeriod(in seconds), Value is
        {
            timerHandler : ,
            chartIDs : [
                {
                    containerIDWithHash : containerIDWithHash,
                    series_compare : series_compare,
                    instrumentCode : instrumentCode,
                    instrumentName : instrumentName
                }
            ]
        }
**/
import loki from 'lokijs';
import _ from 'lodash';
import $ from 'jquery';
import liveapi from 'websockets/binary_websockets';
import 'jquery-growl';
import 'common/util';

const db = new loki();
export const barsTable = db.addCollection('bars_table');
// TODO: add common tasks for chartingRequestMap to this module
//       move code from charts.js, ohlc_handler.js, stream_handler.js and symbol_handler.js


export const barsLoaded = function(instrumentCdAndTp) {

    const key = instrumentCdAndTp;
    if (!this[key] || !this[key].chartIDs) return;

    const chartIDList = this[key].chartIDs;
    const processOHLC = this.processOHLC;

    for(let i =0;i<chartIDList.length;i++){
        let chartID = chartIDList[i];
        if (!chartID) return;
        if (!$(chartID.containerIDWithHash).highcharts()) return;
        const series = $(chartID.containerIDWithHash).highcharts().get(key),
            type = $(chartID.containerIDWithHash).data('type'),
            timePeriod = $(chartID.containerIDWithHash).data('timePeriod');

        if (series) { //Update mode

            const lastBarOpenTime = series.data[series.data.length - 1] && (series.data[series.data.length - 1].x || series.data[series.data.length - 1].time);
            if(!lastBarOpenTime) return;
            const db_bars = barsTable
                .chain()
                .find({ instrumentCdAndTp: key })
                .where((obj) => {
                    return obj.time >= lastBarOpenTime;
                })
                .simplesort('time', false).data();

            for (let index in db_bars) {
                const dbBar = db_bars[index];
                //If the bar already exists, then update it, else add a new bar
                let foundBar = undefined;
                for (let indx = series.data.length - 1; indx >= 0; indx--) {
                    const value = series.data[indx];
                    if (value && dbBar.time == (value.x || value.time)) {
                        foundBar = value;
                        break;
                    }
                }
                if (foundBar) {
                    if (type && isDataTypeClosePriceOnly(type)) {
                        foundBar.update([dbBar.time, dbBar.close], false);
                    } else {
                        foundBar.update([dbBar.time, dbBar.open, dbBar.high, dbBar.low, dbBar.close], false);
                    }
                } else {
                    if (type && isDataTypeClosePriceOnly(type)) {
                        series.addPoint([dbBar.time, dbBar.close], false, true);
                    } else {
                        series.addPoint([dbBar.time, dbBar.open, dbBar.high, dbBar.low, dbBar.close], false, true);
                    }
                }
            }
            //We have to mark it dirty because for OHLC, Highcharts leave some weird marks on chart that do not belong to OHLC
            series.isDirty = true;
            series.isDirtyData = true;
            series.chart.redraw();

        } else {

            //First time rendering
            const chart = $(chartID.containerIDWithHash).highcharts();
            //We just want to get bars which are after the last complete rendered bar on chart(excluding the currently forming bar because that might change its values)
            const dataInHighChartsFormat = [];

            const db_bars = barsTable
                .chain()
                .find({ instrumentCdAndTp: key })
                .simplesort('time', false)
                .data();
            for (const barIndex in db_bars) {
                processOHLC(db_bars[barIndex].open, db_bars[barIndex].high, db_bars[barIndex].low, db_bars[barIndex].close,
                    db_bars[barIndex].time, type, dataInHighChartsFormat);
            }

            if (!chart || dataInHighChartsFormat.length === 0) return;

            //set the range
            let numberOfBarsToShow = 30;
            if (isTick(timePeriod)) numberOfBarsToShow = 200;
            const totalLength = dataInHighChartsFormat.length;
            const endIndex = dataInHighChartsFormat.length > numberOfBarsToShow ? totalLength - numberOfBarsToShow : 0;

            const instrumentName = chartID.instrumentName;
            const series_compare = chartID.series_compare;

            //Find out how many instrument series are loaded on chart
            let countInstrumentCharts = 0;
            chart.series.forEach((series) => {
                if (series.options.isInstrument && series.options.id !== "navigator") {
                    ++countInstrumentCharts;
                }
            });
            if (countInstrumentCharts === 0) {
                chart.xAxis[0].range = dataInHighChartsFormat[totalLength - 1][0] - dataInHighChartsFormat[endIndex][0]; //show 30 bars
            }

            const seriesConf = {
                id: key,
                name: instrumentName,
                data: dataInHighChartsFormat,
                type: type ? type : 'candlestick', //area, candlestick, line, areaspline, column, ohlc, scatter, dot, linedot
                dataGrouping: {
                    enabled: false
                },
                compare: series_compare,
                states: {
                    hover: {
                        enabled: false
                    }
                },
                isInstrument: true //Its our variable
            };
            if (isLineDotType(type) || isDotType(type)) {
                seriesConf.type = 'line';
                if (isDotType(type)) {
                    seriesConf.dashStyle = 'dot';
                }
                seriesConf.marker = {
                    enabled: !isDotType(type),
                    radius: 4
                };
            }
            chart.addSeries(seriesConf);

        }

    };

}

export const processOHLC = (open, high, low, close, time, type, dataInHighChartsFormat) => {
    //Ignore if last known bar time is greater than this new bar time
    if (dataInHighChartsFormat.length > 0 && dataInHighChartsFormat[dataInHighChartsFormat.length - 1][0] > time) return;

    if (type && isDataTypeClosePriceOnly(type)) {
        if (!$.isNumeric(time) || !$.isNumeric(close)) return;
        dataInHighChartsFormat.push([time, close]);
    } else {
        if (!$.isNumeric(time) || !$.isNumeric(open) || !$.isNumeric(high) || !$.isNumeric(low) || !$.isNumeric(close)) return;
        dataInHighChartsFormat.push([time, open, high, low, close]);
    }
}

export const keyFor = (symbol, granularity_or_timeperiod) => {
    let granularity = granularity_or_timeperiod || 0;
    if (typeof granularity === 'string') {
        granularity = convertToTimeperiodObject(granularity).timeInSeconds();
    }
    return (symbol + granularity).toUpperCase();
}

/*  options: {
      symbol,
      granularity: // could be a number or a string in 1t, 2m, 3h, 4d format.
                   // if a string is present it will be converted to seconds
      subscribe: // default = 1,
      style: // default = 'ticks',
      count: // default = 1,
      adjust_start_time?: // only will be added to the request if present
    }
    will return a promise
*/


export const register = function(options) {
    const map = this;
    const key = map.keyFor(options.symbol, options.granularity);

    let granularity = options.granularity || 0;
    //If granularity = 0, then style should be ticks
    const style = (granularity == 0 || !options.style) ? 'ticks' : options.style;

    let is_tick = true;
    if (typeof granularity === 'string') {
        if ($.trim(granularity) == '0') {} else if ($.trim(granularity).toLowerCase() == '1t') {
            granularity = convertToTimeperiodObject(granularity).timeInSeconds();
        } else {
            is_tick = false;
            granularity = convertToTimeperiodObject(granularity).timeInSeconds();
        }
    }

    const req = {
        "ticks_history": options.symbol,
        "granularity": granularity,
        "count": options.count || 1,
        "end": 'latest',
        "style": style
    };
    if (options.subscribe === 1) {
        req.subscribe = 1;
    }

    if (!is_tick) {
        const count = options.count || 1;
        let start = (new Date().getTime() / 1000 - count * granularity) | 0;

        //If the start time is less than 3 years, adjust the start time
        const _3YearsBack = new Date();
        _3YearsBack.setUTCFullYear(_3YearsBack.getUTCFullYear() - 3);
        //Going back exactly 3 years fails. I am adding 1 day
        _3YearsBack.setDate(_3YearsBack.getDate() + 1);

        if ((start * 1000) < _3YearsBack.getTime()) { start = (_3YearsBack.getTime() / 1000) | 0; }

        req.style = 'candles';
        req.start = start;
        req.adjust_start_time = options.adjust_start_time || 1;
    }

    map[key] = { symbol: options.symbol, granularity: granularity, subscribers: 0, chartIDs: [] };
    if (req.subscribe) map[key].subscribers = 1; // how many charts have subscribed for a stream
    return liveapi.send(req, /*timeout:*/ 30 * 1000) // 30 second timeout
        .catch((up) => {
            /* if the market is closed try the same request without subscribing */
            if (req.subscribe && up.code == 'MarketIsClosed') {
                $.growl.notice({ message: options.symbol + ' market is presently closed.'.i18n() });
                delete req.subscribe;
                map[key].subscribers -= 1;
                return liveapi.send(req, 30 * 1000);
            }
            delete map[key];
            throw up;
        });
}

/* use this method if there is already a stream with this key registered,
  if you are counting on a registered stream and don't call this method that stream might be removed,
  when all dependent modules call unregister function.
  you should also make sure to call unregister when you no longer need the stream to avoid "stream leack!" */
export const subscribe = function(key, chartID) {
    const map = this;
    if (!map[key]) {
        return;
    }
    map[key].subscribers += 1;
    if (chartID) {
        map[key].chartIDs.push(chartID);
    }
}

export const unregister = function(key, containerIDWithHash, instrument) {
    const map = this;
    if (!map[key]) {
        return;
    }
    if (containerIDWithHash) {
        _.remove(map[key].chartIDs, { containerIDWithHash: containerIDWithHash });
    }
    map[key].subscribers -= 1;
    if (map[key].chartIDs.length === 0 && map[key].timerHandler) {
        clearInterval(map[key].timerHandler);
        map[key].timerHandler = null;
    }
    /* Remove the following code if backend fixes this issue: 
     * https://trello.com/c/1IZRihrH/4662-1-forget-call-for-one-stream-id-affects-all-other-streams-with-the-same-symbol
     * Also remove instrument from function argument list.
     * Files changed: "charts.es6"(destroy())
     */
    //-----Start-----//
    instrument = instrument || $(containerIDWithHash).data("instrumentCode");
    const tickSubscribers = map[map.keyFor(instrument, 0)] && map[map.keyFor(instrument, 0)].subscribers;
    //-----End-----//
    if (map[key].subscribers === 0 && map[key].id) { /* id is set in stream_handler.js */
        liveapi.send({ forget: map[key].id })
            // Remove this part as well.
            .then(()=>{
                // Resubscribe to tick stream if there are any tickSubscribers.
                if(tickSubscribers)
                    map.register({
                        symbol: instrument,
                        granularity: 0,
                        subscribe: 1,
                        count: 50 // To avoid missing any ticks.
                    });
            })
            .catch((err) => { console.error(err); });
    }
    if (map[key].subscribers === 0) {
        delete map[key];
    }
}

/* this will be use for charts.drawCharts method which wants to : Just make sure that everything has been cleared out before starting a new thread! */
export const removeChart = function(key, containerIDWithHash) {
    const map = this;
    if (!map[key]) return;
    if (_(map[key].chartIDs).map('containerIDWithHash').includes(containerIDWithHash)) {
        map[key].subscribers -= 1;
        _.remove(map[key].chartIDs, { containerIDWithHash: containerIDWithHash });
    }
}

export const digits_after_decimal = function(pip, symbol) {
    pip = pip && pip + '';
    if (!pip) {
        console.warn();
        ('pip value is invalid', pip);
        /**
         * This is disaster. If pip value is invalid, then it could several trade related issues.
         * Try to guess decimal places from whatever data we have from local database
         * (This is a fallback method. the execution never come here)
         * Technique -
         *      Fetch last 10 tick values
         *      Take the maximum decimal places all these ticks
         */
        const key = this.keyFor(symbol, 0);
        let decimal_digits = 0;
        barsTable.chain()
            .find({ instrumentCdAndTp: key })
            .simplesort("time", true).limit(10).data()
            .forEach((d) => {
                const quote = d.close + '';
                const len = quote.substring(quote.indexOf('.') + 1).length;
                if (len > decimal_digits)
                    decimal_digits = len;
            });
        return decimal_digits;
    }
    return pip.substring(pip.indexOf(".") + 1).length;
}

export default {
    barsLoaded,
    processOHLC,
    keyFor,
    barsTable,
    register,
    subscribe,
    unregister,
    removeChart,
    digits_after_decimal
}
