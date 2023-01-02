import { Input, InputProps, View } from "@tarojs/components";
import React, { ReactNode } from "react";
import styles from "./index.module.scss";

export default function FieldInput({
  label,
  customCls,
  ...args
}: { label?: ReactNode; customCls?: string } & InputProps) {
  return (
    <View className={styles.box}>
      <View className={styles.label}>{label}</View>
      <Input
        {...args}
        className={styles.input}
        placeholderClass={styles.placeholder}
      />
    </View>
  );
}
