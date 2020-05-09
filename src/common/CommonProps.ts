export const defaultDateFormat: string = "MM/DD/YYYY";
export const chartDateFormat: string = "MMM DD, hh:mm A";
export interface IListColProps {
    key: string;
    title: string;
    order: number;
}
export interface IPageViewCountProps {
    oriDate: string;
    date: string;
    sum: number;
}
export interface IPageViewDetailProps {
    oriStartDate: string;
    oriEndDate: string;
    start: string;
    end: string;
    date: string;
    Url: string;
    count: string;
}