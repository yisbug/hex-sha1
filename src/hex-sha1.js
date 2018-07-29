/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
import buf from 'buffer/';

if (typeof window !== 'undefined') {
  window.Buffer = buf.Buffer;
}


const { fromCharCode } = String;

/*
* Convert a raw string to an array of big-endian words
* Characters >255 have their high-byte silently ignored.
*/
const rstr2binb = (input) => {
  const output = [];
  // eslint-disable-next-line
  for (let i = 0; i < input.length * 8; i += 8) { output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32); }
  return output;
};

/*
* Convert an array of big-endian words to a string
*/
const binb2rstr = (input) => {
  let output = '';
  // eslint-disable-next-line
  for (let i = 0; i < input.length * 32; i += 8) { output += fromCharCode((input[i >> 5] >> (24 - i % 32)) & 0xFF); }
  return output;
};

/*
* Perform the appropriate triplet combination function for the current
* iteration
*/
const sha1Ft = (t, b, c, d) => {
  // eslint-disable-next-line
  if (t < 20) return (b & c) | ((~b) & d);
  // eslint-disable-next-line
  if (t < 40) return b ^ c ^ d;
  // eslint-disable-next-line
  if (t < 60) return (b & c) | (b & d) | (c & d);
  // eslint-disable-next-line
  return b ^ c ^ d;
};

/*
* Determine the appropriate additive constant for the current iteration
*/
// eslint-disable-next-line
const sha1Kt = t => ((t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514);


/*
* Bitwise rotate a 32-bit number to the left.
*/
// eslint-disable-next-line
const bitRol = (num, cnt) => (num << cnt) | (num >>> (32 - cnt));

/*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally
* to work around bugs in some JS interpreters.
*/
const safeAdd = (x, y) => {
  // eslint-disable-next-line
  const lsw = (x & 0xFFFF) + (y & 0xFFFF);
  // eslint-disable-next-line
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  // eslint-disable-next-line
  return (msw << 16) | (lsw & 0xFFFF);
};
/*
   * Calculate the SHA-1 of an array of big-endian words, and a bit length
   */
const binbSha1 = (x, len) => {
  /* append padding */
  // eslint-disable-next-line
  x[len >> 5] |= 0x80 << (24 - len % 32);
  // eslint-disable-next-line
  x[((len + 64 >> 9) << 4) + 15] = len;

  const w = [];
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  let e = -1009589776;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    const olde = e;

    for (let j = 0; j < 80; j += 1) {
      if (j < 16) {
        w[j] = x[i + j];
      } else {
        // eslint-disable-next-line
        w[j] = bitRol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      const t = safeAdd(
        safeAdd(bitRol(a, 5), sha1Ft(j, b, c, d)),
        safeAdd(safeAdd(e, w[j]), sha1Kt(j)),
      );
      e = d;
      d = c;
      c = bitRol(b, 30);
      b = a;
      a = t;
    }

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
    e = safeAdd(e, olde);
  }
  return [a, b, c, d, e];
};


/*
* Calculate the SHA1 of a raw string
*/
const rstrSha1 = s => binb2rstr(binbSha1(rstr2binb(s), s.length * 8));

/*
     * Convert a raw string to a hex string
     */
const rstr2hex = (input) => {
  let output = '';
  let x;
  for (let i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    // eslint-disable-next-line
    output += ((x >> 4) & 0x0F).toString(16) + (x & 0x0F).toString(16);
  }
  return output;
};

/*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
const str2rstrUtf8 = (input) => {
  let output = '';
  let i = -1;
  let x;
  let y;

  // eslint-disable-next-line
  while (++i < input.length) {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if (x >= 0xD800 && x <= 0xDBFF && y >= 0xDC00 && y <= 0xDFFF) {
      // eslint-disable-next-line
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i += 1;
    }

    /* Encode output as utf-8 */
    if (x <= 0x7F) { output += fromCharCode(x); } else if (x <= 0x7FF) {
      // eslint-disable-next-line
      output += fromCharCode(0xC0 | ((x >> 6) & 0x1F), 0x80 | (x & 0x3F));
    } else if (x <= 0xFFFF) {
      // eslint-disable-next-line
      output += fromCharCode(0xE0 | ((x >> 12) & 0x0F), 0x80 | ((x >> 6) & 0x3F), 0x80 | (x & 0x3F));
    } else if (x <= 0x1FFFFF) {
      // eslint-disable-next-line
      output += fromCharCode(0xF0 | ((x >> 18) & 0x07), 0x80 | ((x >> 12) & 0x3F), 0x80 | ((x >> 6) & 0x3F), 0x80 | (x & 0x3F));
    }
  }
  return output;
};


const hexSha1 = (s) => {
  let str = '';
  if (typeof s !== 'string') {
    for (let i = 0; i < s.length; i += 1) {
      str += String.fromCharCode(s.readUInt8(i));
    }
  } else {
    str = s;
  }
  return rstr2hex(rstrSha1(str2rstrUtf8(str)));
};


export default hexSha1;