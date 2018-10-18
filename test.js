
let should = require('should');
let crack_geetest = require('./');
let request = require('superagent').agent();

async function testOnce() {
    let config = JSON.parse((await request.get('https://passport.bilibili.com/captcha/gc').query({
        cType: 2,
        vcType: 2,
        _: 1539750486783
    })).text).data;
    // console.log(config);
    should(config.gt).be.a.String().and.not.empty();
    should(config.challenge).be.a.String().and.not.empty();

    let crack = await crack_geetest(config.gt, config.challenge, 'https://passport.bilibili.com/login', { debug: false });
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

async function run() {
    try {
        await test();
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();