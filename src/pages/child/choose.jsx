import request from "@/service/request";
import { View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import moment from "moment";
import { useEffect, useState } from "react";
import { AtButton, AtListItem } from "taro-ui";
import "./choose.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);

  const start = () => {
    let age = moment().diff(moment(data[0]?.birthday), "years");
    navigateTo({
      url: `/pages/evaluate/index?childId=${data[active]?.id}&age=${age}&code=${router.params.code}`
    });
  };

  const choose = (_v, i) => {
    setActive(i);
  };

  useEffect(() => {
    (async () => {
      const res = await request({ url: "/children/list", data: page });
      setData(res.data.children);
    })();
  }, []);

  return (
    <View className="index">
      <View className="list-wrap">
        <View className="list">
          {data.map((v, i) => (
            <AtListItem
              className={active === i && "active"}
              title={v.name}
              note={v.birthday}
              arrow="right"
              hasBorder={false}
              onClick={() => choose(v, i)}
              thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
            />
          ))}
        </View>
        <AtButton className="btn" type="primary" onClick={start}>
          开始评测
        </AtButton>
      </View>
    </View>
  );
}
