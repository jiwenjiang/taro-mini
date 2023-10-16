export default {
  pages: [
    "pages/index/index",
    // "pages/index/home",
    "pages/mine/index",
    "pages/login/index",
    "pages/evaluate/list",
    "pages/evaluate/index",
    "pages/evaluate/step",
    "pages/evaluate/brainDetail",
    "pages/evaluate/interventionList",
    "pages/evaluate/interventionDetail",
    "pages/evaluate/gmsDetail",
    "pages/evaluate/brainGmsDetail",
    "pages/evaluate/previewReport",
    "pages/evaluate/detail",
    "pages/other/webView"
  ],
  subpackages: [
    {
      root: "evaluatePackage",
      pages: [
        "pages/stepDetail",
        "pages/recordList",
        "pages/ganyuList",
        "pages/ganyuDetail",
      ]
    },
    {
      root: "orderPackage",
      pages: [
        "pages/order/scale",
        "pages/order/detail",
        "pages/order/gmsPay",
        "pages/order/videoList",
        "pages/book/index",
        "pages/book/records",
        "pages/AIevaluate/index",
        "pages/xianliti",
        "pages/lingdaoyi",
      ]
    },
    {
      root: "minePackage",
      pages: [
        "pages/setting",
        "pages/password",
        "pages/info",
        "pages/vaccination",
        "pages/grow",
        "pages/growList",
        "pages/growDetail",
      ]
    },
    {
      root: "childPackage",
      pages: [
        "pages/choose",
        "pages/manage",
        "pages/edit",
        "pages/register"
      ]
    },
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
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序定位"
    }
  },
};
