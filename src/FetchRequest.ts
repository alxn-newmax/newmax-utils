import {delay} from './delay';

type FetchDataType ={ 
  url: string;
  method?: string;
  body: object;
  headersOptions: object
  options: object
}

type ReqParamsType = {
  method: string;
  headers: {
    [key: string]: string;
  };
  body?: string;
  [key: string]: any;
}

export class FetchRequest {
  commonHeaders: {
    [key: string]: string
  }
  
  constructor() {
    this.commonHeaders = {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Sec-Ch-Ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    };
  }

  fetchData = async ({ url, method = 'GET', body = {}, headersOptions = {}, options = {} }: FetchDataType) => {
    const reqParams: ReqParamsType = {
      method,
      headers: { ...this.commonHeaders, ...headersOptions },
      ...options,
    };

    if (['POST', 'UPDATE', 'PUT'].includes(method)) {
      reqParams.body = JSON.stringify(body);
    }

    const response = await fetch(url, reqParams);

    if (!response.ok || response.status === 204) {
      return {
        error: { status: response.status, message: response.statusText },
      };
    }

    try {
      const data = await response.json();
      return { data };
    } catch (e) {
      return { data: { status: response.status } };
    }
  };

  fetchErrorLoop = async (caller: string, params: FetchDataType, errStatusBreakList: number[] = []) => {
    errStatusBreakList = [...errStatusBreakList, 429, 500, 502, 504] as number[]
    let errorStatus = 0
    do {
      const { data, error } = await this.fetchData(params);
      if (error && errStatusBreakList.includes(error.status)) {
        if(errorStatus !== error.status) {
          console.log('first')
        }
        errorStatus = error.status
        await delay(3);
        continue;
      }
      return { data, error };
    } while (true);
  };
}

