import NavBar from "@/comps/NavBar";
import Report from "@/comps/Report.tsx";
import request from "@/service/request";
import fenxiImg from "@/static/imgs/fenxi.png";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtButton } from "taro-ui";
import styles from "./brainDetail.module.scss";

const colorMap = {
  低风险: "#2EC25B",
  中等风险: "#FF7D41",
  高风险: "#EBEDF0"
};

const riskMap = {
  "1": {
    text: "无高危无异常",
    color: "#2EC25B"
  },
  "2": {
    text: "有高危无异常",
    color: "#FF7D41"
  },
  "3": {
    text: "无高危有异常",
    color: "#FF7D41"
  },
  "4": {
    text: "有高危有异常",
    color: "#EBEDF0"
  }
};

const checkColor = v => {
  if (v) {
    return colorMap[v];
  } else {
    return "#000000";
  }
};

const checkItem = v => {
  if (v) {
    return riskMap[v];
  } else {
    return {};
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
  const [report, setReportData] = useState<any>({});
  const router = useRouter();
  const [popObj, setPopObj] = useState({ visible: false, content: "" });

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleRecord/get",
        data: { id: router.params.id || 1 }
      });
      setData(res.data);
      const res2 = await request({
        url: "/scaleRecord/report",
        data: { id: router.params.id }
      });
      setReportData(res2.data);
    })();
  }, []);

  const handle = c => {
    if (c.type === "STRING") {
      setPopObj({ visible: true, content: c.content });
    }
    if (c.type === "LINK") {
      // navigateTo({ url: `/pages/other/webView?url=${c.content}` });
      Taro.navigateToMiniProgram({
        appId: "wx98dc9b974915de77",
        path:
          "page/home/content/content_video/content_video?id=v_62c50754e4b050af2398680d",
        success(res) {
          console.log(
            "🚀 ~ file: brainDetail.tsx ~ line 94 ~ success ~ res",
            res
          );
          // 打开成功
        }
      });
    }
  };

  return (
    <View>
      <NavBar title="脑瘫评测详情" />
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
          </View>
        </View>
      </View>
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={fenxiImg} className={styles.imgIcon} />
            &nbsp; 结果分析
          </View>
          <View className={styles.remark}>
            <View>
              蕾波幼儿脑瘫危险程度百分数表自测结果风险系数越高，则患儿童脑损伤的可能性越大。测评结果不代表诊断结果，建议
              您联系客服预约蕃波专业评估，进一步精准评定！
            </View>
            <View className={styles.kefu}>
              <Text className={styles.key}>客服咨询预约电话</Text>
              <Text className={styles.val}>400-898-6962</Text>
            </View>
            <View className={styles.kefu}>
              <Text className={styles.key}>附近中心预约评估</Text>
              <Text className={styles.val}>400-898-6962</Text>
            </View>
            <View className={styles.kefu}>
              <Text className={styles.key}>总部联系电话</Text>
              <Text className={styles.val}>400-898-6962</Text>
            </View>
          </View>
        </View>
      </View>
      <View className={styles.cardBox}>
        <View className={styles.card}>
          <View className={styles.title}>
            <Image src={fenxiImg} className={styles.imgIcon} />
            &nbsp; 医生评估
            <Text className={styles.evaDate}>{report.evaluateDate}</Text>
          </View>
          <View className={styles.evaBox}>
            {report?.scaleResult && (
              <View
                className={styles.tag}
                style={{
                  backgroundColor:
                    checkItem(report?.scaleResult?.result)?.color ?? "#000"
                }}
              >
                {checkItem(report?.scaleResult?.result)?.text}
              </View>
            )}
            <View className={styles.tagBox}>
              {report.scaleResult?.highRisk?.map(v => (
                <View className={styles.grayTag}>{v}</View>
              ))}
            </View>
            <View className={styles.evaRemark}>
              {report.scaleResult?.remark}
            </View>
            <View className={styles.tagBox}>
              {report.scaleResult?.abnormalIterm?.map(v => (
                <View className={styles.grayTag}>{v}</View>
              ))}
            </View>
          </View>
        </View>
      </View>
      {report.scaleResult?.suggest?.map((v, i) => (
        <View className={styles.cardBox} key={i}>
          <View className={styles.card}>
            <View className={styles.title}>
              <Image src={pingceImg} className={styles.imgIcon} />
              &nbsp; 建议{i + 1}
            </View>
            <View className={styles.cardContent}>{v.content}</View>
            {v.button?.map(c => (
              <AtButton
                className={styles.btnBox}
                type={c.type === "LINK" ? "primary" : "secondary"}
                onClick={() => handle(c)}
              >
                {c.copyWriting}
              </AtButton>
            ))}
          </View>
        </View>
      ))}
      <Report data={report} />
      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setPopObj({ visible: false, content: "" })}
        open={popObj.visible}
      >
        <View className={styles.popContent}>{popObj.content}</View>
      </Popup>
    </View>
  );
}
