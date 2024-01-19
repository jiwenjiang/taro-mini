import { ChildContext } from "@/service/context";
import request, { envHost } from "@/service/request";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Button, Notify, Popup } from "@taroify/core";
import { Checked, Exchange } from "@taroify/icons";
import { Image, Picker, Text, View } from "@tarojs/components";
import Taro, {
  getStorageSync,
  navigateTo,
  useDidShow,
  useRouter
} from "@tarojs/taro";
import { useContext, useEffect, useState } from "react";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import { Base64 } from "@/service/utils";
import dayjs from "dayjs";
import React from "react";
import styles2 from "./sleep.module.scss";
import styles from "./vaccination.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const router = useRouter();
  const [updateFlag, setUpdateFlag] = useState(Date.now());
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const childContext = useContext(ChildContext);
  const [weights, setWeights] = useState({ birthWeight: "", recordWeight: "" });
  const [growData, setGrowData] = useState<any>({
    weight: "",
    sleepTime: "",
    readyTime: "",
    nightAwakenings: 0,
    fallBackAsleepAvgTime: "",
    longestSleepTime: "",
    wakeUpTime: "",
    recordDate: dayjs().format("YYYY-MM-DD"),
    daySleep: []
  });

  const [lastDay, setLastDay] = useState(
    dayjs()
      .subtract(1, "day")
      .format("MM-DD")
  );

  useEffect(() => {
    setLastDay(
      dayjs()
        .subtract(1, "day")
        .format("MM-DD")
    );
  }, [growData.recordDate]);

  // 页面加载时调用该方法获取儿童信息
  useEffect(() => {
    getChildrenList();
  }, [updateFlag]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChildren(res.data.children);
    setCurrentChildren(res.data.children?.[0]);
    getWeight(res.data.children?.[0]);
    childContext.updateChild({ len: res.data.children.length });
  };

  const getWeight = async v => {
    if (!router.params.id) {
      const res = await request({
        url: "/sleep/weight/get",
        data: { childrenId: v.id }
      });
      setWeights(res.data);
      setGrowData({ ...growData, weight: res.data.recordWeight });
    }
    // console.log("🚀 ~ getWeight ~ res:", res);
  };

  const getGrowDetail = async () => {
    const res = await request({
      url: "/sleep/record/get",
      data: { id: router.params.id }
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };

  const onBirthdayChange = (e, k) => {
    // setBirthday(e.detail.value);
    setGrowData({ ...growData, [k]: e.detail.value });
  };

  const onSleepChange = (e, i, k) => {
    // setBirthday(e.detail.value);
    growData.daySleep[i][k] = e.detail.value;
    setGrowData({ ...growData });
    console.log(
      "🚀 ~ file: sleep.tsx:92 ~ onBirthdayChange ~ { ...growData, [k]: e.detail.value }:",
      { ...growData, [k]: e.detail.value }
    );
  };

  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    if (router.params.returnUrl) {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}&returnUrl=${router.params.returnUrl}`
      });
    } else {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}`
      });
    }
  };

  const goToList = () => {
    navigateTo({
      url: `/minePackage/pages/sleepList?childrenId=${currentChildren.id}`
    });
  };

  const chooseChild = v => {
    setCurrentChildren(v);
    setVisible(false);
  };

  const onChange = (v, key) => {
    setGrowData({ ...growData, [key]: v });
  };

  const save = async () => {
    if (!/^\d+$/.test(growData.weight)) {
      Notify.open({ color: "warning", message: "请填写整数体重" });
      return;
    }
    // if(growData.weight < weights.birthWeight){

    // }
    const checkRes = await request({
      url: "/sleep/record/check",
      method: "GET",
      data: {
        childrenId: currentChildren.id,
        date: growData.recordDate
      }
    });
    if (checkRes.data) {
      Taro.showModal({
        title: "提醒",
        content: "您记录的日期已经有睡眠日志，是否进行覆盖",
        confirmText: "覆盖",
        async success(res) {
          if (res.confirm) {
            const res = await request({
              url: "/sleep/record/save",
              method: "POST",
              data: {
                childrenId: currentChildren.id,
                ...growData
              }
            });
            if (res.code === 0) {
              Notify.open({ color: "success", message: "保存成功" });
              setGrowData({
                weight: "",
                sleepTime: "",
                readyTime: "",
                nightAwakenings: 0,
                fallBackAsleepAvgTime: "",
                longestSleepTime: "",
                wakeUpTime: "",
                recordDate: dayjs().format("YYYY-MM-DD"),
                daySleep: []
              });
            }
          } else if (res.cancel) {
            console.log("用户点击了取消");
            // 在这里可以执行取消后的操作
          }
        }
      });
    }
  };

  const toChart = () => {
    const url = `${envHost}?classify=${1}&token=${getStorageSync(
      "token"
    )}&childId=${currentChildren.id}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`
    });
  };

  const toHabit = () => {
    navigateTo({
      url: `/minePackage/pages/sleepHabit?childrenId=${currentChildren.id}`
    });
  };

  const addItem = () => {
    const list = [...growData.daySleep];
    list.push({ start: null, end: null });
    console.log(
      "🚀 ~ file: sleep.tsx:159 ~ addItem ~ { ...growData, daySleep: list }:",
      { ...growData, daySleep: list }
    );

    setGrowData({ ...growData, daySleep: list });
  };

  const del = c => {
    const list = [...growData.daySleep].filter((v, i) => i !== c);
    console.log("🚀 ~ file: sleep.tsx:178 ~ del ~ list:", list);
    setGrowData({ ...growData, daySleep: list });
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles["list-wrap"]}>
        <View className={styles["list"]}>
          <View className={styles["child-info"]}>
            <View className={styles["left"]}>
              <Image
                src={currentChildren.gender === "男" ? maleImg : femaleImg}
                className={styles["gender"]}
              />
              <View className={styles["text-info"]}>
                <Text className={styles.name}>{currentChildren.name}</Text>
                <Text className={styles.birthday}>
                  {currentChildren.birthday}
                </Text>
              </View>
            </View>
            <View className={styles.actions}>
              <Exchange
                className={styles.action}
                onClick={() => setVisible(true)}
                color="#ffa200"
              />
            </View>
          </View>
        </View>
        <View className={styles.listBtnBox}>
          <Button size="small" onClick={goToList}>
            睡眠记录
          </Button>
          <Button size="small" style={{ marginLeft: 10 }} onClick={toChart}>
            睡眠图
          </Button>
          <Button size="small" style={{ marginLeft: 10 }} onClick={toHabit}>
            睡眠习惯
          </Button>
        </View>
        <View className={styles.actions}>
          {children?.length === 0 && (
            <Button className={styles.btn} color="primary" onClick={add}>
              添加儿童
            </Button>
          )}
        </View>
      </View>
      <View className={styles.form}>
        <View style={{ marginBottom: 10 }}>
          <Picker
            mode="date"
            value={growData.recordDate}
            onChange={e => onBirthdayChange(e, "recordDate")}
          >
            <ListItem
              left="记录日期"
              customStyles={customStyle}
              right={growData.recordDate}
            />
          </Picker>
        </View>
        <View className={styles.row}>
          <FieldInput
            label="体重"
            placeholder="请输入体重(整数)"
            value={growData.weight}
            onInput={(e: any) => onChange(e.target.value, "weight")}
            rootStyles={{ padding: "12px" }}
            labelStyles={{ color: "#333" }}
            inputStyles={{ textAlign: "right" }}
          />
          <Text className={styles.unit}>g</Text>
        </View>
        <View className={styles2.title}>
          昨晚睡眠统计 {lastDay} 20:00 至{" "}
          {dayjs(growData.recordDate).format("MM-DD")} 08:00
        </View>
        <View style={{ marginBottom: 10 }}>
          <Picker
            mode="time"
            value={growData.readyTime}
            onChange={e => onBirthdayChange(e, "readyTime")}
          >
            <ListItem
              left="昨晚准备入睡时间"
              customStyles={customStyle}
              right={growData.readyTime}
            />
          </Picker>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Picker
            mode="time"
            value={growData.sleepTime}
            onChange={e => onBirthdayChange(e, "sleepTime")}
          >
            <ListItem
              left="昨晚睡着时间"
              customStyles={customStyle}
              right={growData.sleepTime}
            />
          </Picker>
        </View>
        <View className={styles.row}>
          <FieldInput
            label="昨晚夜醒次数"
            placeholder="请输入夜醒次数"
            value={growData.nightAwakenings}
            onInput={(e: any) => onChange(e.target.value, "nightAwakenings")}
            rootStyles={{ padding: "12px" }}
            labelStyles={{ color: "#333" }}
            inputStyles={{ textAlign: "right" }}
            type="number"
          />
          <Text className={styles.unit}>次</Text>
        </View>
        <View className={styles.row}>
          <FieldInput
            label="昨晚夜醒重新入睡平均所需时间"
            placeholder="请输入"
            value={growData.fallBackAsleepAvgTime}
            onInput={(e: any) =>
              onChange(e.target.value, "fallBackAsleepAvgTime")
            }
            rootStyles={{ padding: "12px" }}
            labelStyles={{ color: "#333", fontSize: 13 }}
            inputStyles={{ textAlign: "right" }}
            type="number"
          />
          <Text className={styles.unit}>分钟</Text>
        </View>
        <View className={styles.row}>
          <FieldInput
            label="昨晚连续最大睡眠时间（最长一觉）"
            placeholder="请输入"
            value={growData.longestSleepTime}
            onInput={(e: any) => onChange(e.target.value, "longestSleepTime")}
            rootStyles={{ padding: "12px" }}
            labelStyles={{ color: "#333", fontSize: 13 }}
            inputStyles={{ textAlign: "right" }}
            type="number"
          />
          <Text className={styles.unit}>分钟</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Picker
            mode="time"
            value={growData.wakeUpTime}
            onChange={e => onBirthdayChange(e, "wakeUpTime")}
          >
            <ListItem
              left="早上醒来时间"
              customStyles={customStyle}
              right={growData.wakeUpTime}
            />
          </Picker>
        </View>
        <View className={styles2.title}>
          今日 {dayjs(growData.recordDate).format("MM-DD")} 08:00 至{" "}
          {dayjs(growData.recordDate).format("MM-DD")} 20:00
          白天小睡统计（支持多次）
        </View>
        <View className={styles2.list}>
          {growData.daySleep.map((v, i) => (
            <View key={i} className={styles2.sleepItem}>
              <View className={styles.row}>
                <Picker
                  mode="time"
                  style={{ width: "100%" }}
                  value={v.start}
                  onChange={e => onSleepChange(e, i, "start")}
                >
                  <ListItem
                    left="小睡入眠时间"
                    customStyles={customStyle}
                    right={v.start || "请选择"}
                  />
                </Picker>
              </View>
              <View className={styles.row}>
                <Picker
                  mode="time"
                  style={{ width: "100%" }}
                  value={v.end}
                  onChange={e => onSleepChange(e, i, "end")}
                >
                  <ListItem
                    left="小睡醒来时间"
                    customStyles={customStyle}
                    right={v.end || "请选择"}
                  />
                </Picker>
              </View>
              <View className={styles2.btn} onClick={() => del(i)}>
                删除
              </View>
            </View>
          ))}
          <View className={styles2.btn} onClick={addItem}>
            添加一次小睡
          </View>
        </View>

        <View className={styles.actions}>
          <Button className={styles.btn} color="primary" onClick={save}>
            保存数据
          </Button>
        </View>
      </View>

      <Popup
        open={visible}
        onClose={() => setVisible(false)}
        placement="top"
        style={{ height: "70%" }}
      >
        <View className={styles["list-wrap"]}>
          <View className={styles["list"]}>
            {children.map((v, index) => (
              <View
                key={index}
                className={styles["child-info"]}
                onClick={() => chooseChild(v)}
              >
                <View className={styles["left"]}>
                  <Image
                    src={v.gender === "男" ? maleImg : femaleImg}
                    className={styles["gender"]}
                  />
                  <View className={styles["text-info"]}>
                    <Text className={styles.name}>{v.name}</Text>
                    <Text className={styles.birthday}>{v.birthday}</Text>
                  </View>
                </View>
                <View className={styles.actions}>
                  {currentChildren.id === v.id && (
                    <Checked className={styles.action} color="#ffa200" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Popup>
    </View>
  );
}
