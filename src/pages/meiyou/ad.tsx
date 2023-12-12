import request from "@/service/request";
import { Image, ScrollView, View } from "@tarojs/components";
import Taro, { setStorageSync } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./ad.module.scss";

enum Channel {
  fushu,
  anqier,
  quzhou,
  leibo,
  meiyou
}

export default function App() {
  const [staticData, setStaticData] = useState<any>({
    detail: "",
    button: ""
  });

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/promotion/get"
      });
      setStaticData(res.data);
      console.log("🚀 ~ file: ad.tsx:15 ~ res:", res);
    })();
  }, []);

  const preview = () => {
    setStorageSync("channel", "meiyou");
    setStorageSync("orgId", "f9b6b0c4");
    wx._channel = "meiyou";
    wx._orgId = "f9b6b0c4";
    Taro.switchTab({
      url: `/pages/index/index`,
      success(res) {}
    });
    console.log(staticData.customerQrCode);
  };

  return (
    <View className="index">
      <ScrollView className={styles.imgView}>
        <Image src={staticData.detail} mode="widthFix" className={styles.m1} />
        <Image
          src={staticData.button}
          mode="widthFix"
          className={styles.m2}
          onClick={preview}
        />
      </ScrollView>
    </View>
  );
}
