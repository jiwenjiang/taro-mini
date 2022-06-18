export default {
  pages: [
    "pages/index/index",
    "pages/mine/index",
    "pages/login/index",
    "pages/evaluate/list",
    "pages/child/choose",
    "pages/evaluate/index",
    "pages/evaluate/brainDetail",
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
