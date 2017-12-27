# jos-sdk
京东开放API nodejs sdk

[![npm status](https://nodei.co/npm/jos-sdk.svg?downloads=true&stars=true&downloadRank=true)](https://www.npmjs.com/package/jos-sdk)

## 安装使用

### Install

```
$ npm install jos-sdk
```

### Use Example (获取商品详情)

```
  var jdConfig = {
    accessToken: 'your access token',
    appKey: 'you app key',
    appSecret: 'your app secret'
    format: 'json',
    v: '2.0'
  };
  const client = new JDClient(jdConfig.appKey, jdConfig.appSecret, jdConfig.accessToken)
  const params = ['1090817274', '11024717589']
  // get product info method
  const results = await client.getProductInfo(params)
```

## 开发调试

Install dependencies:

```shell
$ npm install
```
Run em!

```shell
$ npm test
```

### 运行测试用例前需要配置
- 拷贝 ``` test/temp_jdConfig.ts ``` 文件到 ``` test ``` 目录下, 重命名为jdConfig.ts
- 填充好 ``` jdConfig.ts ``` 里需要的配置
