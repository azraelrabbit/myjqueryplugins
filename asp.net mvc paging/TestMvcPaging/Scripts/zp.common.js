$(document).ready(function () {
    var t = $('.popcontent')[0];
    if (t) {
        $(t).prepend("<div id='alertContainerPop' style='width:40%;position:fixed; z-index:999999; top:200px;'></div>");

        $('#alertContainerPop').css('margin-left', parseInt((window.innerWidth - parseInt($('#alertContainerPop').css('width'))) / 2) + 'px');
    }
});

function showPopAlertSuccess(content, interval, delaycallback) {

    var id = getRndStr(15);

    var html = $("  <div id='" + id + "' class='alert alert-success' style='border-width: 5px; border-color:white'><button type='button' class='close'  data-dismiss='alert'><span>X</span></button><div id='alert-text'>" + content + "</div></div> ");
    $('#alertContainerPop').append(html);


    var alert = $('#' + id);
    if (alert && interval) {

        setTimeout(function () {
            alert.alert('close');
            if (delaycallback) {
                delaycallback();
            }
        }, interval);
    }
    return alert;
}

function showPopAlertInfo(content, interval, delaycallback) {
    var id = getRndStr(15);
    var html = " <div id='" + id + "' class='alert alert-info' style='border-width: 5px; border-color:white'><button type='button' class='close'  data-dismiss='alert'><span>X</span></button><div id='alert-text'>" + content + "</div></div>";
    $('#alertContainerPop').append(html);

    var alert = $('#' + id);
    if (alert && interval) {

        setTimeout(function () {
            alert.alert('close');
            if (delaycallback) {
                delaycallback();
            }
        }, interval);
    }
    return alert;
}

function showPopAlertWarning(content, interval, delaycallback) {
    var id = getRndStr(15);
    var html = " <div id='" + id + "' class='alert alert-warning' style='border-width: 5px; border-color:white'><button type='button' class='close'  data-dismiss='alert' ><span>X</span></button><div id='alert-text'>" + content + "</div></div>";
    $('#alertContainerPop').append(html);
    var alert = $('#' + id);
    if (alert && interval) {

        setTimeout(function () {
            alert.alert('close');
            if (delaycallback) {
                delaycallback();
            }
        }, interval);
    }
    return alert;
}

function showPopAlertDanger(content, interval, delaycallback) {
    var id = getRndStr(15);
    var html = " <div id='" + id + "' class='alert alert-danger' style='border-width: 5px; border-color:white'><button type='button' class='close' data-dismiss='alert' ><span>X</span></button><div id='alert-text'>" + content + "</div></div>";
    $('#alertContainerPop').append(html);
    var alert = $('#' + id);

    if (alert && interval) {

        setTimeout(function () {
            alert.alert('close');
            if (delaycallback) {
                delaycallback();
            }
        }, interval);
    }
    return alert;
}



function closeAlert(alert) {
    if (alert) {
        alert.alert('close');
    }
}


function getRndStr(len) {
    var s = [];
    var a = parseInt(Math.random() * 25) + (Math.random() > 0.5 ? 65 : 97);
    for (var i = 0; i < len; i++) {
        s[i] = Math.random() > 0.5
            ? parseInt(Math.random() * 9)
            : String.fromCharCode(parseInt(Math.random() * 25) + (Math.random() > 0.5 ? 65 : 97));
    }
    return s.join('');
}

function jsonAuthAjax(paramUrl, paramData, paramSuccess,paramError, paramType, paramAsync) {
    if (arguments.length < 4) {
        paramError = function (response) {
            slog(response); 
        };
        paramType = "GET";
        paramAsync = false;
    } else if (arguments.length < 5) {
        paramAsync = false;
    }

    if (!paramError) {
        paramError = function (response) {
            slog(response);
        };
    }

    $.ajax({
        cache: false,
        url: paramUrl,
        data: paramData,
        type: paramType,
        traditional: true,
        async: paramAsync,
        error: function (response) {
            slog(response);
            paramError(response);
        },
        success: function (response) {
            paramSuccess(response);
        }
    });
}
if (!Array.prototype.remove) {
    Array.prototype.remove = function (val) {
        var i = this.indexOf(val);
        // return i > -1 ? this.splice(i, 1) : [];
        if (i > -1) {
            return this.splice(i, 1);
        } else {
            return [];
        }
    };
}

