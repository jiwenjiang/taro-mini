import { useEffect, useState } from "react"

import Taro, {
  navigateTo,
  useRouter,
  navigateToMiniProgram,
} from "@tarojs/taro"
import {
  View,
  Text,
  Image,
} from "@tarojs/components"
import { AtButton } from "taro-ui"

import request from "@/service/request"

import "./interventionDetail.scss"

export default function App() {
  const router = useRouter()
  const [abnormalIterm, setAbnormalIterm] = useState('')
  const [interventionDetail, setInterventionDetail] = useState('')

  useEffect(() => {
    (async () => {
      const res = await getInterventionDetail()
    })()
  }, [])

  const getInterventionDetail = async () => {
    setAbnormalIterm(decodeURIComponent(router.params.abnormalIterm))

    const res = await request({
      url: `/scaleRecord/abnormal/methods/detail?abnormalIterm=${decodeURIComponent(router.params.abnormalIterm)}`,
    })

    if (!res.data) {
      setInterventionDetail('<p>我在抖音看到过一个嫁给日本人的中国女人，她的日本婆婆照顾她的日常饮食，所以她每天的视频内容就是一日三餐。</p><p>我以前就听说过日本人下班吃烧烤，一杯啤酒三串烧鸟吃一晚上的传说，但是真正亲眼目睹日本人一日三餐的模式还是惊到了。</p><p>那个日本婆婆做饭每餐的确都会有牛肉虾之类的食物，但是你知道么？她们婆媳两个人吃饭，她一般只拿一片牛肉，大小跟我们国内常见的一片培根相当，她把那片牛肉水煮一下，没错，就是直接用清水煮一下，然后用剪刀剪成四五块，装盘，那就是她们一餐最硬的一个菜--水煮肉片。</p><p>我因为减肥的缘故，平常吃东西也会用那种可以精确到克的食物称，所以对食物的重量基本上看一眼就可以大概评估出重量，那一片牛肉充其量就是四五十克，平均下来，两个人只有二十来克的量。</p><p><img alt="" src="https://pica.zhimg.com/80/v2-dc7450b7d98a0a9e59a5c6377be9557d_1440w.jpg?source=1940ef5c" /></p>')
    } else {
      setInterventionDetail(decodeURIComponent(res.data.detail))
    }
  }

  const buyBook = (content) => {
    navigateToMiniProgram({
      appId: 'wx98dc9b974915de77',
      path: content,
    })
  }

  const readIntro = (abnormalIterm) => {
    navigateTo({
      url: `/pages/evaluate/interventionDetail?abnormalIterm=${abnormalIterm}`,
    })
  }

  return (
    <View className="intervention-detail">
      <View className="card">
        <View className="card-header">{abnormalIterm}</View>
        <View className="card-body">
          <View dangerouslySetInnerHTML={{ __html: interventionDetail }}></View>
        </View>
      </View>
      <View className="buy-book">
        <AtButton
          className="btn"
          type="primary"
          onClick={() => buyBook(interventionDetail.content)}
        >购买纸质书，查看更多详细介绍</AtButton>
      </View>
    </View>
  )
}
