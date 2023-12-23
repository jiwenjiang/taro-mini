import Box from "@/comps/Box";
import { DanjuTishi, MediaType, PaymentType } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import Book from "@/static/icons/bookmark-3-fill.svg";
import Cny from "@/static/icons/exchange-cny-fill.svg";
import Psy from "@/static/icons/psychotherapy-fill.svg";
import tip from "@/static/icons/tip.svg";
import weixuanzhong from "@/static/imgs/weixuanzhong.png";
import xuanzhong from "@/static/imgs/xuanzhong.png";
import { Button, Checkbox, Notify, Popup } from "@taroify/core";
import { ArrowDown, Clear, Plus } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import Taro, { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import { cls } from "reactutils";

import { Base64 } from "@/service/utils";
import styles from "../book/index.module.scss";
import "./gmsPay.scss";

export default function App() {
  const [value, setValue] = useState(false);
  const [open, setOpen] = useState(false);
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
  const [payList, setPayList] = useState<("OFF_LINE" | "ON_LINE")[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSucc, setUploadSucc] = useState(false);

  const router = useRouter();

  const checkPay = async () => {
    const res = await request({
      url: "/order/check",
      data: { scaleTableCode: router.params.code }
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

  const buy = async () => {
    if (!value) {
      Notify.open({ color: "warning", message: "请先同意服务条款" });
      return;
    }
    const res = await request({
      url: "/order/create",
      method: "POST",
      data: {
        scaleTableCode: router.params.code,
        priceId: priceList[currentPrice].id,
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
      console.log("🚀 ~ file: gmsPay.tsx:100 ~ payRes:", payRes);
      setPayList(payRes.data);
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
      url: "/reserve/submit",
      method: "POST",
      data: {
        scaleCodes: [router.params.code],
        childrenId: 0,
        type: 3,
        workScheduleId: 0,
        payment: PaymentType.OFFLINE,
        invoiceId: pic.map(v => v.id)
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
            <View className={styles.payBox}>
              {payList.includes("OFF_LINE") && (
                <View
                  className={cls(
                    styles.payCard,
                    payMode === 1 && styles.active
                  )}
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
                  className={cls(
                    styles.payCard,
                    payMode === 2 && styles.active
                  )}
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
            <View style={{ paddingBottom: 20 }}>
              <Box
                title={
                  <View>
                    <Image src={Cny} className="icon" />
                    付费标准
                  </View>
                }
                styles={{ marginTop: 10 }}
              >
                <View className="desc">
                  <View className="price-box">
                    {priceList?.map((v, i) => (
                      <View
                        key={i}
                        className={cls(
                          "price-item",
                          currentPrice === i && "price-item-active"
                        )}
                        onClick={() => setCurrentPrice(i)}
                      >
                        <View>{v.availableTimes}次</View>
                        <View className="price-item-listPrice">
                          {v.listPrice}元
                        </View>
                        <View className="price-item-salePrice">
                          {v.salePrice}元
                        </View>
                      </View>
                    ))}
                  </View>
                  <View className="sub-desc">
                    *量表筛查为一次性消费产品，一旦购买概不退换
                  </View>
                </View>
              </Box>
              <View className="agreement">
                <Checkbox
                  shape="square"
                  checked={value}
                  onChange={setValue}
                  size={18}
                >
                  <View className="read">我己阅读并同意 </View>
                </Checkbox>
                <Text className="buy" onClick={() => setOpen(true)}>
                  《购买服务条款》
                </Text>
              </View>
              <Popup
                defaultOpen
                placement="bottom"
                style={{ height: "100%" }}
                open={open}
                onClose={() => setOpen(false)}
              >
                <Popup.Close />
                <View className="head">GMs新生婴儿脑发育风险自评服务条款</View>
                <View className="body">
                  <View className="title">服务条款总则</View>
                  <View className="content">
                    1.任何使用GMs新生婴儿脑发育风险自评APP软件(简称GMs自评软件)的用户均应仔细阅读本服务条款，用户使用本软件的行为将被视为对服务条款全部内容的认可并接受;
                  </View>
                  <View className="content">
                    2.GMs自评软件是关于4月龄以内小婴儿家长用户进行GMs脑发育风险自评的平台，
                    <Text style={{ color: "#F44336" }}>
                      本软件的自评报告仅供参考，不能作为医疗诊断和治疗的直接依据;
                    </Text>
                  </View>
                  <View className="content">
                    3.GMs风险自评只是儿童吃发育健康咨询领域的一种初步方法，不能仅仅依靠GMs自评结果判断小婴儿的脑发育状况;
                  </View>
                  <View className="content">
                    4.随着宝宝出生后发育长大，相隔数周的多次GMs自评能够更为清晰的了解宝宝脑发育的情况及其变化;
                  </View>
                  <View className="content">5.自评费用一旦支付将不予退回;</View>
                  <View className="content">
                    6.我们将在必要时修改服务条款，如果家长用户继续使用本软件提供的服务，则被视为接受服务条款变动。我们保留修改服务条款的权利，不需知照家长用户或第三方。
                  </View>

                  <View className="title">免责声明</View>
                  <View className="content">
                    1.家长用户应该理解GMs自评不属于医疗看诊，无法代替医生面诊，因此GMs自评报告仅供参考，具体诊疗请一定要到医院由相关医生完成;
                  </View>
                  <View className="content">
                    2.我们不承担因家长用户自身过错、网络状况、通讯线路等任何技术原因或其他不可控原因而导致不能正常进行GMs自评以及因此引起的损失，亦不承担任何相关法律责任。
                  </View>

                  <View className="title">其他说明</View>
                  <View className="content">
                    1.家长客户应提供真实、正确的信息资料并耐心完成自评;
                  </View>
                  <View className="content">
                    2.用户名
                    登录密码和支付密码只允许家长用户使用，不得将登录密码和支付密码公开或提供给第三方，家长用户将对用户名、登录密码和支付密码的安全负有全部责任。另外，每个家长用户都要对以其用户名进行的所有活动和事件负全责;
                  </View>
                  <View className="content">
                    3.我们对家长上传的信息、资料以及自评建议等资料的保存期限为完成自评后的6个月。
                  </View>
                </View>
              </Popup>
              <Button
                onClick={buy}
                style={{ width: "100%", marginTop: 20 }}
                color="primary"
              >
                立即购买
              </Button>
            </View>
          )}
        </ScrollView>
      )}
      <Notify id="notify" />
    </View>
  );
}
