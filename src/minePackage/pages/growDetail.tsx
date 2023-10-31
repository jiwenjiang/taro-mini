import request from "@/service/request";
import { Button, Notify } from "@taroify/core";
import { ChartTrendingOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useState } from "react";

import React from "react";
import { cls } from "reactutils";
import styles from "./vaccination.module.scss";

export default function App() {
  const router = useRouter();
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [growData, setGrowData] = useState({
    weight: "",
    height: "",
    fillDate: "",
    weightForHeight: "",
    headCircumference: "",
    bmi: ""
  });

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getGrowDetail = async () => {
    const res = await request({
      url: "/growth/get",
      data: { id: router.params.id }
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };
  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    navigateTo({
      url: `/minePackage/pages/grow`
    });
  };

  const goToList = () => {
    navigateTo({
      url: `/minePackage/pages/growList?childrenId=${currentChildren.id}`
    });
  };

  const getCode = async classify => {
    const res = await request({
      url: "/growth/curve/type",
      data: {
        classify
      }
    });
    return res;
  };

  const getChart = async v => {
    const res = await getCode(v);
    console.log("🚀 ~ file: growDetail.tsx:66 ~ getChart ~ res:", res)
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles["list-wrap"]}>
        <View className={styles.listTitle}>
          <View className={styles.title}>生长评估</View>
          <Button size="small" onClick={goToList}>
            生长记录
          </Button>
        </View>

        <View className={styles.detailList}>
          <View>测评日期：{growData.fillDate}</View>
          <View className={styles.listItem}>
            <View className={styles.val}>体重：{growData.weight}</View>
            <View>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>身高：{growData.height}</View>
            <View onClick={() => getChart(1)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>
              头围：{growData.headCircumference}
            </View>
            <View>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>
              身高别体重：{growData.weightForHeight}
            </View>
            <View>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>BMI：{growData.bmi}</View>
            <View>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
        </View>
      </View>
      <View className={cls(styles.actions, styles.fixBottom)}>
        <Button className={styles.btn} color="primary" onClick={add}>
          继续添加评估
        </Button>
      </View>
    </View>
  );
}
