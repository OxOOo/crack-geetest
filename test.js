
require('should');
let crack_geetest = require('./');
let request = require('superagent').agent();

async function testOnce() {
    let config = JSON.parse((await request.get('http://bj.gsxt.gov.cn/pc-geetest/register').query({t: Date.now()})).text);
    config.gt.should.be.a.String().and.not.empty();
    config.challenge.should.be.a.String().and.not.empty();

    let crack = await crack_geetest(config.gt, config.challenge, 'http://bj.gsxt.gov.cn/sydq/loginSydqAction!sydq.dhtml');
    console.log(crack);
    return crack != null;
}

async function test() {
    const T = 30;
    let accepted = 0;
    for(let i = 0; i < T; i ++) {
        if (await testOnce()) accepted ++;
    }
    console.log(accepted, T);
}

test();