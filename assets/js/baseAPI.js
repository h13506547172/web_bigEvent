// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  options.url = 'http://www.liulongbin.top:3007' + options.url;
  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token'),
    };
  }

  //complete是ajax提供的，返回的res包含传输的全过程
  options.complete = (res) => {
    // console.log(res);
    //判断返回的信息是不是因本地密钥不存在或过期
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败！'
    ) {
      //清空本地密匙
      localStorage.removeItem('token');
      //回到登录页面
      location.href = '/login.html';
    }
  };
});
