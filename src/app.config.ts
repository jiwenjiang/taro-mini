export default {
  pages: [
    "pages/index/index",
    "pages/mine/index",
    "pages/login/index",
    "pages/evaluate/list",
    "pages/child/choose",
    "pages/child/manage",
    "pages/child/edit",
    "pages/evaluate/index",
    "pages/evaluate/brainDetail",
    "pages/evaluate/detail",
    "pages/evaluate/recordList",
    "pages/order/gmsPay",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    custom: true,
    color: "#000000",
    selectedColor: "#DC143C",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页"
      },
      {
        pagePath: "pages/mine/index",
        text: "个人中心"
      }
    ]
  }
};
