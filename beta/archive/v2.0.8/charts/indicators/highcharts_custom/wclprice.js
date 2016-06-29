define(["indicator_base","highstock"],function(a){function b(b,c,d,e){var f=0;if(!a.isOHLCorCandlestick(e))throw new Error("This indicator is only for OHLC charts!");return f=a.extractPriceForAppliedTO(d,b,c)}function c(c,d,e){var f=b(c,d,a.CLOSE,e),g=b(c,d,a.HIGH,e),h=b(c,d,a.LOW,e);return(2*f+g+h)/4}var d={},e={};return{init:function(){!function(a,b,f){function g(a,b){{var g=this;g.chart}for(var h in e)if(e[h]&&e[h].options&&e[h].options.data&&e[h].options.data.length>0&&d[h].parentSeriesID===g.options.id){var i=g.options.data,j=(d[h],f.findIndexInDataForTime(i,a));if(j>=1){var k=c(i,j,this.options.type);b&&e[h].options.data.length>=i.length?e[h].data[j].update({y:f.toFixed(k,4)}):e[h].addPoint([i[j].x||i[j][0],f.toFixed(k,4)],!0,!0,!1)}}}a&&!a.Series.prototype.addWCLPRICE&&(a.Series.prototype.addWCLPRICE=function(a){var g=this.options.id;a=b.extend({strokeColor:"red",strokeWidth:1,dashStyle:"line",parentSeriesID:g},a);var h="_"+(new Date).getTime(),i=this.options.data||[];if(i&&i.length>0){for(var j=[],k=0;k<i.length;k++){var l=c(i,k,this.options.type);j.push([i[k].x||i[k][0],f.toFixed(l,4)])}var m=this.chart;d[h]=a;var n=this;e[h]=m.addSeries({id:h,name:"WCLPRICE",data:j,type:"line",dataGrouping:n.options.dataGrouping,opposite:n.options.opposite,color:a.strokeColor,lineWidth:a.strokeWidth,dashStyle:a.dashStyle,compare:n.options.compare},!1,!1),b(e[h]).data({onChartIndicator:!0,indicatorID:"wclprice",isIndicator:!0,parentSeriesID:a.parentSeriesID}),m.redraw()}},a.Series.prototype.removeWCLPRICE=function(a){var b=this.chart;d[a]=null,b.get(a).remove(!1),e[a]=null,b.redraw()},a.Series.prototype.preRemovalCheckWCLPRICE=function(a){return{isMainIndicator:!0,isValidUniqueID:null!=d[a]}},a.wrap(a.Series.prototype,"addPoint",function(a,b,c,e,h){a.call(this,b,c,e,h),f.checkCurrentSeriesHasIndicator(d,this.options.id)&&g.call(this,b[0])}),a.wrap(a.Point.prototype,"update",function(a,b,c,e){a.call(this,b,c,e),f.checkCurrentSeriesHasIndicator(d,this.series.options.id)&&g.call(this.series,this.x,!0)}))}(Highcharts,jQuery,a)}}});