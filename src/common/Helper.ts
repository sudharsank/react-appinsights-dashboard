import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
import { TimeInterval, TimeSpan } from './enumHelper';
import * as moment from 'moment';

export interface IPageViewCountProps {
    oriDate: string;
    date: string;
    sum: number;
}

export default class Helper {
    private _appid: string = '';
    private _appkey: string = '';
    private _postUrl: string = `https://api.applicationinsights.io/v1/apps`;
    private requestHeaders: Headers = new Headers();
    private httpClientOptions: IHttpClientOptions = {};
    private httpClient: HttpClient = null;

    constructor(appid: string, appkey: string, httpclient: HttpClient) {
        this._appid = appid;
        this._appkey = appkey;
        this.httpClient = httpclient;
        this._postUrl = this._postUrl + `/${this._appid}`;
        this.requestHeaders.append('Content-type', 'application/json; charset=utf-8');
        this.requestHeaders.append('x-api-key', this._appkey);
        this.httpClientOptions = { headers: this.requestHeaders };
    }

    public getPageViewCount = async (timespan: TimeSpan, timeinterval: TimeInterval): Promise<IPageViewCountProps[]> => {
        let finalRes: IPageViewCountProps[] = [];
        let finalPostUrl: string = this._postUrl + `/metrics/pageViews/count?timespan=${timespan}&interval=${timeinterval}`;
        let response: HttpClientResponse = await this.httpClient.get(finalPostUrl, HttpClient.configurations.v1, this.httpClientOptions);
        let responseJson: any = await response.json();
        if (responseJson.value && responseJson.value.segments.length > 0) {
            let segments: any[] = responseJson.value.segments;
            segments.map((seg: any) => {
                finalRes.push({
                    oriDate: seg.start,
                    date: moment(seg.start).format("MMM DD, hh:mm A"),
                    sum: seg['pageViews/count'].sum
                });
            });
        }
        console.log(finalRes);
        return finalRes;
    }

    public getTimeSpanMenu = (): any[] => {
        let items: any[] = [];
        Object.keys(TimeSpan).map(key => {
            items.push({
                text: key,
                key: TimeSpan[key]
            });
        });
        return items;
    }

    public getTimeIntervalMenu = (): any[] => {
        let items: any[] = [];
        Object.keys(TimeInterval).map(key => {
            items.push({
                text: key,
                key: TimeSpan[key]
            });
        });
        return items;
    }
}