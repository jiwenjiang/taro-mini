import FieldInput from "@/comps/Field";
import request from "@/service/request";
import CheckedIcon from "@/static/icons/checked.svg";
import DropdownIcon from "@/static/icons/dropdown.svg";
import { Checkbox, Notify, Radio, Slider } from "@taroify/core";
import Button from "@taroify/core/button/button";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./info.module.scss";
import styles2 from "./sleepHabit.module.scss";
import "./sleepHabit.scss";

export default function App() {
  const [answers, setAnswers] = useState<any>([]);
  const [data, setData] = useState([]);
  const router = useRouter();
  const [openPicker, setOpenPicker] = useState(false);

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

  const save = async () => {
    console.log("ans", answers);
    const params = buildData();
    const res = await request({
      url: "/sleep/habits/answer/save",
      method: "GET",
      data: {
        answers: params,
        childrenId: router.params.childrenId
      }
    });
  };

  const buildData = () => {
    const ans = answers.map(v => {
      if (v.type === 1) {
        const item = v.options.find(c => c.sn === v.answerSn) || { sn: 1 };
        const optionItem = {
          optionSn: item.sn,
          content: item.next?.type === 3 ? v.inputContent : "",
          next:
            item.next?.type === 2
              ? item.next?.options?.filter(c => c.checked)
              : []
        };
        return { sn: v.sn, options: [optionItem] };
      }
      if (v.type === 2) {
        return { sn: v.sn, options: v.answerSn.map(c => ({ optionSn: c })) };
      }
      if (v.type === 3) {
        return { sn: v.sn, content: v.inputContent };
      }
      if (v.type === 4) {
        const item = v.options.find(c => c.sn === v.answerSn) || { sn: 1 };
        const optionItem = {
          optionSn: item.sn,
          content: "",
          next: []
        };
        return { sn: v.sn, options: [optionItem] };
      }
    });
    console.log("🚀 ~ buildData ~ ans:", ans);

    return ans;
  };

  // 1 单选 3填空
  const changeVal = (e, q, m) => {
    console.log("🚀 ~ changeVal ~ e:", e, q, m);
    q[m] = e;
    if (q.type === 1) {
      const item = q.options.find(c => c.sn === e);
      if (item.next?.type === 3) {
        q.showNextContent = true;
      }
      if (item.next?.type === 2) {
        q.showMultPicker = true;
        // setPickerList(item.next?.options);
        console.log("🚀 ~ changeVal ~ item.next?.options:", item.next?.options);
      }
    }
    setAnswers([...answers]);
    // setData([...data]);
  };

  const inputVal = (a, b) => {
    b.inputContent = a;
    setAnswers([...answers]);
  };

  const onPickerChange = (c, item) => {
    item.checked = !!!item.checked;
    setAnswers([...answers]);
    console.log(c, item);
  };

  const calcPickerText = item => {
    let list = item.options?.filter((v, i) => v.checked).map(c => c.content);

    return list.join(",");
  };

  const isChecked = item => {
    return item.checked;
  };

  const sliderChange = (e, v) => {
    console.log("🚀 ~ sliderChange ~ e:", e);
    v.answerSn = e;
    setAnswers([...answers]);
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
                  value={answers[i].answerSn ?? 1}
                  onChange={e => changeVal(e, answers[i], "answerSn")}
                >
                  {answers[i].options.map(c => (
                    <View key={c.sn} className={styles2.radioRow}>
                      <Radio name={c.sn} key={c.sn}>
                        <View>{c.content}</View>
                      </Radio>
                      {v.showNextContent && answers[i].answerSn === c.sn && (
                        <FieldInput
                          label=""
                          placeholder="请输入"
                          value={answers[i].inputContent}
                          onInput={(e: any) => inputVal(e.target.value, v)}
                          rootStyles={{
                            padding: "6px 12px",
                            paddingTop: 0,
                            borderBottom: "1px solid #666",
                            height: "30px"
                          }}
                          labelStyles={{ color: "#333" }}
                        />
                      )}
                      {v.showMultPicker && answers[i].answerSn === c.sn && (
                        <View className="risks">
                          <View
                            className="row-inside"
                            onClick={() => setOpenPicker(true)}
                          >
                            <Text>请选择</Text>
                            <View className="dropdown">
                              <View className="dropdown-text">
                                {calcPickerText(c.next)}
                              </View>
                              <Image
                                src={DropdownIcon}
                                className="dropdown-icon"
                              />
                            </View>
                          </View>
                          {openPicker && (
                            <View className="mask">
                              <View className={`dropdown-items`}>
                                {c.next?.options?.map((item, index) => (
                                  <View
                                    className="item"
                                    key={index}
                                    onClick={e => onPickerChange(c, item)}
                                  >
                                    <View className="icon-wrapper">
                                      <Image
                                        src={CheckedIcon}
                                        className={`checked-icon ${isChecked(
                                          item
                                        ) && "checked"}`}
                                      />
                                    </View>
                                    <View
                                      className={`item-text ${isChecked(item) &&
                                        "checked"}`}
                                    >
                                      {item.content}
                                    </View>
                                  </View>
                                ))}
                                <View className="actions">
                                  <Button
                                    onClick={() => setOpenPicker(false)}
                                    className="confirm"
                                  >
                                    确定
                                  </Button>
                                </View>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </Radio.Group>
              </View>
            )}
            {v.type === 2 && (
              <View>
                <View className={styles2.title}>{v.name}</View>
                <Checkbox.Group
                  value={answers[i].answerSn ?? []}
                  onChange={e => changeVal(e, answers[i], "answerSn")}
                >
                  {answers[i].options.map(c => (
                    <View key={c.sn} className={styles2.radioRow}>
                      <Checkbox shape="square" name={c.sn} key={c.sn}>
                        <View>{c.content}</View>
                      </Checkbox>
                    </View>
                  ))}
                </Checkbox.Group>
              </View>
            )}
            {v.type === 3 && (
              <View>
                <View className={styles2.title}>{v.name}</View>
                <FieldInput
                  label=""
                  placeholder="请输入"
                  value={answers[i].inputContent}
                  onInput={(e: any) => inputVal(e.target.value, v)}
                  rootStyles={{
                    padding: "6px 12px",
                    paddingTop: 0,
                    borderBottom: "1px solid #666",
                    height: "30px"
                  }}
                  labelStyles={{ color: "#333" }}
                />
              </View>
            )}
            {v.type === 4 && (
              <View>
                <View className={styles2.title}>{v.name}</View>
                <View className={styles2.slider}>
                  <View className={styles2.sliderContent}>
                    {v.options?.[0]?.content}
                  </View>
                  <Slider
                    className="custom-color"
                    value={v.answerSn ?? 1}
                    onChange={e => sliderChange(e, v)}
                    max={v.options?.[v.options?.length - 1]?.score}
                  >
                    <Slider.Thumb>
                      <View className="custom-thumb">{v.answerSn ?? 1}</View>
                    </Slider.Thumb>
                  </Slider>
                  <View className={styles2.sliderContent}>
                    {v.options?.[v.options?.length - 1]?.content}
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.btnBox}>
        <Button color="primary" className={styles.btn} onClick={save}>
          保存
        </Button>
      </View>
    </View>
  );
}
