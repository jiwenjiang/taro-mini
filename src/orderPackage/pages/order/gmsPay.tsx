import Box from "@/comps/Box";
import { ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import Book from "@/static/icons/bookmark-3-fill.svg";
import Cny from "@/static/icons/exchange-cny-fill.svg";
import Psy from "@/static/icons/psychotherapy-fill.svg";
import { Button, Checkbox, Notify, Popup } from "@taroify/core";
import { ArrowDown } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import { cls } from "reactutils";
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
  const childContext = useContext(ChildContext);

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
          url: `/pages/child/choose?code=${router.params.code}&orderId=${res.data.orderId}`
        });
      } else {
        navigateTo({ url: "/pages/child/manage" });
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
      data: {
        scaleTableCode: router.params.code,
        priceId: priceList[currentPrice].id
      }
    });
    console.log("🚀 ~ file: gmsPay.tsx ~ line 47 ~ buy ~ res", res);
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
      const res = await request({
        url: "/scaleTable/price",
        data: { code: router.params.code }
      });
      setPrice(res.data);
      console.log("🚀 ~ file: gmsPay.tsx ~ line 78 ~ res.data.price", res.data);
    })();
  }, []);

  const expand = () => {
    setIsExpand(!isExpand);
  };

  return (
    <View className="index">
      <Box
        title={
          <View>
            <Image src={Book} className="icon" />
            GMs评估的重要性
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View
          className={cls("desc", "intro-box", isExpand && "constent-visible")}
        >
          {+(router.params.code as any) === ScaleTableCode.LEIBO_BRAIN && (
            <View>
              婴儿神经运动检查（Neural movement examination
              ininfants）是婴儿脑瘫等神经肌肉疾病早期认出和诊断的方法。婴幼儿神经运动检查16项是吸取“0～1岁52项神经运动检查”、全身运动质量评估（GMs评估）、婴儿运动表现测试（Test
              of infant motor performance, TIMP）、婴儿神经学检查（Hammersmith
              infant neurological
              examination，HINE）和Vojta用变换体位的方法激发出异常姿势等方法精华，增加临床实践证明对脑瘫倾向/脑瘫有重要诊断价值的肩外展角、肘伸展角、前臂旋后90度回弹角的上肢肌张力检查和紧张性头偏斜、肌性足内翻的异常认出等，适用婴幼儿神经运动损伤的检查诊断方法。“婴儿神经运动检查16项”是在吸取上述方法精华，并融入大量临床实践，创建的一个能在短时间内（10分钟），通过“静态+激发+触诊”三个方面的评估，完成神经运动发育水平及异常。“婴儿16项神经运动检查”在中国儿童保健杂志([1]任世光,
              崔红, 李娜,等. 婴儿脑瘫早期诊断神经运动检查15项[J].
              中国儿童保健杂志, 2012,
              20(12):4.)发表至今，有了较大范围的应用，证实该法是早期认出脑瘫倾向和早期诊断脑瘫的有效方法，是姿势、运动、肌张力、反射异常的定位、定性、定级有效方法。因其融入了姿势肌动学检测，还可有效指导和确定康复治疗的起点、方案、目标。这一技术的特点，一是提升了准确性，二是注重了早期应用，三是节省诊断时间，四是降低操作风险，五是易于基层普及，六是可以指导临床干预治疗。
            </View>
          )}
          {+(router.params.code as any) === ScaleTableCode.LEIBO_GMS && (
            <View>
              全身运动质量评估GMs，源自欧洲发育神经学之父Heinz F R,
              Prechtl，由杨红、邵肖梅教授引入我国。它是通过记录和评估孩子仰卧位时的全身运动录像，有效早期认出脑瘫(Cerebral
              Palsy，CP)等运动相关疾病，使之获得宝贵的最佳康复时间窗。此法的非入侵性和非干扰性受到广泛欢迎。GMs评估还可以早期预测运动发育正常，有利于缓解家庭的焦虑和过度干预。GMs评估简单易操作，只需要配备一台数码摄像机或高性能手机，让婴儿处于仰卧位，纵向或横向摆位，要摄录到头面部及全身。裸露四肢、尿布不要干扰腿部活动。记录的时间通常早产婴儿需要15-30分钟，不安阶段全身运动需要5-10分钟。摄录程序中重要的是婴儿应处于正确的行为状态，哭闹、睡眠、周围有干扰等应避免。出生后头3天内一般不建议摄录。评估方法是关闭听觉信号后播放全身运动录像，通过已取得资质证书的评估者对全身运动进行评估。在评估过程中按照矫正月龄，往往足月前全身运动和扭动运动两个阶段可以归并一起看待。GMs的单次评估价值有限，建议在早期进行多次评估，如足月前早产阶段做2-3次；足月后早期做1-2次；不安运动阶段至少做1次，如果发现有不安运动缺乏，应再做1次。
              婴幼儿神经运动检查16项，婴儿神经运动检查（Neural movement
              examination in
              infants）是婴儿脑瘫等神经肌肉疾病早期认出和诊断的方法。婴幼儿神经运动检查16项是吸取“0～1岁52项神经运动检查”、全身运动质量评估（GMs评估）、婴儿运动表现测试（Test
              of infant motor performance, TIMP）、婴儿神经学检查（Hammersmith
              infant neurological
              examination，HINE）和Vojta用变换体位的方法激发出异常姿势等方法精华，增加临床实践证明对脑瘫倾向/脑瘫有重要诊断价值的肩外展角、肘伸展角、前臂旋后90度回弹角的上肢肌张力检查和紧张性头偏斜、肌性足内翻的异常认出等，适用婴幼儿神经运动损伤的检查诊断方法。“婴儿神经运动检查16项”是在吸取上述方法精华，并融入大量临床实践，创建的一个能在短时间内（10分钟），通过“静态+激发+触诊”三个方面的评估，完成神经运动发育水平及异常。“婴儿16项神经运动检查”在中国儿童保健杂志([1]任世光,
              崔红, 李娜,等. 婴儿脑瘫早期诊断神经运动检查15项[J].
              中国儿童保健杂志, 2012,
              20(12):4.)发表至今，有了较大范围的应用，证实该法是早期认出脑瘫倾向和早期诊断脑瘫的有效方法，是姿势、运动、肌张力、反射异常的定位、定性、定级有效方法。因其融入了姿势肌动学检测，还可有效指导和确定康复治疗的起点、方案、目标。这一技术的特点，一是提升了准确性，二是注重了早期应用，三是节省诊断时间，四是降低操作风险，五是易于基层普及，六是可以指导临床干预治疗。
              GMs与婴幼儿神经运动16项（可简称GMs2.0），是上述两者的有效结合，即在婴儿全身运动质量评估GMs的10分钟摄像记录基础上，增加2分钟扶呈侧卧、拉坐、扶持迈步体位变化的摄像，10分钟摄像除捕捉异常运动外，增加自发姿势异常和自发反射异常。临床证实GMs-2对脑瘫等异常的认出优于GMs。基于GMs能有效认出婴儿早期全身运动异常，变换婴儿体位可很快激发出更多与脑瘫相关的姿势等异常，由任世光教授与邵肖梅教授（著名儿科学家、复旦大学附属儿科医院儿内科及新生儿科原主任）商议在10分钟摄像记录后，加2分钟体位变化的摄像，即GMs2.0。
            </View>
          )}
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
                <View className="price-item-listPrice">{v.listPrice}元</View>
                <View className="price-item-salePrice">{v.salePrice}元</View>
              </View>
            ))}
          </View>
          <View className="sub-desc">
            *量表筛查为一次性消费产品，一旦购买概不退换
          </View>
        </View>
      </Box>
      <View className="agreement">
        <Checkbox shape="square" checked={value} onChange={setValue} size={18}>
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
      <Notify id="notify" />
    </View>
  );
}
