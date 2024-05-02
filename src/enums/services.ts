type KeyNames = {
  [key: string]: string
}

export const serviceNames: KeyNames = {
  Action1C: 'Action1C',
  AmazonReport: 'AmazonReport',
  ApiReport: 'ApiReport',
  Innerdata: 'Innerdata',
  Manager: 'Innerdata',
  Mpstats: 'Mpstats',
  NoonReport: 'NoonReport',
  OzonReport: 'OzonReport',
  OzonFinance: 'OzonFinance',
  QrSupplies: 'QrSupplies',
  SelfReport: 'SelfReport',
  SupOrder: 'SupOrder',
  WberFinance: 'WberFinance',
  WberReport: 'WberReport',
  LamdReport: 'LamdReport',
  Mpunion: 'Mpunion',
};

export const serviceTags: KeyNames = {
  [serviceNames.Action1C]: 'ac1c',
  [serviceNames.AmazonReport]: 'amaz',
  [serviceNames.ApiReport]: 'apir',
  [serviceNames.Innerdata]: 'idat',
  [serviceNames.Manager]: 'mngr',
  [serviceNames.Mpstats]: 'stat',
  [serviceNames.NoonReport]: 'noon',
  [serviceNames.OzonReport]: 'ozon',
  [serviceNames.OzonFinance]: 'ozon',
  [serviceNames.QrSupplies]: 'qrsp',
  [serviceNames.SelfReport]: 'self',
  [serviceNames.SupOrder]: 'spor',
  [serviceNames.WberFinance]: 'wbef',
  [serviceNames.WberReport]: 'wber',
  [serviceNames.LamdReport]: 'lamd',
  [serviceNames.Mpunion]: 'mpun',
};

export const schemaNames: KeyNames = {
  amaz_report: 'amaz_report',
  data1c: 'data1c',
  innerdata: 'innerdata',
  lamd_report: 'lamd_report',
  manager: 'manager',
  mpunion: 'mpunion',
  noon_report: 'noon_report',
  ozon_finance: 'ozon_finance',
  ozon_plan: 'ozon_plan',
  ozon_private: 'ozon_private',
  ozon_report: 'ozon_report',
  self: 'self',
  supplier: 'supplier',
  wber_finance: 'wber_finance',
  wber_plan: 'wber_plan',
  wber_private: 'wber_private',
  wber_report: 'wber_report',
};

export const schemaServices: KeyNames = {
  amaz_report: serviceNames.AmazonReport,
  data1c: serviceNames.Action1C,
  innerdata: serviceNames.Innerdata,
  lamd_report: serviceNames.LamdReport,
  manager: serviceNames.Manager,
  mpunion: serviceNames.Mpunion,
  noon_report: serviceNames.NoonReport,
  ozon_finance: serviceNames.OzonFinance,
  ozon_plan: serviceNames.OzonReport,
  ozon_private: serviceNames.OzonReport,
  ozon_report: serviceNames.OzonReport,
  self: serviceNames.SelfReport,
  supplier: serviceNames.SupOrder,
  wber_finance: serviceNames.WberFinance,
  wber_plan: serviceNames.WberReport,
  wber_private: serviceNames.WberReport,
  wber_report: serviceNames.WberReport,
};

export const currencyEnums: KeyNames = {
  SUDI: 'SAR',
  UAEE: 'AED',
  SAR: 'SUDI',
  AED: 'UAEE',
  sa: 'SAR',
  ae: 'AED',
};

export const companyEnums: KeyNames = {
  SUDI: 'sa',
  UAEE: 'ae',
  sa: 'SUDI',
  ae: 'UAEE',
};
