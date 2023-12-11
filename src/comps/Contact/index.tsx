import { Button } from "@taroify/core";
import { View } from "@tarojs/components";
import React from "react";
import styles from "./index.module.scss";

export default function Contact() {
  const preview = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc86155f0abef5c38b" },
      corpId: "ww47f31bbc9556c2ef",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      }
    });
  };
  return (
    <View className={styles.contactBox}>
      <View>对报告有疑问？</View>
      <Button className={styles.contact} onClick={preview}>
        在线解答
      </Button>
    </View>
  );
}
