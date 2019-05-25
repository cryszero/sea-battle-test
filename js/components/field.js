function field () {
    var fields = [];

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            fields[i][j] = null;
        }
    }

    console.log(fields);

    return fields;
}

module.exports = field;