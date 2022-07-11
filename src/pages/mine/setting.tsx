import React from "react"

import { navigateTo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtListItem } from "taro-ui"

import TabBar from "@/comps/TabBar"

import "./setting.scss"

export default function App() {
  const record = () => {
    navigateTo({ url: `/pages/mine/password` })
  }

  return (
    <View className="setting">
      <View className="option" onClick={record}>
        <AtListItem title="修改密码" arrow="right" hasBorder={false} />
      </View>
      <TabBar current="mine" />
    </View>
  )
}
