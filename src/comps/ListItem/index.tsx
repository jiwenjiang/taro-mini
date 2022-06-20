import { View } from "@tarojs/components";
import React, { ReactNode } from "react";
import "./index.scss";

export default function ListItem({
  left,
  title,
  subTitle,
  right
}: Partial<Record<"title" | "subTitle" | "left" | "right", ReactNode>>) {
  return (
    <View className="list-item">
      {left && <View className="left">{left}</View>}
      <View>
        <View className="info-title">{title}</View>
        <View className="info-node">{subTitle}</View>
      </View>
      <View className="right">{right}</View>
    </View>
  );
}
