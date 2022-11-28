import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import { ChildContext } from "@/service/context";
import { useAuth } from "@/service/hook";
import request from "@/service/request";
import { Arrow } from "@taroify/icons";
import { View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import "./list.scss";

const cusStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  width: "280px",
  height: "60px",
  position: "static" as any
};

export default function App() {
  const childContext = useContext(ChildContext);
  const [list, setList] = useState<any>([]);
  const router = useRouter();
  const { getAuth } = useAuth();

  const checkPay = async scaleTableCode => {
    const res = await request({
      url: "/order/check",
      data: { scaleTableCode }
    });
    if (!res.data.hasPaidOrder) {
      navigateTo({
        url: `/orderPackage/pages/order/gmsPay?code=${scaleTableCode}`
      });
    } else {
      if (childContext.child.len) {
        navigateTo({
          url: `/pages/child/choose?code=${scaleTableCode}&orderId=${res.data.orderId}`
        });
      } else {
        navigateTo({ url: `/pages/child/manage?code=${scaleTableCode}` });
      }
    }
  };

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/list"
    });
    setList(res.data);
  };

  useEffect(() => {
    if (router.params.channel || router.params.orgid) {
      getAuth(getList, {
        channel: router.params.channel,
        orgid: router.params.orgid
      });
    } else {
      getList();
    }
  }, []);

  return (
    <View className="index">
      <View className="list-wrap">
        {/* <View className="list" onClick={() => todo()}>
          <ListItem
            left="婴幼儿脑瘫危险程度量表(蕾波)"
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
            customStyles={cusStyle}
          />
        </View>
        <View
          className="list"
          onClick={() => checkPay(ScaleTableCode.BRAIN_GMS)}
        >
          <ListItem
            left={
              <View>
                <View>全身运动质量评估(GMs) +</View>
                <View>婴幼儿脑瘫危险程度量表(蕾波)</View>
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
            customStyles={cusStyle}
          />
        </View> */}
        {/* <View
          className="list"
          onClick={() => checkPay(ScaleTableCode.LEIBO_BRAIN)}
        >
          <ListItem
            left="婴幼儿神经运动16项"
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
            customStyles={cusStyle}
          />
        </View>
        <View
          className="list"
          onClick={() => checkPay(ScaleTableCode.LEIBO_GMS)}
        >
          <ListItem
            left={
              <View>
                <View>GMs与婴幼儿神经运动16项</View>
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
            customStyles={cusStyle}
          />
        </View> */}
        {list?.map((v, i) => (
          <View key={i} className="list" onClick={() => checkPay(v.code)}>
            <ListItem
              left={v.name}
              right={
                <View className="arrow-icon">
                  <Arrow color="#fff" />
                </View>
              }
              customStyles={cusStyle}
            />
          </View>
        ))}
      </View>
      <TabBar current="index" />
    </View>
  );
}
