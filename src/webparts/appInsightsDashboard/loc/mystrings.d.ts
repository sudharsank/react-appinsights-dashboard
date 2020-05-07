declare interface IAppInsightsDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppIdLabel: string;
  AppKeyLabel: string;

  Config_IconText: string;
  Config_Desc: string;
  Config_Desc_ReadMode: string;
  Config_ButtonText: string;
}

declare module 'AppInsightsDashboardWebPartStrings' {
  const strings: IAppInsightsDashboardWebPartStrings;
  export = strings;
}
