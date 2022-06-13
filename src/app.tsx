import "@/service/http_interceptors";
import request from "@/service/request";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import Taro, { navigateTo, setStorageSync } from "@tarojs/taro";
import React, { Component } from "react";
import "./app.scss";
import "./custom-variables.scss";

class App extends Component {
  componentDidMount() {
    this.getAuth();
  }

  componentDidShow() {}

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
    if (res.code === 0) {
      setStorageSync("token", res.data.token);
      setStorageSync("user", res.data.user);
    }

    if (res.code === 2) {
      navigateTo({ url: "/pages/login/index" });
    }
  }

  render() {
    return <View className="html">{this.props.children}</View>;
  }
}

export default App;
