$(function () {
  const form = layui.form;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度不能超过6位';
      }
    },
  });

  //获取用户基本资料
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取用户信息失败！');
        // console.log(res);
        //为表单添加lay-filter="formUserInfo"属性  填充表单
        form.val('formUserInfo', res.data);
      },
    });
  }
  initUserInfo();

  //重置表单按钮
  $('#resetBtn').click(function (e) {
    e.preventDefault();
    initUserInfo();
  });

  //提交更新
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取用户信息失败！');
        //通知父页面更新信息
        window.parent.getUserInfo();
      },
    });
  });
});
