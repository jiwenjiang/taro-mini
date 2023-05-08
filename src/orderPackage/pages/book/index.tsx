import NavBar from "@/comps/NavBar";
import { DanjuTishi, EvaluateType, MediaType } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import { Base64 } from "@/service/utils";
import duigou from "@/static/icons/duigou.svg";
import tip from "@/static/icons/tip.svg";
import weizhi from "@/static/icons/weizhi.svg";
import nanhai from "@/static/imgs/nanhai.png";
import nvhai from "@/static/imgs/nvhai.png";
import weixuanzhong from "@/static/imgs/weixuanzhong.png";
import xuanzhong from "@/static/imgs/xuanzhong.png";
import { Notify, Popup } from "@taroify/core";
import { Arrow, Clear, Plus } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";

import styles from "./index.module.scss";

const heads = ["日", "一", "二", "三", "四", "五", "六"];
const heads2 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

enum categoryEnum {
  isNormal = 1,
  isXianLiTi,
  isLingDaoYi
}

export default function App() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [page] = useState({ pageNo: 1, pageSize: 1000 });
  const [days, setDays] = useState<any[]>([]);
  const [childs, setChilds] = useState<any[]>([]);
  const [project, setProject] = useState<any[]>([]);
  const [time, setTime] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState("");
  const [activeTime, setActiveTime] = useState<any>({});
  const [activeCode, setActiveCode] = useState<any>([]);
  const [org, setOrg] = useState<any>({});
  const [pic, setPic] = useState<any>([]);
  const [activeChild, setActiveChild] = useState<
    NonNullable<{ name: string; id: string }>
  >({ name: "", id: "" });
  const [payMode, setPayMode] = useState(1);
  const [priceInfo, setPriceInfo] = useState({ price: "", time: "" });
  const [title, setTitle] = useState("");
  const tempId = useRef<any>();
  const [showImgPreview, setShowImgPreview] = useState(false);
  const [previewedImage, setPreviewedImage] = useState("");
  const [category, setCategory] = useState(categoryEnum.isNormal);

  const goto = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  const type = router.params.type!.replace(/[^0-9]/gi, "");

  const getOrg = async () => {
    const res = await request({ url: "/org/get" });
    setOrg(res.data);
  };

  const getChild = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChilds(res.data.children);
    setActiveChild(res.data.children[0]);
  };

  const getTable = async () => {
    const res = await request({ url: "/scaleTable/clinic" });
    setProject(res.data);
    setActiveCode([res.data[0].list[0]]);
  };

  const initDate = async () => {
    const res = await request({
      url: "/workSchedule/getDayCount",
      data: { type }
    });
    const startDay = dayjs().day(0);
    const today = dayjs().format("MM.DD");
    const formatToday = dayjs().format("YYYY-MM-DD");
    const res2 = await request({
      url: "/workSchedule/getDay",
      data: {
        day: formatToday,
        type
      }
    });
    setTime(res2.data);
    setActiveTime(res2.data[0]);
    setActiveDay(today);
    let num = -1;
    const ranges = new Array(14).fill(0).map((_v, i) => {
      const day = startDay.add(i, "day").format("MM.DD");
      const formatDay = startDay.add(i, "day").format("YYYY-MM-DD");
      if (day < today) {
        return { day, count: null, inweek: false, formatDay, pre: true };
      }
      if (day === today) {
        num = 0;
      }
      if (num > -1 && num < 7) {
        num++;
        return { day, count: res.data[num - 1].count, inweek: true, formatDay };
      }
      return { day, count: null, inweek: false, formatDay, after: true };
    });
    setDays(ranges);
    setActiveDay(dayjs().format("MM.DD"));
  };

  const changePay = type => {
    setPayMode(type);
  };

  const changeChild = v => {
    setActiveChild(v);
  };

  const changeProject = c => {
    setActiveCode([c]);
    // if (activeCode.find(v => c.code === v.code)) {
    //   setActiveCode(activeCode.filter(v => v.code !== c.code));
    // } else {
    //   setActiveCode([...activeCode, c]);
    // }
  };

  const changeDay = async v => {
    if (v.inweek) {
      setActiveDay(v.day);
      const res2 = await request({
        url: "/workSchedule/getDay",
        data: { day: v.formatDay, type }
      });
      const avaliTime = res2.data.filter(v => v.availableReserveNumber);
      setTime(avaliTime);
      setActiveTime(avaliTime[0]);
    }
  };

  const changeTime = v => {
    setActiveTime(v);
  };

  const getTime = () => {
    if (activeDay) {
      let i = dayjs(activeDay).day();
      i = i ? i : 7;
      return `${activeDay} (${heads2[i - 1]})，${activeTime?.startTime ?? ""}`;
    }
    return "";
  };

  const getWeekDay = () => {
    if (activeDay) {
      let i = dayjs(activeDay).day();
      i = i ? i : 7;
      return `${heads2[i - 1]}`;
    }
    return "";
  };

  const chooseMedia = () => {
    wx.chooseMedia({
      count: 9,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        let num = 0;
        const picList: any = [];
        res.tempFiles.forEach(c => {
          upload2Server(c.tempFilePath, MediaType.PICTURE, v => {
            picList.push(v);
            num++;
            if (num === res.tempFiles.length) {
              setPic(picList);
            }
          });
        });
      }
    });
  };

  const del = i => {
    const list = pic.filter((_v, i2) => i !== i2);
    setPic(list);
  };

  const complate = async () => {
    if (pic.some(v => !v.id)) {
      Notify.open({
        color: "warning",
        message: "请上传票据"
      });
      return;
    }
    if (activeCode?.length === 0) {
      Notify.open({
        color: "warning",
        message: "请选择评估项目"
      });
      return;
    }
    const params = {
      childrenId: activeChild.id,
      invoiceId: pic.map(v => v.id),
      payment: 1,
      type: Number(type),
      scaleCodes: Number(type) === 1 ? activeCode.map(v => v.code) : null,
      workScheduleId: activeTime.id,
      category: category,
      trainingType: payMode
    };
    const res = await request({
      url: "/reserve/submit",
      method: "POST",
      data: params
    });
    if (res.code === 0) {
      wx.requestSubscribeMessage({
        tmplIds: [
          tempId.current.newReserveNotify,
          tempId.current.scaleResultNotify
        ],
        success(res) {}
      });

      setStep(4);
    }
  };

  const toPay = async () => {
    const data = {
      childrenId: activeChild.id,
      workScheduleId: activeTime.id
    };
    const payRes = await request({
      url: "/videoGuide/video/submit",
      method: "POST",
      data
    });
    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success(res) {
        Notify.open({ color: "success", message: "支付成功" });
        setStep(4);
      }
    });
  };

  const openMap = () => {
    const latitude = org.latitude;
    const longitude = org.longitude;
    wx.openLocation({
      latitude,
      longitude,
      name: org.name,
      scale: 18
    });
  };

  const getTemp = async () => {
    const res = await request({
      url: "/wx/portal/template"
    });
    tempId.current = res.data;
  };

  useEffect(() => {
    getOrg();
    getChild();
    getTable();
    initDate();
    getTemp();
    if (type === String(EvaluateType.SHIPIN)) {
      request({ url: "/videoGuide/price" }).then(res => {
        setPriceInfo(res.data);
      });
    }
    setTitle(
      {
        "1": "门诊评估",
        "2": "康复指导",
        "4": "视频评估"
      }[type] || "门诊评估"
    );
  }, []);

  const add = () => {
    const returnUrl = Base64.encode("/orderPackage/pages/book/index?type=1");
    Taro.navigateTo({
      url: `/childPackage/pages/edit?returnUrl=${returnUrl}`
    });
  };

  const checkTime = () => {
    if (!activeTime?.id) {
      Notify.open({
        color: "warning",
        message: "请选择预约时间段"
      });
      return;
    }
    setStep(3);
  };

  const checkChild = () => {
    if (!activeChild?.id) {
      Notify.open({
        color: "warning",
        message: "请选择评估人"
      });
      return;
    }
    setStep(2);
  };

  const previewImage = url => {
    setPreviewedImage(url);
    setShowImgPreview(true);
  };

  return (
    <View className={styles.index}>
      <NavBar title={title} />
      <View className={styles.bottomPart}>
        {step === 1 && (
          <View>
            <View className={styles.title}>
              选择被评估人
              <View className={styles.subTitle} onClick={add}>
                新增评估人 <Arrow color="#f2b04f" />
              </View>
            </View>
            {childs.map((v, i) => (
              <View
                style={{ marginTop: i !== 0 ? 8 : 0 }}
                className={cls(
                  styles.personCard,
                  activeChild.id === v.id && styles.active
                )}
                key={i}
                onClick={() => changeChild(v)}
              >
                <View className={styles.left}>
                  <Image
                    src={v.gender === "男" ? nanhai : nvhai}
                    className={styles.gender}
                  ></Image>
                  <View className={styles.nameBox}>
                    <View className={styles.name}>{v.name}</View>
                    <View className={styles.date}>{v.birthday}</View>
                  </View>
                </View>
                <Image
                  src={activeChild.id === v.id ? xuanzhong : weixuanzhong}
                  className={styles.choose}
                ></Image>
              </View>
            ))}
            {type == "1" && (
              <View>
                <View className={styles.title}>选择评估项目</View>
                <View className={styles.projectBox}>
                  {project.map((v, i) => (
                    <View key={i} style={{ marginTop: i !== 0 ? 16 : 0 }}>
                      <View className={styles.pTitleBox}>
                        <View className={styles.pTitle}>
                          {v.classification}
                        </View>
                      </View>
                      {v.list.map((c, i2) => (
                        <View
                          className={styles.contentBox}
                          key={i2}
                          onClick={() => changeProject(c)}
                        >
                          <View
                            className={cls(
                              styles.cTitle,
                              activeCode.find(v => v.code === c.code) &&
                                styles.active
                            )}
                          >
                            {c.name}
                          </View>
                          {activeCode.find(v => v.code === c.code) && (
                            <Image
                              src={duigou}
                              className={styles.duigou}
                            ></Image>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.nextBtn} onClick={() => checkChild()}>
              下一步
            </View>
          </View>
        )}
        {step === 2 && (
          <View>
            {[EvaluateType.MENZHEN, EvaluateType.ZHUANSHU].includes(
              Number(type)
            ) && (
              <View>
                <View className={styles.title}>机构信息</View>
                <View
                  className={cls(styles.personCard, styles.active)}
                  onClick={openMap}
                >
                  <View className={styles.left}>
                    <Image src={nanhai} className={styles.gender}></Image>
                    <View className={styles.nameBox}>
                      <View className={styles.name}>{org.name}</View>
                      <View className={styles.date}>{org.address}</View>
                    </View>
                  </View>
                  <Image src={weizhi} className={styles.choose}></Image>
                </View>
              </View>
            )}

            <View className={styles.title}>查看预约时间</View>
            <View className={styles.riliBox}>
              <View className={styles.riliHeads}>
                {heads.map((v, i) => (
                  <View key={i} className={styles.head}>
                    {v}
                  </View>
                ))}
              </View>
              <View className={styles.riliBodys}>
                {days.map(v => (
                  <View
                    key={v}
                    className={cls(
                      styles.body,
                      activeDay === v.day && styles.activeDay,
                      v.inweek && styles.inweek
                    )}
                    onClick={() => changeDay(v)}
                  >
                    <View>{v.day}</View>
                    {v.inweek && (
                      <View
                        className={cls(
                          styles.count,
                          v.count && styles.hasCount
                        )}
                      >
                        {v.count ? `余${v.count}` : "无剩余"}
                      </View>
                    )}
                    {v.pre && <View className={cls(styles.count)}>已过时</View>}
                    {v.after && (
                      <View className={cls(styles.count)}>即将放号</View>
                    )}
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.title}>
              {activeDay}（{getWeekDay()}）可预约时间
            </View>
            <View className={styles.timeBox}>
              {time.map(v => (
                <View
                  className={cls(
                    styles.time,
                    activeTime?.id === v.id && styles.activeTime
                  )}
                  onClick={() => changeTime(v)}
                >
                  <View className={styles.time1}>
                    {v.startTime}-{v.endTime}
                  </View>
                  <View>余{v.availableReserveNumber}</View>
                </View>
              ))}
            </View>
            <View className={styles.btnBox}>
              <View className={styles.preBtn} onClick={() => setStep(1)}>
                上一步
              </View>
              <View className={styles.nextBtn} onClick={() => checkTime()}>
                下一步
              </View>
            </View>
          </View>
        )}
        {step === 3 && (
          <View>
            <View className={styles.title}>确认订单</View>
            <View className={styles.orderBox}>
              <View className={styles.li}>
                <View className={styles.k}>机构信息</View>
                <View className={styles.v}>{org?.name}</View>
              </View>
              <View className={styles.li}>
                <View className={styles.k}>预约时间</View>
                <View className={styles.v}>{getTime()}</View>
              </View>
              <View className={cls(styles.li, styles.noBorder)}>
                <View className={styles.k}>被评估人</View>
                <View className={styles.v}>{activeChild?.name}</View>
              </View>
            </View>

            <View className={cls(styles.orderBox, styles.mt16)}>
              {activeCode.map((v, i) => (
                <View className={cls(styles.li, styles.noBorder)} key={i}>
                  <View className={styles.k}>{i === 0 ? "评估项目" : ""}</View>
                  <View className={styles.v}>
                    {type === String(EvaluateType.MENZHEN)
                      ? v.name
                      : type === String(EvaluateType.SHIPIN)
                      ? "视频一对一"
                      : "家庭康复指导"}
                  </View>
                </View>
              ))}
            </View>
            {/* <View className={cls(styles.orderBox, styles.mt16)}>
              <View className={cls(styles.li, styles.noBorder)}>
                <View className={styles.k}>总计</View>
                <View className={styles.p}>￥156</View>
              </View>
            </View> */}
            {[EvaluateType.MENZHEN, EvaluateType.ZHUANSHU].includes(
              Number(type)
            ) && (
              <View>
                <View className={styles.payBox}>
                  <View
                    className={cls(
                      styles.payCard,
                      payMode === 1 && styles.active
                    )}
                    onClick={() => changePay(1)}
                  >
                    <Text>院内支付</Text>
                    <Image src={xuanzhong} className={styles.choose}></Image>
                  </View>
                  {/* <View
                className={cls(styles.payCard, payMode === 2 && styles.active)}
                // onClick={() => changePay(2)}
              >
                <Text>在线支付</Text>
                <Image src={weixuanzhong} className={styles.choose}></Image>
              </View> */}
                </View>
                <View className={styles.picBox}>
                  {pic.map((v, i) => (
                    <View style={{ position: "relative" }} key={i}>
                      <Clear
                        className={styles.clear}
                        onClick={e => del(i)}
                        color="#f2b04f"
                      />
                      <Image
                        src={v.url}
                        className={styles.pic}
                        mode="widthFix"
                        onClick={() => previewImage(v.url)}
                      />
                    </View>
                  ))}
                </View>
                <View className={styles.danjuBox}>
                  <Plus className={styles.addIcon} onClick={chooseMedia} />
                  <View>{DanjuTishi}</View>
                </View>
              </View>
            )}
            {[EvaluateType.SHIPIN].includes(Number(type)) && (
              <View>
                <View className={styles.title}>服务介绍</View>
                <View className={styles.desc}>
                  团队成员来自于北京儿童医院，对需要康复的孩子做1对1视频康复指导，并提供其他增值服务
                </View>
              </View>
            )}

            {[EvaluateType.SHIPIN].includes(Number(type)) && (
              <View>
                <View className={styles.title}>服务价格</View>
                <View className={cls(styles.priceIitem)}>
                  {priceInfo.price}元/{priceInfo.time}分钟
                </View>
              </View>
            )}

            <View className={styles.btnBox}>
              <View className={styles.preBtn} onClick={() => setStep(2)}>
                上一步
              </View>
              {type === String(EvaluateType.SHIPIN) ? (
                <View className={styles.nextBtn} onClick={() => toPay()}>
                  立即预约
                </View>
              ) : (
                <View className={styles.nextBtn} onClick={() => complate()}>
                  完成预约
                </View>
              )}
            </View>
          </View>
        )}
        {step === 4 && (
          <View>
            <View className={styles.succBox}>
              <View className={styles.tiphead}>
                <Image src={tip} className={styles.tip}></Image>
                温馨提示
              </View>
              {[EvaluateType.MENZHEN, EvaluateType.ZHUANSHU].includes(
                Number(type)
              ) && (
                <View className={styles.tipBody}>
                  <View className={styles.hasComplate}>已预约完成！</View>
                  <View>后台审核单据无误后会短信通知；</View>
                  <View>
                    {/* 院内支付请于{dayjs(activeDay).format("YYYY-MM-DD")}{" "} */}
                    院内支付请于{activeDay} {activeTime?.startTime}
                    前携带收费单据到指定地点。
                  </View>
                  <View>如有问题，请提前电话联系010-56190995</View>
                  <View className={styles.loc} onClick={openMap}>
                    <View className={styles.left}>
                      <View className={styles.nameBox}>
                        <View className={styles.name}>{org.name}</View>
                        <View className={styles.date}>{org.address}</View>
                      </View>
                    </View>
                    <Image src={weizhi} className={styles.choose}></Image>
                  </View>
                </View>
              )}
              {[EvaluateType.SHIPIN].includes(Number(type)) && (
                <View className={styles.tipBody}>
                  <View className={styles.hasComplate}>已预约完成！</View>
                  <View>后台审核单据无误后会短信通知；</View>
                  <View>
                    请在预约时间前10分钟，在【首页】-【预约记录】进入房间
                  </View>
                  <View>如有问题，请提前电话联系010-56190995</View>
                </View>
              )}
            </View>
            <View className={styles.preBtn} onClick={() => goto()}>
              我知道了
            </View>
          </View>
        )}
        <Notify id="notify" />
      </View>
      <Popup
        defaultOpen={false}
        open={showImgPreview}
        onClose={() => setShowImgPreview(false)}
      >
        <Popup.Close />
        <Image className={styles.img} src={previewedImage} mode="widthFix" />
      </Popup>
    </View>
  );
}
