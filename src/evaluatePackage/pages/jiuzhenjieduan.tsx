import { Notify } from "@taroify/core";
import { View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import React from "react";
import styles from "./jiuzhenjieduan.module.scss";

export default function App() {
  const router = useRouter();

  const ing = () => {
    Notify.open({ color: "warning", message: "开发升级中" });
  };

  const goto = () => {
    navigateTo({
      url: `/evaluatePackage/pages/kouchi?childId=${router.params?.childId}&age=${router.params?.age}&code=${router.params.code}&orderId=${router.params.orderId}`
    });
  };
  return (
    <View className={styles.index}>
      <View className={styles.btnBox} onClick={goto}>
        初诊
      </View>
      <View className={styles.btnBox} onClick={() => ing()}>
        复诊
      </View>
      <Notify id="notify" />
    </View>
  );
}
