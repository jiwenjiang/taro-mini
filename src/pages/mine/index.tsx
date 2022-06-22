import Box from "@/comps/Box";
import TabBar from "@/comps/TabBar";
import Dingdan from "@/static/imgs/dingdan.png";
import Shipin from "@/static/imgs/shipin.png";
import Yuyue from "@/static/imgs/yuyue.png";
import { Image, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtListItem } from "taro-ui";
import "./index.scss";

export default function App() {
  const [user, setUser] = useState({
    name: ""
  });
  useEffect(() => {
    setUser(getStorageSync("user"));
  }, []);

  const manage = () => {
    navigateTo({ url: '/pages/child/manage' });
  };

  const scale = () => {
    // navigateTo({ url: `/pages/child/choose?code=${code}` });
  };

  const record = () => {
    navigateTo({ url: `/pages/evaluate/recordList` });
  };

  return (
    <View className="index">
      <View>
        <View className="avator">
          <Image
            className="ava"
            src="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
          />
          <Text>{user.name || "张三"}</Text>
        </View>
        <Box title="订单管理">
          <View className="grid">
            <View className="item">
              <Image className="trade" src={Dingdan} />
              <Text className="sub-title">量表订单</Text>
            </View>
            <View className="item">
              <Image className="trade" src={Shipin} />
              <Text className="sub-title">视频订单</Text>
            </View>
            <View className="item">
              <Image className="trade" src={Yuyue} />
              <Text className="sub-title">预约订单</Text>
            </View>
          </View>
        </Box>
        <View>
          <View className="list" onClick={record}>
            <AtListItem title="自测量表记录" arrow="right" hasBorder={false} />
          </View>
          <View className="list" onClick={manage}>
            <AtListItem title="儿童管理" arrow="right" hasBorder={false} />
          </View>
          <View className="list" onClick={scale}>
            <AtListItem title="系统设置" arrow="right" hasBorder={false} />
          </View>
        </View>
      </View>
      <TabBar current="mine" />
    </View>
  );
}
