import { Input, InputProps, View } from "@tarojs/components";
import React, { ReactNode, CSSProperties } from "react";
import styles from "./index.module.scss";

export default function FieldInput({
  label,
  customCls,
  rootStyles,
  labelStyles,
  inputStyles,
  ...args
}: {
  label?: ReactNode;
  customCls?: string;
  rootStyles?: CSSProperties;
  labelStyles?: CSSProperties;
  inputStyles?: CSSProperties;
} & InputProps) {
  return (
    <View className={styles.box} style={rootStyles}>
      <View className={styles.label} style={labelStyles}>{label}</View>
      <Input
        {...args}
        className={styles.input}
        style={inputStyles}
        placeholderClass={styles.placeholder}
      />
    </View>
  );
}
