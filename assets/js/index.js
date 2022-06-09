function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization:localStorage.getItem("token")
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) return layer.msg(res.message)
            layer.msg('获取信息成功')
            let { data } = res
            // console.log(data);
            renderAvatar(data)
        }
    })
}
//获取用户信息
getUserInfo()

//渲染用户信息

function renderAvatar(data) {
    const name = data.nickname || data.username
    $('#welcome').html('欢迎 '+name)
    if (data.user_pic !==null) {
        $('.layui-nav-img').attr('src', data.user_pic).show()
        $('.text-avatar').hide()
    } else {
        let firstname = name[0]
        $('.text-avatar').html(name[0]).show()
        $('.layui-nav-img').hide()
    }
}



//退出按钮
$('#exit_btn').click(function () {
    layer.confirm('是否退出?', { icon: 3, title: '提示' }, function (index) {
        localStorage.removeItem("token")
        location.href = '/login.html'
      });
})