function zpCreatePager(pagerContainerId, pagerNumber, pageCount, currentPage) {
    var pagerContainer = '#' + pagerContainerId;
    var pagerUlHtml = '<ul id="' + pagerContainerId + 'Ul" class="zpPager">';
    var pagerUlHtmlEnd = '</ul>';
    var pagerHtml1 = '<li><input type="button"   onclick="gotoPage(this);" id="' + pagerContainerId + 'Li';
    var pagerHtml2 = '" pagetarget="';
    var pagerHtml3 = '" value="';
    var pagerHtml4 = '" /></li>';
    var pagerFirstHtml = '<li><input type="button"   onclick="gotoPage(this);" id="' + pagerContainerId + 'Li0" pagetarget="1" value="&lt;&lt;" /></li>';
    var pagerLastHtml = '<li><input type="button"   onclick="gotoPage(this);" id="' + pagerContainerId + 'Li' + (pageCount + 1) + '" pagetarget="' + pageCount + '" value="&gt;&gt;" /></li>';

    var mod = 1 - pagerNumber % 2;

    var pageMin = currentPage - parseInt(pagerNumber / 2);
    if (pageMin > pageCount - pagerNumber + 1) {
        pageMin = pageCount - pagerNumber + 1;
    }
    if (pageMin < 1) {
        pageMin = 1;
    }

    var pageMax = currentPage + parseInt(pagerNumber / 2) - mod;
    if (pageMax < pageMin + pagerNumber - 1) {
        pageMax = pageMin + pagerNumber - 1;
    }
    if (pageMax > pageCount) {
        pageMax = pageCount;
    }
    var pagerHtml = pagerUlHtml;

    if (pageMin > 1) {
        pagerHtml += pagerFirstHtml;
    }
    var i;
    for (i = pageMin; i <= pageMax; i++) {
        pagerHtml += pagerHtml1 + i + pagerHtml2 + i + pagerHtml3 + i + pagerHtml4;
    }

    if (pageMax < pageCount) {
        pagerHtml += pagerLastHtml;
    }
    pagerHtml += pagerUlHtmlEnd;
    $(pagerContainer).html(pagerHtml);

    for (i = pageMin; i <= pageMax; i++) {
        if ($(pagerContainer + 'Li' + i).attr('pagetarget') === currentPage) {
            $(pagerContainer + 'Li' + i).css('background', '#BBB');
        }
        else {
            $(pagerContainer + 'Li' + i).css('background', '');
        }
    }
    $(pagerContainer).show();
}
// 
function zpConfirm(message,confirmCallback,cancelCallback) {
    $.confirm({
        title: '操作确认',
        content: message,
        confirmButton: '确定',
        cancelButton: '取消',
        confirm: function() {
            if (confirmCallback) {
                confirmCallback();
            }
        },
        cancel: function() {
            if (cancelCallback) {
                cancelCallback();
            }
        }
    });
}

