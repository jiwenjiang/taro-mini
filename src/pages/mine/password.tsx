import React, { useState } from "react"

import Taro, { navigateTo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtInput, AtButton, AtMessage } from "taro-ui"

import TabBar from "@/comps/TabBar"

import request from "@/service/request"

import "./password.scss"

export default function App() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onPasswordChange = (value) => {
    setPassword(value)
  }

  const onConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
  }

  const onFinish = async () => {
    if (password !== confirmPassword) {
      Taro.atMessage({
        'message': '两次输入的密码不一致，请重新输入',
        'type': 'error',
      })

      return
    }

    const res = await request({
      url: '/password/update',
      method: 'POST',
      data: {
        password,
      },
    })

    if (res.code !== 0) {
      Taro.atMessage({
        'message': '密码修改失败，请重试',
        'type': 'error',
      })

      return
    }

    Taro.atMessage({
      'message': '密码修改成功',
      'type': 'success',
    })

    await new Promise(r => setTimeout(r, 3000))

    navigateTo({
      url: `/pages/mine/setting`,
    })
  }

  return (
    <View className="password">
      <View className="row">
        <AtInput
          name='value'
          title='新密码'
          type='password'
          placeholder='请输入新密码'
          value={password}
          onChange={(value) => onPasswordChange(value)}
        />
      </View>
      <View className="row">
        <AtInput
          name='value'
          title='确认密码'
          type='password'
          placeholder='请再次输入新密码'
          value={confirmPassword}
          onChange={(value) => onConfirmPasswordChange(value)}
        />
      </View>
      <View className="actions">
        <AtButton
          onClick={() => onFinish()}
          className="action confirm"
        >确认修改</AtButton>
      </View>
      <TabBar current="mine" />
      <AtMessage />
    </View>
  )
}
