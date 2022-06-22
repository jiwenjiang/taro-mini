import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import Train from "@/static/icons/jujia.svg";
import SelfTest from "@/static/icons/self-test.svg";
import { Arrow } from "@taroify/icons";
import { Image, View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import "./index.scss";

export default function App() {
  const goto = url => {
    navigateTo({ url });
  };

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list" onClick={() => goto("/pages/evaluate/list")}>
          <ListItem
            title="量表自测"
            subTitle="拍摄视频，自主筛查"
            left={
              <View className="left">
                <Image src={SelfTest} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
        <View className="list">
          <ListItem
            title="居家训练"
            subTitle="居家康复，远程训练"
            left={
              <View className="left">
                <Image src={Train} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
