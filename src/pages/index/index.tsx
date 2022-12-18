import TabBar from "@/comps/TabBar";
import Ganyu from "@/static/imgs/ganyufangan.png";
import Baogao from "@/static/imgs/pinggubaogao.png";
import Xianxia from "@/static/imgs/xianxiapinggu.png";
import Yisheng from "@/static/imgs/yisheng.png";
import Yuyue from "@/static/imgs/yuyuejilu.png";
import Pinggu from "@/static/imgs/zhinengpinggu.png";
import Kecheng from "@/static/imgs/zhuanshukecheng.png";
import { Image, View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import styles from "./index.module.scss";

export default function App() {
  const goto = url => {
    navigateTo({ url });
  };

  return (
    <View className={styles.index}>
      <View className={styles.bottomPart}>
        <View className={styles.title}>评估服务</View>
        <View className={styles.cardBox}>
          <View
            className={styles.card}
            onClick={() => goto("/pages/evaluate/list")}
          >
            <Image src={Pinggu} className={styles.cardImg}></Image>
            <View className={styles.cardTitle}>智能评估</View>
            <View className={styles.cardDesc}>居家拍摄视频AI智能评测</View>
            <View className={styles.cardDesc}>专家二次审核</View>
          </View>
          <View
            className={styles.card}
            onClick={() => goto("/orderPackage/pages/book/index")}
          >
            <Image src={Xianxia} className={styles.cardImg}></Image>
            <View className={styles.cardTitle}>门诊评估</View>
            <View className={styles.cardDesc}>专业机构预约</View>
            <View className={styles.cardDesc}>专家面对面评估</View>
          </View>
        </View>
        <View className={styles.title}>干预服务</View>
        <View className={styles.ganyuBox}>
          <View className={styles.ganyuTxt}>
            <View className={styles.ganyuTitle}>制定专属康复方案</View>
            <View className={styles.subTxt}>
              线下预约设计家庭康复指导方案，专家量身定制
            </View>
          </View>
          <Image src={Yisheng} className={styles.ganyuImg}></Image>
        </View>
        <View className={styles.title}>常用服务</View>
        <View className={styles.cardBox}>
          <View className={styles.miniCard}>
            <Image src={Baogao} className={styles.miniCardImg}></Image>
            <View className={styles.miniCardTitle}>评估报告</View>
          </View>
          <View className={styles.miniCard}>
            <Image src={Ganyu} className={styles.miniCardImg}></Image>
            <View className={styles.miniCardTitle}>干预方案</View>
          </View>
          <View className={styles.miniCard}>
            <Image src={Kecheng} className={styles.miniCardImg}></Image>
            <View className={styles.miniCardTitle}>专属课程</View>
          </View>
          <View className={styles.miniCard}>
            <Image src={Yuyue} className={styles.miniCardImg}></Image>
            <View className={styles.miniCardTitle}>预约记录</View>
          </View>
        </View>
      </View>
      {/* <View className="list-wrap">
        <View className="list" onClick={() => goto("/pages/evaluate/list")}>
          <ListItem
            title="智能评估"
            subTitle="真实视频，智能评估"
            left={
              <View className="left">
                <Image src={SelfTest} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
        <View className="list">
          <ListItem
            title="专属训练"
            subTitle="个性定制，训练指导"
            left={
              <View className="left">
                <Image src={Train} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View>
        {/* <View className="list" onClick={() => gotoOther()}>
          <ListItem
            title="视频课程"
            subTitle="蕾波视频，助力康复"
            left={
              <View className="left">
                <Image src={VideoCourse} className="icon" />
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
          />
        </View> */}
      {/* </View> */}
      <TabBar current="index" />
    </View>
  );
}
