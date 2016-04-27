/**
 * Created by yoavamit on 27/04/2016.
 */

var queue = [];
var metadata = {};

function add(id) {
    queue.push(id);
}

function addInfo(id, info) {
    metadata[id] = info;
}

function getInfo(id) {
    return metadata[id];
}

function pop() {
    var id = queue.shift();
    return {
        linkId: id,
        info: getInfo(id)
    };
}

function list() {
    return queue;
}

module.exports = {
    add: add,
    pop: pop,
    list: list,
    addInfo: addInfo,
    getInfo: getInfo
};