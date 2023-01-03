import { useEffect, useState } from "react";

import { Button, Notify } from "@taroify/core";
import { Image, Picker, Text, View } from "@tarojs/components";
import {
  getCurrentPages,
  getStorageSync,
  navigateTo,
  useRouter
} from "@tarojs/taro";

import CheckedIcon from "@/static/icons/checked.svg";
import DropdownIcon from "@/static/icons/dropdown.svg";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import request from "@/service/request";
import dayjs from "dayjs";

import { Base64 } from "@/service/utils";
import "./edit.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const router = useRouter();

  const genders = ["男", "女"];
  const gestationalWeeks = [
    Array.from({ length: 52 }, (v, i) => i + 1),
    Array.from({ length: 31 }, (v, i) => i)
  ];
  const allChildRisks = [
    "胎龄不足37周或超过42周",
    "出生体重在2500g以下",
    "胎儿的兄弟姊妹有严重新生儿病史",
    "产时感染",
    "胎儿宫内窘迫",
    "胎儿宫内发育迟缓",
    "缺血缺氧性脑病",
    "颅内出血",
    "新生儿肺炎",
    "寒冷损伤",
    "新生儿黄疸",
    "高危产妇所生的新生儿",
    "手术产儿、难产、急产、产程过 长、分娩过程使用镇静剂等"
  ];
  const allMotherRisks = [
    "年龄：年龄＜18岁或＞35岁",
    "孕产史:有异常孕产史者，如流产、早产、死胎、死产、各种难产及手术产、新生儿死亡、新生儿溶血性黄疸、先天缺陷或遗传性疾病;",
    "孕早期先兆流产",
    "贫血",
    "孕期出血，如前置胎盘、胎盘早剥",
    "妊娠高血压综合征",
    "妊娠合并内科疾病，如心脏病、肾炎、病毒性肝炎、重度贫血、病毒感染(巨细胞病毒、疱疹病毒、风疹病毒)等",
    "妊娠期接触有害物质，如放射线、同位素、农药、化学毒物、 CO中毒及服用对胎儿有害药物",
    "母儿血型不合",
    "早产或过期妊娠",
    "胎盘及脐带异常:胎盘发育不良、前置胎盘、胎盘早剥，脐带过短、脐带扭曲等",
    "胎位异常",
    "产道异常(包括骨产道及软产道)",
    "多胎妊娠",
    "羊水过多、过少、羊水早破、羊水污染等",
    "多年不育经治疗受孕者",
    "曾患或现有生殖器官肿瘤者等"
  ];

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [birthday, setBirthday] = useState(
    dayjs()
      .startOf("year")
      .format("YYYY-MM-DD")
  );
  const [defaultGestationalIndex, setDefaultGestationalIndex] = useState([
    36,
    0
  ]);
  const [gestationalWeek, setGestationalWeek] = useState(
    gestationalWeeks[0][defaultGestationalIndex[0]]
  );
  const [gestationalWeekDay, setGestationalWeekDay] = useState(
    gestationalWeeks[1][defaultGestationalIndex[1]]
  );
  const [birthdayWeight, setBirthdayWeight] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [parentContact, setParentContact] = useState("");
  const [childRisks, setChildRisks] = useState([]);
  const [showChildRisksDropdown, setShowChildRisksDropdown] = useState(false);
  const [motherRisks, setMotherRisks] = useState([]);
  const [showMotherRisksDropdown, setShowMotherRisksDropdown] = useState(false);

  const init = () => {
    // 路由中没有儿童 ID 时，为新增儿童，无需获取儿童信息
    if (!router.params.childId) {
      return;
    }

    // 路由中有儿童 ID 时，为更新儿童，需获取儿童信息
    useEffect(() => {
      (async () => {
        const res = await request({
          url: `/children/get?id=${router.params.childId}`
        });
        const childInfo = res.data;

        if (!childInfo) {
          return;
        }

        setName(childInfo.name);
        // TODO: setGender 在这里无效，为什么？
        setGender(childInfo.gender);
        setBirthday(childInfo.birthday);
        setGestationalWeek(childInfo.gestationalWeek);
        setGestationalWeekDay(childInfo.gestationalWeekDay);
        setDefaultGestationalIndex([
          gestationalWeeks[0].indexOf(childInfo.gestationalWeek),
          gestationalWeeks[1].indexOf(childInfo.gestationalWeekDay)
        ]);
        setBirthdayWeight(childInfo.birthdayWeight);
        setCardNumber(childInfo.medicalCardNumber);
        setParentContact(childInfo.contactPhone);
        childInfo.childRisks && setChildRisks(childInfo.childRisks);
        childInfo.motherRisks && setMotherRisks(childInfo.motherRisks);
      })();
    }, []);
  };

  useEffect(() => {
    const user = getStorageSync("user");
    setParentContact(user?.phone);
  }, []);

  init();

  const onNameChange = value => {
    setName(value);
  };

  const onGenderChange = e => {
    setGender(genders[e.detail.value]);
  };

  const onBirthdayChange = e => {
    setBirthday(e.detail.value);
  };

  // 由于孕周的 Picker 控件的 value 属性绑定为 defaultGestationalIndex
  // 所以在改变所选择的值时，也需要同步更新 defaultGestationalIndex
  const onGestationalWeekChange = e => {
    if (e.detail.column === 0) {
      setDefaultGestationalIndex(
        defaultGestationalIndex.splice(0, 0, e.detail.value)
      );
      setGestationalWeek(gestationalWeeks[0][e.detail.value]);
    } else if (e.detail.column === 1) {
      setDefaultGestationalIndex(
        defaultGestationalIndex.splice(1, 0, e.detail.value)
      );
      setGestationalWeekDay(gestationalWeeks[1][e.detail.value]);
    }
  };

  const onBirthdayWeightChange = value => {
    setBirthdayWeight(parseInt(value));
  };

  const onCardNumber = value => {
    setCardNumber(value);
  };

  const onParentContact = value => {
    setParentContact(value);
  };

  const toggleChildRisksDropdown = () => {
    setShowChildRisksDropdown(!showChildRisksDropdown);
  };

  const showChildRisksSummary = () => {
    if (childRisks.filter(item => !!item).length === 0) {
      return "无";
    }

    return `共${childRisks.filter(item => !!item).length}项高危因素`;
  };

  const onChildRisksChange = (e, item) => {
    if (childRisks.indexOf(item) > -1) {
      setChildRisks(childRisks.filter(i => i !== item));
    } else {
      setChildRisks(childRisks.concat(item));
    }
  };

  const toggleMotherRisksDropdown = () => {
    setShowMotherRisksDropdown(!showMotherRisksDropdown);
  };

  const showMotherRisksSummary = () => {
    if (motherRisks.filter(item => !!item).length === 0) {
      return "无";
    }

    return `共${motherRisks.filter(item => !!item).length}项高危因素`;
  };

  const onMotherRisksChange = (e, item) => {
    if (motherRisks.indexOf(item) > -1) {
      setMotherRisks(motherRisks.filter(i => i !== item));
    } else {
      setMotherRisks(motherRisks.concat(item));
    }
  };

  const onFinish = () => {
    if (!router.params.childId) {
      doSave();
    } else {
      doUpdate();
    }
  };

  // 保存新的儿童信息
  const doSave = async () => {
    if (!name.trim() || !birthdayWeight || !parentContact) {
      Notify.open({ color: "danger", message: "请填写所有信息后再保存" });

      return;
    }

    const payload = {
      name,
      gender: gender === "男" ? 1 : 2,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      gestationalWeek,
      gestationalWeekDay,
      birthdayWeight: parseInt(birthdayWeight),
      medicalCardNumber: cardNumber,
      contactPhone: parentContact
    };
    childRisks.length > 0 &&
      (payload.childRisks = childRisks.filter(item => !!item));
    motherRisks.length > 0 &&
      (payload.motherRisks = motherRisks.filter(item => !!item));

    const res = await request({
      url: "/children/save",
      method: "POST",
      data: payload
    });

    if (res.code !== 0) {
      Notify.open({ color: "danger", message: "儿童信息保存失败" });
      return;
    }

    Notify.open({ color: "success", message: "儿童信息保存成功" });

    autoNavigate();
  };

  // 更新当前儿童信息
  const doUpdate = async index => {
    const payload = {
      id: router.params.childId,
      name,
      gender: gender === "男" ? 1 : 2,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      gestationalWeek,
      gestationalWeekDay,
      birthdayWeight: parseInt(birthdayWeight),
      medicalCardNumber: cardNumber,
      contactPhone: parentContact
    };
    childRisks.length > 0 &&
      (payload.childRisks = childRisks.filter(item => !!item));
    motherRisks.length > 0 &&
      (payload.motherRisks = motherRisks.filter(item => !!item));

    const res = await request({
      url: "/children/update",
      method: "POST",
      data: payload
    });

    if (res.code !== 0) {
      Notify.open({ color: "danger", message: "儿童信息更新失败" });
      return;
    }
    Notify.open({ color: "success", message: "儿童信息更新成功" });

    autoNavigate();
  };

  const autoNavigate = () => {
    if (router.params.returnUrl) {
      const url = Base64.decode(router.params.returnUrl);
      console.log("🚀 ~ file: edit.jsx:301 ~ autoNavigate ~ url", url)
      navigateTo({ url });
    }
    const pages = getCurrentPages();

    // let backPageIndex = 0;

    // if (pages.some(page => page.route.includes("pages/evaluate/list"))) {
    //   backPageIndex = pages.findIndex(page =>
    //     page.route.includes("pages/child/choose")
    //   );
    // } else {
    //   backPageIndex = pages.findIndex(page =>
    //     page.route.includes("pages/child/manage")
    //   );
    // }
    // navigateBack({
    //   delta: pages.length - backPageIndex - 1
    // });
    if (pages[pages.length - 3]?.route === "pages/evaluate/list") {
      navigateTo({ url: `/pages/child/choose?code=${router.params.code}` });
    } else {
      navigateTo({ url: "/pages/child/manage" });
    }
  };

  return (
    <View className="index">
      <Notify id="notify" />
      <View className="row name">
        <FieldInput
          label="儿童姓名"
          placeholder="请输入姓名"
          value={name}
          onInput={e => onNameChange(e.target.value)}
        />
      </View>
      <View className="row gender">
        <Picker mode="selector" range={genders} onChange={onGenderChange}>
          <ListItem left="性别" customStyles={customStyle} right={gender} />
        </Picker>
      </View>
      <View className="row birthday">
        <Picker mode="date" value={birthday} onChange={onBirthdayChange}>
          <ListItem
            left="出生日期"
            customStyles={customStyle}
            right={birthday}
          />
        </Picker>
      </View>
      <View className="row gestational-week">
        <Picker
          mode="multiSelector"
          range={gestationalWeeks}
          value={defaultGestationalIndex}
          onColumnChange={onGestationalWeekChange}
        >
          <ListItem
            left="孕周"
            customStyles={customStyle}
            right={`${gestationalWeek} 周 ${gestationalWeekDay} 天`}
          />
        </Picker>
      </View>
      <View className="row">
        <FieldInput
          label="出生体重"
          placeholder="请输入体重"
          value={birthdayWeight}
          onInput={e => onBirthdayWeightChange(e.target.value)}
        />
        <Text className="weight-input">克(g)</Text>
      </View>
      <View className="row">
        <FieldInput
          label="就诊卡号"
          placeholder="请输入就诊卡号，非必填"
          value={cardNumber}
          onInput={e => onCardNumber(e.target.value)}
        />
      </View>
      <View className="row">
        <FieldInput
          label="家长联系方式"
          placeholder="请输入家长联系方式"
          value={parentContact}
          onInput={e => onParentContact(e.target.value)}
        />
      </View>
      <View className="row child-risks">
        <View className="risks">
          <View className="row-inside" onClick={toggleChildRisksDropdown}>
            <Text>儿童高危因素</Text>
            <View className="dropdown">
              <View className="dropdown-text">{showChildRisksSummary()}</View>
              <Image src={DropdownIcon} className="dropdown-icon" />
            </View>
          </View>
        </View>
      </View>
      <View className="row mother-risks">
        <View className="risks">
          <View className="row-inside" onClick={toggleMotherRisksDropdown}>
            <Text>母亲高危因素</Text>
            <View className="dropdown">
              <View className="dropdown-text">{showMotherRisksSummary()}</View>
              <Image src={DropdownIcon} className="dropdown-icon" />
            </View>
          </View>
        </View>
      </View>
      <View className="actions">
        <Button onClick={() => onFinish()} className="confirm">
          保存
        </Button>
      </View>
      {showChildRisksDropdown && (
        <View className="mask child-risks">
          <View
            className={`dropdown-items ${!showChildRisksDropdown && "hidden"}`}
          >
            {allChildRisks.map((item, index) => (
              <View
                className="item"
                key={index}
                onClick={e => onChildRisksChange(e, item)}
              >
                <View className="icon-wrapper">
                  <Image
                    src={CheckedIcon}
                    className={`checked-icon ${childRisks.includes(item) &&
                      "checked"}`}
                  />
                </View>
                <View
                  className={`item-text ${childRisks.includes(item) &&
                    "checked"}`}
                >
                  {item}
                </View>
              </View>
            ))}
            <View className="actions">
              <Button
                onClick={() => setShowChildRisksDropdown(false)}
                className="confirm"
              >
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
      {showMotherRisksDropdown && (
        <View className="mask child-risks">
          <View
            className={`dropdown-items ${!showMotherRisksDropdown && "hidden"}`}
          >
            {allMotherRisks.map((item, index) => (
              <View
                className="item"
                key={index}
                onClick={e => onMotherRisksChange(e, item)}
              >
                <View className="icon-wrapper">
                  <Image
                    src={CheckedIcon}
                    className={`checked-icon ${motherRisks.includes(item) &&
                      "checked"}`}
                  />
                </View>
                <View
                  className={`item-text ${motherRisks.includes(item) &&
                    "checked"}`}
                >
                  {item}
                </View>
              </View>
            ))}
            <View className="actions">
              <Button
                onClick={() => setShowMotherRisksDropdown(false)}
                className="confirm"
              >
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
