import crypto from 'crypto';
import 'should';

import hexSha1 from '../src/hex-sha1';


describe('sha1', () => {
  it('sha1 buffer', async () => {
    const buf = Buffer.concat([
      Buffer.from('FT'),
      Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer),
    ]);
    const sha1 = hexSha1(buf);
    crypto.createHash('sha1').update(buf).digest('hex').should.be.eql(sha1);
    console.log('sha1', sha1);
  });
  it('sha1 string', async () => {
    const str = 'test string.';
    const sha1 = hexSha1(str);
    crypto.createHash('sha1').update(str).digest('hex').should.be.eql(sha1);
    console.log('sha1', sha1);
  });
});