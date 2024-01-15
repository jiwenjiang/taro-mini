import request from "@/service/request";
import { Notify, Radio } from "@taroify/core";
import Button from "@taroify/core/button/button";
import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import styles from "./info.module.scss";
import styles2 from "./sleepHabit.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const [answers, setAnswers] = useState<any>([]);
  const [data, setData] = useState([]);

  const getAns = async () => {
    const res = await request({
      url: "/sleep/habits/answer/get",
      method: "GET"
    });
    setAnswers(res.data.map(v => ({ ...v, sn: 1 })));
    console.log("🚀 ~ file: sleepHabit.tsx:19 ~ getAns ~ res:", res);
  };

  useEffect(() => {
    getAns();
  }, []);

  const save = async () => {};

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles2.habitBox}>
        {answers.map((v, i) => (
          <View key={i}>
            {v.type === 1 && (
              <View>
                <View className={styles2.title}>{v.name}</View>
                <Radio.Group
                  value={answers[i].sn ?? 1}
                  onChange={e => changeVal(e, answers[i].options, "answerSn")}
                >
                  {answers[i].options.map(c => (
                    <Radio name={c.sn} key={c.sn}>
                      {c.content}
                    </Radio>
                  ))}
                </Radio.Group>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.btnBox}>
        <Button color="primary" className={styles.btn} onClick={save}>
          保存信息
        </Button>
      </View>
    </View>
  );
}
