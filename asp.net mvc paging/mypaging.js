/*
 1.在你要放置分页内容的页面,设置分页内容容器, 

<div id="pageDiv">

</div>

2.用法:
要将一个列表页面,渲染到div : pageDiv 中,且渲染分页工具栏:
    url: 指向你渲染分页页面的partialview 
    showInfo: 是否显示分页信息, 显示内容例如:  共 150 条 / 15 页
    paramData: 分页查询的参数信息,pageSize和pageIndex 属性是必须的,其他查询用的属性,可自己随意增加或定义.
    shownumbers:true,  //是否显示分页数字按钮,默认为true,若为false,则只显示首页,前页,当前页码,下页,尾页按钮.
    method: // http请求方法, GET 或POST,默认可不设置此参数,默认值为GET
    firsttext: 第一页按钮自定义文本,默认值为 << == &lt;&lt;
    pretext: 上一页按钮自定义文本,默认值为 < == &lt;
    nexttext: 下一页按钮自定义文本,默认值为 > == &gt;
    lasttext: 最后一页按钮自定义文本,默认值为 >> == &gt;&gt;
    pageBarContainer: 自定义分页条容器Id,为空,则自动追加到分页容器,不为空则渲染到指定Id的容器中,例如: '#zpPager',
    loadingtext: 自定义加载遮罩提示文本..默认为  'loading ...'
    showloading:true; //是否使用内置的loading 加载遮罩,默认 true.
    loadedCallback:function(container){}, 页面加载完毕回调方法,参数为要渲染页面的容器的jquery对象
    loadingCallback:function(container){},页面开始加载回调方法,参数为要渲染页面的容器的jquery对象
   $('#pageDiv').Paging({
            url: hostVTPath + "/Home/GetPagedList",
            showInfo:true,
            paramData:{content:'asflasjflsdajfjsd'},
            shownumbers:true,
            pageSize:10,
            pageIndex:1,
            loadingtext:''  //默认值为 loading ...
            pageBarContainer:'',
            method:'GET' , 
            firsttext:'首页',
            pretext:'上一页',
            nexttext:'下一页',
            lasttext:'尾页',
            showloading:true;
            loadedCallback:function(container){},
            loadingCallback:function(container){}
        });
 
 // 例如:
 function onloadfinish(container) {
            var cid = $(container).attr('id');
            console.log(cid + ", page load finished");
        }

3. 在渲染的partialview里,回调一下setTotalRows()方法,通知分页控制条总共的记录数.
      $(document).ready(function() {
        //此处用的pageDiv为你渲染此partial的容器Id,
        

        回调方法的参数:
        totalrows:查询数据的总条数.
        pageindex:当前页码
        pagesize: 分页大小,默认值为10.

        $('#pageDiv').setTotalRow(total,pageindex,pagesize);
    });
 */

