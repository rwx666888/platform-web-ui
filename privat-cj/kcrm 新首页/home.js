$(function () {
  // 查看更多弹窗
  function moreNoticeBox(type) {
    cumCurWinModal('更多', '/kcrm-web/notice/homeList?type=' + type, top);
  }

  // 查看单个公告
  function noticeItemBox(id) {
    cumCurWinModal(null, './notice.html?id=' + id, top, {
      area: ['60%', '60%'],
      other: { closeBtn: 1 }
    });
  }

  // superslide init
  $('#js_swiper_bar').slide({
    // autoPage: true,
    autoPlay: true,
    titCell: '.home__swiper-pointer li',
    mainCell: '.home__swiper-figure ul',
    effect: 'leftLoop'
  });

  // event bind
  // 查看更多 在标签上写 data-type="xxx"
  // 查看单个公告 在标签上写 data-notice_id="xxx"
  $(document)
    .on('click', '#js_swiper_bar .home__swiper-figure li', function () {
      // 点击轮播图 li 触发时间
      var item = $(this);
      var itemData = item.data();

      if (itemData.notice_id) {
        // todo 弹窗方法
        noticeItemBox(itemData.notice_id);
      }
    })
    .on('click', '.js-open-more', function () {
      // 点击更多
      var item = $(this);
      var itemData = item.data();

      if (itemData.type) {
        // todo 弹窗方法
        moreNoticeBox(itemData.type);
      }
    })
    .on('click', '#js_open_layer_yhzx li', function () {
      // 点击优惠政策某项
      var item = $(this);
      var itemData = item.data();

      if (itemData.notice_id) {
        // todo 弹窗方法
        noticeItemBox(itemData.notice_id);
      }
    })
    .on('click', '#js_open_layer_tctmdt li', function () {
      // 点击优惠政策某项
      var item = $(this);
      var itemData = item.data();

      if (itemData.notice_id) {
        // todo 弹窗方法
        noticeItemBox(itemData.notice_id);
      }
    });
});
