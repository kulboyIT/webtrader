!function(a){"object"==typeof module&&module.exports?module.exports=a:a(Highcharts)}(function(a){!function(a){function b(a,b){this.init(a,b)}var c=a.CenteredSeriesMixin,d=a.each,e=a.extend,f=a.merge,g=a.splat;e(b.prototype,{coll:"pane",init:function(a,b){this.chart=b,this.background=[],b.pane.push(this),this.setOptions(a)},setOptions:function(a){this.options=f(this.defaultOptions,this.chart.angular?{background:{}}:void 0,a)},render:function(){var a=this.options,b=this.options.background,c=this.chart.renderer;if(this.group||(this.group=c.g("pane-group").attr({zIndex:a.zIndex||0}).add()),this.updateCenter(),b)for(b=g(b),a=Math.max(b.length,this.background.length||0),c=0;a>c;c++)b[c]?this.renderBackground(f(this.defaultBackgroundOptions,b[c]),c):this.background[c]&&(this.background[c]=this.background[c].destroy(),this.background.splice(c,1))},renderBackground:function(a,b){var c="animate";this.background[b]||(this.background[b]=this.chart.renderer.path().add(this.group),c="attr"),this.background[b][c]({d:this.axis.getPlotBandPath(a.from,a.to,a)}).attr({fill:a.backgroundColor,stroke:a.borderColor,"stroke-width":a.borderWidth,"class":"highcharts-pane "+(a.className||"")})},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",borderWidth:1,borderColor:"#cccccc",backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#ffffff"],[1,"#e6e6e6"]]},from:-Number.MAX_VALUE,innerRadius:0,to:Number.MAX_VALUE,outerRadius:"105%"},updateCenter:function(a){this.center=(a||this.axis||{}).center=c.getCenter.call(this)},update:function(a,b){f(!0,this.options,a),this.setOptions(this.options),this.render(),d(this.chart.axes,function(a){a.pane===this&&(a.pane=null,a.update({},b))},this)}}),a.Pane=b}(a),function(a){var b,c,d=a.each,e=a.extend,f=a.map,g=a.merge,h=a.noop,i=a.pick,j=a.pInt,k=a.wrap,l=a.Axis.prototype;a=a.Tick.prototype,b={getOffset:h,redraw:function(){this.isDirty=!1},render:function(){this.isDirty=!1},setScale:h,setCategories:h,setTitle:h},c={defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",minorTickWidth:1,tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,distance:15,x:0,y:null},maxPadding:0,minPadding:0,showLastLabel:!1,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},showLastLabel:!1,title:{x:4,text:null,rotation:90}},setOptions:function(a){a=this.options=g(this.defaultOptions,this.defaultRadialOptions,a),a.plotBands||(a.plotBands=[])},getOffset:function(){l.getOffset.call(this),this.chart.axisOffset[this.side]=0},getLinePath:function(a,b){a=this.center;var c=this.chart,d=i(b,a[2]/2-this.offset);return this.isCircular||void 0!==b?b=this.chart.renderer.symbols.arc(this.left+a[0],this.top+a[1],d,d,{start:this.startAngleRad,end:this.endAngleRad,open:!0,innerR:0}):(b=this.postTranslate(this.angleRad,d),b=["M",a[0]+c.plotLeft,a[1]+c.plotTop,"L",b.x,b.y]),b},setAxisTranslation:function(){l.setAxisTranslation.call(this),this.center&&(this.transA=this.isCircular?(this.endAngleRad-this.startAngleRad)/(this.max-this.min||1):this.center[2]/2/(this.max-this.min||1),this.minPixelPadding=this.isXAxis?this.transA*this.minPointOffset:0)},beforeSetTickPositions:function(){(this.autoConnect=this.isCircular&&void 0===i(this.userMax,this.options.max)&&this.endAngleRad-this.startAngleRad===2*Math.PI)&&(this.max+=this.categories&&1||this.pointRange||this.closestPointRange||0)},setAxisSize:function(){l.setAxisSize.call(this),this.isRadial&&(this.pane.updateCenter(this),this.isCircular&&(this.sector=this.endAngleRad-this.startAngleRad),this.len=this.width=this.height=this.center[2]*i(this.sector,1)/2)},getPosition:function(a,b){return this.postTranslate(this.isCircular?this.translate(a):this.angleRad,i(this.isCircular?b:this.translate(a),this.center[2]/2)-this.offset)},postTranslate:function(a,b){var c=this.chart,d=this.center;return a=this.startAngleRad+a,{x:c.plotLeft+d[0]+Math.cos(a)*b,y:c.plotTop+d[1]+Math.sin(a)*b}},getPlotBandPath:function(a,b,c){var d,e=this.center,g=this.startAngleRad,h=e[2]/2,k=[i(c.outerRadius,"100%"),c.innerRadius,i(c.thickness,10)],l=Math.min(this.offset,0),m=/%$/,n=this.isCircular;return"polygon"===this.options.gridLineInterpolation?e=this.getPlotLinePath(a).concat(this.getPlotLinePath(b,!0)):(a=Math.max(a,this.min),b=Math.min(b,this.max),n||(k[0]=this.translate(a),k[1]=this.translate(b)),k=f(k,function(a){return m.test(a)&&(a=j(a,10)*h/100),a}),"circle"!==c.shape&&n?(a=g+this.translate(a),b=g+this.translate(b)):(a=-Math.PI/2,b=1.5*Math.PI,d=!0),k[0]-=l,k[2]-=l,e=this.chart.renderer.symbols.arc(this.left+e[0],this.top+e[1],k[0],k[0],{start:Math.min(a,b),end:Math.max(a,b),innerR:i(k[1],k[0]-k[2]),open:d})),e},getPlotLinePath:function(a,b){var c,e,f,g=this,h=g.center,i=g.chart,j=g.getPosition(a);return g.isCircular?f=["M",h[0]+i.plotLeft,h[1]+i.plotTop,"L",j.x,j.y]:"circle"===g.options.gridLineInterpolation?(a=g.translate(a))&&(f=g.getLinePath(0,a)):(d(i.xAxis,function(a){a.pane===g.pane&&(c=a)}),f=[],a=g.translate(a),h=c.tickPositions,c.autoConnect&&(h=h.concat([h[0]])),b&&(h=[].concat(h).reverse()),d(h,function(b,d){e=c.getPosition(b,a),f.push(d?"L":"M",e.x,e.y)})),f},getTitlePosition:function(){var a=this.center,b=this.chart,c=this.options.title;return{x:b.plotLeft+a[0]+(c.x||0),y:b.plotTop+a[1]-{high:.5,middle:.25,low:0}[c.align]*a[2]+(c.y||0)}}},k(l,"init",function(a,d,f){var h,j=d.angular,k=d.polar,l=f.isX,m=j&&l,n=d.options,o=this.pane=d.pane[f.pane||0],p=o.options;j?(e(this,m?b:c),(h=!l)&&(this.defaultRadialOptions=this.defaultRadialGaugeOptions)):k&&(e(this,c),this.defaultRadialOptions=(h=l)?this.defaultRadialXOptions:g(this.defaultYAxisOptions,this.defaultRadialYOptions)),j||k?(this.isRadial=!0,d.inverted=!1,n.chart.zoomType=null):this.isRadial=!1,h&&(o.axis=this),a.call(this,d,f),m||!j&&!k||(a=this.options,this.angleRad=(a.angle||0)*Math.PI/180,this.startAngleRad=(p.startAngle-90)*Math.PI/180,this.endAngleRad=(i(p.endAngle,p.startAngle+360)-90)*Math.PI/180,this.offset=a.offset||0,this.isCircular=h)}),k(l,"autoLabelAlign",function(a){return this.isRadial?void 0:a.apply(this,[].slice.call(arguments,1))}),k(a,"getPosition",function(a,b,c,d,e){var f=this.axis;return f.getPosition?f.getPosition(c):a.call(this,b,c,d,e)}),k(a,"getLabelPosition",function(a,b,c,d,e,f,g,h,j){var k=this.axis,l=f.y,m=20,n=f.align,o=(k.translate(this.pos)+k.startAngleRad+Math.PI/2)/Math.PI*180%360;return k.isRadial?(a=k.getPosition(this.pos,k.center[2]/2+i(f.distance,-25)),"auto"===f.rotation?d.attr({rotation:o}):null===l&&(l=k.chart.renderer.fontMetrics(d.styles.fontSize).b-d.getBBox().height/2),null===n&&(k.isCircular?(this.label.getBBox().width>k.len*k.tickInterval/(k.max-k.min)&&(m=0),n=o>m&&180-m>o?"left":o>180+m&&360-m>o?"right":"center"):n="center",d.attr({align:n})),a.x+=f.x,a.y+=l):a=a.call(this,b,c,d,e,f,g,h,j),a}),k(a,"getMarkPath",function(a,b,c,d,e,f,g){var h=this.axis;return h.isRadial?(a=h.getPosition(this.pos,h.center[2]/2+d),b=["M",b,c,"L",a.x,a.y]):b=a.call(this,b,c,d,e,f,g),b})}(a),function(a){var b=a.each,c=a.noop,d=a.pick,e=a.Series,f=a.seriesType,g=a.seriesTypes;f("arearange","area",{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},trackByArea:!0,dataLabels:{align:null,verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},states:{hover:{halo:!1}}},{pointArrayMap:["low","high"],dataLabelCollections:["dataLabel","dataLabelUpper"],toYData:function(a){return[a.low,a.high]},pointValKey:"low",deferTranslatePolar:!0,highToXY:function(a){var b=this.chart,c=this.xAxis.postTranslate(a.rectPlotX,this.yAxis.len-a.plotHigh);a.plotHighX=c.x-b.plotLeft,a.plotHigh=c.y-b.plotTop},translate:function(){var a=this,c=a.yAxis,d=!!a.modifyValue;g.area.prototype.translate.apply(a),b(a.points,function(b){var e=b.low,f=b.high,g=b.plotY;null===f||null===e?b.isNull=!0:(b.plotLow=g,b.plotHigh=c.translate(d?a.modifyValue(f,b):f,0,1,0,1),d&&(b.yBottom=b.plotHigh))}),this.chart.polar&&b(this.points,function(b){a.highToXY(b)})},getGraphPath:function(a){var b,c,e,f,h=[],i=[],j=g.area.prototype.getGraphPath;f=this.options;var k=this.chart.polar&&!1!==f.connectEnds,l=f.step;for(a=a||this.points,b=a.length;b--;)c=a[b],c.isNull||k||a[b+1]&&!a[b+1].isNull||i.push({plotX:c.plotX,plotY:c.plotY,doCurve:!1}),e={polarPlotY:c.polarPlotY,rectPlotX:c.rectPlotX,yBottom:c.yBottom,plotX:d(c.plotHighX,c.plotX),plotY:c.plotHigh,isNull:c.isNull},i.push(e),h.push(e),c.isNull||k||a[b-1]&&!a[b-1].isNull||i.push({plotX:c.plotX,plotY:c.plotY,doCurve:!1});return a=j.call(this,a),l&&(!0===l&&(l="left"),f.step={left:"right",center:"center",right:"left"}[l]),h=j.call(this,h),i=j.call(this,i),f.step=l,f=[].concat(a,h),this.chart.polar||"M"!==i[0]||(i[0]="L"),this.graphPath=f,this.areaPath=this.areaPath.concat(a,i),f.isArea=!0,f.xMap=a.xMap,this.areaPath.xMap=a.xMap,f},drawDataLabels:function(){var a,b,c,d=this.data,f=d.length,g=[],h=e.prototype,i=this.options.dataLabels,j=i.align,k=i.verticalAlign,l=i.inside,m=this.chart.inverted;if(i.enabled||this._hasPointLabels){for(a=f;a--;)(b=d[a])&&(c=l?b.plotHigh<b.plotLow:b.plotHigh>b.plotLow,b.y=b.high,b._plotY=b.plotY,b.plotY=b.plotHigh,g[a]=b.dataLabel,b.dataLabel=b.dataLabelUpper,b.below=c,m?j||(i.align=c?"right":"left"):k||(i.verticalAlign=c?"top":"bottom"),i.x=i.xHigh,i.y=i.yHigh);for(h.drawDataLabels&&h.drawDataLabels.apply(this,arguments),a=f;a--;)(b=d[a])&&(c=l?b.plotHigh<b.plotLow:b.plotHigh>b.plotLow,b.dataLabelUpper=b.dataLabel,b.dataLabel=g[a],b.y=b.low,b.plotY=b._plotY,b.below=!c,m?j||(i.align=c?"left":"right"):k||(i.verticalAlign=c?"bottom":"top"),i.x=i.xLow,i.y=i.yLow);h.drawDataLabels&&h.drawDataLabels.apply(this,arguments)}i.align=j,i.verticalAlign=k},alignDataLabel:function(){g.column.prototype.alignDataLabel.apply(this,arguments)},setStackedPoints:c,getSymbol:c,drawPoints:c})}(a),function(a){var b=a.seriesType;b("areasplinerange","arearange",null,{getPointSpline:a.seriesTypes.spline.prototype.getPointSpline})}(a),function(a){var b=a.defaultPlotOptions,c=a.each,d=a.merge,e=a.noop,f=a.pick,g=a.seriesType,h=a.seriesTypes.column.prototype;g("columnrange","arearange",d(b.column,b.arearange,{lineWidth:1,pointRange:null}),{translate:function(){var a,b,d=this,e=d.yAxis,g=d.xAxis,i=g.startAngleRad,j=d.chart,k=d.xAxis.isRadial;h.translate.apply(d),c(d.points,function(c){var h,l,m=c.shapeArgs,n=d.options.minPointLength;c.plotHigh=b=e.translate(c.high,0,1,0,1),c.plotLow=c.plotY,l=b,h=f(c.rectPlotY,c.plotY)-b,Math.abs(h)<n?(n-=h,h+=n,l-=n/2):0>h&&(h*=-1,l-=h),k?(a=c.barX+i,c.shapeType="path",c.shapeArgs={d:d.polarArc(l+h,l,a,a+c.pointWidth)}):(m.height=h,m.y=l,c.tooltipPos=j.inverted?[e.len+e.pos-j.plotLeft-l-h/2,g.len+g.pos-j.plotTop-m.x-m.width/2,h]:[g.left-j.plotLeft+m.x+m.width/2,e.pos-j.plotTop+l+h/2,h])})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:e,crispCol:h.crispCol,drawPoints:h.drawPoints,drawTracker:h.drawTracker,getColumnMetrics:h.getColumnMetrics,animate:function(){return h.animate.apply(this,arguments)},polarArc:function(){return h.polarArc.apply(this,arguments)},pointAttribs:h.pointAttribs})}(a),function(a){var b=a.each,c=a.isNumber,d=a.merge,e=a.pick,f=a.pInt,g=a.Series,h=a.seriesType,i=a.TrackerMixin;h("gauge","line",{dataLabels:{enabled:!0,defer:!1,y:15,borderRadius:3,crop:!1,verticalAlign:"top",zIndex:2,borderWidth:1,borderColor:"#cccccc"},dial:{},pivot:{},tooltip:{headerFormat:""},showInLegend:!1},{angular:!0,directTouch:!0,drawGraph:a.noop,fixedBox:!0,forceDL:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],translate:function(){var a=this.yAxis,g=this.options,h=a.center;this.generatePoints(),b(this.points,function(b){var i=d(g.dial,b.dial),j=f(e(i.radius,80))*h[2]/200,k=f(e(i.baseLength,70))*j/100,l=f(e(i.rearLength,10))*j/100,m=i.baseWidth||3,n=i.topWidth||1,o=g.overshoot,p=a.startAngleRad+a.translate(b.y,null,null,null,!0);c(o)?(o=o/180*Math.PI,p=Math.max(a.startAngleRad-o,Math.min(a.endAngleRad+o,p))):!1===g.wrap&&(p=Math.max(a.startAngleRad,Math.min(a.endAngleRad,p))),p=180*p/Math.PI,b.shapeType="path",b.shapeArgs={d:i.path||["M",-l,-m/2,"L",k,-m/2,j,-n/2,j,n/2,k,m/2,-l,m/2,"z"],translateX:h[0],translateY:h[1],rotation:p},b.plotX=h[0],b.plotY=h[1]})},drawPoints:function(){var a=this,c=a.yAxis.center,f=a.pivot,g=a.options,h=g.pivot,i=a.chart.renderer;b(a.points,function(b){var c=b.graphic,e=b.shapeArgs,f=e.d,h=d(g.dial,b.dial);c?(c.animate(e),e.d=f):(b.graphic=i[b.shapeType](e).attr({rotation:e.rotation,zIndex:1}).addClass("highcharts-dial").add(a.group),b.graphic.attr({stroke:h.borderColor||"none","stroke-width":h.borderWidth||0,fill:h.backgroundColor||"#000000"}))}),f?f.animate({translateX:c[0],translateY:c[1]}):(a.pivot=i.circle(0,0,e(h.radius,5)).attr({zIndex:2}).addClass("highcharts-pivot").translate(c[0],c[1]).add(a.group),a.pivot.attr({"stroke-width":h.borderWidth||0,stroke:h.borderColor||"#cccccc",fill:h.backgroundColor||"#000000"}))},animate:function(a){var c=this;a||(b(c.points,function(a){var b=a.graphic;b&&(b.attr({rotation:180*c.yAxis.startAngleRad/Math.PI}),b.animate({rotation:a.shapeArgs.rotation},c.options.animation))}),c.animate=null)},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",this.options.zIndex,this.chart.seriesGroup),g.prototype.render.call(this),this.group.clip(this.chart.clipRect)},setData:function(a,b){g.prototype.setData.call(this,a,!1),this.processData(),this.generatePoints(),e(b,!0)&&this.chart.redraw()},drawTracker:i&&i.drawTrackerPoint},{setState:function(a){this.state=a}})}(a),function(a){var b=a.each,c=a.noop,d=a.pick,e=a.seriesType,f=a.seriesTypes;e("boxplot","column",{threshold:null,tooltip:{pointFormat:'<span style="color:{point.color}">●</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},whiskerLength:"50%",fillColor:"#ffffff",lineWidth:1,medianWidth:2,states:{hover:{brightness:-.3}},whiskerWidth:2},{pointArrayMap:["low","q1","median","q3","high"],toYData:function(a){return[a.low,a.q1,a.median,a.q3,a.high]},pointValKey:"high",pointAttribs:function(a){var b=this.options,c=a&&a.color||this.color;return{fill:a.fillColor||b.fillColor||c,stroke:b.lineColor||c,"stroke-width":b.lineWidth||0}},drawDataLabels:c,translate:function(){var a=this.yAxis,c=this.pointArrayMap;f.column.prototype.translate.apply(this),b(this.points,function(d){b(c,function(b){null!==d[b]&&(d[b+"Plot"]=a.translate(d[b],0,1,0,1))})})},drawPoints:function(){var a,c,e,f,g,h,i,j,k,l,m,n=this,o=n.options,p=n.chart.renderer,q=0,r=!1!==n.doQuartiles,s=n.options.whiskerLength;b(n.points,function(b){var t=b.graphic,u=t?"animate":"attr",v=b.shapeArgs,w={},x={},y={},z=b.color||n.color;void 0!==b.plotY&&(i=v.width,j=Math.floor(v.x),k=j+i,l=Math.round(i/2),a=Math.floor(r?b.q1Plot:b.lowPlot),c=Math.floor(r?b.q3Plot:b.lowPlot),e=Math.floor(b.highPlot),f=Math.floor(b.lowPlot),t||(b.graphic=t=p.g("point").add(n.group),b.stem=p.path().addClass("highcharts-boxplot-stem").add(t),s&&(b.whiskers=p.path().addClass("highcharts-boxplot-whisker").add(t)),r&&(b.box=p.path(void 0).addClass("highcharts-boxplot-box").add(t)),b.medianShape=p.path(void 0).addClass("highcharts-boxplot-median").add(t)),w.stroke=b.stemColor||o.stemColor||z,w["stroke-width"]=d(b.stemWidth,o.stemWidth,o.lineWidth),w.dashstyle=b.stemDashStyle||o.stemDashStyle,b.stem.attr(w),s&&(x.stroke=b.whiskerColor||o.whiskerColor||z,x["stroke-width"]=d(b.whiskerWidth,o.whiskerWidth,o.lineWidth),b.whiskers.attr(x)),r&&(t=n.pointAttribs(b),b.box.attr(t)),y.stroke=b.medianColor||o.medianColor||z,y["stroke-width"]=d(b.medianWidth,o.medianWidth,o.lineWidth),b.medianShape.attr(y),h=b.stem.strokeWidth()%2/2,q=j+l+h,b.stem[u]({d:["M",q,c,"L",q,e,"M",q,a,"L",q,f]}),r&&(h=b.box.strokeWidth()%2/2,a=Math.floor(a)+h,c=Math.floor(c)+h,j+=h,k+=h,b.box[u]({d:["M",j,c,"L",j,a,"L",k,a,"L",k,c,"L",j,c,"z"]})),s&&(h=b.whiskers.strokeWidth()%2/2,e+=h,f+=h,m=/%$/.test(s)?l*parseFloat(s)/100:s/2,b.whiskers[u]({d:["M",q-m,e,"L",q+m,e,"M",q-m,f,"L",q+m,f]})),g=Math.round(b.medianPlot),h=b.medianShape.strokeWidth()%2/2,g+=h,b.medianShape[u]({d:["M",j,g,"L",k,g]}))})},setStackedPoints:c})}(a),function(a){var b=a.each,c=a.noop,d=a.seriesType,e=a.seriesTypes;d("errorbar","boxplot",{color:"#000000",grouping:!1,linkedTo:":previous",tooltip:{pointFormat:'<span style="color:{point.color}">●</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},whiskerWidth:null},{type:"errorbar",pointArrayMap:["low","high"],toYData:function(a){return[a.low,a.high]},pointValKey:"high",doQuartiles:!1,drawDataLabels:e.arearange?function(){var a=this.pointValKey;e.arearange.prototype.drawDataLabels.call(this),b(this.data,function(b){b.y=b[a]})}:c,getColumnMetrics:function(){return this.linkedParent&&this.linkedParent.columnMetrics||e.column.prototype.getColumnMetrics.call(this)}})}(a),function(a){var b=a.correctFloat,c=a.isNumber,d=a.pick,e=a.Point,f=a.Series,g=a.seriesType,h=a.seriesTypes;g("waterfall","column",{dataLabels:{inside:!0},lineWidth:1,lineColor:"#333333",dashStyle:"dot",borderColor:"#333333",states:{hover:{lineWidthPlus:0}}},{pointValKey:"y",translate:function(){var a,c,e,f,g,i,j,k,l,m,n,o=this.options,p=this.yAxis,q=d(o.minPointLength,5),r=q/2,s=o.threshold,t=o.stacking;for(h.column.prototype.translate.apply(this),k=l=s,c=this.points,a=0,o=c.length;o>a;a++)e=c[a],j=this.processedYData[a],f=e.shapeArgs,g=t&&p.stacks[(this.negStacks&&s>j?"-":"")+this.stackKey],n=this.getStackIndicator(n,e.x,this.index),m=g?g[e.x].points[n.key]:[0,j],e.isSum?e.y=b(j):e.isIntermediateSum&&(e.y=b(j-l)),i=Math.max(k,k+e.y)+m[0],f.y=p.toPixels(i,!0),e.isSum?(f.y=p.toPixels(m[1],!0),f.height=Math.min(p.toPixels(m[0],!0),p.len)-f.y):e.isIntermediateSum?(f.y=p.toPixels(m[1],!0),f.height=Math.min(p.toPixels(l,!0),p.len)-f.y,l=m[1]):(f.height=j>0?p.toPixels(k,!0)-f.y:p.toPixels(k,!0)-p.toPixels(k-j,!0),k+=g&&g[e.x]?g[e.x].total:j),0>f.height&&(f.y+=f.height,f.height*=-1),e.plotY=f.y=Math.round(f.y)-this.borderWidth%2/2,f.height=Math.max(Math.round(f.height),.001),e.yBottom=f.y+f.height,f.height<=q&&!e.isNull?(f.height=q,f.y-=r,e.plotY=f.y,e.minPointLengthOffset=0>e.y?-r:r):e.minPointLengthOffset=0,f=e.plotY+(e.negative?f.height:0),this.chart.inverted?e.tooltipPos[0]=p.len-f:e.tooltipPos[1]=f},processData:function(a){var c,d,e,g,h,i,j,k=this.yData,l=this.options.data,m=k.length;for(e=d=g=h=this.options.threshold||0,j=0;m>j;j++)i=k[j],c=l&&l[j]?l[j]:{},"sum"===i||c.isSum?k[j]=b(e):"intermediateSum"===i||c.isIntermediateSum?k[j]=b(d):(e+=i,d+=i),g=Math.min(e,g),h=Math.max(e,h);f.prototype.processData.call(this,a),this.options.stacking||(this.dataMin=g,this.dataMax=h)},toYData:function(a){return a.isSum?0===a.x?null:"sum":a.isIntermediateSum?0===a.x?null:"intermediateSum":a.y},pointAttribs:function(a,b){var c=this.options.upColor;return c&&!a.options.color&&(a.color=0<a.y?c:null),a=h.column.prototype.pointAttribs.call(this,a,b),delete a.dashstyle,a},getGraphPath:function(){return["M",0,0]},getCrispPath:function(){var a,b,c,d=this.data,e=d.length,f=this.graph.strokeWidth()+this.borderWidth,f=Math.round(f)%2/2,g=[];for(c=1;e>c;c++)b=d[c].shapeArgs,a=d[c-1].shapeArgs,b=["M",a.x+a.width,a.y+d[c-1].minPointLengthOffset+f,"L",b.x,a.y+d[c-1].minPointLengthOffset+f],0>d[c-1].y&&(b[2]+=a.height,b[5]+=a.height),g=g.concat(b);return g},drawGraph:function(){f.prototype.drawGraph.call(this),this.graph.attr({d:this.getCrispPath()})},setStackedPoints:function(){var a,b,c=this.options;for(f.prototype.setStackedPoints.apply(this,arguments),a=this.stackedYData?this.stackedYData.length:0,b=1;a>b;b++)c.data[b].isSum||c.data[b].isIntermediateSum||(this.stackedYData[b]+=this.stackedYData[b-1])},getExtremes:function(){return this.options.stacking?f.prototype.getExtremes.apply(this,arguments):void 0}},{getClassName:function(){var a=e.prototype.getClassName.call(this);return this.isSum?a+=" highcharts-sum":this.isIntermediateSum&&(a+=" highcharts-intermediate-sum"),a},isValid:function(){return c(this.y,!0)||this.isSum||this.isIntermediateSum}})}(a),function(a){var b=a.Series,c=a.seriesType,d=a.seriesTypes;c("polygon","scatter",{marker:{enabled:!1,states:{hover:{enabled:!1}}},stickyTracking:!1,tooltip:{followPointer:!0,pointFormat:""},trackByArea:!0},{type:"polygon",getGraphPath:function(){for(var a=b.prototype.getGraphPath.call(this),c=a.length+1;c--;)(c===a.length||"M"===a[c])&&c>0&&a.splice(c,0,"z");return this.areaPath=a},drawGraph:function(){this.options.fillColor=this.color,d.area.prototype.drawGraph.call(this)},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,drawTracker:b.prototype.drawTracker,setStackedPoints:a.noop})}(a),function(a){var b=a.arrayMax,c=a.arrayMin,d=a.Axis,e=a.color,f=a.each,g=a.isNumber,h=a.noop,i=a.pick,j=a.pInt,k=a.Point,l=a.Series,m=a.seriesType,n=a.seriesTypes;m("bubble","scatter",{dataLabels:{formatter:function(){return this.point.z},inside:!0,verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1,radius:null,states:{hover:{radiusPlus:0}},symbol:"circle"},minSize:8,maxSize:"20%",softThreshold:!1,states:{hover:{halo:{size:5}}},tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},turboThreshold:0,zThreshold:0,zoneAxis:"z"},{pointArrayMap:["y","z"],parallelArrays:["x","y","z"],trackerGroups:["markerGroup","dataLabelsGroup"],bubblePadding:!0,zoneAxis:"z",directTouch:!0,pointAttribs:function(a,b){var c=i(this.options.marker.fillOpacity,.5);return a=l.prototype.pointAttribs.call(this,a,b),1!==c&&(a.fill=e(a.fill).setOpacity(c).get("rgba")),a},getRadii:function(a,b,c,d){var e,f,g,h=this.zData,i=[],j=this.options,k="width"!==j.sizeBy,l=j.zThreshold,m=b-a;for(f=0,e=h.length;e>f;f++)g=h[f],j.sizeByAbsoluteValue&&null!==g&&(g=Math.abs(g-l),b=Math.max(b-l,Math.abs(a-l)),a=0),null===g?g=null:a>g?g=c/2-1:(g=m>0?(g-a)/m:.5,k&&g>=0&&(g=Math.sqrt(g)),g=Math.ceil(c+g*(d-c))/2),i.push(g);this.radii=i},animate:function(a){var b=this.options.animation;a||(f(this.points,function(a){var c,d=a.graphic;d&&d.width&&(c={x:d.x,y:d.y,width:d.width,height:d.height},d.attr({x:a.plotX,y:a.plotY,width:1,height:1}),d.animate(c,b))}),this.animate=null)},translate:function(){var b,c,d,e=this.data,f=this.radii;for(n.scatter.prototype.translate.call(this),b=e.length;b--;)c=e[b],d=f?f[b]:0,g(d)&&d>=this.minPxSize/2?(c.marker=a.extend(c.marker,{radius:d,width:2*d,height:2*d}),c.dlBox={x:c.plotX-d,y:c.plotY-d,width:2*d,height:2*d}):c.shapeArgs=c.plotY=c.dlBox=void 0},alignDataLabel:n.column.prototype.alignDataLabel,buildKDTree:h,applyZones:h},{haloPath:function(a){return k.prototype.haloPath.call(this,0===a?0:(this.marker?this.marker.radius||0:0)+a)},ttBelow:!1}),d.prototype.beforePadding=function(){var a=this,d=this.len,e=this.chart,h=0,k=d,l=this.isXAxis,m=l?"xData":"yData",n=this.min,o={},p=Math.min(e.plotWidth,e.plotHeight),q=Number.MAX_VALUE,r=-Number.MAX_VALUE,s=this.max-n,t=d/s,u=[];f(this.series,function(d){var g=d.options;!d.bubblePadding||!d.visible&&e.options.chart.ignoreHiddenSeries||(a.allowZoomOutside=!0,u.push(d),l&&(f(["minSize","maxSize"],function(a){var b=g[a],c=/%$/.test(b),b=j(b);o[a]=c?p*b/100:b}),d.minPxSize=o.minSize,d.maxPxSize=Math.max(o.maxSize,o.minSize),d=d.zData,d.length&&(q=i(g.zMin,Math.min(q,Math.max(c(d),!1===g.displayNegative?g.zThreshold:-Number.MAX_VALUE))),r=i(g.zMax,Math.max(r,b(d))))))}),f(u,function(b){var c,d=b[m],e=d.length;if(l&&b.getRadii(q,r,b.minPxSize,b.maxPxSize),s>0)for(;e--;)g(d[e])&&a.dataMin<=d[e]&&d[e]<=a.dataMax&&(c=b.radii[e],h=Math.min((d[e]-n)*t-c,h),k=Math.max((d[e]-n)*t+c,k))}),u.length&&s>0&&!this.isLog&&(k-=d,t*=(d+h-k)/d,f([["min","userMin",h],["max","userMax",k]],function(b){void 0===i(a.options[b[0]],a[b[1]])&&(a[b[0]]+=b[2]/t)}))}}(a),function(a){function b(a,b){var c=this.chart,d=this.options.animation,e=this.group,f=this.markerGroup,g=this.xAxis.center,h=c.plotLeft,i=c.plotTop;c.polar?c.renderer.isSVG&&(!0===d&&(d={}),b?(a={translateX:g[0]+h,translateY:g[1]+i,scaleX:.001,scaleY:.001},e.attr(a),f&&f.attr(a)):(a={translateX:h,translateY:i,scaleX:1,scaleY:1},e.animate(a,d),f&&f.animate(a,d),this.animate=null)):a.call(this,b)}var c=a.each,d=a.pick,e=a.seriesTypes,f=a.wrap,g=a.Series.prototype,h=a.Pointer.prototype;g.searchPointByAngle=function(a){var b=this.chart,c=this.xAxis.pane.center;return this.searchKDTree({clientX:180+-180/Math.PI*Math.atan2(a.chartX-c[0]-b.plotLeft,a.chartY-c[1]-b.plotTop)})},g.getConnectors=function(a,b,c,d){var e,f,g,h,i,j,k,l;return f=d?1:0,e=b>=0&&b<=a.length-1?b:0>b?a.length-1+b:0,b=0>e-1?a.length-(1+f):e-1,f=e+1>a.length-1?f:e+1,g=a[b],f=a[f],h=g.plotX,g=g.plotY,i=f.plotX,j=f.plotY,f=a[e].plotX,e=a[e].plotY,h=(1.5*f+h)/2.5,g=(1.5*e+g)/2.5,i=(1.5*f+i)/2.5,k=(1.5*e+j)/2.5,j=Math.sqrt(Math.pow(h-f,2)+Math.pow(g-e,2)),l=Math.sqrt(Math.pow(i-f,2)+Math.pow(k-e,2)),h=Math.atan2(g-e,h-f),k=Math.PI/2+(h+Math.atan2(k-e,i-f))/2,Math.abs(h-k)>Math.PI/2&&(k-=Math.PI),h=f+Math.cos(k)*j,g=e+Math.sin(k)*j,i=f+Math.cos(Math.PI+k)*l,k=e+Math.sin(Math.PI+k)*l,f={rightContX:i,rightContY:k,leftContX:h,leftContY:g,plotX:f,plotY:e},c&&(f.prevPointCont=this.getConnectors(a,b,!1,d)),f},f(g,"buildKDTree",function(a){this.chart.polar&&(this.kdByAngle?this.searchPoint=this.searchPointByAngle:this.options.findNearestPointBy="xy"),a.apply(this)}),g.toXY=function(a){var b,c=this.chart,d=a.plotX;b=a.plotY,a.rectPlotX=d,a.rectPlotY=b,b=this.xAxis.postTranslate(a.plotX,this.yAxis.len-b),a.plotX=a.polarPlotX=b.x-c.plotLeft,a.plotY=a.polarPlotY=b.y-c.plotTop,this.kdByAngle?(c=(d/Math.PI*180+this.xAxis.pane.options.startAngle)%360,0>c&&(c+=360),a.clientX=c):a.clientX=a.plotX},e.spline&&(f(e.spline.prototype,"getPointSpline",function(a,b,c,d){return this.chart.polar?d?(a=this.getConnectors(b,d,!0,this.connectEnds),a=["C",a.prevPointCont.rightContX,a.prevPointCont.rightContY,a.leftContX,a.leftContY,a.plotX,a.plotY]):a=["M",c.plotX,c.plotY]:a=a.call(this,b,c,d),a}),e.areasplinerange&&(e.areasplinerange.prototype.getPointSpline=e.spline.prototype.getPointSpline)),f(g,"translate",function(a){var b=this.chart;if(a.call(this),b.polar&&(this.kdByAngle=b.tooltip&&b.tooltip.shared,!this.preventPostTranslate))for(a=this.points,b=a.length;b--;)this.toXY(a[b])}),f(g,"getGraphPath",function(a,b){var d,e,f,g=this;if(this.chart.polar){for(b=b||this.points,d=0;d<b.length;d++)if(!b[d].isNull){e=d;break}!1!==this.options.connectEnds&&void 0!==e&&(this.connectEnds=!0,b.splice(b.length,0,b[e]),f=!0),c(b,function(a){void 0===a.polarPlotY&&g.toXY(a)})}return d=a.apply(this,[].slice.call(arguments,1)),f&&b.pop(),d}),f(g,"animate",b),e.column&&(e=e.column.prototype,e.polarArc=function(a,b,c,e){var f=this.xAxis.center,g=this.yAxis.len;return this.chart.renderer.symbols.arc(f[0],f[1],g-b,null,{start:c,end:e,innerR:g-d(a,g)})},f(e,"animate",b),f(e,"translate",function(a){var b,c,d,e=this.xAxis,f=e.startAngleRad;if(this.preventPostTranslate=!0,a.call(this),e.isRadial)for(b=this.points,d=b.length;d--;)c=b[d],a=c.barX+f,c.shapeType="path",c.shapeArgs={d:this.polarArc(c.yBottom,c.plotY,a,a+c.pointWidth)},this.toXY(c),c.tooltipPos=[c.plotX,c.plotY],c.ttBelow=c.plotY>e.center[1]}),f(e,"alignDataLabel",function(a,b,c,d,e,f){this.chart.polar?(a=b.rectPlotX/Math.PI*180,null===d.align&&(d.align=a>20&&160>a?"left":a>200&&340>a?"right":"center"),null===d.verticalAlign&&(d.verticalAlign=45>a||a>315?"bottom":a>135&&225>a?"top":"middle"),g.alignDataLabel.call(this,b,c,d,e,f)):a.call(this,b,c,d,e,f)})),f(h,"getCoordinates",function(a,b){var d=this.chart,e={xAxis:[],yAxis:[]};return d.polar?c(d.axes,function(a){var c=a.isXAxis,f=a.center,g=b.chartX-f[0]-d.plotLeft,f=b.chartY-f[1]-d.plotTop;e[c?"xAxis":"yAxis"].push({axis:a,value:a.translate(c?Math.PI-Math.atan2(g,f):Math.sqrt(Math.pow(g,2)+Math.pow(f,2)),!0)})}):e=a.call(this,b),e}),f(a.Chart.prototype,"getAxes",function(b){this.pane||(this.pane=[]),c(a.splat(this.options.pane),function(b){new a.Pane(b,this)},this),b.call(this)}),f(a.Chart.prototype,"drawChartBox",function(a){a.call(this),c(this.pane,function(a){a.render()})}),f(a.Chart.prototype,"get",function(b,c){return a.find(this.pane,function(a){return a.options.id===c})||b.call(this,c)})}(a)});