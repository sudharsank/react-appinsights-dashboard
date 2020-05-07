import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
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

    public getPageViewCount = async () => {
        let finalPostUrl: string = this._postUrl + `/metrics/pageViews/count?timespan=PT12H`
        let response: HttpClientResponse = await this.httpClient.get(finalPostUrl, HttpClient.configurations.v1, this.httpClientOptions);
		console.log(response.json());
    }
}