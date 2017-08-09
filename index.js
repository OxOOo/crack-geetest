
let GeeTest = require('./src/GeeTest');

module.exports = async function(gt, challenge, site, {debug = false} = {}) {
    return await new GeeTest(debug).Validate(gt, challenge, site);
}