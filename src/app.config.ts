const projectConfig = require("../project.config.json");
console.log("🚀 ~ file: app.config.ts:2 ~ projectConfig:", projectConfig.appid)
const AppConfig = {
  fushu: {
    appId: "wxc662de75e52ad4d5"
  },
  child: {
    appId: "wxb7471fee564e0831"
  },
  leibo: {
    appId: "wx45988ee03543eb16"
  }
};

export default {
  pages: [
    "pages/index/index",
    "pages/kefu/index",
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
    "pages/other/webView",
    "pages/meiyou/ad",
  ],
  subpackages: [
    {
      root: "evaluatePackage",
      pages: [
        "pages/stepDetail",
        "pages/recordList",
        "pages/ganyuList",
        "pages/ganyuDetail"
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
        "pages/lingdaoyi"
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
        "pages/growDetail"
      ]
    },
    {
      root: "childPackage",
      pages: ["pages/choose", "pages/manage", "pages/edit", "pages/register"]
    }
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
    list:
      projectConfig.appid === AppConfig.fushu.appId
        ? [
            {
              pagePath: "pages/index/index",
              text: "首页"
            },
            {
              pagePath: "pages/kefu/index",
              text: "客服"
            },
            {
              pagePath: "pages/mine/index",
              text: "个人中心"
            }
          ]
        : [
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
  }
};
