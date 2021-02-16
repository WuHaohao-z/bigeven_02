var baseAPI = 'http://api-breakingnews-web.itheima.net'

$.ajaxPrefilter(function(options){
    options.url = baseAPI + options.url
})