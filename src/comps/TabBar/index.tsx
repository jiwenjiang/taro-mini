import { FushuAppId } from "@/service/const";
import Kefu from "@/static/icons/kefu.svg";
import Kefu2 from "@/static/icons/kefu2.svg";
import { Tabbar } from "@taroify/core";
import { HomeOutlined, UserCircleOutlined } from "@taroify/icons";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect } from "react";
import pkgJSON from "../../../project.config.json";
import "./index.scss";

const pageList = [
  {
    page: "index",
    url: "/pages/index/index"
  },
  {
    page: "kefu",
    url: "/pages/kefu/index"
  },
  {
    page: "mine",
    url: "/pages/mine/index"
  }
];

export default function TabBar({ current }) {
  const handleClick = e => {
    const page = pageList[e];
    Taro.switchTab({ url: page.url });
    // setCurrent(e);
  };

  const open = () => {
    console.log(113);

    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc86155f0abef5c38b" },
      corpId: "ww47f31bbc9556c2ef",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      }
    });
  };

  useEffect(() => {
    // async () => {
    //   await request({
    //     url: "/org/customerService/get",
    //     method: "GET"
    //   });
    // };
  }, []);

  return (
    <View className="tab-wrap">
      <Tabbar value={pageList.findIndex(v => v.page === current)} fixed={true}>
        <Tabbar.TabItem icon={<HomeOutlined />} onClick={() => handleClick(0)}>
          首页
        </Tabbar.TabItem>
        {pkgJSON.appid === FushuAppId && (
          <Tabbar.TabItem
            icon={
              <Image
                src={current === "kefu" ? Kefu2 : Kefu}
                style={{ width: 16, height: 16 }}
              />
            }
            // onClick={() => handleClick(1)}
            onClick={() => open()}
          >
            客服
          </Tabbar.TabItem>
        )}

        <Tabbar.TabItem
          icon={<UserCircleOutlined />}
          onClick={() => handleClick(2)}
        >
          我的
        </Tabbar.TabItem>
      </Tabbar>
    </View>
  );
}
