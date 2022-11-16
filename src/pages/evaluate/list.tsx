import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import { ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import { Arrow } from "@taroify/icons";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React, { useContext } from "react";
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

  const todo = (code = ScaleTableCode.BRAIN) => {
    if (childContext.child.len) {
      navigateTo({ url: `/pages/child/choose?code=${code}` });
    } else {
      navigateTo({ url: `/pages/child/manage?code=${code}` });
    }
  };

  const checkPay = async scaleTableCode => {
    const res = await request({
      url: "/order/check",
      data: { scaleTableCode }
    });
    console.log("🚀 ~ file: list.tsx ~ line 35 ~ checkPay ~ res", res);
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
        <View
          className="list"
          onClick={() => checkPay(ScaleTableCode.LEIBO_BRAIN)}
        >
          <ListItem
            left="婴幼儿神经运动16项检查(蕾波)"
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
                <View>全身运动质量评估(GMs) +</View>
                <View>婴幼儿神经运动16项检查(蕾波)</View>
              </View>
            }
            right={
              <View className="arrow-icon">
                <Arrow color="#fff" />
              </View>
            }
            customStyles={cusStyle}
          />
        </View>
      </View>
      <TabBar current="index" />
    </View>
  );
}
