# 极限验证码破解

正确率在 $30\%$ ~ $50\%$ 之间。

适配 geetest-5.10.10

## 安装

```sh
> sudo apt install imagemagick
> npm install
```

## 使用

参见`test.js`

## API

```js
let crack_geetest = require('./');
```

* `crack_geetest(gt, challenge, site, [config])`: 做一次验证，成功则返回验证的结果，否则返回null。
