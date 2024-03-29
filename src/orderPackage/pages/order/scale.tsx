import { OrderStatus } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import { Base64 } from "@/service/utils";
import { Button, Notify } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import "./scale.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [orderList, setOrderList] = useState<any>([]);
  const childContext = useContext(ChildContext);

  // 页面加载时调用该方法获取量表订单
  const getScaleOrderList = () => {
    useEffect(() => {
      (async () => {
        const res = await getAndSetOrderInfo();
      })();
    }, []);
  };

  getScaleOrderList();

  const getAndSetOrderInfo = async () => {
    const res = await request({ url: "/order/list", data: page });
    setOrderList(res.data.orders);
  };

  useDidShow(() => {
    getAndSetOrderInfo();
  });

  // 获取订单状态并为对应文字标签设置对应类名
  const getOrderStatus = v => {
    switch (v.status) {
      case OrderStatus.UNPAID:
        return "status unpaid";
      case OrderStatus.PAID:
        return "status paid";
      case OrderStatus.USED:
        return "status used";
      case OrderStatus.CANCELLED:
        return "status cancelled";
      default:
        return "status unpaid";
    }
  };

  // 取消订单
  const cancel = async id => {
    const res = await request({ url: `/order/cancel?id=${id}` });

    if (res.code === 0) {
      const res = await request({ url: "/order/list", data: page });
      setOrderList(res.data.orders);
      Notify.open({ color: "success", message: "订单已取消" });
    } else {
      Notify.open({ color: "error", message: "订单无法取消" });
    }
  };

  // 跳转至订单详情页面
  const goOrderDetailPage = id => {
    navigateTo({
      url: `/orderPackage/pages/order/detail?id=${id}`
    });
  };

  // 跳转至GMs量表儿童选择页面
  const goChildChoosePage = v => {
    if (childContext.child.len) {
      navigateTo({
        url: `/childPackage/pages/choose?code=${v.scaleTableCode}&orderId=${v.id}`
      });
    } else {
      const returnUrl = Base64.encode(`/childPackage/pages/choose?code=${v.scaleTableCode}&orderId=${v.id}`);
      navigateTo({
        url: `/childPackage/pages/manage?returnUrl=${returnUrl}`
      });
    }
  };

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list" });
    childContext.updateChild({ len: res.data.children.length });
  };

  return (
    <View className="scale-orderlist-wrapper">
      <Notify id="notify" />
      <View className="list">
        {orderList.map((v, index) => (
          <View
            key={v.id}
            className="order-info"
            onClick={() => goOrderDetailPage(v.id)}
          >
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
                  <Button className="btn cancel" onClick={() => cancel(v.id)}>
                    取消
                  </Button>
                  <Button className="btn" color="primary">
                    去付款
                  </Button>
                </View>
              )}
              {v.status === OrderStatus.PAID && (
                <View className="actions">
                  <Button
                    className="btn"
                    color="primary"
                    onClick={() => goChildChoosePage(v)}
                  >
                    去使用
                  </Button>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
