import { PaymentType, ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import OfflineImg from "@/static/imgs/offline.png";
import OnlineImg from "@/static/imgs/online.png";
import { List, Loading } from "@taroify/core";
import { Image, View } from "@tarojs/components";
import { navigateTo, usePageScroll } from "@tarojs/taro";
import React, { useRef, useState } from "react";
import styles from "./ganyuList.module.scss";

const trainingStatusType = {
  1: "已预约",
  4: "已结束",
  10: "已完成"
};

const trainingStatusColor = {
  1: "#635DF7",
  4: "#F44336",
  10: "#06CC76"
};

export default function App() {
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const total = useRef(1);
  const params = useRef({ pageNo: 0, pageSize: 10 });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");

  usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      setLoading(true);
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    } else {
      setHasMore(false);
    }
  };

  const getList = async (init?: boolean) => {
    const res = await request({
      url: "/recovery/list",
      data: params.current
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.records : [...data, ...res.data?.list]);
    isLoading.current = false;
    setLoading(false);
  };

  const goReport = item => {
    console.log("🚀 ~ file: recordList.tsx ~ line 47 ~ goReport ~ item", item);
    if (item.scaleTableCode === ScaleTableCode.BRAIN) {
      navigateTo({
        url: `/pages/evaluate/brainDetail?id=${item.id}`
      });
    }
    if (item.scaleTableCode === ScaleTableCode.GMS) {
      navigateTo({
        url: `/pages/evaluate/gmsDetail?id=${item.id}`
      });
    }
    if (item.scaleTableCode === ScaleTableCode.BRAIN_GMS) {
      navigateTo({
        url: `/pages/evaluate/brainGmsDetail?id=${item.id}`
      });
    }
    if (
      item.scaleTableCode === ScaleTableCode.LEIBO_BRAIN ||
      item.scaleTableCode === ScaleTableCode.LEIBO_GMS
    ) {
      navigateTo({
        url: `/evaluatePackage/pages/stepDetail?id=${item.id}`
      });
    }
    if (item.scaleTableCode === ScaleTableCode.Griffiths) {
      navigateTo({
        url: `/pages/evaluate/previewReport?id=${item.id}&name=${item.scaleName}`
      });
    }
  };

  return (
    <View className={styles.index}>
      <List
        loading={loading}
        hasMore={hasMore}
        scrollTop={scrollTop}
        onLoad={onLoad}
      >
        {data?.map((item, i) => (
          <View className={styles.box} key={i}>
            <Card data={item}></Card>
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
        </List.Placeholder>
      </List>
    </View>
  );
}

function Card({ data }) {
  //   const toReport = () => {
  //     report?.(data);
  //   };

  //   const toDetail = () => {
  //     detail?.(data);
  //   };

  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.scaleName}>
          <View>家庭康复指导</View>
          <View className={styles.date}>{data?.createTime}</View>
        </View>
        {data?.trainingRecordList?.map((v, i) => (
          <View key={i} className={styles.trainItem}>
            <View className={styles.firstLine}>
              <Image
                src={
                  v.trainingType === PaymentType.OFFLINE
                    ? OfflineImg
                    : OnlineImg
                }
                className={styles.cardImg}
              />
              <View>
                训练方式：
                {v.trainingType === PaymentType.OFFLINE ? "线下" : "线上"}
              </View>
              <View
                className={styles.status}
                style={{ color: trainingStatusColor[v?.trainingStatus] }}
              >
                {trainingStatusType[v?.trainingStatus] ?? "异常"}
              </View>
            </View>
            <View className={styles.secondLine}>
              <View>预约时间：{v?.reserveTime}</View>
              <View className={styles.secondLineBtn}></View>
            </View>
          </View>
        ))}
      </View>
      <View className={styles.btnbox}>
        <View className={styles.btn} onClick={() => {}}>
          方案详情
        </View>
        <View className={styles.btn} onClick={() => {}}>
          首诊评估
        </View>
        <View className={styles.btn} onClick={() => {}}>
          康复总结
        </View>
      </View>
    </View>
  );
}
