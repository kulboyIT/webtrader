define(["exports","jquery","moment","./lookback","../charts/chartingRequestMap","../charts/chartSettings","../websockets/binary_websockets","../common/rivetsExtra","text!../trade/tradeConf.html","../common/util","css!../trade/tradeConf.css"],function(a,b,c,d,e,f,g,h,i){"use strict";function j(a){return a&&a.__esModule?a:{"default":a}}function k(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}Object.defineProperty(a,"__esModule",{value:!0}),a.init=void 0;var l=j(b),m=j(c),n=j(d),o=j(e),p=j(g),q=j(h),r=j(i),s=["start_time","barrier","end_time"];q["default"].binders["tick-chart"]={priority:65,bind:function(a){var b=this.model;a.chart=new Highcharts.Chart({subtitle:{text:f.getLabelEl(s),useHTML:!0},title:"",credits:{enabled:!1},chart:{type:"line",renderTo:a,backgroundColor:null,width:400,height:144,marginLeft:20,marginTop:35,marginBottom:15},tooltip:{useHTML:!0,formatter:function(){var a=b.array[this.x-1];return a&&a.tooltip?"<div class='tooltip-body'>"+a.tooltip+"</div>":void 0}},xAxis:{type:"linear",min:1,max:1*a.getAttribute("tick-count")+1,labels:{enabled:!1}},yAxis:{labels:{align:"left",x:0,formatter:function(){return addComma(this.value,b.display_decimals)}},title:"",gridLineWidth:0},series:[{data:[]},{type:"scatter",marker:{enabled:!1},data:[]}],plotOptions:{scatter:{enableMouseTracking:!1}},exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1}})},routine:function(a,b){function c(b,c){var d=c.findIndex(function(a){return a.epoch===+b.exit_tick_time});g(a.chart,{value:d+1,dashStyle:"Dash"})}function d(c){var d=b[c-1];a.chart.series[0].addPoint([c,d.quote])}function e(b){g(a.chart,{value:b})}function f(b){a.chart.yAxis[0].removePlotLine(b.id),h(a.chart,b)}function g(a,b){a.xAxis[0].addPlotLine({value:b.value,id:b.id||b.value,color:b.color||"#e98024",width:b.width||2,dashStyle:b.dashStyle||!1})}function h(a,b){a.yAxis[0].addPlotLine({id:b.id,value:b.value,color:"green",width:2}),a.series[1].addPoint([1,1*b.value])}var i=this.model,j=b.length,k=i.makeBarrier(),l=i.contract_is_finished;return k&&f(k),l?void c(i,b):void(0!==j&&(d(j),1===j&&e(j)))}};var t=function(a,b){function c(c){function d(c){var d=m["default"].utc(1e3*c.epoch).format("dddd, MMM D, HH:mm:ss"),e=b.symbol_name,f=addComma(+c.quote,a.ticks.display_decimals);return d+"<br/>"+e+" "+f}var e=d(c);a.ticks.array.push({quote:+c.quote,epoch:+c.epoch,number:a.ticks.array.length+1,tooltip:e})}function d(){var b=a.ticks.array.slice();a.ticks.array=[].concat(k(b))}function e(a,c){p["default"].send({ticks_history:c,end:"latest",start:a,style:"ticks",count:5e3}).then(function(a){s=!1,a.history.prices.forEach(function(c,d){q.push({epoch:a.history.times[d],quote:c,symbol:b.symbol})}),q.sort(function(a,b){return+a.epoch-+b.epoch})})["catch"](function(){return l["default"].growl.error({message:data.error.message})})}var f=void 0,g=void 0,h=void 0,i=!1,j=b.tick_count,n=function(b){var e=+b.epoch>=+f.entry_tick_time,g=!a.ticks.array.some(function(a){return a.epoch===+b.epoch}),h=g&&!a.ticks.contract_is_finished&&e;if(h){var k="open"!==f.status&&(-1>j||i);a.buy.barrier=f.barrier?+f.barrier:null,k&&(o(f),d()),j--,j>-1&&(i=b.epoch>=f.exit_tick_time?!0:!1,c(b))}},o=function(c){function d(){var a=b.contract_id;p["default"].events.off("proposal_open_contract",g),p["default"].events.off("tick",h),p["default"].proposal_open_contract.forget(a)}d(),a.ticks.contract_is_finished=!0,a.ticks.exit_tick_time=c.exit_tick_time?c.exit_tick_time:null,a.ticks.status=c.status,a.buy.update(),a.back.visible=!0};g=p["default"].events.on("proposal_open_contract",function(a){var c=a.proposal_open_contract.contract_id!==b.contract_id;if(!c)return a.error?void t(a):void(f=a.proposal_open_contract)});var q=[],r=void 0,s=!1;h=p["default"].events.on("tick",function(a){var c=b.symbol!==a.tick.symbol;if(!c){r||(r=a.tick.epoch);var d=f&&f.entry_tick_time;if(!d)return void q.push(a.tick);var g=r>d;if(g&&(s=!0,r=d,e(d,b.symbol)),s)return void q.push(a.tick);q.length>0&&(q.forEach(function(a){return n(a)}),q=[]),n(a.tick)}});var t=function(a){l["default"].growl.error({message:a.error.message}),p["default"].proposal_open_contract.forget(a.echo_req.contract_id),p["default"].proposal_open_contract.subscribe(a.echo_req.contract_id)}},u=a.init=function(a,b,c,d){var e=o["default"].digits_after_decimal(b.pip,b.symbol),f=l["default"](r["default"]).i18n(),g=a.buy,h={title:{text:"Contract Confirmation".i18n()},buy:{barrier:null,message:g.longcode,balance_after:g.balance_after,buy_price:(+g.buy_price).toFixed(currencyFractionalDigits()),purchase_time:g.purchase_time,start_time:g.start_time,transaction_id:g.transaction_id,payout:(+g.payout).toFixed(currencyFractionalDigits()),currency:b.currency,potential_profit:(g.payout-g.buy_price).toFixed(currencyFractionalDigits()),potential_profit_text:"Profit".i18n(),show_result:!1},spreads:{amount_per_point:g.amount_per_point||"0",stop_loss_level:g.stop_loss_level||"0",stop_profit_level:g.stop_profit_level||"0"},ticks:{array:[],contract_is_finished:!1,display_decimals:e,exit_tick_time:null,is_path_dependent:null,makeBarrier:function(){var a=h.buy.barrier;return a?{value:+a}:null},tick_count:b.tick_count,value:(b.digits_value||"0")+"",category:b.category,category_display:b.category_display,status:"waiting",chart_visible:b.show_tick_chart},arrow:{visible:!b.show_tick_chart&&"digits"!==b.category.contract_category},back:{visible:!1}};n["default"].isLookback(b.category_display.contract_type)&&(h.buy.payout=n["default"].formula(b.category_display.contract_type,b.amount),h.buy.potential_profit=void 0),h.buy.update=function(){var a=h.ticks.status;h.title.text={waiting:"Contract Confirmation".i18n(),won:"This contract won".i18n(),lost:"This contract lost".i18n()}[a],"lost"===a&&(h.buy.potential_profit=(-h.buy.buy_price).toFixed(currencyFractionalDigits()),h.buy.payout=0..toFixed(currencyFractionalDigits()),h.buy.potential_profit_text="Lost"),"won"===a&&(h.buy.balance_after=1*g.balance_after+1*h.buy.payout,p["default"].sell_expired()),h.buy.show_result=!0},h.back.onclick=function(){return d(f)},h.arrow.onclick=function(a){var c=l["default"](a.target);c.hasClass("disabled")||(c.addClass("disabled"),require(["viewtransaction/viewTransaction"],function(a){a.init(b.contract_id,b.transaction_id).then(function(){return c.removeClass("disabled")})}))};q["default"].bind(f[0],h);h.arrow.visible?h.back.visible=!0:t(h,b),c(f)};a["default"]={init:u}});