import * as React from 'react';
import { AppInsightsProps } from '../../webparts/appInsightsDashboard/components/AppInsightsDashboard';
import CustomPivot from '../components/CustomPivot';
import Helper, { IPageViewCountProps } from '../Helper';
import { TimeInterval, TimeSpan } from '../enumHelper';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import {MessageBar, MessageBarType} from 'office-ui-fabric-react/lib/MessageBar';

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
    const [chartData, setChartData] = React.useState<any>(null);
    const [chartOptions, setChartOptions] = React.useState<any>(null);

    const _loadMenus = () => {
        let tsMenus: any[] = props.helper.getTimeSpanMenu();
        setTimeSpanMenus(tsMenus);
        let tiMenus: any[] = props.helper.getTimeIntervalMenu();
        setTimeIntervalMenus(tiMenus);
    };
    const _loadPageViewsCount = async () => {
        let response: IPageViewCountProps[] = await props.helper.getPageViewCount(TimeSpan["30 days"], TimeInterval["1 Day"]);
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
                    display: true,
                    text: "Page Views"
                }
            };
            setChartOptions(options);
            setLoading(false);
        } else {
            setLoading(false);
            setNoData(true);
        }
    };

    React.useEffect(() => {
        if (props.helper) {
            _loadMenus();
            _loadPageViewsCount();
            // Testing
            // setLoading(false);
            // setNoData(true);
        }
    }, [mainProps.AppId, mainProps.AppKey, props.helper]);

    return (
        <div>
            {loading &&
                <>
                    <Spinner label="Loading data..." labelPosition={"bottom"} />
                </>
            }
            {!loading && !noData &&
                <>
                    <div style={{ display: 'flex', padding: '5px' }}>
                        <CustomPivot ShowLabel={true} LabelText={"Show data for last:"} Items={timespanMenus} />
                        <CustomPivot ShowLabel={true} LabelText={"Time Interval:"} Items={timeintervalMenus} />
                    </div>
                    <div>
                        <ChartControl
                            type={ChartType.Line}
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                </>
            }
            {!loading && noData &&
                <MessageBar messageBarType={MessageBarType.error}>{"Sorry no data!!!"}</MessageBar>
            }
        </div>
    );
};

export default PageViews;