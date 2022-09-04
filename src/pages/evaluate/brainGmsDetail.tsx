import Contact from "@/comps/Contact";
import NavBar from "@/comps/NavBar";
import Report from "@/comps/Report.tsx";
import { useReportBtnHandle } from "@/service/hook";
import request from "@/service/request";
import fenxiImg from "@/static/imgs/fenxi.png";
import pingceImg from "@/static/imgs/pingce.png";
import yonghuImg from "@/static/imgs/yonghu.jpg";
import { Button, Dialog, Popup } from "@taroify/core";
import { InfoOutlined } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
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

const intros = [
  {
    title: "1、单调性（PR）：",
    content:
      "表现为宝宝连续性运动顺序的单调，不同身体部位的运动失去了正常的GMS复杂性，总是简单的重复几个动作。存在一定的神经运动发育障碍风险。"
  },
  {
    title: "2、痉挛－同步性（CS）：",
    content:
      "扭动运动阶段出现运动僵硬，失去正常的流畅性，所有肢体和躯干肌肉几乎同时收缩和放松，比如双腿同时抬高并且同时放下。存在神经运动发育障碍风险。"
  },
  {
    title: "3、混乱型”（CH）：",
    content:
      "扭动运动阶段出现肢体运动幅度大，顺序混乱，失去流畅性，动作突然不连贯。“混乱型”相当少见，常在数周后发展为“痉挛－同步性”GMs。存在神经运动发育障碍风险。"
  },
  {
    title: "4、不安运动缺乏”（F-）：",
    content:
      "不安运动是一种小幅度，中速度的细微运动，在9-20周龄的宝宝身上会如星辰般闪烁的各个的身体部位上。如果没有这样的细微运动出现，便是不安运动缺乏了。存在神经运动发育障碍风险。"
  },
  {
    title: "5、扭动运动正常（N）",
    content:
      "自发运动符合年龄水平。出现在足月6-9周龄内，其特征为小至中等幅度，速度缓慢至中等，运动轨迹在形式上呈现为椭圆形。发展为明显的神经运动障碍可能性很小。"
  },
  {
    title: "6、自发性全身运动正常(F+)：",
    content:
      "不安运动正常出现，符合年龄水平。不安运动是一种小幅度，中速度的细微运动，在9-20周龄的宝宝身上会如星辰般闪烁的各个的身体部位上。发展为明显的神经运动障碍可能性很小。"
  }
];

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
  const { checkPay, toPay, open, setOpen, price } = useReportBtnHandle();
  const [intro, setIntro] = useState(false);

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
    if (c.type === "MINIAPP") {
      checkPay(c);
    }
    if (c.type === "SELF") {
      checkPay(c, true);
    }
  };

  return (
    <View>
      <NavBar title="脑瘫+GMs评估详情" />
      <Contact />
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
      {report?.progressStatus === "未评估" ? (
        <View className={styles.noEva}>
          <View>已提交医生评估，请耐心等待，</View>
          <View>医生评估后将通知您</View>
          <View className={styles.phone}>客服电话：400-898-6862</View>
        </View>
      ) : (
        <View>
          <View className={styles.cardBox}>
            <View className={styles.card}>
              <View className={styles.title}>
                <Image src={pingceImg} className={styles.imgIcon} />
                &nbsp; 蕾波自测测评结果
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
                <Image src={pingceImg} className={styles.imgIcon} />
                &nbsp; GMs测评结果{" "}
                <InfoOutlined
                  size={17}
                  style={{ marginLeft: 5 }}
                  onClick={() => setIntro(true)}
                />
              </View>
              <View className={styles.gmsEvaBox}>
                {report.scaleResult?.gmsResult?.result?.map(
                  (v, i) =>
                    v.content && (
                      <View key={i} className={styles.evaItem}>
                        <View className={styles.evaTitle}>{v.name}</View>
                        <View className={styles.evaVal}>{v.content}</View>
                      </View>
                    )
                )}
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
                &nbsp; 蕾波自测医生评估
                <Text className={styles.evaDate}>
                  {report.evaluateDate ??
                    "医生评估后可查看评估结果，可以通过微信的服务消息或者在【我的】-【自测量表记录】中查看报告结果"}
                </Text>
              </View>
              <View className={styles.evaBox}>
                {report?.scaleResult?.cerebralPalsyResult && (
                  <View
                    className={styles.tag}
                    style={{
                      backgroundColor:
                        checkItem(
                          report?.scaleResult?.cerebralPalsyResult?.result
                        )?.color ?? "#000"
                    }}
                  >
                    {
                      checkItem(
                        report?.scaleResult?.cerebralPalsyResult?.result
                      )?.text
                    }
                  </View>
                )}

                <View className={styles.tagBox}>
                  {report.scaleResult?.cerebralPalsyResult?.highRisk?.map(v => (
                    <View className={styles.grayTag}>{v}</View>
                  ))}
                </View>
                <View className={styles.evaRemark}>
                  {report.scaleResult?.cerebralPalsyResult?.remark}
                </View>
                <View className={styles.tagBox}>
                  {report.scaleResult?.cerebralPalsyResult?.abnormalIterm?.map(
                    v => (
                      <View className={styles.grayTag}>{v}</View>
                    )
                  )}
                </View>
              </View>
            </View>
          </View>
          <View className={styles.cardBox}>
            <View className={styles.card}>
              <View className={styles.title}>
                <Image src={fenxiImg} className={styles.imgIcon} />
                &nbsp; GMs医生评估
                <Text className={styles.evaDate}>{report.evaluateDate}</Text>
              </View>
              <View className={styles.evaBox}>
                <View>{report.conclusion}</View>
                <View className={styles.intro}>评估结果不代表诊断结果</View>
              </View>
            </View>
          </View>
          {report.scaleResult?.cerebralPalsyResult?.suggest?.map((v, i) => (
            <View className={styles.cardBox} key={i}>
              <View className={styles.card}>
                <View className={styles.title}>
                  <Image src={pingceImg} className={styles.imgIcon} />
                  &nbsp; 建议{i + 1}
                </View>
                <View className={styles.cardContent}>{v.content}</View>
                {v.button?.map(c => (
                  <Button
                    className={styles.btnBox}
                    variant="outlined"
                    color="primary"
                    onClick={() => handle(c)}
                  >
                    {c.copyWriting}
                  </Button>
                ))}
              </View>
            </View>
          ))}
          <Report data={report} />
        </View>
      )}

      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setPopObj({ visible: false, content: "" })}
        open={popObj.visible}
      >
        <View className={styles.popContent}>{popObj.content}</View>
      </Popup>
      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setIntro(false)}
        open={intro}
      >
        {intros.map(v => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
      </Popup>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Header>购买居家视频课程</Dialog.Header>
        <Dialog.Content>
          购买居家视频课程后，享有蕾波所有线上视频课程均可免费观看权益
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => toPay()}>{price ?? 0}元立即购买</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
