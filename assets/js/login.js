$(function(){
    // 去注册
    $("#link_reg").on("click",function(){
        $(".login-box").hide()
        $(".reg-box").show()
    })
    // 去登陆
    $("#link_login").on("click",function(){
        $(".login-box").show()
        $(".reg-box").hide()
    })

    var form = layui.form
    var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
        var pwd = $('.reg-box [name=password]').val()
        if (pwd !== value) {
            return '两次密码不一致！'
        }
        }
    })

    // 注册
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            // 点击
            $('#link_login').click()
            $("#form_reg")[0].reset()
        })
    })

    // 注册提交
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
        url: '/api/login',
        method: 'POST',
        // 快速获取表单中的数据
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
            return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
        }
        })
    })

    // 登录功能
    $("#form_login").submit(function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                
            }
        });
    })

})