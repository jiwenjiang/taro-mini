import Box from "@/comps/Box";
import {
  DanjuTishi,
  EvaluateType,
  MediaType,
  PaymentType
} from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import Book from "@/static/icons/bookmark-3-fill.svg";
import Psy from "@/static/icons/psychotherapy-fill.svg";
import tip from "@/static/icons/tip.svg";
import { Button, Notify } from "@taroify/core";
import { ArrowDown, Clear, Plus } from "@taroify/icons";
import { Image, ScrollView, View } from "@tarojs/components";
import Taro, { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import { cls } from "reactutils";

import PayBtn from "@/comps/PayBtn";
import PriceList from "@/comps/PriceList";
import { Base64 } from "@/service/utils";
import styles from "../book/index.module.scss";
import "./gmsPay.scss";

export default function App() {
  const [value, setValue] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [priceList, setPrice] = useState<
    NonNullable<
      {
        availableTimes: number;
        listPrice: string;
        salePrice: string;
        id: number;
      }[]
    >
  >([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [intro, setIntro] = useState({ name: "", introduction: "" });
  const childContext = useContext(ChildContext);
  const [payMode, setPayMode] = useState<1 | 2>(1);
  const [pic, setPic] = useState<any>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSucc, setUploadSucc] = useState(false);

  const router = useRouter();

  const checkPay = async () => {
    const res = await request({
      url: "/order/check",
      data: { scaleTableCode: router.params.code, type: EvaluateType.ZHINENG }
    });
    if (!res.data.hasPaidOrder) {
      navigateTo({ url: `/orderPackage/pages/order/gmsPay` });
    } else {
      if (childContext.child.len) {
        navigateTo({
          url: `/childPackage/pages/choose?code=${router.params.code}&orderId=${res.data.orderId}`
        });
      } else {
        const returnUrl = Base64.encode("/pages/evaluate/list?key=1");
        navigateTo({
          url: `/childPackage/pages/manage?returnUrl=${returnUrl}`
        });
      }
    }
  };

  const buy = async id => {
    if (!value) {
      Notify.open({ color: "warning", message: "请先同意服务条款" });
      return;
    }
    const res = await request({
      url: "/reserve/unified",
      method: "POST",
      data: {
        category: 1,
        childrenId: 0,
        scaleCodes: [Number(router.params.code)],
        priceId: id,
        payment: PaymentType.ONLINE,
        invoiceId: [0],
        type: EvaluateType.ZHINENG,
        workScheduleId: 0
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
        success(res) {
          Notify.open({ color: "success", message: "支付成功" });
          checkPay();
        }
      });
    } else {
      checkPay();
    }
  };

  useEffect(() => {
    (async () => {
      const introRes = await request({
        url: "/scaleTable/introduction",
        data: { code: router.params.code }
      });
      const res = await request({
        url: "/scaleTable/price",
        data: { code: router.params.code }
      });
      const payRes = await request({
        url: "/scaleTable/payment",
        data: { code: router.params.code }
      });
      setPayMode(payRes.data.includes("OFF_LINE") ? 1 : 2);

      setPrice(res.data);
      setIntro({
        name: introRes.data.name,
        introduction: introRes.data.introduction
      });
    })();
  }, []);

  const expand = () => {
    setIsExpand(!isExpand);
  };

  const changePay = type => {
    setPayMode(type);
  };

  const del = i => {
    const list = pic.filter((_v, i2) => i !== i2);
    setPic(list);
  };

  const chooseMedia = () => {
    setUploading(true);
    wx.chooseMedia({
      count: 9,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        // const filePath = res.tempFiles[0].tempFilePath;
        console.log(1, res);
        let num = 0;
        const picList: any = [];
        setUploading(true);
        res.tempFiles.forEach(c => {
          upload2Server(c.tempFilePath, MediaType.PICTURE, v => {
            // setPic(v);
            picList.push(v);
            num++;
            if (num === res.tempFiles.length) {
              setUploading(false);
              setPic(picList);
            }
            console.log("🚀 ~ file: brain.tsx ~ line 128 ~ success ~ v", v);
          });
        });
        return;
      }
    });
  };

  const evaluate = async () => {
    if (pic.length === 0) {
      Notify.open({ color: "warning", message: "请上传缴费单据" });
      return;
    }
    await request({
      url: "/reserve/unified",
      method: "POST",
      data: {
        scaleCodes: [Number(router.params.code)],
        childrenId: 0,
        type: EvaluateType.ZHINENG,
        workScheduleId: 0,
        payment: PaymentType.OFFLINE,
        invoiceId: pic.map(v => v.id),
        priceId: priceList[currentPrice]?.id,
        category: 1
      }
    });
    setUploadSucc(true);
  };

  const goto = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list" });
    childContext.updateChild({ len: res.data.children.length });
  };

  return (
    <View className="index">
      {uploadSucc ? (
        <View>
          <View className={styles.succBox}>
            <View className={styles.tiphead}>
              <Image src={tip} className={styles.tip}></Image>
              温馨提示
            </View>

            <View className={styles.tipBody}>
              <View className={styles.hasComplate}>上传完成！</View>
              <View>等待后台审核通过后会短信通知，即可开始评估！</View>
            </View>
          </View>
          <View className={styles.preBtn} onClick={() => goto()}>
            我知道了
          </View>
        </View>
      ) : (
        <ScrollView>
          <Box
            title={
              <View>
                <Image src={Book} className="icon" />
                {intro?.name}
              </View>
            }
            styles={{ marginTop: 10 }}
          >
            <View
              className={cls(
                "desc",
                "intro-box",
                isExpand && "constent-visible"
              )}
            >
              <View className="intro-text">{intro?.introduction}</View>
            </View>
            <View className="expand-box">
              <ArrowDown
                onClick={() => expand()}
                className={cls(isExpand && "is-expand")}
              />
            </View>
          </Box>
          <Box
            title={
              <View>
                <Image src={Psy} className="icon" />
                专家评估
              </View>
            }
            styles={{ marginTop: 10 }}
          >
            <View className="desc">
              行业顶级专家团队针对筛查结果进行评估，为孩子健康发育保驾护航
            </View>
          </Box>
          <View>
            <PayBtn
              changePay={changePay}
              payMode={payMode}
              code={router.params.code}
              type={EvaluateType.ZHINENG}
            ></PayBtn>
            <View className={styles.picBox}>
              {pic.map((v, i) => (
                <View style={{ position: "relative" }} key={i}>
                  <Clear
                    className={styles.clear}
                    onClick={e => del(i)}
                    color="#f2b04f"
                  />
                  <Image src={v.url} className={styles.pic} />
                </View>
              ))}
            </View>

            {payMode === 1 && (
              <View className={styles.danjuBox}>
                <Plus className={styles.addIcon} onClick={chooseMedia} />
                <View>{DanjuTishi}</View>
              </View>
            )}
            {payMode === 1 && (
              <Button
                onClick={evaluate}
                style={{ width: "100%", marginTop: 20 }}
                color="primary"
                disabled={uploading}
              >
                开始评估
              </Button>
            )}
          </View>
          {payMode === 2 && (
            <PriceList
              value={value}
              setValue={setValue}
              buy={buy}
              code={router.params.code}
              type={EvaluateType.ZHINENG}
            ></PriceList>
          )}
        </ScrollView>
      )}
      <Notify id="notify" />
    </View>
  );
}
