const buf = Buffer.concat([
  Buffer.from('FT'),
  Buffer.from(new Uint32Array(['1024']).buffer), // 协议ID
  Buffer.from(new Uint8Array([0]).buffer), // 协议格式类型，0为Protobuf格式，1为Json格式
  Buffer.from(new Uint8Array([0]).buffer), // 协议版本，用于迭代兼容, 目前填0
  Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer),
  Buffer.from(new Uint32Array(['1024']).buffer), // 协议ID

]);

module.exports = buf;