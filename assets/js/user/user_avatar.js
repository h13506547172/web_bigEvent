$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  //模拟点击事件
  $('#btnChoosePic').click(function () {
    $('#file').click();
  });

  $('#file').change(function (e) {
    // console.log(e);
    const fileLength = e.target.files.length;
    if (fileLength === 0) {
      return;
    }
    //把文件转换成路径
    const imgRoute = URL.createObjectURL(e.target.files[0]);
    // 3. 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgRoute) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //点击上传按钮把图片转换格式
  $('#btnUpPic').click(function () {
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
          .toDataURL('image/png');
      
          //发送数据
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg("更换头像失败！");
            }
            layer.msg("更换头像成功！");
            window.parent.getUserInfo();
        }
    })
  });

});
