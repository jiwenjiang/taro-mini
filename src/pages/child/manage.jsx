import { useEffect, useState } from "react";

import { View, Text, Image } from "@tarojs/components";
import { AtButton, AtMessage } from "taro-ui";
import Taro, { navigateTo, useRouter } from "@tarojs/taro";

import request from "@/service/request";

import maleImg from "@/static/imgs/male.png";
import femaleImg from "@/static/imgs/female.png";
import removeImg from "@/static/imgs/remove.png";
import editImg from "@/static/imgs/edit.png";

import "./manage.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [children, setChildren] = useState([]);
  const [dataIndex, setDataIndex] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // 页面加载时调用该方法获取儿童信息
  const getChildrenInfo = () => {
    useEffect(() => {
      (async () => {
        const res = await request({ url: "/children/list", data: page });
        setChildren(res.data.children);
      })();
    }, []);
  }

  getChildrenInfo();

  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    navigateTo({
      url: `/pages/child/edit`
    });
  };
  // 跳转至添加儿童页面，并带上儿童 ID，以编辑儿童信息
  const edit = (index) => {
    navigateTo({
      url: `/pages/child/edit?childId=${children[index].id}`
    });
  };

  // 显示删除儿童信息对话框
  const showRemove = (index) => {
    setDataIndex(index);
    setShowRemoveModal(true);
  }

  // 删除当前儿童信息
  const doRemove = async (index) => {
    console.log(`will delete: ${JSON.stringify(children[index])}`);

    const res = await request({
      url: `/children/delete?id=${children[index].id}`,
    });

    setShowRemoveModal(false);

    if (res.code === 0) {
      children.splice(children.findIndex(ele => ele.id === dataIndex), 0);
      setChildren(children);

      Taro.atMessage({
        'message': '儿童信息已删除',
        'type': 'success',
      });
    } else {
      Taro.atMessage({
        'message': '儿童信息删除失败',
        'type': 'error',
      });
    }
  }

  return (
    <View className="index">
      <AtMessage />
      <View className="list-wrap">
        <View className="list">
          {children.map((v, index) => (
            <View key={index} className="child-info">
              <View className="left">
                <Image src={v.gender === '男' ? maleImg : femaleImg} className="gender"/>
                <View className="text-info">
                  <Text className="name">{v.name}</Text>
                  <Text className="birthday">{v.birthday}</Text>
                </View>
              </View>
              <View className="actions">
                <Image onClick={() => showRemove(index)} src={removeImg} className="action remove"/>
                <Image onClick={() => edit(index)} src={editImg} className="action edit"/>
              </View>
            </View>
          ))}
        </View>
        <AtButton className="btn" type="primary" onClick={add}>
          添加儿童
        </AtButton>
      </View>
      {showRemoveModal && (
        <View className="remove-modal">
          <View className="mask"></View>
          <View className="modal">
            <View className="text">确认删除儿童{children[dataIndex].name}？</View>
            <View className="actions">
              <View onClick={() => setShowRemoveModal(false)} className="action cancel">取消</View>
              <View onClick={() => doRemove(dataIndex)} className="action confirm">删除</View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
