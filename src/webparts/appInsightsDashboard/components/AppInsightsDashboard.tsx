import * as React from 'react';
import styles from './AppInsightsDashboard.module.scss';
import * as strings from 'AppInsightsDashboardWebPartStrings';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { DisplayMode } from '@microsoft/sp-core-library';
import { HttpClient } from '@microsoft/sp-http';
import PageViews from '../../../common/components/PageViews';
import Helper from '../../../common/Helper';

export interface IAppInsightsDashboardProps {
	AppId: string;
	AppKey: string;
	DisplayMode: DisplayMode;
	onConfigure: () => void;
	httpClient: HttpClient;
}

export const AppInsightsProps = React.createContext<IAppInsightsDashboardProps>(null);

const AppInsightsDashboard: React.FunctionComponent<IAppInsightsDashboardProps> = (props) => {

	const [helper, setHelper] = React.useState<any>(null);
	
	React.useEffect(() => {
		setHelper(new Helper(props.AppId, props.AppKey, props.httpClient));
	}, [props.AppId, props.AppKey]);

	return (
		<AppInsightsProps.Provider value={props}>
			<div className={styles.appInsightsDashboard}>
				<div className={styles.container}>
					{(!props.AppId || !props.AppKey) ? (
						<Placeholder iconName='Edit'
							iconText={strings.Config_IconText}
							description={props.DisplayMode === DisplayMode.Edit ? strings.Config_Desc : strings.Config_Desc_ReadMode}
							buttonLabel={strings.Config_ButtonText}
							hideButton={props.DisplayMode === DisplayMode.Read}
							onConfigure={props.onConfigure}
						/>
					) : (
							<>
								<div className={styles.row}>
									<PageViews helper={helper} />
								</div>
							</>
						)}
				</div>
			</div>
		</AppInsightsProps.Provider>
	);
};

export default AppInsightsDashboard;

// export default class AppInsightsDashboard extends React.Component<IAppInsightsDashboardProps, {}> {
//   public render(): React.ReactElement<IAppInsightsDashboardProps> {
//     return (
//       <div className={ styles.appInsightsDashboard }>
//         <div className={ styles.container }>
//           <div className={ styles.row }>

//           </div>
//         </div>
//       </div>
//     );
//   }
// }
