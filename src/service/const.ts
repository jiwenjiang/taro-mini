export enum MediaType {
  PICTURE = 1,
  VIDEO,
  AUDIO
}

export enum GenderType {
  MALE = 1,
  FEMALE
}

export enum ScaleTableCode {
  BRAIN = 9,
  GMS,
  BRAIN_GMS,
  LEIBO_BRAIN,
  LEIBO_GMS,
  Griffiths
}

export enum OrderStatus {
  UNPAID = 1,
  PAID,
  USED,
  CANCELLED
}

export enum EvaluateType {
  MENZHEN = 1,
  ZHUANSHU = 2,
  SHIPIN = 4
}

export enum PaymentType {
  OFFLINE = 1,
  ONLINE
}

export const tabPages = ["/pages/index/index", "pages/mine/index"];

export const FushuAppId = "wxc662de75e52ad4d5";
export const LeiboAppId = "wxb7471fee564e0831";

export enum OrgId {
  ANQIER = "28"
}
