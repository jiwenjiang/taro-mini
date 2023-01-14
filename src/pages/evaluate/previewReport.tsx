import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import Down from "@/static/icons/download-2-fill.svg";
import { Image, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./brainDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    downloadImg();
  }, []);

  const downloadImg = async () => {
    const res = await request({
      url: "/scaleRecord/report/picture",
      data: { id: router.params.id }
    });
    setData(res.data);
  };

  const preview = () => {
    console.log("🚀 ~ file: previewReport.tsx:38 ~ preview ~ data", data);

    wx.previewImage({
      urls: data, // 当前显示图片的 http 链接
      current: 0
    });
  };

  return (
    <View>
      <NavBar title={router.params.name || "评估详情"} />
      <View>
        <Image
          onClick={preview}
          src={data}
          mode="widthFix"
          className={styles.reportImg}
        ></Image>
      </View>
      <View className={styles.downLoadBox}>
        <Image
          src={Down}
          onClick={preview}
          mode="aspectFill"
          className={styles.downLoad}
        />
      </View>
    </View>
  );
}
