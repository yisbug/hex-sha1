import buf from 'buffer/';

if (typeof window !== 'undefined') {
  window.Buffer = buf.Buffer;
}

const hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */

/*
*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally
*
* to work around bugs in some JS interpreters.
*
* 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
*
*/
const safeAdd = (x, y) => {
  const lsw = (x & 0xFFFF) + (y & 0xFFFF);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

/*
*
* Perform the appropriate triplet combination function for the current
* iteration
*
* 返回对应F函数的值
*
*/
const sha1Ft = (t, b, c, d) => {
  if (t < 20) { return (b & c) | ((~b) & d); }
  if (t < 40) { return b ^ c ^ d; }
  if (t < 60) { return (b & c) | (b & d) | (c & d); }
  return b ^ c ^ d; // t<80
};

/*
*
* Determine the appropriate additive constant for the current iteration
*
* 返回对应的Kt值
*
*/
const sha1Kt = t => ((t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514);


/*
  *
  * Bitwise rotate a 32-bit number to the left.
  *
  * 32位二进制数循环左移
  *
  */
const rol = (num, cnt) => (num << cnt) | (num >>> (32 - cnt));

/*
*
* Calculate the SHA-1 of an array of big-endian words, and a bit length
*
*/
const coreSha1 = (blockArray) => {
  const x = blockArray; // append padding
  const w = Array(80);

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  let e = -1009589776;

  // 每次处理512位 16*32
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    const olde = e;
    // 对每个512位进行80步操作
    for (let j = 0; j < 80; j += 1) {
      if (j < 16) { w[j] = x[i + j]; } else { w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1); }
      const t = safeAdd(safeAdd(rol(a, 5), sha1Ft(j, b, c, d)), safeAdd(safeAdd(e, w[j]), sha1Kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
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
*
* The standard SHA1 needs the input string to fit into a block
*
* This function align the input string to meet the requirement
*
*/
const alignSHA1 = (str) => {
  const nblk = ((str.length + 8) >> 6) + 1;
  const blks = new Array(nblk * 16);
  let i = 0;
  for (i = 0; i < nblk * 16; i += 1) { blks[i] = 0; }
  for (i = 0; i < str.length; i += 1) { blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8); }
  blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
  blks[nblk * 16 - 1] = str.length * 8;
  return blks;
};

/*
*
* Convert an array of big-endian words to a hex string.
*
*/
const binb2hex = (binarray) => {
  const hexTab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
  let str = '';
  for (let i = 0; i < binarray.length * 4; i += 1) {
    str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
  }
  return str;
};

/*
*
* The main function to calculate message digest
*
*/
const hexSha1 = (s) => {
  let str = '';
  if (typeof s !== 'string') {
    for (let i = 0; i < s.length; i += 1) {
      str += String.fromCharCode(s.readUInt8(i));
    }
  } else {
    str = s;
  }
  return binb2hex(coreSha1(alignSHA1(str)));
};

export default hexSha1;