import Report from "@/comps/Report.tsx";
import request from "@/service/request";
import fenxiImg from "@/static/imgs/fenxi.png";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./brainDetail.module.scss";

const colorMap = {
  低风险: "#2EC25B",
  中等风险: "#FF7D41",
  高风险: "#EBEDF0"
};

const checkColor = v => {
  if (v) {
    return colorMap[v];
  } else {
    return "#000000";
  }
};

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const router = useRouter();
  const [range, setRange] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleRecord/get",
        data: { id: router.params.id || 1 }
      });
      setData(res.data);
    //   const arr = res.data.answers.map(v => v.score.split("-")[1]);
    //   setRange(arr);
    })();
  }, []);

  return (
    <View>
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={yonghuImg} className={styles.imgIcon} />
            &nbsp; 用户详情
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>姓名</Text>
            <Text className={styles.v}>{data.name}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>性别</Text>
            <Text className={styles.v}>{data.gender}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.k}>年龄</Text>
            <Text className={styles.v}>{data.age}</Text>
          </View>
        </View>
      </View>
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={pingceImg} className={styles.imgIcon} />
            &nbsp; 测评结果
          </View>
          <View className={styles.scoreBox}>
            <View className={styles.text}>您本次评测结果风险系数</View>
            <View
              className={styles.score}
              style={{ color: checkColor(data.content) }}
            >
              {data.score}%
            </View>
            {/* <View>
              <Tag size="medium" type="primary" color={checkColor(data.content)}>
                {data.content}
              </Tag>
            </View> */}
          </View>
        </View>
      </View>
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={fenxiImg} className={styles.imgIcon} />
            &nbsp; 结果分析
          </View>
          {/* <View className={styles.scoreBox}>
            <Range data={range} content={data.content} score={data.totalScore} />
          </View> */}
          <View className={styles.remark}>
            <View>
              蕾波婴幼儿脑瘫危险程度百分数表自测结果风险系数越高，则患儿童脑损伤的可能性越大。测评结果不代表诊断结果，建议您联系客服预约蕾波专业评估，进一步精准评定！
            </View>
            <View className={styles.kefu}>客服咨询预约电话：400-898-6862</View>
            <View className={styles.kefu}>附近中心预约评估：</View>
            <View className={styles.area}>总部</View>
            <View>北京市西城区南礼士路19号</View>
            <View className={styles.area}>济南中心</View>
            <View>山东省济南市槐荫区南辛庄中街69号</View>
            <View className={styles.area}>武汉中心</View>
            <View>湖北省武汉市洪山区卓刀泉路楚康路9附107号商铺</View>
          </View>
        </View>
      </View>
      <Report />
    </View>
  );
}
