import TabBar from "@/comps/TabBar";
import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import React, { useEffect } from "react";
import { AtGrid } from "taro-ui";
import "./index.scss";

export default function App() {
  useEffect(() => {}, []);

  useDidShow(() => {});

  return (
    <View className="index">
      <View>
        <AtGrid
          data={[
            {
              image:
                "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
              value: "量表自测"
            },
            {
              image:
                "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
              value: "居家训练"
            }
          ]}
        />
      </View>
      <TabBar current="index" />
    </View>
  );
}
