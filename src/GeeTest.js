
require('should');
let _ = require('lodash');
let del = require('del');
let os = require('os');
let async = require('async');
let path = require('path');
let mzfs = require('mz/fs');
let fs = require('fs');
let gm = require('gm').subClass({imageMagick: true});
let PNG = require('pngjs').PNG;
let CryptoJS = require("crypto-js");
let moves = require('./moves');

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

// 6.0.9
module.exports = class GeeTest {

    constructor(debug) {
        debug.should.be.a.Boolean();

        // config
        this.debug = debug;

        this.request = require('superagent').agent();
        this.header = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
            'Connection': 'keep-alive',
            'Host': 'api.geetest.com',
            'Referer': '',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/59.0.3071.109 Chrome/59.0.3071.109 Safari/537.36'
        };
    }

    // return null if not success
    async Validate(gt, challenge, site) {
        gt.should.be.a.String().and.not.empty();
        challenge.should.be.a.String().and.not.empty();
        site.should.be.a.String().and.not.empty();

        this.header['Referer'] = site;
        this.gt = gt;
        this.challenge = challenge;

        await this.runGetType();
        await this.runGet();
        return await this.runAjax();
    }

    async runGetType() {
        let res = this.parse((await this.request.get('https://api.geetest.com/gettype.php').set(this.header).query({
            gt: this.gt,
            callback: 'geetest_'+this.random()
        }).timeout(2000).retry(10)).text);
        if (this.debug) {
            console.log('=============gettype.php===========');
            console.log(res);
        }
        res.should.have.property('status').exactly('success');
        res.should.have.property('data').be.an.Object();
        res.data.should.have.property('type').exactly('slide');
        res.data.should.have.property('static_servers').an.Array().and.not.empty();
        res.data.static_servers[0].should.be.a.String().and.not.empty();
        res.data.should.have.property('path').a.String();

        this.data_path = res.data.path;
        this.data_pencil = res.data.pencil;
        this.data_voice = res.data.voice;
        this.static_server = 'https://' + res.data.static_servers[0];
        if (!this.static_server.endsWith('/')) this.static_server += '/';
    }

    async runGet() {
        let q = {
            gt: this.gt,
            challenge: this.challenge,
            width: '100%',
            product: 'float',
            offline: false,
            protocol: 'https://',
            type: 'slide',
            pencil: this.data_pencil,
            voice: this.data_voice,
            path: this.data_path,
            callback: 'geetest_' + this.random()
        };
        let res = this.parse((await this.request.get('https://api.geetest.com/get.php').set(this.header).query(q)).text);
        if (this.debug) {
            console.log('=============get.php===========');
            console.log(res);
        }
        res.should.have.property('api_server').exactly('https://api.geetest.com/');
        res.should.have.property('version').exactly('6.0.9');
        res.should.have.property('height').exactly(116);
        res.should.have.property('xpos').exactly(0);
        res.should.have.property('bg').a.String().and.not.empty();
        res.should.have.property('fullbg').a.String().and.not.empty();
        res.should.have.property('slice').a.String().and.not.empty();
        res.should.have.property('challenge').a.String().and.not.empty();

        this.version = res.version;
        this.bg_url = this.static_server + res.bg;
        this.fullbg_url = this.static_server + res.fullbg;
        this.slice_url = this.static_server + res.slice;
        this.challenge = res.challenge;
        this.data_c = res.c;
        this.data_s = res.s;
    }

    async runAjax() {
        let M9r = require('./M9r');

        let user_func = function(L0z, o0z) {
            var c1r = M9r.k9r()[2][7][21];
            while (c1r !== M9r.L9r()[18][12][0]) {
                switch (c1r) {
                case M9r.L9r()[15][39][27]:
                    X0z++;
                    c1r = M9r.k9r()[13][28][42];
                    break;
                case M9r.L9r()[6][22][30]:
                    return x0z;
                    c1r = M9r.L9r()[44][40][0];
                    break;
                case M9r.k9r()[32][7][37][17]:
                    X0z++;
                    c1r = M9r.L9r()[31][47][3];
                    break;
                case M9r.L9r()[20][9][15]:
                    n0z = o0z['charAt'](X0z),
                    Q0z[n0z] || (Q0z[n0z] = 1,
                    f0z[N0z]['push'](n0z),
                    N0z++,
                    N0z = 5 == N0z ? 0 : N0z);
                    Y4r = Y4r >= 19614 ? Y4r / 7 : Y4r * 7;
                    c1r = M9r.L9r()[29][13][28][35];
                    break;
                case M9r.L9r()[16][14][18]:
                    c1r = v0z > 0 && g4r * (g4r + 1) * g4r % 2 == 0 ? M9r.k9r()[19][35][39] : M9r.k9r()[18][46][30];
                    break;
                case M9r.L9r()[26][25][3]:
                    c1r = X0z < i0z && Y4r * (Y4r + 1) * Y4r % 2 == 0 ? M9r.k9r()[31][19][15] : M9r.k9r()[20][33][39];
                    break;
                case M9r.L9r()[14][47][21]:
                    var n0z, f0z = [[], [], [], [], []], Q0z = {}, N0z = 0;
                    X0z = 0;
                    c1r = M9r.L9r()[15][19][15];
                    break;
                case M9r.k9r()[20][42][30]:
                    var j0z = o0z['slice'](32)
                    , c0z = []
                    , X0z = 0;
                    c1r = M9r.L9r()[43][16][42];
                    break;
                case M9r.L9r()[43][27][15]:
                    var i0z = o0z['length'];
                    c1r = M9r.L9r()[0][45][3];
                    break;
                case M9r.L9r()[27][8][1][20]:
                    o0z = o0z['slice'](0, 32);
                    c1r = M9r.L9r()[1][9][21];
                    break;
                case M9r.L9r()[42][40][36]:
                    var K0z = j0z['charCodeAt'](X0z);
                    c0z[X0z] = K0z > 57 ? K0z - 87 : K0z - 48;
                    F4r = F4r >= 10020 ? F4r / 5 : F4r * 5;
                    c1r = M9r.L9r()[0][21][27];
                    break;
                case M9r.k9r()[3][26][0]:
                    g4r = g4r > 32264 ? g4r / 5 : g4r * 5;
                    c1r = M9r.k9r()[25][44][18];
                    break;
                case M9r.k9r()[44][23][33]:
                    j0z = 36 * c0z[0] + c0z[1];
                    var k0z = Math['round'](L0z) + j0z;
                    c1r = M9r.k9r()[47][0][18];
                    break;
                case M9r.L9r()[35][3][39]:
                    var y0z, v0z = k0z, B0z = 4, x0z = '', I0z = [1, 2, 5, 10, 50];
                    c1r = M9r.k9r()[35][40][18];
                    break;
                case M9r.k9r()[26][7][17][13]:
                    var g4r = 6;
                    var Y4r = 7;
                    var F4r = 3;
                    c1r = M9r.k9r()[46][22][30];
                    break;
                case M9r.L9r()[21][44][42]:
                    c1r = X0z < j0z['length'] && F4r * (F4r + 1) % 2 + 6 ? M9r.k9r()[6][16][36] : M9r.k9r()[36][7][33];
                    break;
                case M9r.L9r()[8][25][39]:
                    v0z - I0z[B0z] >= 0 ? (y0z = parseInt(Math['random']() * f0z[B0z]['length'], 10),
                    x0z += f0z[B0z][y0z],
                    v0z -= I0z[B0z]) : (f0z['splice'](B0z, 1),
                    I0z['splice'](B0z, 1),
                    B0z -= 1);
                    c1r = M9r.L9r()[31][34][0];
                    break;
                }
            }
        }
        let s6z = function(F6z) {
            var R1r = M9r.k9r()[2][7][21];
            while (R1r !== M9r.k9r()[4][27][45]) {
                switch (R1r) {
                case M9r.L9r()[31][29][21]:
                    var N5r = 9;
                    R1r = M9r.k9r()[15][42][24];
                    break;
                case M9r.k9r()[29][35][3]:
                    R1r = J6z < l6z && N5r * (N5r + 1) % 2 + 7 ? M9r.L9r()[36][26][30] : M9r.k9r()[5][42][12];
                    break;
                case M9r.L9r()[17][0][30]:
                    Y6z = Math['round'](F6z[J6z + 1][0] - F6z[J6z][0]),
                    g6z = Math['round'](F6z[J6z + 1][1] - F6z[J6z][1]),
                    a6z = Math['round'](F6z[J6z + 1][2] - F6z[J6z][2]),
                    P6z['push']([Y6z, g6z, a6z]),
                    0 == Y6z && 0 == g6z && 0 == a6z || (0 == Y6z && 0 == g6z ? D6z += a6z : (E6z['push']([Y6z, g6z, a6z + D6z]),
                    D6z = 0));
                    N5r = N5r > 34958 ? N5r / 6 : N5r * 6;
                    R1r = M9r.L9r()[2][8][36];
                    break;
                case M9r.k9r()[37][14][24]:
                    var Y6z, g6z, a6z, E6z = [], D6z = 0, P6z = [], J6z = 0, l6z = F6z['length'] - 1;
                    R1r = M9r.k9r()[23][47][3];
                    break;
                case M9r.L9r()[4][36][36]:
                    J6z++;
                    R1r = M9r.L9r()[1][27][3];
                    break;
                case M9r.k9r()[21][26][12]:
                    return 0 !== D6z && E6z['push']([Y6z, g6z, D6z]),
                    E6z;
                    R1r = M9r.k9r()[6][7][45];
                    break;
                }
            }
        }
        let O6z = function(r6z) {
            var C1r = M9r.k9r()[18][39][21];
            while (C1r !== M9r.k9r()[5][12][42]) {
                switch (C1r) {
                case M9r.k9r()[38][31][21]:
                    var d6z = '()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr'
                      , m6z = d6z['length']
                      , Z6z = ''
                      , H6z = Math['abs'](r6z)
                      , W6z = parseInt(H6z / m6z);
                    W6z >= m6z && (W6z = m6z - 1),
                    W6z && (Z6z = d6z['charAt'](W6z)),
                    H6z %= m6z;
                    var q6z = '';
                    return r6z < 0 && (q6z += '!'),
                    Z6z && (q6z += '$'),
                    q6z + Z6z + d6z['charAt'](H6z);
                    C1r = M9r.k9r()[35][0][42];
                    break;
                }
            }
        }
        let u6z = function(R6z) {
            var t8r = M9r.L9r()[17][25][21];
            while (t8r !== M9r.k9r()[5][43][27]) {
                switch (t8r) {
                case M9r.k9r()[8][18][30]:
                    t8r = R6z[0] == z6z[h6z][0] && R6z[1] == z6z[h6z][1] ? M9r.k9r()[42][2][42] : M9r.L9r()[47][14][36];
                    break;
                case M9r.k9r()[25][38][24]:
                    var z6z = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]]
                      , h6z = 0
                      , C6z = z6z['length'];
                    t8r = M9r.k9r()[13][3][3];
                    break;
                case M9r.k9r()[31][29][21][21]:
                    var f5r = 9;
                    t8r = M9r.L9r()[20][16][24];
                    break;
                case M9r.L9r()[27][32][42]:
                    return 'stuvwxyz~'[h6z];
                    t8r = M9r.L9r()[27][15][27];
                    break;
                case M9r.L9r()[14][17][39][27]:
                    t8r = h6z < C6z && f5r * (f5r + 1) % 2 + 7 ? M9r.L9r()[44][42][30] : M9r.k9r()[14][23][45];
                    break;
                case M9r.L9r()[30][8][12]:
                    h6z++;
                    t8r = M9r.k9r()[15][31][3];
                    break;
                case M9r.L9r()[37][9][45]:
                    return 0;
                    t8r = M9r.k9r()[13][11][27];
                    break;
                case M9r.L9r()[41][26][36]:
                    f5r = f5r >= 62252 ? f5r - 6 : f5r + 6;
                    t8r = M9r.k9r()[12][44][12];
                    break;
                }
            }
        };
        let aa_func1 = function(arr) {
            var X8r = M9r.k9r()[45][33][21];
            while (X8r !== M9r.k9r()[34][15][45]) {
                switch (X8r) {
                case M9r.L9r()[41][25][21]:
                    var o5r = 6;
                    X8r = M9r.k9r()[27][18][24];
                    break;
                case M9r.k9r()[4][32][24]:
                    var N1z, X1z = s6z(arr), f1z = [], B1z = [], o1z = [], t1z = 0, j1z = X1z['length'];
                    X8r = M9r.L9r()[4][21][14][13];
                    break;
                case M9r.k9r()[12][37][3]:
                    X8r = o5r * (o5r + 1) % 2 + 8 && t1z < j1z ? M9r.L9r()[20][42][30] : M9r.L9r()[37][10][25][2];
                    break;
                case M9r.k9r()[42][14][30]:
                    N1z = u6z(X1z[t1z]),
                    N1z ? B1z['push'](N1z) : (f1z['push'](O6z(X1z[t1z][0])),
                    B1z['push'](O6z(X1z[t1z][1]))),
                    o1z['push'](O6z(X1z[t1z][2]));
                    o5r = o5r >= 17705 ? o5r / 3 : o5r * 3;
                    X8r = M9r.L9r()[36][4][36];
                    break;
                case M9r.L9r()[18][32][26][16]:
                    return f1z['join']('') + '!!' + B1z['join']('') + '!!' + o1z['join']('');
                    X8r = M9r.L9r()[9][1][45];
                    break;
                case M9r.L9r()[4][36][36]:
                    t1z++;
                    X8r = M9r.k9r()[12][37][3];
                    break;
                }
            }
        }
        let aa_func2 = function(Q1z, v1z, T1z) {
            var B8r = M9r.k9r()[1][41][21];
            while (B8r !== M9r.L9r()[5][36][18]) {
                switch (B8r) {
                case M9r.L9r()[10][16][47][22]:
                    x1z += 2;
                    var n1z = parseInt(i1z, 16)
                      , M1z = String['fromCharCode'](n1z)
                      , I1z = (y1z * n1z * n1z + k1z * n1z + L1z) % Q1z['length'];
                    c1z = c1z['substr'](0, I1z) + M1z + c1z['substr'](I1z);
                    B8r = M9r.L9r()[46][3][33];
                    break;
                case M9r.k9r()[40][11][21]:
                    var K5r = 2;
                    var j5r = 4;
                    B8r = M9r.k9r()[23][47][37][47];
                    break;
                case M9r.k9r()[7][15][3]:
                    B8r = (!v1z || !T1z) && j5r * (j5r + 1) * j5r % 2 == 0 ? M9r.L9r()[1][16][30] : M9r.L9r()[19][16][42];
                    break;
                case M9r.k9r()[2][30][30]:
                    return Q1z;
                    B8r = M9r.L9r()[1][28][18];
                    break;
                case M9r.k9r()[26][11][33]:
                    K5r = K5r > 10375 ? K5r / 8 : K5r * 8;
                    B8r = M9r.k9r()[13][18][36];
                    break;
                case M9r.k9r()[47][14][36]:
                    B8r = (i1z = T1z['substr'](x1z, 2)) && K5r * (K5r + 1) * K5r % 2 == 0 ? M9r.L9r()[16][4][16][20] : M9r.L9r()[47][9][9];
                    break;
                case M9r.k9r()[31][40][42]:
                    var i1z, x1z = 0, c1z = Q1z, y1z = v1z[0], k1z = v1z[2], L1z = v1z[4];
                    B8r = M9r.L9r()[6][16][36];
                    break;
                case M9r.k9r()[24][23][9]:
                    return c1z;
                    B8r = M9r.L9r()[22][34][18];
                    break;
                }
            }
        };

        let encrypt = function encrypt(text, key) {
            let keyd = CryptoJS.enc.Latin1.parse(key);
            let iv = CryptoJS.enc.Latin1.parse("0000000000000000");
            let aesEncryptor = CryptoJS.algo.AES.createEncryptor(keyd, { iv: iv });
            let d = aesEncryptor.finalize(text);
            let rst = [];
            for(let i = 0; i < d.sigBytes; i ++) {
                rst.push( 255 & (d.words[Math.floor(i/4 + 0.1)] >>> (24 - i%4 * 8)));
            }
            return rst;
        }

        let base66 = function(arr) {
            var mmm0 = {"0":"A","65536":"B","131072":"C","196608":"D","262144":"E","327680":"F","393216":"G","458752":"H","524288":"I","589824":"J","655360":"K","720896":"L","786432":"M","851968":"N","917504":"O","983040":"P","2097152":"Q","2162688":"R","2228224":"S","2293760":"T","2359296":"U","2424832":"V","2490368":"W","2555904":"X","2621440":"Y","2686976":"Z","2752512":"a","2818048":"b","2883584":"c","2949120":"d","3014656":"e","3080192":"f","4194304":"g","4259840":"h","4325376":"i","4390912":"j","4456448":"k","4521984":"l","4587520":"m","4653056":"n","4718592":"o","4784128":"p","4849664":"q","4915200":"r","4980736":"s","5046272":"t","5111808":"u","5177344":"v","6291456":"w","6356992":"x","6422528":"y","6488064":"z","6553600":"0","6619136":"1","6684672":"2","6750208":"3","6815744":"4","6881280":"5","6946816":"6","7012352":"7","7077888":"8","7143424":"9","7208960":"(","7274496":")"};
            var mmm1 = {"0":"A","1024":"B","4096":"C","5120":"D","8192":"E","9216":"F","12288":"G","13312":"H","32768":"I","33792":"J","36864":"K","37888":"L","40960":"M","41984":"N","45056":"O","46080":"P","1048576":"Q","1049600":"R","1052672":"S","1053696":"T","1056768":"U","1057792":"V","1060864":"W","1061888":"X","1081344":"Y","1082368":"Z","1085440":"a","1086464":"b","1089536":"c","1090560":"d","1093632":"e","1094656":"f","8388608":"g","8389632":"h","8392704":"i","8393728":"j","8396800":"k","8397824":"l","8400896":"m","8401920":"n","8421376":"o","8422400":"p","8425472":"q","8426496":"r","8429568":"s","8430592":"t","8433664":"u","8434688":"v","9437184":"w","9438208":"x","9441280":"y","9442304":"z","9445376":"0","9446400":"1","9449472":"2","9450496":"3","9469952":"4","9470976":"5","9474048":"6","9475072":"7","9478144":"8","9479168":"9","9482240":"(","9483264":")"};
            var mmm2 = {"0":"A","4":"B","16":"C","20":"D","256":"E","260":"F","272":"G","276":"H","512":"I","516":"J","528":"K","532":"L","768":"M","772":"N","784":"O","788":"P","2048":"Q","2052":"R","2064":"S","2068":"T","2304":"U","2308":"V","2320":"W","2324":"X","2560":"Y","2564":"Z","2576":"a","2580":"b","2816":"c","2820":"d","2832":"e","2836":"f","16384":"g","16388":"h","16400":"i","16404":"j","16640":"k","16644":"l","16656":"m","16660":"n","16896":"o","16900":"p","16912":"q","16916":"r","17152":"s","17156":"t","17168":"u","17172":"v","18432":"w","18436":"x","18448":"y","18452":"z","18688":"0","18692":"1","18704":"2","18708":"3","18944":"4","18948":"5","18960":"6","18964":"7","19200":"8","19204":"9","19216":"(","19220":")"};
            var mmm3 = {"0":"A","1":"B","2":"C","3":"D","8":"E","9":"F","10":"G","11":"H","32":"I","33":"J","34":"K","35":"L","40":"M","41":"N","42":"O","43":"P","64":"Q","65":"R","66":"S","67":"T","72":"U","73":"V","74":"W","75":"X","96":"Y","97":"Z","98":"a","99":"b","104":"c","105":"d","106":"e","107":"f","128":"g","129":"h","130":"i","131":"j","136":"k","137":"l","138":"m","139":"n","160":"o","161":"p","162":"q","163":"r","168":"s","169":"t","170":"u","171":"v","192":"w","193":"x","194":"y","195":"z","200":"0","201":"1","202":"2","203":"3","224":"4","225":"5","226":"6","227":"7","232":"8","233":"9","234":"(","235":")"};
            var mask0 = 7274496;
            var mask1 = 9483264;
            var mask2 = 19220;
            var mask3 = 235;
            let c = 0;
            while(arr.length % 3 != 0) {
                c ++;
                arr.push(0);
            }
            let rst = '';
            for(let i = 0; i < arr.length; i += 3) {
                let value = (arr[i]*256+arr[i+1])*256+arr[i+2];
                rst += mmm0[value & mask0];
                rst += mmm1[value & mask1];
                rst += mmm2[value & mask2];
                rst += mmm3[value & mask3];
            }
            rst = rst.slice(0, rst.length-c);
            while(c > 0) {
                rst = rst + '.';
                c --;
            }
            return rst;
        }
        
        // ============================================================================

        if (this.debug) {
            this.files_dir = String(Math.random());
        } else {
            this.files_dir = path.join(os.tmpdir(), String(Math.random()));
        }
        await mzfs.mkdir(this.files_dir);

        await this.downloadImages();
        this.bg_recover_path = path.join(this.files_dir, 'recover' + path.basename(this.bg_url));
        this.fullbg_recover_path = path.join(this.files_dir, 'recover' + path.basename(this.fullbg_url));
        await this.recoverImage(this.bg_path, this.bg_recover_path);
        await this.recoverImage(this.fullbg_path, this.fullbg_recover_path);

        let length = await this.destination();
        if (this.debug) {
            console.log('destination length:', length);
        }

        let actions = moves(length);
        let passtime = _.last(actions).time;
        
        let F7z = aa_func1(actions.map(o => [o.x, o.y, o.time]));
        F7z = aa_func2(F7z, this.data_c, this.data_s);

        let Y7z = {
            'userresponse': user_func(length, this.challenge),
            'passtime': passtime,
            'imgload': 100,
            'aa': F7z,
            'ep': {v: this.version}
        };

        const KEY = '60b2c35842dd20e5';
        const CTEXT = '5e32137e21e61e0ba40fea738d77c0b79eb4249e8b04f0f09769f3a4d6d61bb231fe174734162e26b6d4ef60534b190548fa9974c3a09c403b087f9a5f5df7bf592841aa40b95afaf7509712c41d776b10e2595af01aa9bc02ac44923a85ac10528d12c8f47ddffdda8c835e80b9d0ea86d31de2b92e5ba6fe05a51af7d1c69a';
        let H7z = CTEXT;
        let q7z = encrypt(JSON.stringify(Y7z), KEY);
        let r7z = base66(q7z);

        let q = {
            gt: this.gt,
            challenge: this.challenge,
            w: r7z + H7z,
            callback: 'geetest_' + this.random(),
        };

        await sleep(passtime + 1000);

        let rst = this.parse((await this.request.get('https://api.geetest.com/ajax.php').set(this.header).query(q)).text);
        rst.should.have.property('success').an.Number();
        if (rst.success === 1) {
            rst.should.have.property('validate').a.String().and.not.empty();
        }
        rst.challenge = this.challenge;
        
        if (!this.debug) {
            await del(this.files_dir, {force: true});
        }

        return rst.success === 1 ? rst : null;
    }

    async downloadImages() {
        await Promise.all([
            (async () => {
                let s = (await this.request.get(this.bg_url).timeout(1000).retry(10)).body;
                this.bg_path = path.join(this.files_dir, path.basename(this.bg_url));
                await mzfs.writeFile(this.bg_path, s);
            })(),
            (async () => {
                let s = (await this.request.get(this.slice_url).timeout(1000).retry(10)).body;
                this.slice_path = path.join(this.files_dir, path.basename(this.slice_url));
                await mzfs.writeFile(this.slice_path, s);
            })(),
            (async () => {
                let s = (await this.request.get(this.fullbg_url).timeout(1000).retry(10)).body;
                this.fullbg_path = path.join(this.files_dir, path.basename(this.fullbg_url));
                await mzfs.writeFile(this.fullbg_path, s);
            })()
        ]);
    }
    recoverImage(input_img, output_img) {
        const n = (function() {
            for (var a, b = "6_11_7_10_4_12_3_1_0_5_2_9_8".split("_"), c = [], d = 0, e = 52; d < e; d++) a = 2 * parseInt(b[parseInt(d % 26 / 2)]) + d % 2,
            parseInt(d / 2) % 2 || (a += d % 2 ? -1 : 1),
            a += d < 26 ? 26 : 0,
            c.push(a);
            return c;
        })();
        const rows = 2, columns = 26, sliceWidth = 10, sliceHeight = 58;
        const tmpdir = path.join(this.files_dir, 'recover' + path.basename(input_img) + '.dir');
        const extname = path.extname(input_img);

        return new Promise((resolve, reject) => {
            async.series([
                (cb) => fs.mkdir(tmpdir, cb),
                (cb) => async.eachOf(n, function(value, i, callback) {
                    let x = value % 26 * 12 + 1;
                    let y = value > 25 ? sliceHeight : 0;
                    gm(input_img).crop(sliceWidth, sliceHeight, x, y).write(tmpdir + '/' + i + extname, callback);
                }, cb),
                (cb) => {
                    let x = gm();
                    for(let j = 0; j < columns; j ++)
                        x.append(tmpdir + '/' + j + extname, true);
                    x.adjoin();
                    x.write(tmpdir + '/' + 'row1' + extname, cb);
                },
                (cb) => {
                    let x = gm();
                    for(let j = 0; j < columns; j ++)
                        x.append(tmpdir + '/' + (columns + j) + extname, true);
                    x.adjoin();
                    x.write(tmpdir + '/' + 'row2' + extname, cb);
                },
                (cb) => gm().append(tmpdir + '/' + 'row1' + extname).append(tmpdir + '/' + 'row2' + extname).write(output_img, cb),
                // (cb) => fs.unlink(tmpdir + '/' + 'row1' + extname, cb),
                // (cb) => fs.unlink(tmpdir + '/' + 'row2' + extname, cb),
                // (cb) => async.eachOf(n, function(value, i, callback) {
                //     fs.unlink(tmpdir + '/' + i + extname, callback);
                // }, cb),
                // (cb) => fs.rmdir(tmpdir, cb),
            ], function(err, results) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
    destination() {
        const width = 26 * 10, height = 2 * 58;
        const threshold = 60;
        const startIndex = 6;

        let buildRGB = function(data) {
            let RGB = function(x, y, c) {
                let idx = (width * x + y) << 2;
                return data[idx + c];
            }
            return RGB;
        }
        return new Promise((resolve, reject) => {
            async.auto({
                BG_RGB: (cb) => {
                    gm(this.bg_recover_path).toBuffer('PNG', (err, buf) => {
                        if (err) return cb(err);

                        let str = new PNG();
                        str.end(buf);

                        str.on("parsed", buffer => {
                            cb(null, buildRGB(buffer));
                        });
                        str.on("error", cb);
                    });
                },
                FULLBG_RGB: (cb) => {
                    gm(this.fullbg_recover_path).toBuffer('PNG', (err, buf) => {
                        if (err) return cb(err);

                        let str = new PNG();
                        str.end(buf);

                        str.on("parsed", buffer => {
                            cb(null, buildRGB(buffer));
                        });
                        str.on("error", cb);
                    });
                },
                DES: ['BG_RGB', 'FULLBG_RGB', ({BG_RGB, FULLBG_RGB}, cb) => {
                    let png = new PNG({width, height});
                    for(let j = 0; j < width; j ++)
                        for(let i = 0; i < height; i ++)
                        {
                            let same = true;
                            for(let c = 0; c < 3; c ++)
                                same = same + Math.abs(BG_RGB(i, j, c) - FULLBG_RGB(i, j, c)) <= threshold;
                            if (!same) return cb(null, j - startIndex);
                        }
                    cb(new Error('no result'));
                }]
            }, function(err, {DES}) {
                if (err) reject(err);
                else resolve(DES);
            });
        });
    }
    random() {
        return parseInt(Math.random() * 10000) + (new Date()).valueOf();
    }
    parse(res) {
        return JSON.parse(/^.*?\((.*)\)$/.exec(res)[1]);
    }
}