hex-sha1
=======================

A very short implementation of SHA-1 in JavaScript,  for the nodejs/browser, support String/Buffer.

USAGE
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


LICENSE
=======================

BSDL.  Original code (http://pajhome.org.uk/crypt/md5/sha1.html) is provided under the following license.

```
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
```
