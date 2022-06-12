import { View } from "@tarojs/components";
import React from "react";
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

export default function ListItem({ ImgSlot, title, subTitle }) {
  return (
    <View className="list-item">
      <View>
        <ImgSlot />
        <View>
          <View className="info-title">{title}</View>
          <View className="info-node">{subTitle}</View>
        </View>
      </View>
      <View></View>
    </View>
  );
}
