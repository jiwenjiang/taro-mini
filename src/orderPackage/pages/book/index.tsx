import { MediaType } from "@/service/const";
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
import { Notify } from "@taroify/core";
import { Arrow, Clear, Plus } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

const heads = ["日", "一", "二", "三", "四", "五", "六"];
const heads2 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

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
  const [pic, setPic] = useState<any>({});
  const [activeChild, setActiveChild] = useState<
    NonNullable<{ name: string; id: string }>
  >({ name: "", id: "" });
  const [payMode, setPayMode] = useState(1);
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
    const res = await request({ url: "/workSchedule/getDayCount" });
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
      if (day === today) {
        num = 0;
      }
      if (num > -1 && num < 7) {
        num++;
        return { day, count: res.data[num - 1].count, inweek: true, formatDay };
      }
      return { day, count: null, inweek: false, formatDay };
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
    setActiveDay(v.day);
    const res2 = await request({
      url: "/workSchedule/getDay",
      data: { day: v.formatDay, type }
    });
    setTime(res2.data);
    setActiveTime(res2.data[0]);
  };

  const changeTime = v => {
    setActiveTime(v);
  };

  const getTime = () => {
    if (activeDay) {
      const i = dayjs(activeDay).day();
      return `${activeDay} (${heads2[i - 1]})，${activeTime?.startTime ?? ""}`;
    }
    return "";
  };

  const chooseMedia = () => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        console.log(1, res);
        upload2Server(filePath, MediaType.PICTURE, v => {
          setPic(v);
          console.log("🚀 ~ file: brain.tsx ~ line 128 ~ success ~ v", v);
        });
      }
    });
  };

  const del = () => {
    setPic({});
  };

  const complate = async () => {
    if (!pic.id) {
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
      invoiceId: pic.id,
      payment: 1,
      type: Number(type),
      scaleCodes: Number(type) === 1 ? activeCode.map(v => v.code) : null,
      workScheduleId: activeTime.id
    };
    const res = await request({
      url: "/reserve/submit",
      method: "POST",
      data: params
    });
    if (res.code === 0) {
      setStep(4);
    }
  };

  const openMap = () => {
    wx.getLocation({
      type: "gcj02", //返回可以用于 wx.openLocation 的经纬度
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        wx.openLocation({
          latitude,
          longitude,
          name: org.name,
          scale: 18
        });
      }
    });
  };

  useEffect(() => {
    getOrg();
    getChild();
    getTable();
    initDate();
  }, []);

  const add = () => {
    const returnUrl = Base64.encode("/orderPackage/pages/book/index?type=1");
    Taro.navigateTo({
      url: `/pages/child/edit?returnUrl=${returnUrl}`
    });
  };

  return (
    <View className={styles.index}>
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

            <View className={styles.nextBtn} onClick={() => setStep(2)}>
              下一步
            </View>
          </View>
        )}
        {step === 2 && (
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
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.title}>查看预约时间</View>
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
              <View className={styles.nextBtn} onClick={() => setStep(3)}>
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
                  <View className={styles.v}>{v.name}</View>
                </View>
              ))}
            </View>
            {/* <View className={cls(styles.orderBox, styles.mt16)}>
              <View className={cls(styles.li, styles.noBorder)}>
                <View className={styles.k}>总计</View>
                <View className={styles.p}>￥156</View>
              </View>
            </View> */}
            <View className={styles.payBox}>
              <View
                className={cls(styles.payCard, payMode === 1 && styles.active)}
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
            <View className={styles.danjuBox}>
              {pic.url ? (
                <View style={{ position: "relative" }}>
                  <Clear
                    className={styles.clear}
                    onClick={e => del()}
                    color="#f2b04f"
                  />
                  <Image src={pic.url} className={styles.pic} />
                </View>
              ) : (
                <Plus className={styles.addIcon} onClick={chooseMedia} />
              )}
              <View>
                <View>请上传院内缴费单据</View>
                <View>人工审核无误后即可预约成功</View>
              </View>
            </View>
            <View className={styles.btnBox}>
              <View className={styles.preBtn} onClick={() => setStep(2)}>
                上一步
              </View>
              <View className={styles.nextBtn} onClick={() => complate()}>
                完成预约
              </View>
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
              <View className={styles.tipBody}>
                <View className={styles.hasComplate}>已预约完成！</View>
                <View>后台审核单据无误后会短信通知；</View>
                <View>
                  院内支付请于2022-04-18 10:00前携带收费单据到指定地点。
                </View>
                <View>如有问题，请提前电话联系41000000000</View>
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
            </View>
            <View className={styles.preBtn} onClick={() => goto()}>
              我知道了
            </View>
          </View>
        )}
        <Notify id="notify" />
      </View>
    </View>
  );
}
