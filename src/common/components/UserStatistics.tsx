import * as React from 'react';
import * as strings from 'AppInsightsDashboardWebPartStrings';
import styles from '../CommonControl.module.scss';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { AppInsightsProps } from '../../webparts/appInsightsDashboard/components/AppInsightsDashboard';
import SectionTitle from '../components/SectionTitle';
import Helper from '../Helper';
import { TimeSpan } from '../enumHelper';
import CustomPivot from './CustomPivot';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

const map: any = require('lodash/map');


export interface IUserStatisticsProps {
    helper: Helper;
}

const UserStatistics: React.FunctionComponent<IUserStatisticsProps> = (props) => {

    const mainProps = React.useContext(AppInsightsProps);
    const [loadingChart, setLoadingChart] = React.useState<boolean>(true);
    const [timespanMenus, setTimeSpanMenus] = React.useState<any[]>([]);
    const [selTimeSpan, setSelTimeSpan] = React.useState<string>('');
    const [menuClick, setMenuClick] = React.useState<boolean>(false);
    const [noData, setNoData] = React.useState<boolean>(false);
    const [chartData, setChartData] = React.useState<any>(null);
    const [chartOptions, setChartOptions] = React.useState<any>(null);

    const _loadMenus = () => {
        let tsMenus: any[] = props.helper.getTimeSpanMenu();
        setTimeSpanMenus(tsMenus);
        setSelTimeSpan(tsMenus[4].key);
    };
    const handleTimeSpanMenuClick = (item: PivotItem) => {
        setMenuClick(true);
        setSelTimeSpan(item.props.itemKey);
    };
    const _loadUserStatistics = async () => {
        if (menuClick) setLoadingChart(true);
        let query: string = `
        union pageViews,customEvents
        | summarize Users=dcount(user_Id) by bin(timestamp, 1h)
        | order by timestamp asc
        `;
        let response: any[] = await props.helper.getResponseByQuery(query, TimeSpan[selTimeSpan]);
        if (response.length > 0) {
            let results: any[] = [];
            response.map((res: any[]) => {
                results.push({
                    oriDate: res[0],
                    date: props.helper.getLocalTime(res[0]),
                    sum: res[1]
                });
            });
            const data: Chart.ChartData = {
                labels: map(results, 'date'),
                datasets: [
                    {
                        label: 'Total Users:',
                        fill: true,
                        lineTension: 0,
                        data: map(results, 'sum'),
                    }
                ]
            };
            setChartData(data);
            const options: Chart.ChartOptions = {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: ""
                },
                responsive: true,
                animation: {
                    easing: 'easeInQuad'
                },
                scales:
                {
                    yAxes: [
                        {
                            ticks:
                            {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            };
            setChartOptions(options);
            setLoadingChart(false);
            setMenuClick(false);
        } else {
            setLoadingChart(false);
            setNoData(true);
            setMenuClick(false);
        }
    };

    React.useEffect(() => {
        if (selTimeSpan) {
            setNoData(false);
            _loadUserStatistics();
        }
    }, [selTimeSpan]);
    React.useEffect(() => {
        if (props.helper) {
            _loadMenus();
        }
    }, [mainProps.AppId, mainProps.AppKey, props.helper]);

    return (
        <div>
            <SectionTitle Title={strings.SecTitle_UserStats} />
            <div style={{ display: 'flex', padding: '5px' }}>
                <div className={styles.centerDiv}>
                    <CustomPivot ShowLabel={true} LabelText={strings.Menu_TimeSpan} Items={timespanMenus} SelectedKey={selTimeSpan} OnMenuClick={handleTimeSpanMenuClick} />
                </div>
            </div>
            {!noData &&
                <div className={css("ms-Grid-row", styles.content)}>
                    <div className={"ms-Grid-col ms-xxxl6 ms-xxl6 ms-xl6 ms-lg6"}>
                        {(!loadingChart && !noData) ? (
                            <ChartControl
                                type={ChartType.Bar}
                                data={chartData}
                                options={chartOptions}
                                className={styles.chart}
                            />
                        ) : (
                                <Spinner label={strings.Msg_LoadChart} labelPosition={"bottom"} />
                            )}
                    </div>
                    <div className={"ms-Grid-col ms-xxxl6 ms-xxl6 ms-xl6 ms-lg6"}>

                    </div>
                </div>
            }
            {!loadingChart && noData &&
                <MessageBar messageBarType={MessageBarType.error}>{strings.Msg_NoData}</MessageBar>
            }
        </div>
    );
};

export default UserStatistics;