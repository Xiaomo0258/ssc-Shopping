function getTime() {
    var timestamp = Date.parse(new Date()) / 1000;
    return timestamp;
}

function timeTostamp(time, fmt) {
    if (!time) return;
    var date = parseDate(time, fmt).getTime() / 1000;
    return date;
}
/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 */
function parseDate(str, fmt) {
    fmt = fmt || 'yyyy-MM-dd';
    var obj = {
        y: 0,
        M: 1,
        d: 0,
        H: 0,
        h: 0,
        m: 0,
        s: 0,
        S: 0
    };
    fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old) {
        str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function(_m, _$1) {
            obj[$3] = parseInt(_$1);
            return '';
        });
        return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
    return date;
}
/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
function formatDate(date, fmt) {
    date = date == undefined ? new Date() : date;
    date = typeof date == 'number' ? new Date(date) : date;
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    var obj = {
        'y': date.getFullYear(), // 年份，注意必须用getFullYear
        'M': date.getMonth() + 1, // 月份，注意是从0-11
        'd': date.getDate(), // 日期
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'w': date.getDay(), // 星期，注意是0-6
        'H': date.getHours(), // 24小时制
        'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
        'm': date.getMinutes(), // 分钟
        's': date.getSeconds(), // 秒
        'S': date.getMilliseconds() // 毫秒
    };
    var week = ['天', '一', '二', '三', '四', '五', '六'];
    for (var i in obj) {
        fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
            var val = obj[i] + '';
            if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
            for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
            return m.length == 1 ? val : val.substring(val.length - m.length);
        });
    }
    return fmt;
}

function openHeaderWin(title, html, str) {
    var _str = $common.hasVal(str, "");
    api.openWin({
        name: $common.hasVal(html, ""),
        url: 'widget://html/commonHeader.html',
        pageParam: {
            title: $common.hasVal(title, "标题"),
            html: $common.hasVal(html, ""),
            str: _str
        },
        animation: _str.animation ? _str.animation : ""
    });
}

function share(url, text) {
    if (!url || !text) return;
    var sharedModule = api.require('shareAction');
    sharedModule.share({
        text: text,
        type: 'url',
        path: url
    });
}

function openLoading() {
    api.openFrame({
        name: 'loading',
        url: 'widget://html/loading.html',
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        },
        bounces: false,
        bgColor: '#fff',
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });

}

function closeLoading() {
    api.closeFrame({
        name: 'loading'
    });
}

function setBadge(_number) {
    var number = _number ? _number : 0;
    api.setAppIconBadge({
        badge: number
    });
}

function setStatusBar(_style) {
    var style = _style ? _style : "light";
    //  console.log(style);
    api.setStatusBarStyle({
        style: style
    });
}

function openError() {
    api.openFrame({
        name: 'error',
        rect: {
            x: 0,
            //y: $api.dom("header").offsetHeight,
            y: 0,
            w: 'auto',
            //h: api.winHeight - $api.dom("footer").offsetHeight
            h: api.winHeight
        },
        url: 'widget://html/error.html',
        bounces: false,
        bgColor: "#fff",
        useWKWebView: false,
        animation: {
            type: "fade", //动画类型（详见动画类型常量）
            subType: "from_right", //动画子类型（详见动画子类型常量）
            duration: 300
        }
    });
}

//横屏+全屏
function OrientationFull() {
    api.setScreenOrientation({
        orientation: 'landscape_left'
    });
    api.setFullScreen({
        fullScreen: true
    });
}

//移除启动图
function removeLaunch() {
    api.removeLaunchView({
        animation: {
            type: 'fade',
            duration: 500
        }
    });
}
//网络监听
function listenNet(){
  //网络监听
  api.addEventListener({
      name: 'offline'
  }, function(ret, err) {
      openError();
  });
  api.addEventListener({
      name: 'online'
  }, function(ret, err) {
      api.closeFrame({
          name: 'error'
      });
  });
}
//=================项目私有方法===============

function addJNotice(date) {
    if (!date) return;
    //callback(ret);
}

function getLocation() {
    api.getLocation(function(ret, err) {
        if (ret && ret.status) {
            //获取位置信息成功
        } else {
            alert(JSON.stringify(err));
        }
    });
}

function openWebWin(u) {
    //console.log(u);

    api.openWin({
        name: "win" + u,
        url: 'widget://html/webwin.html',
        pageParam: {
            u: u
        }
    });
}
