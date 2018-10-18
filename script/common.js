// function push() {
//     var uzgetuisdk = api.require('pushGeTui');
//     uzgetuisdk.initialize(function(ret) {
//         //console.log(JSON.stringify(ret));
//     });
//     var param = {
//         badge: 0
//     };
//     var systemType = api.systemType;
//     if (systemType == "ios") {
//         uzgetuisdk.setBadge(param, function(ret) {
//             //console.log(JSON.stringify(ret));
//         });
//     }
//     api.setAppIconBadge({
//         badge: param.badge
//     });
// }

function listen() {
    api.addEventListener({
        name: 'offline'
    }, function(ret, err) {
        openE();
    });
    api.addEventListener({
        name: 'online'
    }, function(ret, err) {
        api.closeFrame({
            name: 'e'
        });
    });
}

function rLaunch() {
    api.removeLaunchView({
        animation: {
            type: 'fade',
            duration: 500
        }
    });
}

function openE() {
    api.openFrame({
        name: 'e',
        rect: {
            x: 0,
            //y: $api.dom("header").offsetHeight,
            y: 0,
            w: 'auto',
            //h: api.winHeight - $api.dom("footer").offsetHeight
            h: api.winHeight
        },
        url: '../html/error.html',
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

function openLLL() {
    api.openFrame({
        name: 'load',
        url: '../html/loading.html',
        rect: {
            marginLeft: 0,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0
        },
        bounces: false,
        bgColor: '#fff',
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}

function closeLLL() {
    api.closeFrame({
        name: 'load'
    });
    //api.hideProgress();
}

function frameClient(frameName, _winName, _closeWin) {

    api.setFrameClient({
        frameName: frameName
    }, function(ret, err) {
        switch (ret.state) {
            case 0:
                openLLL();
                break;
            case 2:
                changeH(_winName, frameName);
                closeLLL();
                rLaunch();
                if (_closeWin !== "" && _closeWin !== "root") {
                    api.execScript({
                        name: _closeWin,
                        script: "closeBase();"
                    });
                }
                break;
            case 4:

                openW2(ret.url, api.winName);
                //closeLLL();
                break;
        }
    });
}


function changeH(_winName, _frameName) {
    var init = "";
    init += "document.getElementById('webFooter').style.display='none';";
    init += "document.getElementById('mobiCornerAd').style.display='none';";
    init += "var links = document.querySelectorAll('a');";
    init += "Array.prototype.forEach.call(links, function (link) {";
    init += "    link.addEventListener('click', function (evt) {";
    init += "       evt.preventDefault();var _u = this.href;";
    init += "       api.execScript({";
    init += "           name: '" + _winName + "',";
    init += "           script: 'openWWW(\"'+_u+'\")'";
    init += "       });";
    init += "    });";
    init += "});";
    init += "Mobi.backOff = function(){"
    init += "   api.execScript({"
    init += "       name: '" + _winName + "',";
    init += "       script: 'closeBase();'"
    init += "   });"
    init += "}";
    api.execScript({
        name: api.winName,
        frameName: _frameName,
        script: init
    });
}

function openWWW(u) {
  alert(u);
    if (u == "https://lo16725032-4.m.icoc.bz/index.jsp" || u == "https://lo16725032-4.m.icoc.bz/" || u=="" || u=="javascript:;" ) {
        api.closeToWin({
            name: 'root'
        });
        return;
    };
    api.openWin({
        name: "win" + u,
        url: '../html/winBase.html',
        pageParam: {
            u: u
        }
    });
}

function openW2(u, _winName) {
  if (u == "https://lo16725032-4.m.icoc.bz/index.jsp" || u == "https://lo16725032-4.m.icoc.bz/" || u=="" || u=="javascript:;" ) {
        api.closeToWin({
            name: 'root'
        });
    } else if (_winName !== "root") {
        api.openWin({
            name: "win" + u,
            url: '../html/winBase.html',
            pageParam: {
                u: u,
                _winName: _winName
            }
        });
    }
}

function closeBase() {
    api.closeWin();
}
