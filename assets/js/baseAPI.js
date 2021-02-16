var baseAPI = 'http://api-breakingnews-web.itheima.net'

$.ajaxPrefilter(function(options){
    options.url = baseAPI + options.url

    // 身份认证
    if(options.url.indexOf("/my/") !== -1){
        options.headers={
            Authorization:localStorage.getItem("token") || ""
        }
    }

    options.complete = function(res){
        var obj = res.responseJSON
        if(obj.status == 1 && obj.message == "身份认证失败！"){
            localStorage.removeItem("token")
            location.href = "/login.html"
        }
    }
})