import ListItem from "@/comps/ListItem";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import Select from "@/static/icons/selected.svg";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Image, View } from "@tarojs/components";
import { atMessage, navigateTo, useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { AtButton, AtMessage } from "taro-ui";
import "./choose.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 1000 });
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);

  const start = () => {
    let age = dayjs().diff(dayjs(data[active]?.birthday), "month");
    if (age > 5 && Number(router.params.code) === ScaleTableCode.GMS) {
      atMessage({ type: "warning", message: "GMs评测仅限0-5个月孩子" });
      return;
    }
    navigateTo({
      url: `/pages/evaluate/index?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`
    });
  };

  const manage = () => {
    navigateTo({ url: "/pages/child/manage" });
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
            <View key={i} className="list-item-wrap">
              <ListItem
                title={v.name}
                subTitle={v.birthday}
                click={() => choose(v, i)}
                left={
                  <Image
                    src={v.gender === "男" ? maleImg : femaleImg}
                    className="gender"
                  />
                }
                right={
                  active === i && (
                    <View className="arrow-icon">
                      <Image src={Select} className="select" />
                    </View>
                  )
                }
              />
            </View>
          ))}
        </View>
        {data.length > 0 && (
          <AtButton className="btn" type="primary" onClick={start}>
            开始评测
          </AtButton>
        )}
        <AtButton className="btn mt10" onClick={manage}>
          儿童管理
        </AtButton>
      </View>
      <AtMessage />
    </View>
  );
}
