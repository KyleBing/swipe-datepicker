/***********************
 * 来源： 网上扒的
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 ***********************/
(function ($) {
    $.fn.date = function (options,confirmCallback,cancelCallback) {
        //插件默认选项
        let that = $(this);
        let docType = $(this).is('input');
        let datetime = false;
        let nowdate = new Date();
        let indexY=1,indexM=1,indexD=1;
        let indexH=1,indexI=1,indexS=1;
        let initY=parseInt((nowdate.getYear()+"").substr(1,2));
        let initM=parseInt(nowdate.getMonth()+"")+1;
        let initD=parseInt(nowdate.getDate()+"");
        let initH=parseInt(nowdate.getHours());
        let initI=parseInt(nowdate.getMinutes());
        let initS=parseInt(nowdate.getSeconds());
        let yearScroll=null,monthScroll=null,dayScroll=null;
        let HourScroll=null,MinuteScroll=null,SecondScroll=null;
        $.fn.date.defaultOptions = {
            beginyear:2000,                 // 日期--年份开始
            endyear:2030,                   // 日期--年份结束
            beginmonth:1,                   // 日期--月份结束
            endmonth:12,                    // 日期--月份结束
            beginday:1,                     // 日期--日份结束
            endday:31,                      // 日期--日份结束
            beginhour:0,
            endhour:24,
            beginminute: 0,
            endminute:59,
            beginsecond: 0,
            endsecond:59,
            curdate:false,                   // 打开日期是否定位到当前日期
            theme:"date",                    // 控件样式（1：日期 date，2：日期+时间 datetime）
            mode:null,                       // 操作模式（滑动模式）
            event:"click",                   // 打开日期插件默认方式为点击后后弹出日期
            show:true
        };

        //用户选项覆盖插件默认选项
        let opts = $.extend( true, {}, $.fn.date.defaultOptions, options );
        if(opts.theme === "datetime"){datetime = true;}
        if(!opts.show){
            that.unbind('click');
        }
        else{
            //绑定事件（默认事件为获取焦点）
            that.bind(opts.event,function () {
                createUL();      //动态生成控件显示的日期
                init_iScrll();   //初始化iscrll
                extendOptions(); //显示控件
                that.blur();
                refreshDate();
                if(datetime){
                    showdatetime();
                    refreshTime();
                }
                bindButton();
            })
        }
        function refreshDate(){
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();
            resetInitDete();
            yearScroll.scrollTo(0, initY*40, 100, true);
            monthScroll.scrollTo(0, initM*40-40, 100, true);
            dayScroll.scrollTo(0, initD*40-40, 100, true);
        }
        function refreshTime(){
            HourScroll.refresh();
            MinuteScroll.refresh();
            SecondScroll.refresh();
            HourScroll.scrollTo(0, initH*40, 100, true);
            MinuteScroll.scrollTo(0, initI*40, 100, true);
            SecondScroll.scrollTo(0, initS*40, 100, true);
            initH=parseInt(nowdate.getHours());
        }
        function resetIndex(){
            indexY=1;
            indexM=1;
            indexD=1;
        }
        function resetInitDete(){
            if(opts.curdate){return false;}
            else if(that.val()===""){return false;}
            initY = parseInt(that.val().substr(2,2));
            initM = parseInt(that.val().substr(5,2));
            initD = parseInt(that.val().substr(8,2));
            initH = parseInt(that.val().substr(11,2));
            initI = parseInt(that.val().substr(14,2));
            initS = parseInt(that.val().substr(17,2));
        }
        function bindButton(){
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {
                let datestr = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1)+"-"+
                    $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1)+"-"+
                    $("#daywrapper ul li:eq("+Math.round(indexD)+")").html().substr(0,$("#daywrapper ul li:eq("+Math.round(indexD)+")").html().length-1);
                if(datetime){
                    datestr+=" "+$("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Minutewrapper ul li:eq("+indexH+")").html().length-1)+":"+
                        $("#Minutewrapper ul li:eq("+indexI+")").html().substr(0,$("#Minutewrapper ul li:eq("+indexI+")").html().length-1)+":"+
                        $("#Secondwrapper ul li:eq("+indexS+")").html().substr(0,$("#Secondwrapper ul li:eq("+indexS+")").html().length-1);
                }

                if(confirmCallback===undefined){
                    if(docType){that.val(datestr);}else{that.html(datestr);}
                }else{
                    confirmCallback(datestr);
                }
                $("#datePage").hide();
                $("#dateshadow").hide();
            });
            $("#datecancle").click(function () {
                $("#datePage").hide();
                $("#dateshadow").hide();
                if (cancelCallback){
                    cancelCallback
                }
            });
        }
        function extendOptions(){
            $("#datePage").show();
            $("#dateshadow").show();
        }
        //日期滑动
        function init_iScrll() {
            let strY = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1);
            let strM = $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1);
            yearScroll = new iScroll("yearwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexY = (this.y/40)*(-1)+1;
                    opts.endday = checkdays(strY,strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }});
            monthScroll = new iScroll("monthwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function (){
                    indexM = (this.y/40)*(-1)+1;
                    opts.endday = checkdays(strY,strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }});
            dayScroll = new iScroll("daywrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexD = (this.y/40)*(-1)+1;
                }});
        }
        function showdatetime(){
            init_iScroll_datetime();
            addTimeStyle();
            $("#datescroll_datetime").show();
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
            $("#Secondwrapper ul").html(createSECOND_UL());
        }

        //日期+时间滑动
        function init_iScroll_datetime(){
            HourScroll = new iScroll("Hourwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexH = Math.round((this.y/40)*(-1))+1;
                    MinuteScroll.refresh();
                    SecondScroll.refresh();
                }});
            MinuteScroll = new iScroll("Minutewrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexI = Math.round((this.y/40)*(-1))+1;
                    HourScroll.refresh();
                    SecondScroll.refresh();
                }});
            SecondScroll = new iScroll("Secondwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexS = Math.round((this.y/40)*(-1))+1;
                    HourScroll.refresh();
                    MinuteScroll.refresh();
                }})
        }
        function checkdays (year,month){
            let new_year = year;        //取当前的年份
            let new_month = month++;    //取下一个月的第一天，方便计算（最后一天不固定）
            if(month>12)                //如果当前大于12月，则年份转到下一年
            {
                new_month -=12;        //月份减
                new_year++;            //年份增
            }
            let new_date = new Date(new_year,new_month,1);                  //取当年当月中的第一天
            return (new Date(new_date.getTime()-1000*60*60*24)).getDate();  //获取当月最后一天日期
        }
        function  createUL(){
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            $("#monthwrapper ul").html(createMONTH_UL());
            $("#daywrapper ul").html(createDAY_UL());
        }
        function CreateDateUI(){
            // 创建放面板的父元素
            let dateContainer = document.createElement('div');
            dateContainer.setAttribute('id','datePlugin');
            document.body.appendChild(dateContainer);
            let str =  `<div id="dateshadow"></div>
                        <div id="datePage" class="page">
                        <section>
                            <div id="datetitle"><h6>请选择日期</h6></div>
                            <div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>
                            <div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>
                            <div id="datescroll">
                                <div id="yearwrapper">
                                    <ul></ul>
                                    </div>
                                <div id="monthwrapper">
                                    <ul></ul>
                                    </div>
                                <div id="daywrapper">
                                    <ul></ul>
                                    </div>
                                </div>
                            <div id="datescroll_datetime">
                                <div id="Hourwrapper">
                                    <ul></ul>
                                    </div>
                                <div id="Minutewrapper">
                                    <ul></ul>
                                    </div>
                                <div id="Secondwrapper">
                                    <ul></ul>
                                    </div>
                                </div>
                            </section>
                        <footer id="dateFooter">
                            <div id="setcancle">
                                <ul>
                                    <li class="confirm" id="dateconfirm">确定</li>
                                    <li class="cancel" id="datecancle">取消</li>
                                    </ul>
                                </div>
                            </footer>
                        </div>`;
            $("#datePlugin").html(str);
        }
        function addTimeStyle(){
            $("#datePage").css("height","380px");
            $("#datePage").css("top","60px");
            $("#yearwrapper").css("position","absolute");
            $("#yearwrapper").css("bottom","200px");
            $("#monthwrapper").css("position","absolute");
            $("#monthwrapper").css("bottom","200px");
            $("#daywrapper").css("position","absolute");
            $("#daywrapper").css("bottom","200px");
        }
        //创建 年 列表
        function createYEAR_UL(){
            let str="<li></li>";
            for(let i=opts.beginyear; i<=opts.endyear;i++){
                str+='<li>'+i+'年</li>'
            }
            return str+"<li></li>";
        }
        //创建 月 列表
        function createMONTH_UL(){
            let str="<li></li>";
            for(let i=opts.beginmonth;i<=opts.endmonth;i++){
                i = i < 10? '0' + i: i;
                str+='<li>'+i+'月</li>'
            }
            return str+"<li></li>";
        }
        //创建 日 列表
        function createDAY_UL(){
            $("#daywrapper ul").html("");
            let str="<li></li>";
            for(let i=opts.beginday;i<=opts.endday;i++){
                i = i < 10? '0' + i: i;
                str+='<li>'+i+'日</li>'
            }
            return str+"<li></li>";
        }
        //创建 时 列表
        function createHOURS_UL(){
            let str="<li></li>";
            for(let i=opts.beginhour;i<=opts.endhour;i++){
                i = i < 10? '0' + i: i;
                str+='<li>'+i+'时</li>'
            }
            return str+"<li></li>";
        }
        //创建 分 列表
        function createMINUTE_UL(){
            let str="<li></li>";
            for(let i=opts.beginminute;i<=opts.endminute;i++){
                i = i < 10? '0' + i: i;
                str+='<li>'+i+'分</li>'
            }
            return str+"<li></li>";
        }
        //创建 秒 列表
        function createSECOND_UL(){
            let str="<li></li>";
            for(let i=opts.beginsecond;i<=opts.endsecond;i++){
                i = i < 10? '0' + i: i;
                str+='<li>'+i+'秒</li>'
            }
            return str+"<li></li>";
        }
    }
})(jQuery);