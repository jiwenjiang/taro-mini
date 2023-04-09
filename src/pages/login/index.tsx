import { tabPages } from "@/service/const";
import { useAuth } from "@/service/hook";
import request from "@/service/request";
import defaultLogo from "@/static/imgs/logo.png";
import { Button } from "@taroify/core";
import { Image, View } from "@tarojs/components";
import Taro, { reLaunch, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function App() {
  const router = useRouter();
  const { getAuth } = useAuth();
  const [logo, setLogo] = useState("");

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
        phoneCode: e.detail.code,
        channel: router.params.channel || "",
        orgid: router.params.orgid
      }
    });
    if (res.code === 0) {
      getAuth();
      if (router.params.returnUrl) {
        if (tabPages.includes(router.params.returnUrl)) {
          Taro.switchTab({ url: router.params.returnUrl });
        } else {
          reLaunch({ url: router.params.returnUrl });
        }
      } else {
        Taro.switchTab({ url: "/pages/index/index" });
      }
    }

    // console.log("🚀 ~ file: index.tsx ~ line 21 ~ App ~ res", res);
  };

  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/wx/portal/logo",
        data: {
          channel: router.params.channel || "",
          orgid: router.params.orgid || 0
        }
      });
      setLogo(res.data.url);
    })();
  });

  return (
    <View className={styles.box}>
      <View className={styles.shadow}>
        <View className={styles.imgBox}>
          <Image src={logo || defaultLogo} className={styles.img} />
        </View>
        {/* <View className={styles.title}>脑科学数字化精准康复变革者</View> */}
        <View className={styles.btnBox}>
          <Button
            className={styles.btn}
            color="primary"
            onGetPhoneNumber={onGetPhoneNumber}
            openType="getPhoneNumber"
          >
            微信登录
          </Button>
          <Button className={styles.btn} onClick={back}>
            取消
          </Button>
        </View>

        {/* <View className={styles.rights}>
          Copyright © {new Date().getFullYear()} 复数健康
        </View> */}
      </View>
    </View>
  );
}
