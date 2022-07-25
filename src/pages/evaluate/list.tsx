import TabBar from "@/comps/TabBar";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import { AtListItem } from "taro-ui";
import "./list.scss";

export default function App() {

  const todo = (code = ScaleTableCode.BRAIN) => {
    navigateTo({ url: `/pages/child/choose?code=${code}` });
  };

  const checkPay = async scaleTableCode => {
    const res = await request({
      url: "/order/check",
      data: { scaleTableCode }
    });
    if (!res.data.hasPaidOrder) {
      navigateTo({ url: `/pages/order/gmsPay?code=${scaleTableCode}` });
    } else {
      navigateTo({
        url: `/pages/child/choose?code=${scaleTableCode}&orderId=${res.data.orderId}`
      });
    }
  };

  return (
    <View className="index">
      <View className="list" onClick={() => todo()}>
        <AtListItem
          title="蕾波儿童脑瘫危险程度量表"
          arrow="right"
          hasBorder={false}
        />
      </View>
      <View className="list">
        <AtListItem
          title="GMs评估量表"
          arrow="right"
          hasBorder={false}
          onClick={() => checkPay(ScaleTableCode.GMS)}
        />
      </View>
      <View className="list">
        <AtListItem
          title="GMs+脑瘫类型量表"
          arrow="right"
          hasBorder={false}
          onClick={() => checkPay(ScaleTableCode.BRAIN_GMS)}
        />
      </View>
      {/* <AtModal isOpened={isOpened}>
        <AtModalContent>
          <View className="icon">
            <AtIcon value="alert-circle" color="#ffd340" size="30"></AtIcon>
          </View>
          检测到该儿童一周内没有蕾波儿童脑瘫危险程度量表的评测，需要先完成该量表评测
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setIsOpened(false)}>取消</Button>{" "}
          <Button onClick={() => todo()}>现在去做</Button>
        </AtModalAction>
      </AtModal> */}
      <TabBar current="index" />
    </View>
  );
}
