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
  RichText,
} from "@tarojs/components"
import { AtButton } from "taro-ui"

import request from "@/service/request"

import "./interventionDetail.scss"

export default function App() {
  const router = useRouter()
  const [abnormalIterm, setAbnormalIterm] = useState(null)
  const [interventionDetail, setInterventionDetail] = useState(null)

  useEffect(async () => {
    const res = await getInterventionDetail()
  }, [])

  const getInterventionDetail = async () => {
    setAbnormalIterm(decodeURIComponent(router.params.abnormalIterm))

    const res = await request({
      url: `/scaleRecord/abnormal/methods/detail?abnormalIterm=${decodeURIComponent(router.params.abnormalIterm)}`,
    })

    if (res.data) {
      let result = res.data.detail.replace(/\<img/g, '<img class="img"')
      result = result.replace(/\<p/g, '<p class="p"')
      setInterventionDetail(decodeURIComponent(result))
    }
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
          {interventionDetail && <RichText nodes={interventionDetail} />}
        </View>
      </View>
      <View className="buy-book">
        <AtButton
          className="btn"
          type="primary"
          openType='contact'
        >联系客服购买纸质书，查看更多详细介绍</AtButton>
      </View>
    </View>
  )
}
