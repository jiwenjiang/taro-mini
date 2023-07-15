import Box from "@/comps/Box";
import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import request from "@/service/request";
import { navWithLogin } from "@/service/utils";
import Dingdan from "@/static/imgs/dingdan.png";
import Head from "@/static/imgs/head.png";
import Shipin from "@/static/imgs/shipin.png";
import { Arrow } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import "./index.scss";

const cusStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  width: "100%"
};

export default function App() {
  const [user, setUser] = useState("");
  const [url, setUrl] = useState("");

  useDidShow(() => {
    (async () => {
      if (!wx._unLogin) {
        const res = await request({
          url: "/user/get",
          method: "GET"
        });
        setUser(res.data?.name);
        setUrl(res.data?.avatarUrl);
      }
    })();
    // setUser(getStorageSync("user"));
  });

  const manage = () => {
    navWithLogin("/childPackage/pages/manage");
  };

  const scale = () => {
    navWithLogin(`/orderPackage/pages/order/scale`);
  };

  const toVideoList = () => {
    navWithLogin(`/orderPackage/pages/order/videoList`);
  };

  const record = () => {
    navWithLogin(`/evaluatePackage/pages/recordList`);
  };

  const setting = () => {
    navWithLogin(`/minePackage/pages/setting`);
  };

  const gotoInfo = () => {
    navWithLogin(`/minePackage/pages/info`);
  };

  return (
    <View className="index">
      <View>
        <View className="avator" onClick={gotoInfo}>
          <Image className="ava" src={url || Head} />
          <Text>{user || "未登录"}</Text>
        </View>
        <Box title="订单管理">
          <View className="grid">
            <View className="item" onClick={scale}>
              <Image className="trade" src={Dingdan} />
              <Text className="sub-title">量表订单</Text>
            </View>
            <View className="item" onClick={toVideoList}>
              <Image className="trade" src={Shipin} />
              <Text className="sub-title">视频订单</Text>
            </View>
            {/* <View className="item">
              <Image className="trade" src={Yuyue} />
              <Text className="sub-title">预约订单</Text>
            </View> */}
          </View>
        </Box>
        <View>
          {/* <View className="list" onClick={record}>
            <ListItem
              left="自测量表记录"
              right={<Arrow />}
              customStyles={cusStyle}
            />
          </View> */}
          <View className="list" onClick={manage}>
            <ListItem
              left="儿童管理"
              right={<Arrow />}
              customStyles={cusStyle}
            />
          </View>
          <View className="list" onClick={setting}>
            <ListItem
              left="系统设置"
              right={<Arrow />}
              customStyles={cusStyle}
            />
          </View>
        </View>
      </View>
      <TabBar current="mine" />
    </View>
  );
}
