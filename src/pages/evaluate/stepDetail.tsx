import Contact from "@/comps/Contact";
import NavBar from "@/comps/NavBar";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import { chunk } from "@/service/utils";
import Down from "@/static/icons/download.svg";
import noticeIcon from "@/static/icons/notice.svg";
import ArrowDown from "@/static/icons/zhankai.svg";
import introImg from "@/static/imgs/intro.png";
import leiboImg from "@/static/imgs/leibo.jpg";
import nanhai from "@/static/imgs/nanhai.png";
import nvhai from "@/static/imgs/nvhai.png";
import { Popup, Swiper, Tabs } from "@taroify/core";
import { InfoOutlined } from "@taroify/icons";
import { Image, RichText, Text, Video, View } from "@tarojs/components";
import { createVideoContext, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./brainDetail.module.scss";

const intros = [
  {
    title: "1、正常扭动运动（N）：【扭动阶段】",
    content:
      "出现在足月至足月后6~9周龄内。其特征为小至中等幅度，速度缓慢至中等，运动轨迹在形式上呈现为椭圆体，给人留下扭动的印象。"
  },
  {
    title: "2、正常不安运动（F+）：【不安阶段】",
    content:
      "是一种小幅度中速运动，遍布颈、躯干和四肢,发生在各个方向，运动加速度可变，在清醒婴儿中该运动持续存在(哭闹时除外)，通常在足月后9周龄左右出现。早产儿可在矫正年龄足月后6周龄左右出现不安运动。不安运动出现的频度随年龄而发生改变，一般可以分为：①连续性不安运动：指不安运动时常出现,间以短时间暂停。不安运动发生在整个身体，尤其在颈、躯干、肩、腕、髋和踝部。不安运动在不同身体部位的表现可能不同，取决于身体姿势尤其是头部位置。②间歇性不安运动：指不安运动之间的暂停时间延长，令人感觉到不安运动在整个观察时期内仅出现一半。③偶发性不安运动：不安运动之间的暂停时间更长。"
  }
];

const intros2 = [
  {
    title: "1、单调性（PR）：【扭动阶段】",
    content:
      "表现为宝宝连续性运动顺序的单调，不同身体部位的运动失去了正常的GMS复杂性，总是简单的重复几个动作。存在一定的神经运动发育障碍风险。"
  },
  {
    title: "2、痉挛－同步性（CS）：【扭动阶段】",
    content:
      "扭动运动阶段出现运动僵硬，失去正常的流畅性，所有肢体和躯干肌肉几乎同时收缩和放松，比如双腿同时抬高并且同时放下。存在神经运动发育障碍风险。"
  },
  {
    title: "3、混乱型（CH）：【扭动阶段】",
    content:
      "扭动运动阶段出现肢体运动幅度大，顺序混乱，失去流畅性，动作突然不连贯。“混乱型”相当少见，常在数周后发展为“痉挛－同步性”GMs。存在神经运动发育障碍风险。"
  },
  {
    title: "4、不安运动缺乏（F-）：【不安阶段】",
    content:
      "不安运动是一种小幅度，中速度的细微运动，在9-20周龄的宝宝身上会如星辰般闪烁的各个的身体部位上。如果没有这样的细微运动出现，便是不安运动缺乏了。存在神经运动发育障碍风险。"
  },
  {
    title: "5、异常不安运动 （AF）：【不安阶段】",
    content:
      "看起来与正常不安运动相似，但在动作幅度、速度以及不平稳性方面中度或明显夸大。该异常模式少见, 并且预测价值低。"
  }
];

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [report, setReportData] = useState<any>({});
  const router = useRouter();
  const [intro, setIntro] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [abnormal, setAbnormal] = useState<
    { name: string; detail: any; isExpand: boolean }[]
  >([]);
  const [videos, setVideos] = useState<any>([]);

  useEffect(() => {
    (async () => {
      // const res = await request({
      //   url: "/scaleRecord/get",
      //   data: { id: router.params.id || 1 }
      // });
      // setData(res.data);
      const res2 = await request({
        url: "/scaleRecord/report",
        data: { id: router.params.id }
      });
      if (ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode) {
        const obj = {
          ...res2.data,
          scaleResult: { cerebralPalsyResult: res2.data.scaleResult }
        };
        setReportData(obj);
      } else {
        setReportData(res2.data);
      }
      setVideos(chunk(res2.data.scaleResult.videos));
      console.log(
        "🚀 ~ file: stepDetail.tsx:127 ~ chunk(res2.data.scaleResult.videos)",
        chunk(res2.data.scaleResult.videos)
      );

      const first = await request({
        url: "/scaleRecord/abnormal/methods/detail",
        data: {
          abnormalIterm: res2.data.scaleResult.positionAndSportAbnormal[0]?.name
        }
      });
      console.log("🚀 ~ file: stepDetail.tsx:103 ~ first", first);
      setAbnormal(
        res2.data.scaleResult.positionAndSportAbnormal.map((v, i) => {
          if (i === 0) {
            return {
              name: v.name,
              detail: handleRichText(first.data.detail),
              isExpand: false
            };
          } else {
            return {
              name: v.name,
              detail: "",
              isExpand: false
            };
          }
        })
      );
    })();
  }, []);

  const handleRichText = v => {
    let result = v.replace(/\<img/g, '<img class="img"');
    result = result.replace(/\<p/g, '<p class="p"');
    return result;
  };

  const downloadImg = async () => {
    const res = await request({
      url: "/scaleRecord/report/picture",
      data: { id: router.params.id }
    });
    preview(res?.data, 0);
  };

  const preview = (urls, e) => {
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e
    });
  };

  const expand = () => {
    setIsExpand(!isExpand);
  };

  const expandRich = i => {
    abnormal[i].isExpand = !abnormal[i].isExpand;
    setAbnormal([...abnormal]);
  };

  const changeTab = async e => {
    if (!abnormal[e].detail) {
      const res = await request({
        url: "/scaleRecord/abnormal/methods/detail",
        data: {
          abnormalIterm: abnormal[e].name
        }
      });
      abnormal[e].detail = handleRichText(res.data.detail);
      setAbnormal([...abnormal]);
    }
    console.log("🚀 ~ file: stepDetail.tsx:159 ~ changeTab ~ e", e);
  };

  const playVideo = (v, id) => {
    const videoContext = createVideoContext(id);
    videoContext.requestFullScreen({ direction: 0 });
  };

  return (
    <View>
      <NavBar title={"评估详情" || report?.scaleTableName} />
      <Contact />

      {report?.progressStatus && (
        <View>
          {report?.progressStatus === "未评估" ? (
            <View>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={noticeIcon} className={styles.imgIcon} />
                    &nbsp; 温馨提示
                  </View>
                  <View className={styles.noEvaluete}>
                    <View>
                      已提交医学评估，请耐心等待，医学评估后，您可以收到微
                      信服务通知或者在【我的】-【自测量表记录】查看结果
                    </View>
                    <View className={styles.phone}>客服电话：400-898-6862</View>
                  </View>
                </View>
              </View>

              <Info data={report} />
            </View>
          ) : (
            <View>
              <Info data={report} />
              {report?.scaleTableCode === ScaleTableCode.LEIBO_GMS && (
                <View className={styles.cardBox}>
                  <View className={styles.card}>
                    <View className={styles.title}>
                      <Image src={leiboImg} className={styles.imgIcon} />
                      &nbsp; 全身运动质量评估GMs
                      <InfoOutlined
                        size={17}
                        style={{ marginLeft: 5 }}
                        color="#1989fa"
                        onClick={() => setIntro(true)}
                      />
                    </View>
                    <View className={styles.pb20}>
                      {report.scaleResult?.gmsResult?.result?.map(
                        (v, i) =>
                          v.content && (
                            <View className={styles.brainBox}>
                              <View className={styles.brain1} key={i}>
                                <View className={styles.brainTitle}>
                                  {v.name}
                                </View>
                                <View className={styles.brainVal}>
                                  {v.content}
                                </View>
                              </View>
                            </View>
                          )
                      )}
                    </View>
                  </View>
                </View>
              )}

              <View className={styles.cardBox}>
                <View className={styles.bgTitle}>
                  评估结果 · <Text>&nbsp;康复元官方出品</Text>
                </View>
                <View className={cls(styles.card, styles.delBorder)}>
                  <View className={styles.shenjingTitle}>
                    神经运动发育风险：
                    {report?.scaleResult?.cerebralPalsyResult?.haveAbnormalIterm
                      ? "有"
                      : "无"}
                  </View>
                  <View style={{ marginBottom: 24 }}>
                    <View className={styles.pinggu}>
                      <Text className={styles.pingguk}>评估时间：</Text>
                      <Text>{report.evaluateDate}</Text>
                    </View>
                    <View className={styles.pinggu}>
                      <Text className={styles.pingguk}>评估专家：</Text>
                      <Text>{report.doctorName}</Text>
                    </View>
                    <View className={styles.desc}>
                      *评估结果基于神经发育异常和高危因表给出，且评估结
                      果不代表诊断结果
                    </View>
                  </View>
                  <View>
                    <View className={cls(styles.head, styles.headTxt)}>
                      <View>姿势和运动异常</View>
                      <View>医学评估</View>
                    </View>
                    <View
                      className={cls(
                        styles.positionBox,
                        isExpand && styles.contentVisible
                      )}
                    >
                      {report?.scaleResult?.cerebralPalsyResult?.positionAndSportAbnormal?.map(
                        (v, i) => (
                          <View
                            key={i}
                            className={cls(styles.head, styles.bBorder)}
                          >
                            <View className={styles.head2}>{v.name}</View>
                            <View
                              className={cls(
                                styles.succ,
                                v.status > 0 && styles.error
                              )}
                            >
                              {v.status > 0 ? "异常" : "正常"}
                            </View>
                          </View>
                        )
                      )}
                    </View>
                    <View className={styles.expandBox}>
                      <Image
                        src={ArrowDown}
                        className={styles.expandImg}
                        onClick={() => expand()}
                      />
                    </View>
                    <View className={styles.downLoadBox}>
                      下载报告&nbsp;
                      <Image
                        src={Down}
                        onClick={downloadImg}
                        className={styles.downLoad}
                      />{" "}
                    </View>
                  </View>
                </View>
              </View>
              <View className={styles.title}>结果解读</View>

              <View className={cls(styles.cardBox, styles.nopt)}>
                <View className={styles.tabBox}>
                  <Tabs onChange={changeTab}>
                    {abnormal.map((v, i) => (
                      <Tabs.TabPane title={v.name}>
                        <View
                          className={cls(
                            styles.cardBody,
                            v.isExpand && styles.contentVisible
                          )}
                        >
                          <RichText nodes={v.detail} />
                        </View>
                        <View className={styles.expandBox}>
                          <Image
                            src={ArrowDown}
                            className={styles.expandImg}
                            onClick={() => expandRich(i)}
                          />
                        </View>
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </View>
              </View>
              <View className={styles.title}>推荐课程</View>
              <View className={styles.swiperBox}>
                <Swiper autoplay={4000}>
                  {videos.map((v, i1) => (
                    <Swiper.Item>
                      <View className={styles.videoBox}>
                        {v?.map((c, i2) => (
                          <View className={styles.videoItem}>
                            <Video
                              src={c.url}
                              id={`video${i1}${i2}`}
                              loop={false}
                              autoplay={false}
                              controls={false}
                              poster={c.coverUrl}
                              className={styles.videoImg}
                              objectFit="contain"
                            ></Video>
                            {/* <Image
                              src={c.coverUrl}
                            ></Image> */}
                            <View className={styles.videoDescBox}>
                              <View className={styles.videoName}>{c.name}</View>
                              <View className={styles.videoRemark}>
                                {c.remark}
                              </View>
                              <View
                                className={styles.videoBtn}
                                onClick={() =>
                                  playVideo(v.localData, `video${i1}${i2}`)
                                }
                              >
                                立即查看
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </Swiper.Item>
                  ))}

                  <Swiper.Indicator />
                </Swiper>
              </View>
            </View>
          )}
        </View>
      )}

      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setIntro(false)}
        open={intro}
      >
        <View>
          <Image src={introImg} className={styles.introImg} />
        </View>
        <View className={styles.introBox}>
          全身运动（GMs）是最常出现和最复杂的一种自发性运动模式，最早出现于妊娠9周的胎儿，持续至出生后5~6个月，能够十分有效地评估年幼神经系统的功能。GMs指整个身体参与的运动，臂、腿、颈和躯干以变化运动顺序的方式参与，这种GMs在运动强度、力量和速度方面具有高低起伏的变化，运动的开始和结束都具有渐进性。沿四肢轴线的旋转和运动方向的轻微改变使整个运动流畅优美并产生一种复杂多变的印象。
        </View>
        <View className={styles.introBox}>
          GMs按时间的发育历程包括：足月前GMs（foetal and preterm
          GMs，即胎儿和早产儿阶段），扭动运动（writhing
          movements，WMs，即从足月至足月后6~9周龄）和不安运动（fidgety
          movements，FMs，即足月后6~9周龄至5~6月龄）。
        </View>
        <View className={styles.introBox}>其中正常GMs主要有：</View>
        {intros.map(v => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
        <View className={styles.introBox}>其中异常的GMs主要包括：</View>
        {intros2.map(v => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
      </Popup>
    </View>
  );
}

function Info({ data }) {
  return (
    <View className={styles.cardBox}>
      <View className={styles.newCard}>
        <View className={styles.newTitle}>
          {data.gender === "男" ? (
            <Image src={nanhai} className={styles.imgIcon} />
          ) : (
            <Image src={nvhai} className={styles.imgIcon} />
          )}
          &nbsp;{data.name}
        </View>
        <View className={cls(styles.newInfo, styles.list)}>
          <Text className={styles.v}>{data.gender}</Text>
          <Text className={styles.v}>{data.age}岁</Text>
          <Text className={styles.v}>{data.birthdayWeight}g</Text>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>编号</Text>
            <Text className={styles.v}>{data.id}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生日期</Text>
            <Text className={styles.v}>{data.birthday}</Text>
          </View>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生孕周</Text>
            <Text className={styles.v}>{data.gestationalWeek}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>就诊卡号</Text>
            <Text className={styles.v}>{data.medicalCardNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
