import Box from "@/comps/Box";
import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import React from "react";
import "./gmsPay.scss";

export default function App() {
  const goto = url => {
    navigateTo({ url });
  };

  return (
    <View className="index">
      <Box title="订单管理" styles={{ marginTop: 10 }}>
        <View className="">
          GMs自评建议将对宝宝面临的脑发育风险程
          度给出相应的类别，为您决定是否尽快就医诊
          治提供参考，GMs自评不属于医疗看诊，无 法代替医生面诊，敬请您知晓。
          通过专业的高质星GMs评估和就诊后的综合
          检查可以尽早有效诊断宝宝的脑发育是否健
          康，是否需要早期康复干预。通过GMs的有
          效鉴别，既能避免健康宝宝盲目接受康复，又
          能为发育落后的宝宝抓住早期康复干预的黄金 时期。
        </View>
      </Box>
      <Box title="订单管理" styles={{ marginTop: 10 }}>
        <View className="">
          行业顶级专家团队针对筛查结果进行评 估，为孩子健康发育保驾护航
        </View>
      </Box>
      <Box title="订单管理" styles={{ marginTop: 10 }}>
        <View>200元/次</View>
        <View>*量表筛直为一次性消费产品，一旦购买概不退换</View>
      </Box>
    </View>
  );
}
