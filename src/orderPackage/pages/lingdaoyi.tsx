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
      <View>
        <View
          className={styles.goto}
          onClick={() => goto("/orderPackage/pages/book/index?type=2")}
        >
          智能评估
        </View>
        <View
          className={styles.goto}
          onClick={() => goto("/orderPackage/pages/book/index?type=2")}
        >
          预约家庭康复指导
        </View>
      </View>

      <View className={styles.tabWrap}>
        <Tabbar fixed={true} value={null}>
          <Tabbar.TabItem
            icon={<TodoListOutlined />}
            onClick={() => goto("/orderPackage/pages/book/records")}
          >
            预约记录
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<Completed />}
            onClick={() => goto("/evaluatePackage/pages/recordList")}
          >
            评估报告
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<NotesOutlined />}
            onClick={() => goto("/evaluatePackage/pages/ganyuList")}
          >
            干预方案
          </Tabbar.TabItem>
        </Tabbar>
      </View>
    </View>
  );
}
