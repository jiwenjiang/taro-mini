import TabBar from "@/comps/TabBar";
import { ChildContext } from "@/service/context";
import { useAuth } from "@/service/hook";
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
import {
  getStorageSync,
  navigateTo,
  setStorageSync,
  useDidShow,
  useRouter
} from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

enum Channel {
  fushu,
  anqier,
  quzhou
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
  const childContext = useContext(ChildContext);
  const { getAuth, getPortal } = useAuth();
  const [modules, setModules] = useState<any>();
  const [channel, setChannel] = useState<Channel>(Channel.fushu);
  const [anqierStatic, setAnqierStatic] = useState({
    carousel: [],
    doctor: "",
    detail: "",
    highlights: "",
    serve: "",
    logo: ""
  });
  const [quzhouStatic, setQuzhouStatic] = useState({
    carousel: [],
    problemPhone: "",
    supportPhone: "",
    logo: "",
    aiEvaluation: "",
    record: ""
  });
  const goto = url => {
    getAuth(() => getChild(url));
  };

  const getChild = async url => {
    const res = await request({
      url: "/children/list",
      data: { pageNo: 1, pageSize: 1000 }
    });
    childContext.updateChild({ len: res.data.children?.length });
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
    }, 1000);
  }, []);

  useEffect(() => {
    if (router.params.scene) {
      const str = router.params.scene as string;
      // const orgId = str.split("orgId%3D")[1];
      // const channel = str.split("channel%3D")[1];
      const decodedStr = decodeURIComponent(str); // 解码字符串
      const matchArr1 = decodedStr.match(/orgId=([^&]*)/); // 使用正则表达式匹配 channel 参数
      const matchArr2 = decodedStr.match(/channel=([^&]*)/); // 使用正则表达式匹配 channel 参数
      const orgId = matchArr1?.[1]; // 获取匹配到的内容
      const channel = matchArr2?.[1]; // 获取匹配到的内容
      setStorageSync("orgId", orgId);
      setStorageSync("channel", channel);

      wx._orgId = orgId;
      wx._channel = channel;

      channelJudge();
    }
    if (router.params.orgId) {
      setStorageSync("orgId", router.params.orgId);
      wx._orgId = router.params.orgId;
    }
    if (router.params.channel) {
      wx._channel = router.params.channel;
      setStorageSync("channel", router.params.channel);
      channelJudge();
    }
  }, []);

  useDidShow(() => {
    getPortal(res => {
      if (wx._frontPage === "xaaqer") {
        setChannel(Channel.anqier);
        request({
          url: "/wx/portal/angle",
          method: "GET"
        }).then(res => {
          setAnqierStatic(res.data);
        });
      }
      if (wx._frontPage === "qzxfybjy") {
        setChannel(Channel.quzhou);
        request({
          url: "/wx/portal/quzhou",
          method: "GET"
        }).then(res => {
          setQuzhouStatic(res.data);
        });
      }
      setModules(res.modules);
    });
  });

  const channelJudge = () => {
    if (wx._channel === "xaaqer") {
      console.log("entey");
      setChannel(Channel.anqier);
      request({
        url: "/wx/portal/angle",
        method: "GET"
      }).then(res => {
        setAnqierStatic(res.data);
      });
    }
    if (wx._channel === "qzxfybjy") {
      console.log("entey");
      setChannel(Channel.quzhou);
      request({
        url: "/wx/portal/quzhou",
        method: "GET"
      }).then(res => {
        setQuzhouStatic(res.data);
      });
    }
  };

  return (
    <View>
      {modules ? (
        <View>
          {channel === Channel.fushu && (
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
                <View className={styles.cardBox}>
                  <View
                    className={cls(styles.card)}
                    onClick={() => goto("/orderPackage/pages/AIevaluate/index")}
                  >
                    <Image src={Yisheng} className={styles.cardImg}></Image>
                    <View className={styles.cardTitle}>家庭康复指导</View>
                    <View className={styles.cardDesc}>点击进行预约</View>
                    <View className={styles.cardDesc}></View>
                  </View>
                </View>
                <View className={styles.title}>专家团队疾病管理</View>
                <View
                  className={styles.manageBox}
                  style={{ marginBottom: 10 }}
                  onClick={() => goto("/orderPackage/pages/xianliti")}
                >
                  <View>
                    <View className={styles.cardTitle}>线粒体病</View>
                    <View className={styles.cardDesc}>
                      居家拍摄视频AI智能评测
                    </View>
                  </View>
                  <View className={styles.manageBtn}>前往查看</View>
                </View>
                <View
                  className={styles.manageBox}
                  onClick={() => goto("/orderPackage/pages/lingdaoyi")}
                >
                  <View>
                    <View className={styles.cardTitle}>0-1岁发育风险管理</View>
                    <View className={styles.cardDesc}>
                      居家拍摄视频AI智能评测
                    </View>
                  </View>
                  <View className={styles.manageBtn}>前往查看</View>
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
          )}
          {channel === Channel.anqier && (
            <View className={styles.index}>
              <View className={styles.anqier}>
                <View className={styles.head}>
                  <Image
                    className={styles.logo}
                    src={anqierStatic.logo}
                  ></Image>
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
                        <Text className={styles.h5}>服务</Text>
                        /儿童大脑发育全周期管理
                      </View>
                    </View>
                    <View className={styles.imgBox}>
                      <Image
                        src={anqierStatic.highlights}
                        className={styles.img}
                      />
                      <View className={styles.text}>
                        <Text className={styles.h5}>亮点</Text>
                        /“智能Al＋顶级儿保专家”双重保障
                      </View>
                    </View>
                    <View className={styles.imgBox}>
                      <Image src={anqierStatic.detail} className={styles.img} />
                      <View className={styles.text}>
                        <Text className={styles.h5}>详细介绍</Text>
                        /链接"机构”与〞家庭"场景，覆盖儿童大脑神经行为发育饰查、诊断、评估和干预全流程，打造一站式儿童保健和早期发展体系，助力儿童保健、儿童早期发展、儿童早期干预与康复的业务发展。
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TabBar current="index" />
            </View>
          )}
          {channel === Channel.quzhou && (
            <View className={styles.index}>
              <View className={styles.quzhou}>
                <View className={styles.head}>
                  <Image
                    className={styles.bg}
                    src={quzhouStatic.carousel[0]}
                  ></Image>
                  <View className={styles.logoBox}>
                    <Image
                      className={styles.logo}
                      src={quzhouStatic.logo}
                    ></Image>
                  </View>
                  <Text className={styles.phone}>
                    电话：{quzhouStatic.supportPhone}
                  </Text>
                </View>
                <View className={styles.body}>
                  <View
                    className={styles.card}
                    onClick={() => goto("/pages/evaluate/list")}
                  >
                    <Image
                      className={styles.img}
                      src={quzhouStatic.aiEvaluation}
                    ></Image>
                    <View className={styles.content}>
                      <View className={styles.quzhouTitle}>智能评估</View>
                      <View className={styles.desc}>
                        根据视频指导，在家庭真实场最下，手机便捷拍摄，云端Al智能与专家组双重保障下，更精准实现宝宝0-1岁发育评估状况检测，实现早发现/早诊断/早治疗。
                      </View>
                    </View>
                  </View>
                  <View
                    className={styles.card}
                    onClick={() => goto("/evaluatePackage/pages/recordList")}
                  >
                    <Image
                      className={styles.img}
                      src={quzhouStatic.record}
                    ></Image>
                    <View className={styles.content}>
                      <View className={styles.quzhouTitle}>我的记录</View>
                      <View className={styles.desc}>
                        您订购的任何服务，可随时查看，有任何问题，可随时拨打电話。
                        <View className={styles.phoneText}>
                          {quzhouStatic.problemPhone}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TabBar current="index" />
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
