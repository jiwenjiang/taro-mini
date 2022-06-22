import ListItem from "@/comps/ListItem";
import request from "@/service/request";
import Select from "@/static/icons/selected.svg";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Image, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { AtButton } from "taro-ui";
import "./choose.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);

  const start = () => {
    let age = dayjs().diff(dayjs(data[0]?.birthday), "years");

    navigateTo({
      url: `/pages/evaluate/index?childId=${data[active]?.id}&age=${age}&code=${router.params.code}`
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
          ))}
        </View>
        <AtButton className="btn" type="primary" onClick={start}>
          开始评测
        </AtButton>
        <AtButton className="btn mt10" onClick={manage}>
          儿童管理
        </AtButton>
      </View>
    </View>
  );
}
{
  /* <AtListItem
className={ "active"}
title={v.name}
note={v.birthday}
arrow="right"
hasBorder={false}
thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
/> */
}
