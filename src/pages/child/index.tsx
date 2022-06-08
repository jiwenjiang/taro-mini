import TabBar from "@/comps/TabBar";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import { AtListItem } from "taro-ui";
import "./index.scss";


export default function App() {

  const goto = url => {
    navigateTo({ url });
  };

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list">
          <AtListItem
            title="量表自测"
            note="描述信息"
            arrow="right"
            hasBorder={false}
            onClick={() => goto("/pages/evaluate/list")}
            thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
          />
        </View>
        <View className="list">
          <AtListItem
            title="居家训练"
            note="描述信息"
            arrow="right"
            hasBorder={false}
            thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
          />
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
