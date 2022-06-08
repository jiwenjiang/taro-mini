import { View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { AtButton, AtListItem } from "taro-ui";
import "./choose.scss";

export default function App() {
  const start = () => {
    navigateTo({ url: "/pages/evaluate/brain" });
  };

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list">
          <AtListItem
            title="张晓乐"
            note="2016-04-12"
            arrow="right"
            hasBorder={false}
            thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
          />
        </View>
      </View>
      <AtButton className="btn" type="primary" onClick={start}>
        开始评测
      </AtButton>
    </View>
  );
}
