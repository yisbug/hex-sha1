import hexSha1 from '../dist/main';
import buf from './buffer';

const sha1 = hexSha1(buf);
console.log(sha1);