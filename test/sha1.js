import hexSha1 from '../src/hex-sha1';
import buf from './buffer';

const sha1 = hexSha1(buf);
console.log(sha1);