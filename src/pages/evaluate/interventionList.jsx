import { useEffect, useState } from "react";

import { Image, Text, View } from "@tarojs/components";
import { navigateTo, navigateToMiniProgram, useRouter } from "@tarojs/taro";

import request from "@/service/request";

import "./interventionList.scss";

export default function App() {
  const router = useRouter();
  const [videoList, setVideoList] = useState([]);

  const getScaleOrderList = () => {
    useEffect(() => {
      (async () => {
        const res = await getInterventionList();
      })();
    }, []);
  };

  getScaleOrderList();

  const getInterventionList = async () => {
    const res = await request({
      url: `/scaleRecord/abnormal/methods?recordId=${router.params.recordId ??
        122}`
    });

    if (res.data.length) {
      setVideoList(res.data);
    } else {
      setVideoList([
        {
          abnormalIterm: "自发姿势运动异常-紧张时头偏斜",
          appid: "wx98dc9b974915de77",
          coverUrl:
            "https://wechatapppro-1252524126.file.myqcloud.com/app7qahxuzk4630/image/b_u_5ee216595ecc9_gW13FzgZ/15t1oodr0ood.jpg",
          name: "紧张时头偏斜",
          page:
            "page/home/content/content_video/content_video?id=v_62d77690e4b0a51fef018f96",
          recordid: 122,
          resourceld: "v_62d77690e4b0a51fef018f96",
          type: 3
        }
      ]);
    }
  };

  const watchVideo = page => {
    navigateToMiniProgram({
      appId: "wx98dc9b974915de77",
      path: page
    });
  };

  const readIntro = name => {
    navigateTo({
      url: `/pages/evaluate/interventionDetail?abnormalIterm=${encodeURIComponent(
        name
      )}`
    });
  };

  return (
    <View className="intervention-list">
      {videoList.map((v, index) => (
        <View key={v.recordId} className="video-info">
          <View className="video-title">
            <Text className="title">{v.name}</Text>
          </View>
          <View className="video-cover">
            <Image src={v.coverUrl} className="cover" />
          </View>
          <View className="actions">
            <Text className="watch-video" onClick={() => watchVideo(v.page)}>
              观看视频
            </Text>
            <Text className="read-intro" onClick={() => readIntro(v.name)}>
              详细介绍
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
