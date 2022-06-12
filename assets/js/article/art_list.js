$(function () {
  const form = layui.form;
  //定义分页
  const laypage = layui.laypage
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  //渲染页面
  const initTable = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // console.log(res);
        const htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  };
  //美化时间
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  initTable();

  const initCate = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // console.log(res);
        const htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render('select');
      },
    });
  };

  //点击筛选发送请求
  $('#form-search').submit(function (e) {
    e.preventDefault();
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();
    // console.log(q);
    initTable();
  });

  //分页功能
// 定义渲染分页的方法
function renderPage(total) {
  // 调用 laypage.render() 方法来渲染分页的结构
  laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum,// 设置默认被选中的分页
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2, 3, 5, 10],// 每页展示多少条
      // 分页发生切换的时候，触发 jump 回调
    //jump在首次加载的时候也会触发，然后会无限循环
    jump: function (obj, first) {
      //obj包含了当前分页的所有参数，比如：
      console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
      // console.log(obj.limit); //得到每页显示的条数
      q.pagenum = obj.curr
      q.pagesize = obj.limit
          //首次不执行
    if(!first){
      initTable()
    }
    }
  })

  //删除模块
  $('tbody').on('click', '.btn-del', function (e) {
    const id = $(this).attr('data-id')
    let btnDel_len = $('.btn-del').length
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) { 
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message)
          
          if (btnDel_len == 1) {
            q.pagenum = q.pagenum==1? 1 : q.pagenum -1 
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })
}
  initCate();
});

