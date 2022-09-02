import { ChildContext } from "@/service/context";
import "@/service/http_interceptors";
import request from "@/service/request";
import "@taroify/core/index.scss";
import "@taroify/icons/index.scss";
import { View } from "@tarojs/components";
import Taro, { navigateTo, setStorageSync, useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import "./app.scss";
import "./custom-variables.scss";

function App(props) {
  const [child, setChild] = useState({ len: 0 });

  const getAuth = async () => {
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
      getChild();
    }

    if (res.code === 2) {
      navigateTo({ url: "/pages/login/index" });
    }
  };

  const getChild = async () => {
    const res = await request({
      url: "/children/list",
      data: { pageNo: 1, pageSize: 1000 }
    });
    setChild({ len: res.data.children?.length });
  };

  useDidShow(() => {
    getAuth();
  });

  return (
    <ChildContext.Provider value={{ child, updateChild: setChild }}>
      <View className="html">{props.children}</View>
    </ChildContext.Provider>
  );
}

export default App;
