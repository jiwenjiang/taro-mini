import request from "@/service/request";
import logo from "@/static/imgs/logo.png";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtButton } from "taro-ui";
import styles from "./index.module.scss";

export default function App() {
  const onGetPhoneNumber = async e => {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();
    const res = await request({
      url: "/miniapp/login",
      method: "POST",
      data: {
        code: login.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        phoneCode: e.detail.code
      }
    });
    if (res.code === 0) {
      Taro.switchTab({ url: "/pages/index/index" });
    }

    // console.log("🚀 ~ file: index.tsx ~ line 21 ~ App ~ res", res);
  };

  return (
    <View className={styles.box}>
      <View className={styles.shadow}>
        <View className={styles.imgBox}>
          <Image src={logo} className={styles.img} />
        </View>
        <View className={styles.title}>脑科学数字化精准康复变革者</View>
        <View>
          <AtButton
            className={styles.btn}
            type="primary"
            onGetPhoneNumber={onGetPhoneNumber}
            openType="getPhoneNumber"
          >
            微信登录
          </AtButton>
        </View>

        <View className={styles.rights}>
          Copyright © {new Date().getFullYear()} 复数健康
        </View>
      </View>
    </View>
  );
}
