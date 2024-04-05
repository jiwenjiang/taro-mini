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
      url: `/pages/evaluate/step?childId=${router.params?.childId}&age=${router.params?.age}&code=${router.params.code}&orderId=${router.params.orderId}`
    });
  };
  return (
    <View className={styles.index}>
      <View className={styles.btnBox} onClick={goto}>
        <View>拍摄视频</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>儿童口吃调查表</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>口吃次要特征检查</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>口吃严重性评级</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>口吃危险因子检查</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>口吃沟通态度量表</View>
        <View>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>儿童沟通教焦虑（说话情况）量表</View>
        <View>未上传 &rarr;</View>
      </View>
      <Notify id="notify" />
    </View>
  );
}
