import { MediaType } from "@/service/const";
import request from "@/service/request";
import {
    Button, Image, Swiper,
    SwiperItem,
    Video,
    View
} from "@tarojs/components";
import React, { useEffect, useRef, useState } from "react";
import styles from "./brain.module.scss";

export default function App() {
  const [data, setData] = useState<any>([]);
  const [active, setActive] = useState(0);
  //   const [form] = Form.useForm();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [baseinfo, setBaseinfo] = useState(null);
  const age = useRef(1);
  const [btnText, setBtnText] = useState("提交答案");
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(false);
  const videoNode = useRef();

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: { code: 9, birthday: age.current }
    });
    console.log("🚀 ~ file: brain.tsx ~ line 27 ~ getList ~ res", res);
    const datas = res.data.subjects?.map(v => ({
      ...v,
      questions: v.questions?.map(c => ({
        ...c,
        remark: "",
        attachments: [],
        mediaList: [],
        answerSn: 1
      }))
    }));
    setData(datas);
  };

  useEffect(() => {
    // if (baseinfo) {
    getList();
    // }
  }, [baseinfo]);

  const pre = () => {
    // if (questionIndex === 0) {
    //   setActive(active - 1);
    //   setQuestionIndex(data[active - 1].questions.length - 1);
    // } else {
    //   setQuestionIndex(questionIndex - 1);
    // }
  };

  const next = () => {
    // if (
    //   data[active].questions[questionIndex]?.attachments?.length === 0 &&
    //   data[active].questions[questionIndex]?.answerSn !== 1
    // ) {
    //   Notify.show({ type: "warning", message: "请至少上传一个视频或图片" });
    //   return;
    // }
    // if (questionIndex < data[active].questions.length - 1) {
    //   setQuestionIndex(questionIndex + 1);
    // } else {
    //   setActive(active + 1);
    //   setQuestionIndex(0);
    // }
    // setTimeout(() => {
    //   if (isAndroid()) {
    //     autoPlay(0);
    //   }
    // });
  };

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  const chooseImg = (type: MediaType) => {
    // window.wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function(res) {
    //     window.wx.uploadImage({
    //       localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
    //       isShowProgressTips: 1, // 默认为1，显示进度提示
    //       success: function(res2) {
    //         var serverId = res2.serverId; // 返回图片的服务器端ID
    //         window.wx.getLocalImgData({
    //           localId: res.localIds[0], // 图片的localID
    //           success: function(res) {
    //             var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
    //             if (data[active].questions[questionIndex].mediaList) {
    //               data[active].questions[questionIndex].mediaList.push({
    //                 type,
    //                 localData
    //               });
    //             } else {
    //               data[active].questions[questionIndex].mediaList = [
    //                 {
    //                   type,
    //                   localData
    //                 }
    //               ];
    //             }
    //             data[active].questions[questionIndex].attachments.push({
    //               type,
    //               serverId
    //             });
    //             setData([...data]);
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  };

  const startRecord = () => {
    // setIsRecord(true);
    // window.wx.startRecord();
  };

  const stopRecord = () => {
    // setIsRecord(false);
    // const type = MediaType.AUDIO;
    // window.wx.stopRecord({
    //   success: function(res) {
    //     var localData = res.localId;
    //     window.wx.uploadVoice({
    //       localId: localData, // 需要上传的音频的本地ID，由stopRecord接口获得
    //       isShowProgressTips: 1, // 默认为1，显示进度提示
    //       success: function(res2) {
    //         var serverId = res2.serverId; // 返回音频的服务器端ID
    //         if (data[active].questions[questionIndex].mediaList) {
    //           data[active].questions[questionIndex].mediaList.push({
    //             type,
    //             localData
    //           });
    //         } else {
    //           data[active].questions[questionIndex].mediaList = [
    //             {
    //               type,
    //               localData
    //             }
    //           ];
    //         }
    //         data[active].questions[questionIndex].attachments.push({
    //           type,
    //           serverId
    //         });
    //         setData([...data]);
    //       }
    //     });
    //   }
    // });
  };

  const startVoice = localId => {
    // setIsPlay(true);
    // window.wx.playVoice({
    //   localId // 需要播放的音频的本地ID，由stopRecord接口获得
    // });
  };

  const stopVoice = localId => {
    // setIsPlay(false);
    // window.wx.stopVoice({
    //   localId // 需要停止的音频的本地ID，由stopRecord接口获得
    // });
  };

  const submit = async () => {
    // if (
    //   data[active].questions[questionIndex]?.attachments?.length === 0 &&
    //   data[active].questions[questionIndex]?.answerSn !== 1
    // ) {
    //   Notify.show({ type: "warning", message: "请至少上传一个视频或图片" });
    //   return;
    // }
    // const answers = [];
    // data.forEach(c => {
    //   c.questions.forEach(v => {
    //     answers.push({
    //       answerSn: v.answerSn ?? 1,
    //       questionSn: v.sn,
    //       remark: v.remark,
    //       attachments: v.attachments
    //     });
    //   });
    // });
    // const params = {
    //   ...(baseinfo as object),
    //   scaleTableCode: 9,
    //   answers
    //   // answers: data[active].questions?.map((v) => ({
    //   //   answerSn: v.answerSn ?? 1,
    //   //   questionSn: v.sn,
    //   //   remark: v.remark,
    //   //   attachments: v.attachments,
    //   // })),
    // };
    // if (btnText === "计算中") return;
    // setBtnText("计算中");
    // const res = await request({
    //   url: "/scaleRecord/save",
    //   data: params,
    //   method: "POST"
    // });
    // if (res.success) {
    //   setBtnText("提交答案");
    //   navigate(`/evaluate/brainDetail/${res.data.id}`);
    // }
  };

  const baseSubmit = params => {
    age.current = params.birthday;
    setBaseinfo(params);
  };

  const upload = (params, file) => {
    // console.log("🚀 ~ file: grow.tsx ~ line 222 ~ upload ~ file", file);
    // data[active].questions[questionIndex].mediaList.push({
    //   type: MediaType.VIDEO,
    //   localData: file.url,
    //   coverUrl: file.coverUrl
    // });
    // data[active].questions[questionIndex].attachments.push({
    //   type: MediaType.VIDEO,
    //   ...params
    // });
    // setData([...data]);
  };

  const playVideo = v => {
    console.log("🚀 ~ file: grow.tsx ~ line 234 ~ playVideo ~ v", v);
    setCurrentVideo(v);
    setShowVideo(true);
  };

  const autoPlay = i => {
    // if (
    //   data[active].questions[questionIndex].carousels[i]?.includes("mp4") &&
    //   isAndroid()
    // ) {
    //   videojs(
    //     videoNode.current,
    //     {
    //       preload: "auto",
    //       autoplay: "muted",
    //       controls: false,
    //       isFullscreen: false,
    //       muted: true,
    //       sources: data[active].questions[questionIndex].carousels[i]
    //     },
    //     () => {
    //       console.log("play ready");
    //     }
    //   );
    // }
  };

  return (
    <View className={styles.box}>
      {data[active] && (
        <View>
          <View className={styles.tabBox}>
            <View className={styles.subject}>{data[active]?.subject}</View>

            {data[active]?.questions[questionIndex]?.carousels?.length > 0 && (
              <Swiper autoplay={false} onChange={i => autoPlay(i)}>
                {data[active].questions[questionIndex].carousels.map(m => (
                  <SwiperItem key={m}>
                    {m.includes("mp4") ? (
                      <Video
                        src={m}
                        muted
                        loop
                        autoplay
                        controls={false}
                        x5-playsinline="true"
                        webkit-playsinline="true"
                        style={{ width: "100%", height: 143 }}
                      />
                    ) : (
                      <Image
                        style="width: 300px;height: 100px;background: #fff;"
                        src={m}
                      />
                    )}
                  </SwiperItem>
                ))}
              </Swiper>
            )}
            <View className={styles.tibox}>
              <View style={{ marginBottom: 8 }}>
                {questionIndex + 1}/{data[active].sum}
              </View>
              {/* <Form form={form} layout="vertical">
                <View className={styles.title}>
                  {data[active].questions[questionIndex]?.name}
                </View>
                <Radio.Group
                  value={data[active].questions[questionIndex]?.answerSn ?? 1}
                  onChange={e =>
                    changeVal(
                      e,
                      data[active].questions[questionIndex],
                      "answerSn"
                    )
                  }
                >
                  {data[active].questions[questionIndex]?.answers.map(c => (
                    <Radio name={c.sn} key={c.sn}>
                      {c.content}
                    </Radio>
                  ))}
                </Radio.Group>
                <View className={styles.title}>补充说明（非必填）</View>
                <Field
                  rows={3}
                  onChange={e =>
                    changeVal(
                      e,
                      data[active].questions[questionIndex],
                      "remark"
                    )
                  }
                  value={data[active].questions[questionIndex]?.remark ?? ""}
                  type="textarea"
                  placeholder="填写补充说明"
                />
                <View className={styles.mediaBox}>
                  {data[active].questions[questionIndex]?.mediaList?.map(
                    (v, i) =>
                      v.type === MediaType.PICTURE ? (
                        <img
                          className={styles.imgs}
                          alt="pic"
                          key={i}
                          src={v.localData}
                        />
                      ) : v.type === MediaType.VIDEO ? (
                        <View
                          className={cls(styles.iconBox, styles.videoBox)}
                          style={{ backgroundImage: `url(${v.coverUrl})` }}
                          key={i}
                          onClick={() => playVideo(v.localData)}
                        >
                          <img src={luxiang} alt="" />
                        </View>
                      ) : (
                        <View className={styles.iconBox} key={i}>
                          {isPlay ? (
                            <PauseCircleO
                              onClick={() => stopVoice(v.localData)}
                            />
                          ) : (
                            <PlayCircleO
                              onClick={() => startVoice(v.localData)}
                            />
                          )}
                        </View>
                      )
                  )}
                  <View
                    className={styles.iconBox}
                    onClick={() => chooseImg(MediaType.PICTURE)}
                  >
                    <Photograph />
                  </View>
                  <View
                    className={styles.iconBox}
                    onClick={() => {
                      setOpenVideo(true);
                    }}
                  >
                    <Video />
                  </View>
                  <View
                    className={styles.iconBox}
                    onClick={() => {
                      isRecord ? stopRecord() : startRecord();
                    }}
                  >
                    {isRecord ? <StopCircleO /> : <Audio />}
                  </View>
                </View>
              </Form> */}
            </View>
          </View>
          <View className={styles.btnbox}>
            {active === data.length - 1 &&
            questionIndex === data[active]?.questions?.length - 1 ? (
              <View>
                <Button className={styles.btn} onClick={submit} type="primary">
                  {btnText}
                </Button>
                {data[active]?.questions?.length > 1 && (
                  <Button className={styles.btn} onClick={pre}>
                    上一题
                  </Button>
                )}
              </View>
            ) : (
              <View>
                <Button className={styles.btn} type="primary" onClick={next}>
                  下一题
                </Button>
                {(active !== 0 || questionIndex !== 0) && (
                  <Button className={styles.btn} onClick={pre}>
                    上一题
                  </Button>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
