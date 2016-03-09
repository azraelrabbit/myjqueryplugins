/*
 1.在你要放置分页控制条的位置填入如下代码
 其中,div的id : ppg 可以自己修改,在之后的代码里保证一致即可.
 结构尽量别修改,可以适当的使用样式调整分页条的显示效果.
 两种结构和样式选择:
 原生不加样式:
 <div class="p-pg" id="ppg">    
    <a href="javascript:void(0);" class="p-first" id="pfirst">@Html.Raw(Html.Encode("<<"))</a>
    <a href="javascript:void(0);" class="p-pre" id="ppre">@Html.Raw(Html.Encode("<"))</a>
    <a href="javascript:void(0);" class="p-number" id="pnumber">1</a>
    <a href="javascript:void(0);" class="p-next" id="pnext">@Html.Raw(Html.Encode(">"))</a>
    <a href="javascript:void(0);" class="p-last" id="plast">@Html.Raw(Html.Encode(">>"))</a>
</div>
  使用bootstrap paging样式

  <div class="p-pg" id="ppg">  
        <ul class="pagination">
            <li><a href="javascript:void(0);" class="p-first hover" id="pfirst">@Html.Raw(Html.Encode("<<"))</a></li>
            <li><a href="javascript:void(0);" class="p-pre" id="ppre">@Html.Raw(Html.Encode("<"))</a></li>
            <li><a href="javascript:void(0);" class="p-number" id="pnumber">1</a></li>
            <li><a href="javascript:void(0);" class="p-next" id="pnext">@Html.Raw(Html.Encode(">"))</a></li>
            <li><a href="javascript:void(0);" class="p-last" id="plast">@Html.Raw(Html.Encode(">>"))</a></li>
        </ul>  
</div>
2.用法:
定义你自己的渲染表格的js方法例子如下:
 function queryShow(oparam) {
        //$('#tbcontent')
        if (!oparam) {
            oparam = { pageNumber: 1, pageSize: 10 };
        }
        var url = hostVTPath + "/PG/GetPgView";
        var param = { pgind: oparam.pageNumber, pgsize: oparam.pageSize };
        jsonAjaxGet(url, param, function (r) {
            $('#tbcontent').html(r);
        });
    }

3. 在 $(document).ready()里实现初始化
      $(document).ready(function () {
        //初始化分页控制条 ppg控制条div的id,你可以自己修改
        pageSize:设置每页显示条数, 默认10条.
        align:设置分页条居左还是居右 'left'|'right',默认left
        callback:传入你的获取查询结果列表partialview的js方法名.  callback有接收参数oparam, 结构为: {pageSize:10,pageNumber}
        showInfo:是否显示分页信息,true|false , 默认不显示:false
         $('#ppg').pagingBar({
            pageSize: 10,
            callback: queryShow,
            align:'left',
            showInfo:false
        });

        //初始化自动渲染表格直接调用
        queryShow({pageNumber:1,pageSize:10});
    });

4. 在渲染的partialview里,回调一下setTotalRows()方法,通知分页控制条总共的记录数.
      $(document).ready(function() {
        //此处用的ppg为你对应的控制条的id.
        $('#ppg').setTotalRow(total);
    });
 */

