/*
 1.在你要放置分页内容的页面,设置分页内容容器, 

<div id="pageDiv">

</div>

2.用法:
要将一个列表页面,渲染到div : pageDiv 中,且渲染分页工具栏:
    url: 指向你渲染分页页面的partialview 
    showInfo: 是否显示分页信息, 显示内容例如:  共 150 条 / 15 页
    paramData: 分页查询的参数信息,pageSize和pageIndex 属性是必须的,其他查询用的属性,可自己随意增加或定义.
    method: // http请求方法, GET 或POST,默认可不设置此参数,默认值为GET
    firsttext: 第一页按钮自定义文本,默认值为 << == &lt;&lt;
    pretext: 上一页按钮自定义文本,默认值为 < == &lt;
    nexttext: 下一页按钮自定义文本,默认值为 > == &gt;
    lasttext: 最后一页按钮自定义文本,默认值为 >> == &gt;&gt;

   $('#pageDiv').Paging({
            url: hostVTPath + "/Home/GetPagedList",
            showInfo:true,
            paramData:{pageSize:10,pageIndex:1,content:'asflasjflsdajfjsd'},
            method:'GET' , 
            firsttext:'首页',
            pretext:'上一页',
            nexttext:'下一页',
            lasttext:'尾页'
        });
 

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
    setTotalRow: function (totalrows, pageindex, pagesize) {

        renderpaging($(this), pageindex, pagesize, totalrows);

        var $psize = $(this).find('#pageSize');
        var $pcount = $(this).find('#pageCount');
        var $trow = $(this).find('#totalRows');
        var $currentPage = (this).find('#currentPage');

        var cpage = $currentPage.val();

        var pageSize = parseInt($psize.val());
        var pagecount = parseInt(totalrows / pageSize);
        var ooPgc = totalrows % pageSize;
        if (ooPgc > 0) {
            pagecount++;
        }
        $trow.val(totalrows);
        $pcount.val(pagecount);

        function renderpaging(container, pageindex, pagesize, totalrow) {

            var numbtnWidth = 40;
            //$pg = $('#' + pgid);// 另一种查找子元素的方式
            //$tt = $pg.find('.p-next');
            var ctid = $(container).idOrName;

            var callback = window.zppaging[ctid].callback;

            var options = window.zppaging[ctid].options;

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
                        pageDivhtml += "<li><a href='javascript:void(0);' class='p-number hover'  style='width:" + numbtnWidth + "px;' id='p" + i + "'>" + i + "</a></li>";
                    } else {
                        pageDivhtml += "<li><a href='javascript:void(0);' class='p-numbers hover'  style='width:" + numbtnWidth + "px;'  id='p" + i + "'>" + i + "</a></li>";
                    }
                }

            } else {
                for (var j = 1; j <= pagecount; j++) {
                    var pg1 = j;
                    if (j === current) {
                        pageDivhtml += "<li><a href='javascript:void(0);' class='p-number hover'  style='width:" + numbtnWidth + "px;'  id='p" + current + "'>" + current + "</a></li>";
                    } else {
                        pageDivhtml += "<li><a href='javascript:void(0);' class='p-numbers hover'  style='width:" + numbtnWidth + "px;' id='p" + pg1 + "'>" + pg1 + "</a></li>";
                    }
                }
            }

            //add last and next button
            pageDivhtml += "<li><a href='javascript:void(0);' class='p-next hover' id='pnext'>" + options.nexttext+ "</a></li>";
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

            var $numberbuttons = $(container).find('.p-numbers');//所有数字按钮

            $(container).css("text-align", options.align);
            $(container).css("vertical-align", 'central');

            //process info bar

            //if (options.showInfo) {

            //    var infohtml =
            //        '<div style="display:inline;height:100%;margin-right: 40px;"><span class="p-info" style="margin-top:0px;"></span></div>';
            //    $(container).prepend($(infohtml));
            //}

            var $pagination = $(container).find('.pagination');
            if ($pagination.length > 0) {
                $pagination.css("margin", 0).css("height", 25);
            }

            $numberbuttons.off('click').on('click', function (e) {
                var $pbar = $(this).parents('.p-pg').parent();
                //var $rtotal = $pbar.find("#totalRows");
                //var $pCount = $pbar.find("#pageCount");
                var $pSize = $pbar.find("#pageSize");
                //var $cPage = $pbar.find("#currentPage");

                var tonumber = $(this).html();
                var pSize = parseInt($pSize.val());
                callback(pSize, tonumber);
                $(this).blur();

            });

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
                    function (e) { //off('click').

                        var $pbar = $(this).parents('.p-pg').parent();

                        var $rtotal = $pbar.find("#totalRows");
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var $number = $pbar.find('.p-number'); //$('#pnumber');
                        var oparam = { pageNumber: 1, pageSize: 10 };
                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());
                        if (cpage <= 1) {
                            // return  ;
                        }

                        oparam.pageNumber = 1;
                        oparam.pageSize = pSize;

                        if (cpage === 1) {
                            return;
                        }

                        callback(pSize, oparam.pageNumber);

                        $(this).blur();
                        // return  ;
                    });
            $last.off('click')
                .on('click',
                    function (e) { //off('click').
                        var $pbar = $(this).parents('.p-pg').parent();

                        var $rtotal = $pbar.find("#totalRows");
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var $number = $pbar.find('.p-number'); //$('#pnumber');

                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());

                        if (cpage === pCount) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                        if (pCount === 0 || cpage >= pCount) {
                            // return  ;
                        } else {
                            cpage = pCount;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;

                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                        //  return  ;
                    });

            $pre.off('click')
                .on('click',
                    function (e) { //off('click').

                        var $pbar = $(this).parents('.p-pg').parent();

                        var $rtotal = $pbar.find("#totalRows");
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var $number = $pbar.find('.p-number'); //$('#pnumber');

                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());

                        if (cpage === 1) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                        if (cpage > 1) {
                            cpage--;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;
                            ;
                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                        // return  ;
                    });
            $next.off('click')
                .on('click',
                    function (e) { //off('click').

                        var $pbar = $(this).parents('.p-pg').parent();

                        var $rtotal = $pbar.find("#totalRows");
                        var $pCount = $pbar.find("#pageCount");
                        var $pSize = $pbar.find("#pageSize");
                        var $cPage = $pbar.find("#currentPage");
                        var $number = $pbar.find('.p-number'); //$('#pnumber');

                        var cpage = parseInt($cPage.val());
                        var pSize = parseInt($pSize.val());
                        var pCount = parseInt($pCount.val());

                        if (cpage === pCount) {
                            return;
                        }

                        var oparam = { pageNumber: 1, pageSize: 10 };
                        if (pCount <= 1) {
                            // return  ;
                        }

                        if (cpage < pCount) {
                            cpage++;
                            oparam.pageNumber = cpage;
                            oparam.pageSize = pSize;

                            callback(pSize, oparam.pageNumber);
                        }
                        $(this).blur();
                        // return  ;
                    });
        }
    },
    Paging: function (options) {

        //--处理参数
        var pageingContainer = $(this);
        var ctid = $(pageingContainer).idOrName;
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
            if (!options.meghod) {
                options.method = "GET";
            }

            //<  ==  &lt;    >== &gt;
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

        } else {
            options = {
                pageSize: 10,
                align: 'left', //'right'
                //callback: function (oparam) { },
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
            var url = options.url;
            var paramData = options.paramData;
            paramData.pageSize = pagesize;
            paramData.pageIndex = pageindex;

            if (options.method.toUpperCase() === "GET") {
                jsonAjaxGet(url, paramData, onsuccess);
            } else {
                jsonAjaxPost(url, paramData, onsuccess);
            }

            function onsuccess(r) {
                pageingContainer.html(r);
            }

        }

        return true;
    }
});