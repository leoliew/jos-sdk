# jos-sdk
京东开放API nodejs sdk

[![npm status](https://nodei.co/npm/jos-sdk.svg?downloads=true&stars=true&downloadRank=true)](https://www.npmjs.com/package/jos-sdk)

## 安装使用

### Install

```
$ npm install jos-sdk
```

### 获取授权()

请求url如下:
```
https://oauth.jd.com/oauth/token?grant_type=authorization_code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REGISTERED_REDIRECT_URI&code=GET_CODE&state=YOUR_CUSTOM_CODE&client_secret= YOUR_APP_SECRET
```
> **WARNING**: 
- >需要获取assessToken的API需要先授权

### 部分接口说明
- `getProductInfo`- 获取推广商品信息接口
- `commonGet`- 获取通用推广链接
- `orderQuery`- 订单查询接口
- `goodsJingfenQuery`- 京粉精选商品查询接口
- `categoryGoodsGet`- 商品类目查询
- `pidGet`- 获取PID

### 详细API参数请参考
- [开放平台API文档](https://union.jd.com/openplatform/api)

### 使用Demo (获取推广商品信息接口)

```
  var jdConfig = {
    accessToken: 'your access token',   //用户授权token,某些api可不传
    appKey: 'you app key',
    appSecret: 'your app secret'
    format: 'json',                     // 默认json数据传输
    v: '2.0'                            // 默认版本号
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

#### 模拟真实情况运行测试用例前需要配置
- 拷贝 ``` test/temp_jdConfig.ts ``` 文件到 ``` test ``` 目录下, 重命名为jdConfig.ts
- 填充好 ``` jdConfig.ts ``` 里需要的配置
