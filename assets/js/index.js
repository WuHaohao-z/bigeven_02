$(function(){
    // 获取用户信息
    getUserInof();

    // 退出
    var layer = layui.layer
    $("#btnLogout").on("click",function(){
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            localStorage.removeItem("token");
            location.href = "/login.html"
            layer.close(index);
        });
    })
})

// 获取用户信息的函数
function getUserInof(){
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        
        success: function (res) {
            if(res.status !== 0){
                return layui.layer.msg(res.message)
            }
            renderAvayar(res.data)
        }
    });
}

// 渲染头像
function renderAvayar(user){
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 渲染头像
    if(user.user_pic !== null){
        // 有头像
        $(".layui-nav-img").show().attr("src",user.user_pic)
        $(".text-avatar").hide()
    }else{
        $(".layui-nav-img").hide()
        var text = name[0].toUpperCase()
        $(".text-avatar").show().html(text)
    }
}