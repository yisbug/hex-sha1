hex-sha1
=======================

A very short implementation of SHA-1 in JavaScript,  for the nodejs/browser, support String/Buffer.

适用于nodejs和浏览器端的sha1加密实现，支持字符串或者buffer。

INSTALL/安装
=======================

```
npm i hex-sha1 --save
```

or

```
yarn add hex-sha1
```

USAGE/使用
=======================

```
import hexSha1 from 'hex-sha1';
const buf = Buffer.concat([
  Buffer.from('FT'),
  Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer),
]);
console.log(hexSha1(buf)); // Buffer, d9ad653575cd8b307f435d5cb55748b477aa4f12
console.log(hexSha1('test string.')); // String, 92d9bd6ea420b65dc0e7e7aa10fe9673dbbb2e01
```
