# Mobile Swipe DateTime Picker

a js plugin for timepicker on mobile.

online example: [Swipe Datetime Picker](http://kylebing.cn/lib/swipe-datepicker)
 
12 hour mode

![12hour](https://github.com/KyleBing/swipe-datepicker/blob/master/github/12hour.png?raw=true)


24 hour mode 

![24hour](https://github.com/KyleBing/swipe-datepicker/blob/master/github/24hour.png?raw=true)





## Usage

There two mode: 

- 12 hour: swipe-datepicker-12hour.js
- 24 hour: swipe-datepicker-24hour.js

24 hour mode is with seconds and 12 hour is not.

```html
<input type="text" readonly id="dateTime">
```

```js
$('#dateTime').date(options, confirmCallback(datetimeString), cancelCallback);
```


option 有这些：

```js
options = {
        beginyear:2000,                 // 日期--年--份开始
        endyear:2020,                   // 日期--年--份结束
        beginmonth:1,                   // 日期--月--份结束
        endmonth:12,                    // 日期--月--份结束
        beginday:1,                     // 日期--日--份结束
        endday:31,                      // 日期--日--份结束
        curdate:true,                   // 打开日期是否定位到当前日期
        theme:"datetime",               // 控件样式（1：日期 date，2：日期+时间 datetime）
        mode:null,                      // 操作模式（滑动模式）
        event:"click",                  // 打开日期插件默认方式为点击后后弹出日期
        show:true
}

```

## Structure

```bash
swipe-datepicker
├── README.md
├── css
│   ├── _reset.scss
│   ├── swipe-datepicker.css
│   ├── swipe-datepicker.css.map
│   └── swipe-datepicker.scss
├── index.html
└── js
    ├── iscroll.js
    ├── jquery-2.2.4.min.js
    ├── swipe-datepicker-12hour.js
    └── swipe-datepicker-24hour.js
```

