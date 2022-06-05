import TabBar from "@/comps/TabBar";
import { View } from "@tarojs/components";
import React, { useEffect } from "react";
import "./index.scss";

export default function App() {
  useEffect(() => {}, []);

  return (
    <View className="index">
      2
      <TabBar current="mine" />
    </View>
  );
}
