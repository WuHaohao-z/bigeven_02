$(function(){

    // 设置表单信息
    // alert(location.search.split("=")[1])

    var form = layui.form
    var layer = layui.layer

    function initForm() {
        var id = location.search.split("=")[1];
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val("form-edit",res.data);
                // 赋值
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传照片！")
                }
                var newImg = baseURL + res.data.cover_img
                // 为裁剪区域重新设置图片
                $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImg)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }

    // 初始化分类
    initCate()
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                // 一定要记得调用 form.render() 方法
                form.render()
                initForm()
            }
        });
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击按钮，选择图片
    $("#btnChooseImage").on("click",function(){
        $("#coverFile").click()
    })

    // 设置图片
    $("#coverFile").change(function(e){
        // 获取文件
        var file = e.target.files[0]
        // 非空校验
        if(file == undefined){
            return ;
        }
        // 根据选择的文件，创建一个对应的URL
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })

    // 设置状态
    var state = "已发布"
    $("#btnSave2").on("click",function(){
        state = "草稿"
    })

    // 添加文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        // 将文章的发布状态，存到 fd 中
        fd.append('state', state)
         // 将封面裁剪过后的图片，输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
            fd.append('cover_img', blob)
            // 发起 ajax 数据请求
            publishArticle(fd)
        })
    })

    // 封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
          method: 'POST',
          url: '/my/article/edit',
          data: fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType: false,
          processData: false,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg(res.message)
            }
            layer.msg('修改文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            // location.href = '/article/art_list.html'
            setTimeout(function(){
                window.parent.document.getElementById("art_list").click()
            },1500)
          }
        })
    }

})