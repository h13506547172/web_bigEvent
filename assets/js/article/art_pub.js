$(function () {
  // 初始化富文本编辑器
  initEditor();
  const form = layui.form;
  const initCate = function () {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败');
        }
        //结构化数据并渲染
        const htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 一定要记得调用 form.render() 方法 否则看不到页面的变化
        //layui自身问题
        form.render('select');
      },
    });
  };
  initCate();

  // 1. 初始化图片裁剪器
  var $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //模拟点击文件上传
  $('#btnChooseImage').click(function () {
    $('#coverFile').click();
  });
  //监听文件上传事件
  $('#coverFile').change(function (e) {
    const fileLength = e.target.files.length;
    if (fileLength <= 0) return;
    //取第一张图片
    const file = e.target.files[0];
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(file);
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //定义发布状态
  let art_state = '已发布';

  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  });

  //监听发表文章表单提交
  $('#form-pub').submit(function (e) {
    e.preventDefault();
    //发布文章前数据处理
    let fd = new FormData($('#form-pub')[0]);
    //给fd添加属性
    fd.append('state', art_state);
    // console.log(fd);
    // console.log(fd.get('title'));
    // console.log(fd.get('cate_id'));
    // console.log(fd.get('content'));
    // console.log(fd.get('art_state'));

    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
        window.parent.change()
      });
  });

  // 为表单绑定 submit 提交事件
// $('#form-pub').on('submit', function(e) {
//   // 1. 阻止表单的默认提交行为
//   e.preventDefault()
//   // 2. 基于 form 表单，快速创建一个 FormData 对象
//   var fd = new FormData($(this)[0])
//   // 3. 将文章的发布状态，存到 fd 中
//   fd.append('state', art_state)
//   // 4. 将封面裁剪过后的图片，输出为一个文件对象
//   $image
//       .cropper('getCroppedCanvas', {
//       // 创建一个 Canvas 画布
//       width: 400,
//       height: 280
//   })
//       .toBlob(function(blob) {
//       // 将 Canvas 画布上的内容，转化为文件对象
//       // 得到文件对象后，进行后续的操作
//       // 5. 将文件对象，存储到 fd 中
//       fd.append('cover_img', blob)
//       // 6. 发起 ajax 数据请求
//         publishArticle(fd)
//         window.parent.change()
//   })
// })

  //发送文章请求
    const publishArticle = function (fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
              data: fd,
              contentType: false,
              processData: false,
            success: function (res) {
                // console.log(res);
              if (res.status !== 0) {
                return layer.msg('发表失败');
                }
              layer.msg('发表成功')
              location.href = '/article/art_list.html'
            },
          });
    }
});
