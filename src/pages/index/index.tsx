import TabBar from "@/comps/TabBar";
import { OrgId } from "@/service/const";
import request from "@/service/request";
import Ganyu from "@/static/imgs/ganyufangan.png";
import Baogao from "@/static/imgs/pinggubaogao.png";
import VideoImg from "@/static/imgs/video.png";
import Xianxia from "@/static/imgs/xianxiapinggu.png";
import Yisheng from "@/static/imgs/yisheng.png";
import Yuyue from "@/static/imgs/yuyuejilu.png";
import Pinggu from "@/static/imgs/zhinengpinggu.png";
import Kecheng from "@/static/imgs/zhuanshukecheng.png";
import { Loading, Notify } from "@taroify/core";
import { Image, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

enum Channel {
  fushu,
  anqier
}

const anqierList = [
  {
    name: "智能筛查",
    color: "#f5a355",
    link: "/pages/evaluate/list"
  },
  {
    name: "家庭指导",
    color: "#645ea8",
    link: "/evaluatePackage/pages/recordList"
  },
  {
    name: "专家会诊",
    color: "#d71e69",
    link: "/orderPackage/pages/book/index?type=4"
  },
  {
    name: "我的记录",
    color: "#53ba89",
    link: "/orderPackage/pages/book/records"
  }
];

const descs = [
  {
    title: "智能筛查",
    content:
      "真实家庭场景，宝宝自然状态，手机便捷拍摄，云端A智能与顶级儿保专家双保障，实现宝宝早期发育状况监测，早发现、 早诊断。",
    color: "#53b98f"
  },
  {
    title: "家庭指导",
    content:
      "针对宝宝大脑神经发育情况，个性化推荐专属课程，指导家长居家开展发育促进与异常干预，呵护宝宝健康成长。",
    color: "#f5a355"
  },
  {
    title: "专家会诊",
    content:
      "在线视频通话服务，支持视频1对1、多对1等模式，汇集顶级儿童保健专家，提供精准、高效便捷的儿保服务。",
    color: "#645ea8"
  }
];

export default function App() {
  const router = useRouter();
  const [modules, setModules] = useState<any>();
  const [channel, setChannel] = useState<Channel>(Channel.fushu);
  const [anqierStatic, setAnqierStatic] = useState({
    carousel: [],
    doctor: "",
    detail: "",
    highlights: "",
    serve: ""
  });
  const { query } = router.params;
  const goto = url => {
    navigateTo({ url });
  };

  const waitOpen = () => {
    Notify.open({
      color: "warning",
      message: "敬请期待"
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const user = getStorageSync("user");
      if (user) {
        setModules(user?.modules);
        clearInterval(timer);
      }
    }, 100);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(
      encodeURIComponent(router.params.scene as string)
    );
    console.log(
      "🚀 ~ file: index.tsx:103 ~ useEffect ~ router.params.orgId:",
      params
    );
    const orgId = params.get("orgId");
    if (orgId == OrgId.ANQIER) {
      console.log("entey");
      setChannel(Channel.anqier);
      request({
        url: "/wx/portal/angle",
        method: "GET"
      }).then(res => {
        setAnqierStatic(res.data);
        console.log("🚀 ~ file: index.tsx:101 ~ useEffect ~ res:", res);
      });
    }
  }, []);

  return (
    <View>
      {modules ? (
        <View>
          {channel === Channel.fushu ? (
            <View className={styles.index}>
              <View className={styles.bottomPart}>
                <View className={styles.title}>评估服务</View>
                <View className={styles.cardBox}>
                  {modules.includes("AI_EVALUATE") && (
                    <View
                      className={styles.card}
                      onClick={() => goto("/pages/evaluate/list")}
                    >
                      <Image src={Pinggu} className={styles.cardImg}></Image>
                      <View className={styles.cardTitle}>智能评估</View>
                      <View className={styles.cardDesc}>
                        居家拍摄视频AI智能评测
                      </View>
                      <View className={styles.cardDesc}>专家二次审核</View>
                    </View>
                  )}
                  {modules.includes("CLINIC_EVALUATE") && (
                    <View
                      className={styles.card}
                      onClick={() =>
                        goto("/orderPackage/pages/book/index?type=1")
                      }
                    >
                      <Image src={Xianxia} className={styles.cardImg}></Image>
                      <View className={styles.cardTitle}>门诊评估</View>
                      <View className={styles.cardDesc}>专业机构预约</View>
                      <View className={styles.cardDesc}>专家面对面评估</View>
                    </View>
                  )}
                  {modules.includes("VIDEO_GUIDE") && (
                    <View
                      className={cls(styles.card)}
                      onClick={() =>
                        goto("/orderPackage/pages/book/index?type=4")
                      }
                    >
                      <Image src={VideoImg} className={styles.cardImg}></Image>
                      <View className={styles.cardTitle}>视频评估</View>
                      <View className={styles.cardDesc}>线上1对1视频</View>
                      <View className={styles.cardDesc}>专家实时评估</View>
                    </View>
                  )}
                </View>
                <View className={styles.title}>干预服务</View>
                <View
                  className={styles.ganyuBox}
                  onClick={() => goto("/orderPackage/pages/AIevaluate/index")}
                >
                  <View className={styles.ganyuTxt}>
                    <View className={styles.ganyuTitle}>
                      点击预约家庭康复管理指导
                    </View>
                  </View>
                  <Image src={Yisheng} className={styles.ganyuImg}></Image>
                </View>
                <View className={styles.title}>常用服务</View>
                <View className={styles.cardBox}>
                  <View
                    className={styles.miniCard}
                    onClick={() => goto("/evaluatePackage/pages/recordList")}
                  >
                    <Image src={Baogao} className={styles.miniCardImg}></Image>
                    <View className={styles.miniCardTitle}>评估报告</View>
                  </View>
                  <View
                    className={styles.miniCard}
                    onClick={() => goto("/evaluatePackage/pages/ganyuList")}
                  >
                    <Image src={Ganyu} className={styles.miniCardImg}></Image>
                    <View className={styles.miniCardTitle}>干预方案</View>
                  </View>
                  <View className={styles.miniCard} onClick={waitOpen}>
                    <Image src={Kecheng} className={styles.miniCardImg}></Image>
                    <View className={styles.miniCardTitle}>专属课程</View>
                  </View>
                  <View
                    className={styles.miniCard}
                    onClick={() => goto("/orderPackage/pages/book/records")}
                  >
                    <Image src={Yuyue} className={styles.miniCardImg}></Image>
                    <View className={styles.miniCardTitle}>预约记录</View>
                  </View>
                </View>
              </View>
              <Notify id="notify" />
              <TabBar current="index" />
            </View>
          ) : (
            <View className={styles.anqier}>
              <View className={styles.head}>
                <Image src="" className={styles.logo} />
                <Text>安琪儿儿童保健与早期发展中心</Text>
              </View>
              <View className={styles.body}>
                <Swiper
                  autoplay={false}
                  indicatorDots={true}
                  indicatorColor="rgba(0, 0, 0, .3)"
                  indicatorActiveColor="#ffd340"
                >
                  {anqierStatic.carousel.map(m => (
                    <SwiperItem key={m} className={styles.swiperBox}>
                      <Image
                        style="height: 143px;background: #fff;width:100%"
                        src={m}
                      />
                    </SwiperItem>
                  ))}
                </Swiper>
                <View className={styles.nav}>
                  {anqierList.map(v => (
                    <View
                      className={styles.navItem}
                      key={v.name}
                      onClick={() => goto(v.link)}
                    >
                      <View
                        className={styles.imgBox}
                        style={{ backgroundColor: v.color }}
                      >
                        <Image
                          src={anqierStatic.doctor}
                          className={styles.img}
                        ></Image>
                      </View>
                      <View>{v.name}</View>
                    </View>
                  ))}
                </View>
                <View className={styles.descBox}>
                  {descs.map(v => (
                    <View
                      className={styles.descCard}
                      style={{ backgroundColor: v.color }}
                    >
                      <View className={styles.title}>{v.title}</View>
                      <View className={styles.content}>{v.content}</View>
                    </View>
                  ))}
                </View>
                <View className={styles.imgBoxBox}>
                  <View className={styles.imgBox}>
                    <Image src={anqierStatic.serve} className={styles.img} />
                    <View className={styles.text}>
                      服务/儿童大脑发育全周期管理
                    </View>
                  </View>
                  <View className={styles.imgBox}>
                    <Image
                      src={anqierStatic.highlights}
                      className={styles.img}
                    />
                    <View className={styles.text}>
                      亮点/“智能Al＋顶级儿保专家”双重保障
                    </View>
                  </View>
                  <View className={styles.imgBox}>
                    <Image src={anqierStatic.detail} className={styles.img} />
                    <View className={styles.text}>
                      详细介绍/链接"机构”与〞家庭"场景，覆盖儿童大脑神经行为发育饰查、诊断、评估和干预全流程，打造一站式儿童保健和早期发展体系，助力儿童保健、儿童早期发展、儿童早期干预与康复的业务发展。
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View className={styles.loadingBox}>
          <Loading type="spinner" />
        </View>
      )}
    </View>
  );
}
