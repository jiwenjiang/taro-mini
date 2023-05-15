import { categoryEnum } from "@/service/const";
import { Tabbar } from "@taroify/core";
import { Completed, NotesOutlined, TodoListOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import styles from "./xianliti.module.scss";

export default function App() {
  const goto = url => {
    navigateTo({ url });
  };
  return (
    <View className={styles.index}>
      <View
        className={styles.goto}
        onClick={() => goto("/orderPackage/pages/book/index?type=2")}
      >
        立即前往预约
      </View>
      <View className={styles.tabWrap}>
        <Tabbar fixed={true} value={null}>
          <Tabbar.TabItem
            icon={<TodoListOutlined />}
            onClick={() =>
              goto(
                `/orderPackage/pages/book/records?origin=${categoryEnum.isXianLiTi}`
              )
            }
          >
            预约记录
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<Completed />}
            onClick={() =>
              goto(
                `/evaluatePackage/pages/recordList?origin=${categoryEnum.isXianLiTi}`
              )
            }
          >
            评估报告
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<NotesOutlined />}
            onClick={() =>
              goto(
                `/evaluatePackage/pages/ganyuList?origin=${categoryEnum.isXianLiTi}`
              )
            }
          >
            干预方案
          </Tabbar.TabItem>
        </Tabbar>
      </View>
    </View>
  );
}
