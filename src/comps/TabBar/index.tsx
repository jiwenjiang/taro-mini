import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtTabBar } from "taro-ui";
import "./index.scss";

const pageList = [
  {
    page: "index",
    url: "/pages/index/index"
  },
  {
    page: "mine",
    url: "/pages/mine/index"
  }
];

export default function TabBar({ current }) {
  const handleClick = e => {
    const page = pageList[e];
    Taro.switchTab({ url: page.url });
    // setCurrent(e);
  };

  return (
    <View className="tab-wrap">
      <AtTabBar
        tabList={[
          { title: "首页", iconType: "home" },
          { title: "我的", iconType: "user" }
        ]}
        onClick={handleClick}
        current={pageList.findIndex(v => v.page === current)}
      />
    </View>
  );
}
