export function omit(obj, ...keys) {
    let newObj = {};
    for (let k in obj) {
        if (!keys.indexOf(k)) newObj[k] = obj[k];
    }
    return newObj;
}