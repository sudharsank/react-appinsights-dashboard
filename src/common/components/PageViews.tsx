import * as React from 'react';
import * as strings from 'AppInsightsDashboardWebPartStrings';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { AppInsightsProps } from '../../webparts/appInsightsDashboard/components/AppInsightsDashboard';
import CustomPivot from '../components/CustomPivot';
import Helper, { IPageViewCountProps } from '../Helper';
import { TimeInterval, TimeSpan } from '../enumHelper';
import styles from '../CommonControl.module.scss';

const map: any = require('lodash/map');

export interface IPageViewsProps {
    helper: Helper;
}

const PageViews: React.FunctionComponent<IPageViewsProps> = (props) => {

    const mainProps = React.useContext(AppInsightsProps);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [noData, setNoData] = React.useState<boolean>(false);
    const [timespanMenus, setTimeSpanMenus] = React.useState<any[]>([]);
    const [timeintervalMenus, setTimeIntervalMenus] = React.useState<any[]>([]);
    const [selTimeSpan, setSelTimeSpan] = React.useState<string>('');
    const [selTimeInterval, setSelTimeInterval] = React.useState<string>('');
    const [menuClick, setMenuClick] = React.useState<boolean>(false);
    const [chartData, setChartData] = React.useState<any>(null);
    const [chartOptions, setChartOptions] = React.useState<any>(null);

    const _loadMenus = () => {
        let tsMenus: any[] = props.helper.getTimeSpanMenu();
        setTimeSpanMenus(tsMenus);
        setSelTimeSpan(tsMenus[4].key);
        let tiMenus: any[] = props.helper.getTimeIntervalMenu();
        setTimeIntervalMenus(tiMenus);
        setSelTimeInterval(tiMenus[3].key);
    };
    const handleTimeSpanMenuClick = (item: PivotItem) => {
        setMenuClick(true);
        setSelTimeSpan(item.props.itemKey);
    };
    const handleTimeIntervalMenuClick = (item: PivotItem) => {
        setMenuClick(true);
        setSelTimeInterval(item.props.itemKey);
    };
    const _loadPageViewsCount = async () => {
        if (menuClick) setLoading(true);
        let response: IPageViewCountProps[] = await props.helper.getPageViewCount(TimeSpan[selTimeSpan], TimeInterval[selTimeInterval]);
        if (response.length > 0) {
            const data: Chart.ChartData = {
                labels: map(response, 'date'),
                datasets: [
                    {
                        label: 'Total Page Views:',
                        fill: true,
                        lineTension: 0,
                        data: map(response, 'sum'),
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgb(255, 159, 64)',
                        borderWidth: 1
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
                    text: "Page Views"
                },
                responsive: true,
                animation: {
                    easing: 'easeInQuad'
                }
            };
            setChartOptions(options);
            setLoading(false);
            setMenuClick(false);
        } else {
            setLoading(false);
            setNoData(true);
            setMenuClick(false);
        }
    };

    React.useEffect(() => {
        if (selTimeSpan && selTimeInterval) {
            _loadPageViewsCount();
        }
    }, [selTimeSpan, selTimeInterval]);

    React.useEffect(() => {
        if (props.helper) {
            _loadMenus();
        }
    }, [mainProps.AppId, mainProps.AppKey, props.helper]);

    return (
        <div>
            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                <div className={styles.centerDiv}>{"Page Views"}</div>
            </div>
            <div style={{ display: 'flex', padding: '5px' }}>
                <div className={styles.centerDiv}>
                    <CustomPivot ShowLabel={true} LabelText={"Show data for last:"} Items={timespanMenus} SelectedKey={selTimeSpan} OnMenuClick={handleTimeSpanMenuClick} />
                    <CustomPivot ShowLabel={true} LabelText={"Time Interval:"} Items={timeintervalMenus} SelectedKey={selTimeInterval} OnMenuClick={handleTimeIntervalMenuClick} />
                </div>
            </div>
            {loading &&
                <>
                    <Spinner label="Loading data..." labelPosition={"bottom"} />
                </>
            }
            {!loading && !noData &&
                <>
                    <div className={css("ms-Grid-row", styles.content)}>
                        <div className={"ms-Grid-col ms-xxxl6 ms-xxl6 ms-xl6 ms-lg6"}>
                            {"Data"}
                        </div>
                        <div className={"ms-Grid-col ms-xxxl6 ms-xxl6 ms-xl6 ms-lg6"}>
                            <ChartControl
                                type={ChartType.Line}
                                data={chartData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </>
            }
            {!loading && noData &&
                <MessageBar messageBarType={MessageBarType.error}>{strings.Msg_NoData}</MessageBar>
            }
        </div>
    );
};

export default PageViews;