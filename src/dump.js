// 用于将谷歌浏览器中的变量导出

function dump(d, onlys) {
    function isType(type) {
        return function (x) {
            return !Array.isArray(x) && typeof(x) == type;
        }
    }
    let isUndefined = isType('undefined');
    let isFunction = isType('function');
    let isObject = isType('object');
    let isBoolean = isType('boolean');
    let isNumber = isType('number');
    let isString = isType('string');
    let isArray = Array.isArray;

    onlys = onlys || Object.keys(d);

    let vars = [];
    let placeholder = [];

    function search(x) {
        for(let v of vars) {
            if (v === x) return;
        }
        vars.push(x);
        if (isUndefined(x) || isBoolean(x) || isNumber(x) || isString(x)) {
            placeholder.push(x);
            return;
        }
        if (isFunction(x)) {
            placeholder.push(x);
        }
        if (isObject(x)) {
            placeholder.push({});
        }
        if (isArray(x)) {
            placeholder.push([]);
        }
        let keys = Object.keys(x);
        if (x == d) keys = onlys;
        for(let key of keys) {
            search(x[key]);
        }
        if (isFunction(x)) {
            for(let key of Object.keys(x.prototype)) {
                search(x.prototype[key]);
            }
        }
        // for(let key of Object.keys(x.__proto__)) {
        //     search(x.__proto__[key]);
        // }
    }
    search(d);

    let lines = [];
    for(let i in vars) {
        lines.push(`var v${i};`);
    }
    for(let i in vars) {
        let x = vars[i];
        if (isUndefined(x)) {
            lines.push(`v${i} = undefined;`);
        }
        if (isBoolean(x) || isNumber(x) || isString(x)) {
            lines.push(`v${i} = ${JSON.stringify(x)};`);
        }
        if (isFunction(x)) {
            lines.push(`v${i} = ${x.toString()};`);
        }
        if (isObject(x)) {
            lines.push(`v${i} = {};`);
        }
        if (isArray(x)) {
            lines.push(`v${i} = [];`);
        }
    }
    for(let i in vars) {
        let x = vars[i];
        if (isFunction(x)) {
            if (x.name) lines.push(`var ${x.name} = v${i};`);
            for(let key of Object.keys(x)) {
                for(let vi in vars) {
                    if (x[key] === vars[vi]) {
                        lines.push(`v${i}['${key}'] = v${vi};`);
                        break;
                    }
                }
            }
            for(let key of Object.keys(x.prototype)) {
                for(let vi in vars) {
                    if (x.prototype[key] === vars[vi]) {
                        lines.push(`v${i}.prototype['${key}'] = v${vi};`);
                        break;
                    }
                }
            }
            // for(let key of Object.keys(x.__proto__)) {
            //     for(let vi in vars) {
            //         if (x.__proto__[key] === vars[vi]) {
            //             lines.push(`v${i}.__proto__['${key}'] = v${vi};`);
            //             break;
            //         }
            //     }
            // }
        }
    }
    for(let i in vars) {
        let x = vars[i];
        if (isObject(x) || isArray(x)) {
            for(let key of Object.keys(x)) {
                for(let vi in vars) {
                    if (x[key] === vars[vi]) {
                        lines.push(`v${i}['${key}'] = v${vi};`);
                        break;
                    }
                }
            }
            // for(let key of Object.keys(x.__proto__)) {
            //     for(let vi in vars) {
            //         if (x.__proto__[key] === vars[vi]) {
            //             lines.push(`v${i}.__proto__['${key}'] = v${vi};`);
            //             break;
            //         }
            //     }
            // }
        }
    }

    return `(function() {\n${lines.join('\n')}\nreturn v0;\n})();`;
}

function dumpClass(d) {
    function isType(type) {
        return function (x) {
            return typeof(x) == type;
        }
    }
    let isUndefined = isType('undefined');
    let isFunction = isType('function');
    let isObject = isType('object');
    let isBoolean = isType('boolean');
    let isNumber = isType('number');
    let isString = isType('string');

    let lines = [];
    let function_name = d.name;

    lines.push(`var ${function_name} = ${d.toString()};`);
    for(let key of Object.keys(d.prototype)) {
        let x = d.prototype[key];
        if (isFunction(x)) {
            lines.push(`${function_name}.prototype['${key}'] = ${x.toString()};`);
        } else {
            lines.push(`${function_name}.prototype['${key}'] = ${JSON.stringify(x)};`);
        }
    }
    for(let key of Object.keys(d)) {
        let x = d[key];
        if (isFunction(x)) {
            lines.push(`${function_name}['${key}'] = ${x.toString()};`);
        } else {
            lines.push(`${function_name}['${key}'] = ${JSON.stringify(x)};`);
        }
    }

    return `(function() {\n${lines.join('\n')}\nreturn ${function_name};\n})();`;
}

// var x = 'abcdef';
// console.log(dump(x));


function trans() {
    let fs = require('fs');
    let path = require('path');
    //let filename = path.join(__dirname, 'GeeTest.js');
    let filename = 'geetest.6.0.9.js';
    // let backup_filename = path.join(__dirname, 'GeeTest.js.bak');
    // if (fs.existsSync(backup_filename)) fs.unlinkSync(backup_filename);
    // fs.copyFileSync(filename, backup_filename);
    let content = fs.readFileSync(filename, 'utf-8');
    let M9r = require('./M9r');
    let reg = /M9r\.\w{3}\(\d+\)/;
    let data;
    while (true)
    {
        data = reg.exec(content);
        if (!data) break;
        let v = eval(data[0]);
        content = content.slice(0, data.index) + `'${v}'` + content.slice(data.index+data[0].length);
    }
    reg = /'(\\x.+?)+'/;
    while (true)
    {
        data = reg.exec(content);
        if (!data) break;
        let v = eval('"' + data[0] + '"');
        content = content.slice(0, data.index) + `${v}` + content.slice(data.index+data[0].length);
    }
    fs.writeFileSync(filename, content);
}
trans();