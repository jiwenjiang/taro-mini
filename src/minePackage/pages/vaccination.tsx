import { ChildContext } from "@/service/context";
import request from "@/service/request";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Button, Notify, Popup } from "@taroify/core";
import { Checked, Exchange } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useContext, useEffect, useState } from "react";

import React from "react";
import { cls } from "reactutils";
import styles from "./vaccination.module.scss";

export default function App() {
  const router = useRouter();
  const [updateFlag, setUpdateFlag] = useState(Date.now());
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const childContext = useContext(ChildContext);
  const [list, setList] = useState<any>([]);
  const [BizTypes, setBizTypes] = useState([
    {
      id: 1,
      name: "一类疫苗（免费）"
    },
    {
      id: 2,
      name: "二类疫苗（自费）"
    }
  ]);
  const [currBizType, setCurrBizType] = useState(BizTypes[0]);

  // 页面加载时调用该方法获取儿童信息
  useEffect(() => {
    getChildrenList();
  }, [updateFlag]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const switchBizType = (item: any) => {
    if (item.id === currBizType.id) {
      return;
    }
    setCurrBizType(item);
  };

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChildren(res.data.children);
    setCurrentChildren(res.data.children?.[0]);
    childContext.updateChild({ len: res.data.children.length });
  };

  useEffect(() => {
    if (currentChildren.id) {
      getList();
    }
  }, [currentChildren.id]);

  const getList = async () => {
    const res = await request({
      url: "/vaccination/get",
      data: { childrenId: currentChildren.id }
    });
    setList(res.data);
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
  // 跳转至添加儿童页面，并带上儿童 ID，以编辑儿童信息
  const edit = index => {
    navigateTo({
      url: `/childPackage/pages/edit?childId=${children[index].id}`
    });
  };

  const chooseChild = v => {
    setCurrentChildren(v);
    setVisible(false);
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
        <View className={styles.actions}>
          {children?.length === 0 && (
            <Button className={styles.btn} color="primary" onClick={add}>
              添加儿童
            </Button>
          )}
        </View>
      </View>
      <View className={styles.bizTypes}>
        {BizTypes.map((item, i) => (
          <View
            key={i}
            className={cls(
              styles.item,
              currBizType.id === item.id && styles.active
            )}
            onClick={() => switchBizType(item)}
          >
            <View className={styles.text}>{item.name}</View>
            <View className={styles.border}></View>
          </View>
        ))}
      </View>
      <View className={styles.listBox}>
        <View className={styles.list}>
          {list[currBizType.id]?.map(v => (
            <View className={cls(styles.itemBox, v.expired && styles.expired)}>
              <View>{v.name}</View>
              <View className={styles.bottomItem}>
                <Text>{v.timeToVaccinate}</Text>
                <Text>{v.actualVaccinate}</Text>
              </View>
            </View>
          ))}
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