function JSONToCSVConvertor(jsonData, reportTitle, showLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

    var csvContent = '';
    //Set Report title in first row or line
    csvContent += reportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (showLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        csvContent += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);

        //add a line break after each row
        csvContent += row + '\r\n';
    }

    if (csvContent == '') {
        // alert("Invalid data");
        slog("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += reportTitle.replace(/ /g, "_");

    if (isIE()) {
        var blob = new Blob([decodeURIComponent(encodeURI("\uFEFF" + csvContent))], {
            type: "text/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, fileName+".csv");
    } else {
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(csvContent);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number 
    {
        return true;
    } else { // If another browser, 
        return false;
    }
    return false;
}


function date2Str(x, y) {
    var z = { M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds() };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) { return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2); });
    return y.replace(/(y+)/g, function (v) { return x.getFullYear().toString().slice(-v.length); });
}

function addDays(date, days) {
    var nd = new Date(date);
    nd = nd.valueOf();
    nd = nd + days * 24 * 60 * 60 * 1000;
    nd = new Date(nd);
    //alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日");
    var y = nd.getFullYear();
    var m = nd.getMonth() + 1;
    var d = nd.getDate();
    if (m <= 9) m = "0" + m;
    if (d <= 9) d = "0" + d;
    var cdate = y + "-" + m + "-" + d;
    return cdate;
}

function addDaysDate(date, days) {
    var nd = new Date(date);
    nd = nd.valueOf();
    nd = nd + days * 24 * 60 * 60 * 1000;
    nd = new Date(nd);
    //alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日");
    var y = nd.getFullYear();
    var m = nd.getMonth() + 1;
    var d = nd.getDate();
    if (m <= 9) m = "0" + m;
    if (d <= 9) d = "0" + d;
    var cdate = y + "-" + m + "-" + d;
    return new Date(cdate);
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

String.prototype.PadLeft = function (totalWidth, paddingChar) {
    if (paddingChar != null) {
        return this.PadHelper(totalWidth, paddingChar, false);
    } else {
        return this.PadHelper(totalWidth, ' ', false);
    }
}
String.prototype.PadRight = function (totalWidth, paddingChar) {
    if (paddingChar != null) {
        return this.PadHelper(totalWidth, paddingChar, true);
    } else {
        return this.PadHelper(totalWidth, ' ', true);
    }

}
String.prototype.PadHelper = function (totalWidth, paddingChar, isRightPadded) {

    if (this.length < totalWidth) {
        var paddingString = new String();
        for (i = 1; i <= (totalWidth - this.length) ; i++) {
            paddingString += paddingChar;
        }

        if (isRightPadded) {
            return (this + paddingString);
        } else {
            return (paddingString + this);
        }
    } else {
        return this;
    }
}

function flashChecker() {
    var hasFlash = 0;　　　　 //是否安装了flash 
    var flashVersion = 0;　　 //flash版本 
    if (document.all) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
            hasFlash = 1;
            VSwf = swf.GetVariable("$version");
            flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return {
        f: hasFlash,
        v: flashVersion
    };
}

var ZP = { browser: 'unknow', browserVersion: '0' };

function CheckBrowser() {
    var ua = navigator.userAgent.toLowerCase(),
browserRegExp = {
    ie: /msie[ ]([\w.]+)/,
    firefox: /firefox[ |\/]([\w.]+)/,
    chrome: /chrome[ |\/]([\w.]+)/,
    safari: /version[ |\/]([\w.]+)[ ]safari/,
    opera: /opera[ |\/]([\w.]+)/
};
    ZP.browser = 'unknow';
    ZP.browserVersion = '0';
    for (var i in browserRegExp) {
        var match = browserRegExp[i].exec(ua);
        if (match) {
            ZP.browser = i;
            ZP.browserVersion = match[1];
            break;
        }
    }

    var isIE11 = (ua.toLowerCase().indexOf("trident") > -1 && ua.indexOf("rv") > -1);
    if (isIE11) {
        var reIE11 = /[(rv):](\d+\.\d+)/;
        ////console.log(ua);
        var mt = reIE11.exec(ua);
        // //console.log(mt);
        var ie11ver = mt[1];
        // //console.log(ie11ver);
        ZP.browser = "ie";
        ZP.browserVersion = ie11ver;
    }
}


function loaddiv(id, url) {
    var target = $('#' + id);
    // target.empty();
    target.addClass("loader");
    target.empty().append("加载中... ...");

    $.ajax(
    {
        type: "get",
        url: url,
        cache: false,
        error: function (xhr, textStatus, errorThrown) {
            target.empty().append(textStatus);
            target.removeClass("loader");
        },
        success: function (msg) {
            target.empty().append(msg);
            target.removeClass("loader");
        }
    });
}

function loadPartialView(targetdiv, url, params) {
    targetdiv.empty();
    targetdiv.addClass("loader");
    targetdiv.append("加载中... ...");
    $.post(url, params)
        .success(function (e) {
            targetdiv.empty().append(e);
            targetdiv.removeClass("loader");
        });

};

function jsonAjaxPost(paramUrl, paramData, onSuccess, onError, isasync) {
    if (!onError) {
        onError = function (response) {
            //console.log(response);
            slog(response);
        };
    }
    jsonAuthAjax(paramUrl, paramData, onSuccess,onError, "POST", isasync);
}

function jsonAjaxGet(paramUrl, paramData, onSuccess, onError, isasync) {
    if (!onError) {
        onError = function (response) {
            slog(response);
        };
    }
    jsonAuthAjax(paramUrl, paramData, onSuccess,onError, "GET", isasync);
}


function slog(s) {
    try {
        console.log(s);
    }
    catch (e) { }
}

var cloneobj = (function () {
    // classify object
    var classof = function (o) {
        if (o === null) { return "null"; }
        if (o === undefined) { return "undefined"; }
        // I suppose Object.prototype.toString use obj.constructor.name
        // to generate string
        var className = Object.prototype.toString.call(o).slice(8, -1);
        return className;
    };

    var references = null;

    var handlers = {
        // Handle regexp and date even in shallow.
        'RegExp': function (reg) {
            var flags = '';
            flags += reg.global ? 'g' : '';
            flags += reg.multiline ? 'm' : '';
            flags += reg.ignoreCase ? 'i' : '';
            return new RegExp(reg.source, flags);
        },
        'Date': function (date) {
            return new Date(+date);
        },
        'Array': function (arr, shallow) {
            var newArr = [], i;
            for (i = 0; i < arr.length; i++) {
                if (shallow) {
                    newArr[i] = arr[i];
                } else {
                    // handle circular reference
                    if (references.indexOf(arr[i]) !== -1) {
                        continue;
                    }
                    var handler = handlers[classof(arr[i])];
                    if (handler) {
                        references.push(arr[i]);
                        newArr[i] = handler(arr[i], false);
                    } else {
                        newArr[i] = arr[i];
                    }
                }
            }
            return newArr;
        },
        'Object': function (obj, shallow) {
            var newObj = {}, prop, handler;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    // escape prototype properties
                    if (shallow) {
                        newObj[prop] = obj[prop];
                    } else {
                        // handle circular reference
                        if (references.indexOf(obj[prop]) !== -1) {
                            continue;
                        }
                        // recursive
                        handler = handlers[classof(obj[prop])];
                        if (handler) {
                            references.push(obj[prop]);
                            newObj[prop] = handler(obj[prop], false);
                        } else {
                            newObj[prop] = obj[prop];
                        }
                    }
                }
            }
            return newObj;
        }
    };

    return function (obj, shallow) {
        // reset references
        references = [];
        // default to shallow clone
        shallow = shallow === undefined ? true : false;
        var handler = handlers[classof(obj)];
        return handler ? handler(obj, shallow) : obj;
    };
}());


