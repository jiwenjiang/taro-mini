import Taro, { navigateTo, useRouter } from "@tarojs/taro";
import { useRef, useState } from "react";
import request from "./request";

export function useReportBtnHandle() {
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  let payRes = useRef<any>();

  const checkPay = async (c, isSelf = false) => {
    console.log("🚀 ~ file: hook.ts ~ line 12 ~ checkPay ~ isSelf", isSelf);
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
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: checkRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
          setOpen(true);
        } else {
          const orderRes = await request({
            url: "/order/video/create",
            data: {
              resourceId: c.resourceId,
              productId: c.productId
            }
          });
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: orderRes.data?.orderId,
              ip: "127.0.0.1"
            }
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
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
      timeStamp: payRes.current.data.timeStamp,
      nonceStr: payRes.current.data.nonceStr,
      package: payRes.current.data.packageValue,
      signType: payRes.current.data.signType,
      paySign: payRes.current.data.paySign,
      success(res) {
        checkPay(payRes.current.order, payRes.current.order?.type === "SELF");
      }
    });
  };
  return { checkPay, toPay, open, setOpen, price };
}
