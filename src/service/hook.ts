import Taro, { navigateTo, useRouter } from "@tarojs/taro";
import { useRef, useState } from "react";
import request from "./request";

export function useReportBtnHandle() {
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  let payRes = useRef<any>().current;

  const checkPay = async (c, isSelf = false) => {
    if (c.resourceId || c.productId) {
      const checkRes = await request({
        url: "/order/video/check",
        data: {
          resourceId: c.resourceId
        }
      });
      if (checkRes.data.hasPaidOrder) {
        if (isSelf) {
          navigateTo({
            url: `${c.content}?recordId=${router.params.id}`
          });
        } else {
          Taro.navigateToMiniProgram({
            appId: checkRes.data.appId,
            path: checkRes.data.page,
            success(res) {
              // 打开成功
            }
          });
        }
      } else {
        if (checkRes.data.orderId) {
          payRes = await request({
            url: "/order/pay",
            data: {
              id: checkRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.order = c;
          setPrice(payRes.data.price);
          setOpen(true);
        } else {
          const orderRes = await request({
            url: "/order/video/create",
            data: {
              resourceId: c.resourceId,
              productId: c.productId
            }
          });
          payRes = await request({
            url: "/order/pay",
            data: {
              id: orderRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.order = c;
          setPrice(payRes.data.price);
          setOpen(true);
        }
      }
    } else {
      Taro.navigateToMiniProgram({
        appId: c.appId,
        path: c.content,
        success(res) {
          // 打开成功
        }
      });
    }
  };

  const toPay = () => {
    setOpen(false);
    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success(res) {
        checkPay(payRes.order);
      }
    });
  };
  return { checkPay, toPay, open, setOpen, price };
}
