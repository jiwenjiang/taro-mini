import { EvaluateType } from "@/service/const";
import request from "@/service/request";
import weixuanzhong from "@/static/imgs/weixuanzhong.png";
import xuanzhong from "@/static/imgs/xuanzhong.png";
import { Image, Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

export default function PayBtn({
  payMode,
  changePay,
  code,
  type
}: {
  payMode: 1 | 2;
  changePay: Function;
  code: String | undefined;
  type: EvaluateType;
}) {
  const [payList, setPayList] = useState<("OFF_LINE" | "ON_LINE")[]>([]);

  useEffect(() => {
    (async () => {
      const payRes = await request({
        url: "/scaleTable/payment",
        data: { code: code ?? 0, type }
      });
      setPayList(payRes.data);
    })();
  }, []);

  return (
    <View className={styles.payBox}>
      {payList.includes("OFF_LINE") && (
        <View
          className={cls(styles.payCard, payMode === 1 && styles.active)}
          onClick={() => changePay(1)}
        >
          <Text>院内支付</Text>
          <Image
            src={payMode === 1 ? xuanzhong : weixuanzhong}
            className={styles.choose}
          ></Image>
        </View>
      )}
      {payList.includes("ON_LINE") && (
        <View
          className={cls(styles.payCard, payMode === 2 && styles.active)}
          onClick={() => changePay(2)}
        >
          <Text>在线支付</Text>
          <Image
            src={payMode === 2 ? xuanzhong : weixuanzhong}
            className={styles.choose}
          ></Image>
        </View>
      )}
    </View>
  );
}
