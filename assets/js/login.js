$(function () {
    //点击去注册切换
    $("#link_reg").click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录切换
    $("#link_login").click(function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //先获得layui.form
    const form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        repwd: function (val) {  //val是本表单的值
        const pwd = $("#zc_pwd").val();
        if(pwd !== val) return "两次密码不一致"
        }
    })

    //设置根链接
    // const baseUrl = 'http://www.liulongbin.top:3007'
    //发送注册请求
    $('#form_reg').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#zc_une').val(),
                password: $('#zc_pwd').val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status !==0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                $("#link_login").click()
            }
        })
    })

    //发送登录请求
    $('#form_login').submit(function (e) {
        e.preventDefault()
        //发送请求
        console.log($('#form_login').serialize());
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $('#form_login').serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //将登录令牌存储在本地
                localStorage.setItem("token" , res.token)
                location.href = '/index.html'
            }
        })
    })
})