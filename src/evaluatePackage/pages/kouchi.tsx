import { Button, Notify } from "@taroify/core";
import { View } from "@tarojs/components";
import Taro, { navigateTo, useRouter } from "@tarojs/taro";
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

  const cancel = () => {
    Taro.showModal({
      title: "提示",
      content: "是否放弃本次评估？放弃后将清空本次填写数据",
      success: res => {
        if (res.confirm) {
          // 用户点击了确定按钮
          Taro.switchTab({ url: "/pages/index/index" });
          // 执行你的操作逻辑
        } else if (res.cancel) {
          // 用户点击了取消按钮
          console.log("用户点击了取消");
        }
      }
    });
  };

  const go = () => {
    navigateTo({
      url: `/evaluatePackage/pages/stepDetail?id=${639}`
    });
  };
  return (
    <View className={styles.index}>
      <View className={styles.btnBox} onClick={goto}>
        <View>拍摄视频</View>
        <View className={router.params?.hasUpload ? styles.green : styles.red}>
          {router.params?.hasUpload ? "已上传" : "未上传"} &rarr;
        </View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>儿童口吃调查表</View>
        <View className={styles.red}>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>口吃严重性评级</View>
        <View className={styles.red}>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>儿童沟通态度量表</View>
        <View className={styles.red}>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox} onClick={ing}>
        <View>儿童沟通焦虑(说话情况)量表</View>
        <View className={styles.red}>未上传 &rarr;</View>
      </View>
      <View className={styles.btnBox2}>
        <Button onClick={() => cancel()}>放弃本次评估</Button>
        <Button color="primary" onClick={() => go()}>
          提交评估
        </Button>
      </View>
      <Notify id="notify" />
    </View>
  );
}
