export interface SystemCPU{
    name: string;
    description: string;
    baseUnit: any;
    measurements: [{
        statistic: string,
        value: number
    }];
    availableTags: any[];
}