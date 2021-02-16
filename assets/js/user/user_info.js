$(function(){
    var form = layui.form
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return "昵称长度为 1 ~ 6 位之间！"
            }
        }
    })

    // 用户渲染
    initUserInfo();
    var layer = layui.layer;
    function initUserInfo(){
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if(res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                form.val("formUserInfo",res.data)
            }
        });
    }

    // 重置
    $("#btnReset").on("click",function(e){
        e.preventDefault()
        initUserInfo()
    })

    // 修改信息
    $(".layui-form").on("submit",function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layer.msg("恭喜您，用户信息修改成功")
                // 重新渲染头像
                window.parent.getUserInof()
            }
        });
    })
})