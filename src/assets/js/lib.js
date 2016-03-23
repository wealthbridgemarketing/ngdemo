
/**
 * Performs a date calculation
 *
 * @example myDateObj.calcDiff('month','-',2)
 *          This first example will subtract 2 months from your date object.
 * @example new Date().fromString('2016-02-22').calcDiff('day','+',1).getString(true)
 *          This second example returns a date string: 2016-02-23
 *
 * @param {string} period
 * @param {string} op
 * @param {(string|number)} num
 *
 * @returns {Date}
 */
Date.prototype.calcDiff = function (period, op, num) {
    if (typeofObject(this) !== 'date') return this;

    num = parseInt(num);

    var seconds   = ['s', 'sec', 'second', 'seconds'],
        minutes   = ['min', 'minute', 'minutes'],
        hours     = ['h', 'hour', 'hours'],
        days      = ['d', 'day', 'days'],
        months    = ['mon', 'month', 'months'],
        years     = ['y', 'year', 'years'],

        operators = {
            '+': function (a, b) { return a + b },
            '-': function (a, b) { return a - b }
        },

        dObj      = this.fromString(this.getString());

         if (seconds.indexOf(period) !== -1) dObj.setSeconds(operators[op](dObj.getSeconds(),   num));
    else if (minutes.indexOf(period) !== -1) dObj.setMinutes(operators[op](dObj.getMinutes(),   num));
    else if (hours.indexOf(period)   !== -1) dObj.setHours(operators[op](dObj.getHours(),       num));
    else if (days.indexOf(period)    !== -1) dObj.setDate(operators[op](dObj.getDate(),         num));
    else if (months.indexOf(period)  !== -1) dObj.setMonth(operators[op](dObj.getMonth(),       num));
    else if (years.indexOf(period)   !== -1) dObj.setFullYear(operators[op](dObj.getFullYear(), num));

    return dObj;
};

/**
 * Failsafe method of creating a date object using a string.
 *
 * @example new Date().fromString('2016-02-22');
 * @example new Date().fromString('2016-02-22 16:30:55');
 *
 * @param {string} str - expected format: 'yyyy-mm-dd' or 'yyyy-mm-dd hh:mm:ss'
 *
 * @returns {Date}
 */
Date.prototype.fromString = function (str) {
    var parts, d, t, dateObj;
    if (str.indexOf(' ') !== -1) {
        parts   = str.split(' '),
        d       = parts[0].split('-'),
        t       = parts[1].split(':');
        dateObj = new Date(parseInt(d[0]), parseInt(d[1] - 1), parseInt(d[2]), parseInt(t[0]), parseInt(t[1]), parseInt(t[2]));
    }
    else {
        parts   = str.split('-');
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1] - 1), parseInt(parts[2]));
    }

    return dateObj;
};

/**
 * Returns a string containing a date without the time parts.
 * A date object starts out like this: '2016-02-22T16:30:55.789Z'
 * This function returns it as: 2016-02-22 16:30:55
 * If dateOnly is true it returns it as: 2016-02-22
 *
 * @returns {(string|Date)}
 */
Date.prototype.getString = function (dateOnly) {
    if (typeofObject(this) !== 'date') return this;

    var isoStr = this.toISOString(), dateStr;

    if (!!dateOnly === true) dateStr = isoStr.slice(0, 10);
    else dateStr = isoStr.replace(/[T]/i, ' ').replace(/(\.\d{3}Z)$/i, '');

    return dateStr;
};

/**
 * Safe `typeof` function for objects.
 * 1. Distinguishes null and object types
 * 2. Checks deep object paths
 *
 * @implements {null} - type checking for objects
 * @implements {date} - type checking for objects
 *
 * @example Real Type Checking
 * var opts = {abc: true, def: 'blue', xyz: null, dt: new Date()}
 * typeofObject(opts,'dt') = 'date'
 * typeofObject(opts,'xyz') = 'null' // safest method
 * typeofObject(opts.xyz) = 'null'   // only safe if opts guaranteed not undefined
 *
 * @example Deep Path Checking
 * typeofObject(ajax,'$scope.ajaxui.ani')
 * In this example, the function performs an iterative loop over the path and checks the typeof:
 * ajax, ajax.$scope, ajax.$scope.ajaxui and ajax.$scope.ajaxui.ani - The 'undefined' string is
 * returned if obj or any part of path is undefined, otherwise the typeof ajax.$scope.ajaxui.ani
 * is returned.
 *
 * @param {object} obj
 * @param {string=} path
 *
 * @returns {string}
 */
function typeofObject(obj, path) {
    var realType = function (t, o) {
        if (Object.prototype.toString.call(o) === '[object Date]') return 'date';
        else if (t !== 'object') return t;
        else return o === null ? 'null' : 'object'
    }

    objType = typeof obj;
    if (objType === 'undefined') return 'undefined';          // obj var is not an object
    else if (!!path === false) return realType(objType, obj); // path var not set or generally invalid

    var props = path.split('.'), l = props.length, currObj = obj, objType, i = 0;
    for (; i < l; i++) {
        currObj = currObj[props[i]];
        objType = typeof currObj;
        if (objType === 'undefined') return 'undefined';
    }

    return realType(objType, currObj);
}

/**
 * Fast angular.copy() replacement for large datasets
 *
 * The angular.copy function is extremely slow when dealing with large objects
 * having thousands of lines. This method is massively faster, however, it won't
 * work if the object being copied contains circles, functions or objects other
 * than string/number/plain-object/null.
 *
 * @param {object} source
 */
function copyObject(source) {
    return JSON.parse(JSON.stringify(source));
}