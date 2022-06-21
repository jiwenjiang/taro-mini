import { useEffect, useState } from "react";

import { View, Text, Picker } from "@tarojs/components";
import { AtList, AtListItem, AtInput, AtButton, AtMessage } from "taro-ui";
import Taro, { navigateTo, useRouter } from "@tarojs/taro";

import dayjs from "dayjs";
import request from "@/service/request";

import "./edit.scss";

export default function App() {
  const router = useRouter();
 
  const genders = ['男', '女']
  const gestationalWeeks = [
    Array.from({ length: 52 }, (v, i) => i + 1),
    Array.from({ length: 31 }, (v, i) => i),
  ]

  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState('2000-01-01');
  const [defaultGestationalIndex, setDefaultGestationalIndex] = useState([27, 0]);
  const [gestationalWeek, setGestationalWeek] = useState(gestationalWeeks[0][defaultGestationalIndex[0]]);
  const [gestationalWeekDay, setGestationalWeekDay] = useState(gestationalWeeks[1][defaultGestationalIndex[1]]);
  const [birthdayWeight, setBirthdayWeight] = useState(null);

  const init = () => {
    // 路由中没有儿童 ID 时，为新增儿童，无需获取儿童信息
    if (!router.params.childId) {
      return
    }

    // 路由中有儿童 ID 时，为更新儿童，需获取儿童信息
    useEffect(() => {
      (async () => {
        const res = await request({
          url: `/children/get?id=${router.params.childId}`,
        });
        const childInfo = res.data;

        if (!childInfo) {
          return
        }

        setName(childInfo.name);
        // TODO: setGender 在这里无效，为什么？
        setGender(childInfo.gender);
        setBirthday(childInfo.birthday);
        setGestationalWeek(childInfo.gestationalWeek);
        setGestationalWeekDay(childInfo.gestationalWeekDay);
        setDefaultGestationalIndex([gestationalWeeks[0].indexOf(childInfo.gestationalWeek), gestationalWeeks[1].indexOf(childInfo.gestationalWeekDay)]);
        setBirthdayWeight(childInfo.birthdayWeight);
      })();
    }, []);
  }

  init();

  const onNameChange = (value) => {
    setName(value)
  }

  const onGenderChange = (e) => {
    setGender(genders[e.detail.value])
  }

  const onBirthdayChange = (e) => {
    setBirthday(e.detail.value)
  }

  // 由于孕周的 Picker 控件的 value 属性绑定为 defaultGestationalIndex
  // 所以在改变所选择的值时，也需要同步更新 defaultGestationalIndex
  const onGestationalWeekChange = (e) => {
    if (e.detail.column === 0) {
      setDefaultGestationalIndex(defaultGestationalIndex.splice(0, 0, e.detail.value))
      setGestationalWeek(gestationalWeeks[0][e.detail.value])
    } else if (e.detail.column === 1) {
      setDefaultGestationalIndex(defaultGestationalIndex.splice(1, 0, e.detail.value))
      setGestationalWeekDay(gestationalWeeks[1][e.detail.value])
    }
  }

  const onBirthdayWeightChange = (value) => {
    setBirthdayWeight(value)
  }

  const onFinish = () => {
    if (!router.params.childId) {
      doSave()
    } else {
      doUpdate()
    }
  }

  // 保存新的儿童信息
  const doSave = async () => {
    if (!name.trim() || !birthdayWeight.trim()) {
      Taro.atMessage({
        'message': '请填写所有信息后再保存',
        'type': 'error',
      })

      return
    }

    const res = await request({
      url: '/children/save',
      method: 'POST',
      data: {
        name,
        gender: gender === '男' ? 1 : 2,
        birthday: dayjs(birthday, 'YYYY-MM-DD').unix(),
        gestationalWeek,
        gestationalWeekDay,
        birthdayWeight: parseFloat(birthdayWeight),
      },
    });

    if (res.code !== 0) {
      Taro.atMessage({
        'message': '儿童信息保存失败',
        'type': 'error',
      })

      return
    }

    Taro.atMessage({
      'message': '儿童信息保存成功',
      'type': 'success',
    })
    navigateTo({
      url: `/pages/child/manage`,
    });
  }

  // 更新当前儿童信息
  const doUpdate = async (index) => {
    console.log(`will update: `);

    const res = await request({
      url: '/children/update',
      method: 'POST',
      data: {
        id: router.params.childId,
        name,
        gender: gender === '男' ? 1 : 2,
        birthday: dayjs(birthday, 'YYYY-MM-DD').unix(),
        gestationalWeek,
        gestationalWeekDay,
        birthdayWeight: parseFloat(birthdayWeight),
      },
    });

    if (res.code !== 0) {
      Taro.atMessage({
        'message': '儿童信息更新失败',
        'type': 'error',
      })

      return
    }

    Taro.atMessage({
      'message': '儿童信息更新成功',
      'type': 'success',
    })
    navigateTo({
      url: `/pages/child/manage`,
    });
  }

  return (
    <View className="index">
      <AtMessage />
      <View className="row">
        <AtInput
          name='value'
          title='儿童姓名'
          type='text'
          placeholder='请输入姓名'
          value={name}
          onChange={(value) => onNameChange(value)}
        />
      </View>
      <View className="row">
        <Picker mode='selector' range={genders} onChange={onGenderChange}>
          <AtList>
            <AtListItem
              title='性别'
              extraText={gender}
            />
          </AtList>
        </Picker>
      </View>
      <View className="row">
        <Picker mode='date' value={birthday} onChange={onBirthdayChange}>
          <AtList>
            <AtListItem
              title='出生日期'
              extraText={birthday}
            />
          </AtList>
        </Picker>
      </View>
      <View className="row">
        <Picker mode='multiSelector' range={gestationalWeeks} value={defaultGestationalIndex} onColumnChange={onGestationalWeekChange}>
          <AtList>
            <AtListItem
              title='孕周'
              extraText={`${gestationalWeek} 周 ${gestationalWeekDay} 天`}
            />
          </AtList>
        </Picker>
      </View>
      <View className="row">
        <AtInput
          name='value'
          title='出生体重'
          type='text'
          placeholder='请输入体重'
          value={birthdayWeight}
          onChange={(value) => onBirthdayWeightChange(value)}
        />
      </View>
      <View className="actions">
        <AtButton onClick={() => onFinish()} className="action confirm">保存</AtButton>
      </View>
    </View>
  );
}
