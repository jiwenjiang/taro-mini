import ListItem from "@/comps/ListItem";
import TabBar from "@/comps/TabBar";
import { ChildContext } from "@/service/context";
import { useAuth } from "@/service/hook";
import request from "@/service/request";
import { Base64 } from "@/service/utils";
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
          url: `/childPackage/pages/choose?code=${scaleTableCode}&orderId=${res.data.orderId}`
        });
      } else {
        const returnUrl = Base64.encode("/pages/evaluate/list?key=1");

        navigateTo({
          url: `/childPackage/pages/manage?code=${scaleTableCode}&returnUrl=${returnUrl}`
        });
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
    if (router.params.channel || router.params.orgid || wx._orgId) {
      getAuth(getList, {
        channel: router.params.channel || "",
        orgid: router.params.orgid || wx._orgId
      });
    } else {
      getList();
    }
  }, []);

  return (
    <View className="index">
      <View className="list-wrap">
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
