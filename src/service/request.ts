import Taro, { getCurrentPages, navigateTo } from "@tarojs/taro";

const reqUrl = {
  develop: "https://wx-test.fushuhealth.com/recovery-wx",
  trial: "https://wx-test.fushuhealth.com/recovery-wx",
  release: "https://wx.fushuhealth.com/recovery-wx"
};
const accountInfo = wx.getAccountInfoSync();
const host = reqUrl[accountInfo.miniProgram.envVersion];

const request = (options: {
  url: string;
  method?: "POST" | "GET" | "DELETE" | "PUT";
  data?: any;
  [key: string]: any;
}): Promise<{ code?: number; data?: any; message: string } & Record<
  string,
  any
>> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...options,
      url: `${host}${options.url}`, //获取域名接口地址
      //header中可以监听到token值的变化
      success(request: any) {
        //监听成功后的操作
        if (request.statusCode === 200) {
          if (request.data?.success) {
            resolve(request.data);
          } else {
            Taro.showToast({
              title: request.data?.message,
              icon: "error",
              duration: 500
            });
            if (request.data?.code === 2) {
              const pages = getCurrentPages();
              const path = pages[pages.length - 1].route;
              navigateTo({
                url: `/pages/login/index?returnUrl=/${path}&channel=${options.channel}&orgid=${options.orgid}`
              });
            } else {
              reject(request.data);
            }
          }
        } else {
          //如果没有获取成功返回值,把request.data传入到reject中
          reject(request.data);
        }
      },
      fail(error: any) {
        //返回失败也同样传入reject()方法
        reject(error.data);
      }
    });
  });
};

export default request;
