var self = (module.exports = {
    isFile: function (object) {
        if (object && typeof object.type != 'undefined' && typeof object.size != 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    isObject: function (val) {
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
    },
    isArray: function (val) {
        return Object.prototype.toString.call(val) === '[object Array]';
    },
    trackingFormUrl: function (form, content, previousKey) {
        self.forEachAny(content, function (ele, index) {
            let key = index;
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }
            if (!ele || self.isFile(ele)) {
                form[key] = ele;
            } else if (self.isArray(ele) && ele.length == 0) {
                form[`${key}[]`] = '';
            } else if (self.isObject(ele) && Object.keys(ele).length == 0) {
                form[`${key}`] = {};
            } else if (self.isArray(ele) || self.isObject(ele)) {
                self.trackingFormUrl(form, ele, key);
            } else {
                form[key] = ele;
            }
        });
    },
    trackingFormData: function (form, content, previousKey) {
        self.forEachAny(content, function (ele, index) {
            let key = index;
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }

            if (!ele || self.isFile(ele)) {
                form.append(key, ele);
            } else if (self.isArray(ele) && ele.length == 0) {
                form.append(`${key}[]`, '');
            } else if (self.isArray(ele) || self.isObject(ele)) {
                self.trackingFormData(form, ele, key);
            } else {
                form.append(key, ele);
            }
        });
    },
})