///bootstrap 3.x modal center
/* center modal */
function centerModals(modal) {
    var $clone = modal.clone().css('display', 'block').appendTo('body');
    var top = Math.round(($clone.height() - $clone.find('.modal-dialog').height()) / 2);
    top = top > 0 ? top : 0;
    $('.modal').each(function (i) {
        $(this).find('.modal-dialog').css("margin-top", top * 0.6);//.css("margin-left", left);
    });
    $clone.remove();
}

function fixedIe8Palceholder() {
    if (!('placeholder' in document.createElement('input'))) {

        $('input[placeholder],textarea[placeholder]').each(function () {
            var that = $(this),
            text = that.attr('placeholder');
            if (that.val() === "") {
                that.val(text).addClass('placeholder');
            }
            that.focus(function () {
                if (that.val() === text) {
                    that.val("").removeClass('placeholder');
                }
            })
            .blur(function () {
                if (that.val() === "") {
                    that.val(text).addClass('placeholder');
                }
            })
            .closest('form').submit(function () {
                if (that.val() === text) {
                    that.val('');
                }
            });
        });
    }
}

function arrRemove(arr,value){    
    var index = $.inArray(value,arr);

    if (index >= 0) {
        //arrayObject.splice(index,howmany,item1,.....,itemX)

        //参数    描述
        //index  必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
        //howmany 必需。要删除的项目数量。如果设置为 0，则不会删除项目。
        //item1, ..., itemX 可选。向数组添加的新项目。
        arr.splice(index, 1);
    }
}