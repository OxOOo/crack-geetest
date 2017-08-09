
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
let moves = require('./moves');

// 5.10.10
module.exports = class GeeTest {

    constructor(debug) {
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
        })).text);
        res.status.should.be.exactly('success');
        res.data.should.be.an.Object();
        res.data.type.should.be.exactly('slide');
        res.data.static_servers.should.be.an.Array().and.not.empty();
        res.data.static_servers[0].should.be.a.String().and.not.empty();
        res.data.path.should.be.a.String();

        this.data_path = res.data.path;
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
            protocol: '',
            type: 'slide',
            path: this.data_path,
            callback: 'geetest_' + this.random()
        };
        let res = this.parse((await this.request.get('https://api.geetest.com/get.php').set(this.header).query(q)).text);
        res.api_server.should.be.a.String().and.not.empty();
        res.version.should.be.exactly('5.10.10');
        res.height.should.be.exactly(116);
        res.xpos.should.be.exactly(0);
        res.bg.should.be.a.String().and.not.empty();
        res.fullbg.should.be.a.String().and.not.empty();
        res.slice.should.be.a.String().and.not.empty();
        res.challenge.should.be.a.String().and.not.empty();
        res.api_server.should.be.exactly('https://api.geetest.com/');

        this.bg_url = this.static_server + res.bg;
        this.fullbg_url = this.static_server + res.fullbg;
        this.slice_url = this.static_server + res.slice;
        this.challenge = res.challenge;
    }

    async runAjax() {
        const ra = function (a, b) { for (var c = b.slice(32), d = [], e = 0; e < c.length; e++) { var f = c.charCodeAt(e); d[e] = f > 57 ? f - 87 : f - 48 } c = 36 * d[0] + d[1]; var g = Math.round(a) + c; b = b.slice(0, 32); var h, i = [[], [], [], [], []], j = {}, k = 0; e = 0; for (var l = b.length; e < l; e++)h = b.charAt(e), j[h] || (j[h] = 1, i[k].push(h), k++ , k = 5 == k ? 0 : k); for (var m, n = g, o = 4, p = "", q = [1, 2, 5, 10, 50]; n > 0;)n - q[o] >= 0 ? (m = parseInt(Math.random() * i[o].length, 10), p += i[o][m], n -= q[o]) : (i.splice(o, 1), q.splice(o, 1), o -= 1); return p }
        const qa = function(arr) {
            let c = function (a) { for (var b, c, d, e = [], f = 0, g = [], h = 0, i = a.length - 1; h < i; h++)b = Math.round(a[h + 1][0] - a[h][0]), c = Math.round(a[h + 1][1] - a[h][1]), d = Math.round(a[h + 1][2] - a[h][2]), g.push([b, c, d]), 0 == b && 0 == c && 0 == d || (0 == b && 0 == c ? f += d : (e.push([b, c, d + f]), f = 0)); return 0 !== f && e.push([b, c, f]), e }
            let d = function (a) { var b = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr", c = b.length, d = "", e = Math.abs(a), f = parseInt(e / c); f >= c && (f = c - 1), f && (d = b.charAt(f)), e %= c; var g = ""; return a < 0 && (g += "!"), d && (g += "$"), g + d + b.charAt(e) }
            let e = function (a) { for (var b = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]], c = "stuvwxyz~", d = 0, e = b.length; d < e; d++)if (a[0] == b[d][0] && a[1] == b[d][1]) return c[d]; return 0 }
            let b, f = c(arr), g = [], h = [], i = [], j = 0, k = f.length;
            for (; j < k; j++) b = e(f[j]), b ? h.push(b) : (g.push(d(f[j][0])), h.push(d(f[j][1]))),
            i.push(d(f[j][2]));
            return g.join("") + "!!" + h.join("") + "!!" + i.join("");
        }

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

        let actions = moves(length);
        let passtime = _.last(actions).time;
        let p = {
            callback: 'geetest_' + this.random(),
            gt: this.gt,
            challenge: this.challenge,
            imgload: _.random(50, 250),
            userresponse: ra(parseInt(length), this.challenge),
            passtime: passtime,
            a: qa(actions.map(o => [o.x, o.y, o.time]))
        };

        let rst = this.parse((await this.request.get('https://api.geetest.com/ajax.php').set(this.header).query(p)).text);
        rst.success.should.be.an.Number();
        if (rst.success === 1) {
            rst.validate.should.be.a.String().and.not.empty();
        }
        
        if (!this.debug) {
            await del(this.files_dir, {force: true});
        }

        return rst.success === 1 ? rst : null;
    }

    downloadImages() {
        return new Promise((resolve, reject) => {
            async.parallel([
                (callback) => {
                    let s = this.request.get(this.bg_url);
                    this.bg_path = path.join(this.files_dir, path.basename(this.bg_url));
                    s.pipe(fs.createWriteStream(this.bg_path));
                    s.on('end', () => callback());
                    s.on('err', callback);
                },
                (callback) => {
                    let s = this.request.get(this.slice_url);
                    this.slice_path = path.join(this.files_dir, path.basename(this.slice_url));
                    s.pipe(fs.createWriteStream(this.slice_path));
                    s.on('end', () => callback());
                    s.on('err', callback);
                },
                (callback) => {
                    let s = this.request.get(this.fullbg_url);
                    this.fullbg_path = path.join(this.files_dir, path.basename(this.fullbg_url));
                    s.pipe(fs.createWriteStream(this.fullbg_path));
                    s.on('end', () => callback());
                    s.on('err', callback);
                },
            ], (err, results) => {
                if (err) reject(err);
                else resolve();
            });
        });
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