import { PaymentType } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import { Base64, navWithLogin } from "@/service/utils";
import { ActionSheet, Notify } from "@taroify/core";
import { ChatOutlined } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import { navigateTo, setStorageSync } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import styles from "./ad.module.scss";

enum Channel {
  fushu,
  anqier,
  quzhou,
  leibo,
  meiyou
}

export default function App() {
  const [staticData, setStaticData] = useState<any>({
    detail: "",
    button: ""
  });

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState<any>({});
  const childContext = useContext(ChildContext);

  useEffect(() => {
    (async () => {
      setStorageSync("channel", "meiyou");
      setStorageSync("orgId", "f9b6b0c4");
      wx._channel = "meiyou";
      wx._orgId = "f9b6b0c4";
      const res = await request({
        url: "/promotion/get"
      });
      setStaticData(res.data);
    })();
  }, []);

  const preview = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc86155f0abef5c38b" },
      corpId: "ww47f31bbc9556c2ef",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      }
    });
  };

  const checkPay = id => {
    if (childContext.child.len) {
      navigateTo({
        url: `/childPackage/pages/choose?code=${price.scaleTableCode}&orderId=${id}`
      });
    } else {
      const returnUrl = Base64.encode("/pages/evaluate/list?key=1");
      navigateTo({
        url: `/childPackage/pages/manage?returnUrl=${returnUrl}`
      });
    }
  };

  const buy = async () => {
    const checkRes = await request({
      url: "/order/check",
      data: { scaleTableCode: price.scaleTableCode }
    });
    if (!checkRes.data.hasPaidOrder) {
      const res = await request({
        url: "/order/create",
        method: "POST",
        data: {
          scaleTableCode: price.scaleTableCode,
          priceId: price.id,
          payment: PaymentType.ONLINE,
          invoiceId: 0
        }
      });
      if (!res.data.hasPaidOrder) {
        const payRes = await request({
          url: "/order/pay",
          data: { id: res.data.orderId, ip: "127.0.0.1" }
        });
        wx.requestPayment({
          timeStamp: payRes.data.timeStamp,
          nonceStr: payRes.data.nonceStr,
          package: payRes.data.packageValue,
          signType: payRes.data.signType,
          paySign: payRes.data.paySign,
          success(res2) {
            Notify.open({ color: "success", message: "支付成功" });
            checkPay(res.data.orderId);
          }
        });
      } else {
        checkPay(res.data.orderId);
      }
    } else {
    //   console.log(checkRes);
      checkPay(checkRes.data.orderId);
    }
  };

  const preBuy = async () => {
    if (wx._unLogin) {
      navWithLogin(`/pages/meiyou/ad`);
    } else {
      const res2 = await request({
        url: "/promotion/scale/price/get"
      });
      setPrice(res2.data);
      console.log("🚀 ~ file: ad.tsx:15 ~ res:", res2);
      setOpen(true);
    }
  };

  return (
    <View className="index">
      <ScrollView className={styles.imgView}>
        <Image src={staticData.detail} mode="widthFix" className={styles.m1} />
        <View className={styles.action}>
          <View className={styles.kefu} onClick={preview}>
            <ChatOutlined size={20} />
            <Text className={styles.kefu}>客服</Text>
          </View>
          <View>
            <View className={styles.btn} onClick={() => preBuy()}>
              立即购买
            </View>
          </View>
        </View>
        <ActionSheet
          open={open}
          onSelect={() => setOpen(false)}
          onClose={setOpen}
        >
          <View className={styles.pop}>
            <View className={styles.title}>{price.scaleTableName}</View>
            <View className={styles.yuanjian}>原价：{price.listPrice}元</View>
            <View className={styles.youhui}>
              <View>
                限时优惠：<Text>{price.salePrice}元</Text>
              </View>
              <View className={styles.payBtn} onClick={buy}>
                立即支付
              </View>
            </View>
          </View>
        </ActionSheet>
      </ScrollView>
    </View>
  );
}
