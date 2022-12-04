class Sensor {
    constructor(name, type, bias, scale, bytes_length) {
        this.name = name;
        this.type = type;
        this.bias = bias;
        this.scale = scale;
        this.bytes_length = bytes_length;
    }
}


module.exports = { Sensor };