import * as React from 'react';
import { AppInsightsProps } from '../../webparts/appInsightsDashboard/components/AppInsightsDashboard';
import Helper from '../Helper';

export interface IPageViewsProps {
    helper: Helper;
}

const PageViews: React.FunctionComponent<IPageViewsProps> = (props) => {

    const mainProps = React.useContext(AppInsightsProps);

    React.useEffect(() => {
        if(props.helper) {
            props.helper.getPageViewCount();
        }        
    }, [mainProps.AppId, mainProps.AppKey, props.helper]);

    return (
        <div></div>
    )
};

export default PageViews;