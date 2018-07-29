const buf = Buffer.concat([
  Buffer.from('FT'),
  Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer),
]);

module.exports = buf;