//给jquery对象增加扩展方法.在方法内部可以使用$(this)类访问当前调用方法的对象.
$.fn.extend({
    zpSetTotalRow: function (totalrows, pageindex, pagesize) {

        var ctid = $(this).attr('id');

        var callback = window.zppaging[ctid].callback;

        var options = window.zppaging[ctid].options;

        var $container = $(this);
 
        if (options.pageBarContainer) {
      
            //兼容指定分页控件容器功能,将分页工具条渲染到指定的容器中
            var pbarContainer = options.pageBarContainer;

            if (pbarContainer[0] !== '#') {
                pbarContainer = '#' + pbarContainer;
            }

            $container = $(pbarContainer);

            $container.empty();
        }

        renderpaging($container, options, pageindex, pagesize, totalrows);

        var $psize = $container.find('#pageSize');
        var $pcount = $container.find('#pageCount');
        var $trow = $container.find('#totalRows');
        var $currentPage = $container.find('#currentPage');

        var cpage = $currentPage.val();

        var pageSize = parseInt($psize.val());
        var pagecount = parseInt(totalrows / pageSize);
        var ooPgc = totalrows % pageSize;
        if (ooPgc > 0) {
            pagecount++;
        }
        $trow.val(totalrows);
        $pcount.val(pagecount);

        function renderpaging(container, options, pageindex, pagesize, totalrow) {
             
            var numbtnWidth = 40;
          
            var pagecount = parseInt(totalrows / pagesize);
            var ooPgc = totalrows % pagesize;
            if (ooPgc > 0) {
                pagecount++;
            }
            //add hidden params container
            var html = [];

            html.push(' <input type="hidden" id="totalRows" value="' + totalrow + '" />');
            html.push(' <input type="hidden" id="pageSize" value="' + pagesize + '" />');
            html.push(' <input type="hidden" id="pageCount" value="' + pagecount + '" />');
            html.push(' <input type="hidden" id="currentPage" value="' + pageindex + '" />');

            $(container).append($(html.join('')));

            var $htotal = $(container).find("#totalRows");
            var $pageCount = $(container).find("#pageCount");
            var $pageSize = $(container).find("#pageSize");
            var $currentPage = $(container).find("#currentPage");
            $pageSize.val(pagesize);

            // :生成各个分页按钮.
            var pageDivhtml = "<div class='p-pg' id='ppg'><ul class='pagination'>";

            //add first and pre button
            pageDivhtml += "<li><a href='javascript:void(0);' class='p-first hover' id='pfirst'>" + options.firsttext + "</a></li>";
            pageDivhtml += "<li><a href='javascript:void(0);' class='p-pre hover' id='ppre'>" + options.pretext + "</a></li>";

            //process number buttons.
            var current = pageindex;

            //确定当前页之前,之后的页码,保证一共出现11个页码按钮
            if (options.shownumbers) {

                if (pagecount > 10) {
                    var startpg = 1;

                    if (current >= 6) {
                        startpg = current - 5;
                    }

                    if (current + 5 > pagecount) {
                        startpg = pagecount - 10;
                    }

                    var maxI = startpg + 11;

                    for (var i = startpg; i < maxI; i++) {
                        //  slog(i);
                        if (i === current) {
                            pageDivhtml += "<li><a href='javascript:void(0);' class='p-number hover'  style='width:" +
                                numbtnWidth +
                                "px;' id='p" +
                                i +
                                "'>" +
                                i +
                                "</a></li>";
                        } else {
                            pageDivhtml += "<li><a href='javascript:void(0);' class='p-numbers hover'  style='width:" +
                                numbtnWidth +
                                "px;'  id='p" +
                                i +
                                "'>" +
                                i +
                                "</a></li>";
                        }
                    }

                } else {
                    for (var j = 1; j <= pagecount; j++) {
                        var pg1 = j;
                        if (j === current) {
                            pageDivhtml += "<li><a href='javascript:void(0);' class='p-number hover'  style='width:" +
                                numbtnWidth +
                                "px;'  id='p" +
                                current +
                                "'>" +
                                current +
                                "</a></li>";
                        } else {
                            pageDivhtml += "<li><a href='javascript:void(0);' class='p-numbers hover'  style='width:" +
                                numbtnWidth +
                                "px;' id='p" +
                                pg1 +
                                "'>" +
                                pg1 +
                                "</a></li>";
                        }
                    }
                }
            } else {
                pageDivhtml += "<li><a href='javascript:void(0);' class='p-number hover'  style='width:" +
                               numbtnWidth +
                               "px;' id='p" +
                               current +
                               "'>" +
                               current +
                               "</a></li>";
            }
            //add last and next button
            pageDivhtml += "<li><a href='javascript:void(0);' class='p-next hover' id='pnext'>" + options.nexttext + "</a></li>";
            pageDivhtml += "<li><a href='javascript:void(0);' class='p-last hover' id='plast'>" + options.lasttext + "</a></li>";

            //add info 
            if (options.showInfo) {
                var infostr = "共 " + totalrows + " 条" + " / " + pagecount + " 页";
                var infohtml = "<li><span style='margin-left:10px;'>" + infostr + "</span></li>";
                pageDivhtml += infohtml;
            }

            //将分页容器控件添加到页面容器
            pageDivhtml += " </ul></div>";
            $(container).append(pageDivhtml);

            var $first = $(container).find('.p-first'); // $('#pfirst');
            var $pre = $(container).find('.p-pre'); //$('#ppre');
            var $number = $(container).find('.p-number'); //$('#pnumber');
            var $next = $(container).find('.p-next'); //$('#pnext');
            var $last = $(container).find('.p-last'); //$('#plast');
 
            $(container).css("text-align", options.align);
            $(container).css("vertical-align", 'central');
 
            var $pagination = $(container).find('.pagination');
            if ($pagination.length > 0) {
                $pagination.css("margin", 0).css("height", 25);
            }

            if (options.shownumbers) {
                var $numberbuttons = $(container).find('.p-numbers');//所有数字按钮

                $numberbuttons.off('click')
                    .on('click',
                        function (e) {
                            var $pbar = $(this).parents('.p-pg').parent();
                            var $pSize = $pbar.find("#pageSize");

                            var tonumber = $(this).html();
                            var pSize = parseInt($pSize.val());
                            callback(pSize, tonumber);
                            $(this).blur();

                        });
            }

            //bind click event
            $number.off('click')
                .on('click',
                    function (e) {
                        e.preventDefault();
                        $(this).blur();
                    });

            $number.parent().attr('class', 'active');

            if (pageindex === 1) {
                $first.parent().attr('class', 'disabled');
                $pre.parent().attr('class', 'disabled');
            }

            if (pageindex === pagecount) {
                $next.parent().attr('class', 'disabled');
                $last.parent().attr('class', 'disabled');
            }

            $first.off('click')
                .on('click',
                    function (e) {  

                        var $pbar = $(this).parents('.p-pg').parent();
  
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var oparam = { pageNumber: 1, pageSize: 10 };
                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());

                        oparam.pageNumber = 1;
                        oparam.pageSize = pSize;

                        if (cpage === 1) {
                            return;
                        }

                        callback(pSize, oparam.pageNumber);
                        $(this).blur();
                    });
            $last.off('click')
                .on('click',
                    function (e) { //off('click').
                        var $pbar = $(this).parents('.p-pg').parent();
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());

                        if (cpage === pCount) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                        if (pCount === 0 || cpage >= pCount) {
                            
                        } else {
                            cpage = pCount;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;
                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                    });

            $pre.off('click')
                .on('click',
                    function (e) {  
                        var $pbar = $(this).parents('.p-pg').parent();
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());

                        if (cpage === 1) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                        if (cpage > 1) {
                            cpage--;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;
                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                    });
            $next.off('click')
                .on('click',
                    function (e) { 
                        var $pbar = $(this).parents('.p-pg').parent();
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());

                        if (cpage === pCount) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                       
                        if (cpage < pCount) {
                            cpage++;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;
                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                    });
        }
    },
    zpPaging: function (options) {
        //--处理参数
        var $pageingContainer = $(this);
        var ctid = $pageingContainer.attr("id");

        window.zppaging = {};
        window.zppaging[ctid] = {};

        if (options) {
            if (!options.pageSize) {
                options.pageSize = 10;
            }
            if (!options.pageIndex) {
                options.pageIndex = 1;
            }
            if (!options.align) {
                options.align = 'left';
            }
            if (!options.paramData) {
                options.paramData = { pageSize: options.pageSize, pageIndex: options.pageIndex };
            }
            if (!options.url) {
                option.url = '';
                slog('paging target url is null!');
                return false;
            }
            if (options.shownumbers == undefined) {
                options.shownumbers = true;
            }
            if (!options.meghod) {
                options.method = "GET";
            }
            if (!options.firsttext) {
                options.firsttext = "&lt;&lt;";
            }
            if (!options.pretext) {
                options.pretext = "&lt;";
            }
            if (!options.lasttext) {
                options.lasttext = "&gt;&gt;";
            }
            if (!options.nexttext) {
                options.nexttext = "&gt;";
            }
            if (!options.loadingtext) {
                options.loadingtext = 'loading ...';
            }
            if (options.showloading == undefined) {
                options.showloading = true;
            }
            if (!options.loadedCallback) {
                options.loadedCallback = function (container) { };
            }
            if (!options.loadingCallback) {
                options.loadingCallback = function (container) { };
            }
        } else {
            options = {
                pageSize: 10,
                pageIndex: 1,
                showInfo: false
            };
        }

        window.zppaging[ctid].options = options;
        window.zppaging[ctid].callback = showPageing;

        //render paging content
        showPageing(options.pageSize, options.pageIndex);

        //========== inner function definenation
        //reqeust url and show data
        function showPageing(pagesize, pageindex) {
            //begin loadpaging
            options.loadingCallback($pageingContainer);

            if (options.showloading) {
                try { //trying to use jquery.blockUI.js to show loading overlay. if do not reference it.then no overlay effect.and because to catch the error,there will be no error reported.
                    $.blockUI.defaults.overlayCSS.opacity = '.2';
                    $pageingContainer
                        .block({
                            message: '<div style=""><i class="fa fa-spinner fa-pulse fa-3x fa-fw" ></i><span class="">' + options.loadingtext + '</span></div>', //sr-only
                            css: { border: '2px' }
                        });
                }
                catch (e) { }
            }

            var url = options.url;
            var paramData = options.paramData;
            paramData.pageSize = pagesize;
            paramData.pageIndex = pageindex;

            if (options.method.toUpperCase() === "GET") {
                jsonAjaxGet(url, paramData, onsuccess, onerror);
            } else {
                jsonAjaxPost(url, paramData, onsuccess, onerror);
            }

            function onsuccess(r) {
                $pageingContainer.html(r);
                options.loadedCallback($pageingContainer);
                if (options.showloading) {
                    try {
                        $pageingContainer.unblock();
                    } catch (e) {
                    }
                }
            }

            function onerror(r) {
                options.loadedCallback($pageingContainer);
                if (options.showloading) {
                    try {
                        $pageingContainer.unblock();
                    } catch (e) {
                    }
                }
            }
        }
        return true;
    }
});