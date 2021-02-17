$(function(){

    // 定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr){
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 补零函数
    function padZero(n){
        return n > 9 ? n : '0' + n
    }


    // 定义提交参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    var layer = layui.layer
    initTable() 
    // 封装初始化文章列表函数
    function initTable(){
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template("tpl-table",res)
                $("tbody").html(str)
                // 调用分页
                renderPage(res.total)
            }
        });
    }

    var form = layui.form
    initCate()
    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template("tpl-cate",res)
                $("[name=cate_id]").html(str)
                form.render()
            }
        });
    }

    // 筛选功能
    $("#form-search").on("submit",function(e){
        e.preventDefault()
        var state = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        initCate()
    })

    // 分页
    var laypage = layui.laypage
    function renderPage(total){
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum // 设置默认被选中的分页

            // 分页模块设置，显示的子模块
            ,layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]

            ,jump:function(obj,first){
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if(!first) {
                    initTable()
                }
            }
        })
    }

    // 删除
    $("tbody").on("click",".btn-delete",function(){
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("文章删除成功")
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if($(".btn-delete").length == 1 && q.pagenum > 1 ) q.pagenum--
                    // 更新成功后渲染页面
                    initTable()
                }
            });
            layer.close(index)
        })
    })

})