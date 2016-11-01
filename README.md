# jos-sdk
京东开放API nodejs sdk

## 安装使用

### Install

```
$ npm install jos-sdk
```

### Use

```
  var js_config = {
    access_token: 'your access token',
    app_secret: 'your app secret',
    app_key: 'you app key',
    format: 'json',
    v: '2.0'
  };
  var client = new JDClient(jd_config);
  it('Should be tested', function (done) {
    client.handleAPI("jingdong.service.promotion.goodsInfo", params, function (err, results) {
      var data = JSON.parse(results);
      var ndata = data.jingdong_service_promotion_goodsInfo_responce.getpromotioninfo_result;
      JSON.parse(ndata).result.should.be.an.instanceOf(Array);
      done(err);
    });
  });
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
- 拷贝 ``` test/temp_jd_config.js ``` 文件到 ``` test ``` 目录下, 重命名为jd_config.js
- 填充好 ``` jd_config.js ``` 里需要的配置
