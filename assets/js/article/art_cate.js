$(function () {
  //快速填充表单需要做的
  const form = layui.form;
  const init_art_cate_list = function () {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败');
        }
        // console.log(res);
        const htmlStr = template('tpl-table', res.data);
        $('tbody').empty().html(htmlStr);
      },
    });
  };

  init_art_cate_list();

  //点击按钮弹窗，增加类别
    let indexadd = null
  $('#btnAddCate').click(function () {
    indexadd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    });
  });
    
    //监听表单提交事件，需要事件委托
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST', 
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message)
                //渲染数据
                init_art_cate_list()
                //关闭弹窗
                layer.close(indexadd);
            }
        })
    })
  
  //监听编辑按钮点击事件，需要事件委托
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
        // 弹出修改文章分类的弹窗
        indexEdit = layer.open({
          type: 1,
          area: ["500px", "250px"],
          title: "修改文章分类",
          content: $("#dialog-edit").html(),
        });
    const id = $(this).attr('data-id');
    //渲染编辑表单
    $.ajax({
      type: "GET",
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
      }
        // console.log(res);
        form.val("form-edit", res.data)
        
      }
    })
    //修改表单数据并提交
    $('body').on('submit', '#form-edit', function (e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          // console.log(res);
          //更新页面数据
          init_art_cate_list();
          //关闭编辑页面
          layer.close(indexEdit)
        }
      })
    })
  })


  //监听删除按钮点击事件
  $('tbody').on('click', '.btn-delete', function (index) {
    const id = $(this).attr('data-id')

    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) { 
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          
          layer.msg(res.message)
          layer.close(index)
          init_art_cate_list();
        }
      })
    })
  })

  //


});