//给jquery对象增加扩展方法.在方法内部可以使用$(this)类访问当前调用方法的对象.
$.fn.extend({
    setTotalRow: function (totalrows) {
        var $psize = $(this).find('#pageSize');
        var $pcount = $(this).find('#pageCount');
        var $trow = $(this).find('#totalRows');
        var pageSize = parseInt($psize.val());
        var pagecount = parseInt(totalrows / pageSize);
        var ooPgc = totalrows % pageSize;
        if (ooPgc > 0) {
            pagecount++;
        }
        $trow.val(totalrows);
        $pcount.val(pagecount);

        var $info = $(this).find('.p-info');
        if ($info.length < 1) {

        } else {
            var infostr = "共 " + totalrows + " 条"+" / "+pagecount+" 页";
            $info.html(infostr);
        }

    },
    pagingBar: function (options) {
  
        if (options) {
            if (!options.pageSize) {
                options.pageSize = 10;
            }
            if (!options.align) {
                options.align = 'left';
            }
            if (!options.callback) {
                options.callback= function(oparam) {}
            }
        } else {
            options = {
                pageSize: 10,
                align: 'left', //'right'
                callback: function (oparam) { },
                showInfo:false
            };
        }

     
        
        //$pg = $('#' + pgid);// 另一种查找子元素的方式
        //$tt = $pg.find('.p-next');

        //add hidden params container
        var html = [];
 
        html.push(' <input type="hidden" id="totalRows" value="0" />');
        html.push(' <input type="hidden" id="pageSize" value="10" />');
        html.push(' <input type="hidden" id="pageCount" value="0" />');
        html.push(' <input type="hidden" id="currentPage" value="1" />');

        $(this).append($(html.join('')));

        var $htotal = $(this).find("#totalRows");
        var $pageCount = $(this).find("#pageCount");
        var $pageSize = $(this).find("#pageSize");
        var $currentPage = $(this).find("#currentPage");
        $pageSize.val(options.pageSize);

        var $first = $(this).find('.p-first');// $('#pfirst');
        var $pre = $(this).find('.p-pre');//$('#ppre');
        var $number = $(this).find('.p-number');//$('#pnumber');
        var $next = $(this).find('.p-next');//$('#pnext');
        var $last = $(this).find('.p-last');//$('#plast');

        $(this).css("text-align", options.align);
        $(this).css("vertical-align", 'central');
 
        //process info bar
        //var infoStyle = '';
        if (options.showInfo) {
            //infoStyle = ' style="display:none;" ';  //' + infoStyle + '
            var infohtml = '<div style="display:inline;height:100%;margin-right: 40px;"><span class="p-info" style="margin-top:0px;"></span></div>';
            $(this).prepend($(infohtml));
        }

        var $pagination = $(this).find('.pagination');
        if ($pagination.length > 0) {
            $pagination.css("margin", 0).css("height", 25);
        }

        //bind click event
        $number.off('click').on('click', function(e) {
            e.preventDefault();
            $(this).blur();
        });

        $first.off('click').on('click', function (e) { //off('click').
           
            var $pbar = $(this).parents('.p-pg');

            var $rtotal = $pbar.find("#totalRows");
            var $pCount = $pbar.find("#pageCount");
            var $pSize = $pbar.find("#pageSize");
            var $cPage = $pbar.find("#currentPage");
            var $number = $pbar.find('.p-number');//$('#pnumber');
            var oparam = { pageNumber: 1, pageSize: 10 };
            var cpage = parseInt($cPage.val());
            var pSize = parseInt($pSize.val());
            var pCount = parseInt($pCount.val());
            if (cpage <= 1) {
               // return  ;
            }
            cpage = 1;
            oparam.pageNumber = 1;
            oparam.pageSize = pSize;

            $number.html(oparam.pageNumber);
            $cPage.val(cpage);

            options.callback(oparam);

            $(this).blur();
            // return  ;
        });
        $last.off('click').on('click', function (e) {//off('click').
            var $pbar = $(this).parents('.p-pg');

            var $rtotal = $pbar.find("#totalRows");
            var $pCount = $pbar.find("#pageCount");
            var $pSize = $pbar.find("#pageSize");
            var $cPage = $pbar.find("#currentPage");
            var $number = $pbar.find('.p-number');//$('#pnumber');

            var cpage = parseInt($cPage.val());
            var pSize = parseInt($pSize.val());
            var pCount = parseInt($pCount.val());

            var oparam = { pageNumber: 1, pageSize: 10 };
            if (pCount === 0 || cpage >= pCount) {
               // return  ;
            } else {
                cpage = pCount;
                oparam.pageNumber = cpage;
                oparam.pageSize = pSize;

                $cPage.val(cpage);
                options.callback(oparam);
                //$number.html("<span>"+cpage+"</span>");
                $number.html(cpage);
            }
            $(this).blur();
            //  return  ;
        });

        $pre.off('click').on('click', function (e) { //off('click').
          
            var $pbar = $(this).parents('.p-pg');
          
            var $rtotal = $pbar.find("#totalRows");
            var $pCount = $pbar.find("#pageCount");
            var $pSize = $pbar.find("#pageSize");
            var $cPage = $pbar.find("#currentPage");
            var $number = $pbar.find('.p-number');//$('#pnumber');

            var cpage = parseInt($cPage.val());
            var pSize = parseInt($pSize.val());
            var pCount = parseInt($pCount.val());

            var oparam = { pageNumber: 1, pageSize: 10 };
            if (cpage > 1) {
                cpage--;
                oparam.pageNumber = cpage;
                oparam.pageSize = pSize;

                $cPage.val(cpage);
                //$number.html("<span>" + cpage + "</span>");
                $number.html(cpage);

                options.callback(oparam);
            }
            $(this).blur();
           // return  ;
        });
        $next.off('click').on('click', function (e) {//off('click').
            
            var $pbar = $(this).parents('.p-pg');

            var $rtotal = $pbar.find("#totalRows");
            var $pCount = $pbar.find("#pageCount");
            var $pSize = $pbar.find("#pageSize");
            var $cPage = $pbar.find("#currentPage");
            var $number = $pbar.find('.p-number');//$('#pnumber');

            var cpage = parseInt($cPage.val());
            var pSize = parseInt($pSize.val());
            var pCount = parseInt($pCount.val());
        
            var oparam = { pageNumber: 1, pageSize: 10 };
            if (pCount <= 1) {
               // return  ;
            }
            if (cpage < pCount) {
                cpage++;
                oparam.pageNumber = cpage;
                oparam.pageSize = pSize;

                $cPage.val(cpage);
                // $number.html("<span>" + cpage + "</span>");
                $number.html(cpage);
                options.callback(oparam);
            }
            $(this).blur();
            // return  ;
        });
    }
});