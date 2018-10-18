# 极限验证码破解

正确率在 $70\%$ ~ $90\%$ 之间。

适配 geetest-6.0.9

生成轨迹方式：记录一次轨迹，然后每次将记录缩放，代码见`src/moves.js`。

## 安装

```sh
> sudo apt install imagemagick
> npm install
```

## 使用

参见`test.js`。

## API

```js
let crack_geetest = require('./');
```

* `crack_geetest(gt, challenge, site, [config])`: 做一次验证，成功则返回验证的结果和challenge，否则返回null。

## 联系方式

欢迎大家使用私信我交流经验。
