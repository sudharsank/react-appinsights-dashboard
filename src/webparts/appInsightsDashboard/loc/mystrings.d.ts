declare interface IAppInsightsDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppIdLabel: string;
  AppKeyLabel: string;

  Config_IconText: string;
  Config_Desc: string;
  Config_Desc_ReadMode: string;
  Config_ButtonText: string;

  Msg_NoData: string;
  Msg_NoUrl: string;
  Msg_LoadList: string;
  Msg_LoadChart: string;
}

declare module 'AppInsightsDashboardWebPartStrings' {
  const strings: IAppInsightsDashboardWebPartStrings;
  export = strings;
}
