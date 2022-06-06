import "@/service/http_interceptors";
import request from "@/service/request";
import { View } from "@tarojs/components";
import Taro, { navigateTo } from "@tarojs/taro";
import React, { Component } from "react";
import "./app.scss";
import "./custom-variables.scss";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {
    this.getAuth();
  }

  componentDidHide() {}

  componentDidCatchError() {}

  async getAuth() {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();
    const res = await request({
      url: "/miniapp/wxLogin",
      data: {
        code: login.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      }
    });
    if (res.code === 2) {
      navigateTo({ url: "/pages/login/index" });
    }
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return <View className="html">{this.props.children}</View>;
  }
}

export default App;
