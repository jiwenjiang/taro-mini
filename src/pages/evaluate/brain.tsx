import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import "./list.scss";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  useDidShow(() => {});

  return <View className="index">eva</View>;
}
