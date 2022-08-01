import { useEffect, useState } from "react"

import Taro, {
  navigateTo,
  useRouter,
  useDidShow,
} from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import { AtButton, AtMessage } from "taro-ui"

import request from "@/service/request"
import { ScaleTableCode, OrderStatus } from "@/service/const"

import "./videoList.scss"

export default function App() {
  const router = useRouter()
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 })
  const [orderList, setOrderList] = useState([])

  // 页面加载时调用该方法获取视频订单
  const getScaleOrderList = () => {
    useEffect(() => {
      (async () => {
        const res = await getAndSetOrderInfo()
      })()
    }, [])
  }

  getScaleOrderList()

  const getAndSetOrderInfo = async () => {
    const res = await request({
      url: "/order/list",
      data: {
        ...page,
        orderType: 2,
      },
    })
    setOrderList(res.data.orders)
  }

  useDidShow(() => {
    getAndSetOrderInfo()
  })

  // 获取视频订单状态并为对应文字标签设置对应类名
  const getOrderStatus = (v) => {
    switch (v.status) {
      case OrderStatus.UNPAID:
        return 'status unpaid'
      case OrderStatus.PAID:
        return 'status paid'
      case OrderStatus.USED:
        return 'status used'
      case OrderStatus.CANCELLED:
        return 'status cancelled'
      default:
        return 'status unpaid'
    }
  }

  // 取消视频订单
  const cancel = async (id) => {
    const res = await request({ url: `/order/cancel?id=${id}` })

    if (res.code === 0) {
      const res = await request({ url: "/order/videoList", data: page })
      setOrderList(res.data.orders)

      Taro.atMessage({
        'message': '订单已取消',
        'type': 'success',
      })
    } else {
      Taro.atMessage({
        'message': '订单无法取消',
        'type': 'error',
      })
    }
  }

  // 跳转至视频订单详情页面
  const goVideoDetailPage = (id) => {
    navigateTo({
      url: `/pages/order/detail?id=${id}`
    })
  }

  return (
    <View className="scale-orderlist-wrapper">
      <AtMessage />
      <View className="list">
        {orderList.map((v, index) => (
          <View key={v.id} className="order-info" onClick={() => goVideoDetailPage(v.id)}>
            <View className="upper">
              <Text className="created">{v.created}</Text>
              <Text className={getOrderStatus(v)}>{v.statusString}</Text>
            </View>
            <View className="lower">
              <View className="info">
                <Text className="name">{v.name}</Text>
                <Text className="total-fee">¥{v.totalFee}</Text>
              </View>
              {v.status === OrderStatus.UNPAID && (
                <View className="actions">
                  <AtButton className="btn cancel" onClick={() => cancel(v.id)}>
                    取消
                  </AtButton>
                  <AtButton className="btn" type="primary">
                    去付款
                  </AtButton>
                </View>
              )}
              {v.status === OrderStatus.PAID && (
                <View className="actions">
                  <AtButton className="btn" type="primary" onClick={() => goChildChoosePage(v.id)}>
                    去使用
                  </AtButton>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
