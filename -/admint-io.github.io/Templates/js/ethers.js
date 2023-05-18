
import * as indexFile from "./index.js";
import * as config from "./config.js";

var commonjsGlobal =
    typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
            ? window
            : typeof global !== "undefined"
                ? global
                : typeof self !== "undefined"
                    ? self
                    : {};
function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
        ? x["default"]
        : x;
}
function createCommonjsModule(fn, basedir, module) {
    return (
        (module = {
            path: basedir,
            exports: {},
            require: function (path, base) {
                return commonjsRequire(
                    path,
                    base === undefined || base === null ? module.path : base
                );
            },
        }),
        fn(module, module.exports),
        module.exports
    );
}
function getDefaultExportFromNamespaceIfPresent(n) {
    return n && Object.prototype.hasOwnProperty.call(n, "default")
        ? n["default"]
        : n;
}
function getDefaultExportFromNamespaceIfNotNamed(n) {
    return n &&
        Object.prototype.hasOwnProperty.call(n, "default") &&
        Object.keys(n).length === 1
        ? n["default"]
        : n;
}
function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var a = Object.defineProperty({}, "__esModule", { value: true });
    Object.keys(n).forEach(function (k) {
        var d = Object.getOwnPropertyDescriptor(n, k);
        Object.defineProperty(
            a,
            k,
            d.get
                ? d
                : {
                    enumerable: true,
                    get: function () {
                        return n[k];
                    },
                }
        );
    });
    return a;
}
function commonjsRequire() {
    throw new Error(
        "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
    );
}
var bn = createCommonjsModule(function (module) {
    (function (module, exports) {
        "use strict";
        function assert(val, msg) {
            if (!val) throw new Error(msg || "Assertion failed");
        }
        function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function () { };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
        function BN(number, base, endian) {
            if (BN.isBN(number)) {
                return number;
            }
            this.negative = 0;
            this.words = null;
            this.length = 0;
            this.red = null;
            if (number !== null) {
                if (base === "le" || base === "be") {
                    endian = base;
                    base = 10;
                }
                this._init(number || 0, base || 10, endian || "be");
            }
        }
        if (typeof module === "object") {
            module.exports = BN;
        } else {
            exports.BN = BN;
        }
        BN.BN = BN;
        BN.wordSize = 26;
        var Buffer;
        try {
            if (
                typeof window !== "undefined" &&
                typeof window.Buffer !== "undefined"
            ) {
                Buffer = window.Buffer;
            } else {
                Buffer = null.Buffer;
            }
        } catch (e) { }
        BN.isBN = function isBN(num) {
            if (num instanceof BN) {
                return true;
            }
            return (
                num !== null &&
                typeof num === "object" &&
                num.constructor.wordSize === BN.wordSize &&
                Array.isArray(num.words)
            );
        };
        BN.max = function max(left, right) {
            if (left.cmp(right) > 0) return left;
            return right;
        };
        BN.min = function min(left, right) {
            if (left.cmp(right) < 0) return left;
            return right;
        };
        BN.prototype._init = function init(number, base, endian) {
            if (typeof number === "number") {
                return this._initNumber(number, base, endian);
            }
            if (typeof number === "object") {
                return this._initArray(number, base, endian);
            }
            if (base === "hex") {
                base = 16;
            }
            assert(base === (base | 0) && base >= 2 && base <= 36);
            number = number.toString().replace(/\s+/g, "");
            var start = 0;
            if (number[0] === "-") {
                start++;
                this.negative = 1;
            }
            if (start < number.length) {
                if (base === 16) {
                    this._parseHex(number, start, endian);
                } else {
                    this._parseBase(number, base, start);
                    if (endian === "le") {
                        this._initArray(this.toArray(), base, endian);
                    }
                }
            }
        };
        BN.prototype._initNumber = function _initNumber(number, base, endian) {
            if (number < 0) {
                this.negative = 1;
                number = -number;
            }
            if (number < 67108864) {
                this.words = [number & 67108863];
                this.length = 1;
            } else if (number < 4503599627370496) {
                this.words = [number & 67108863, (number / 67108864) & 67108863];
                this.length = 2;
            } else {
                assert(number < 9007199254740992);
                this.words = [number & 67108863, (number / 67108864) & 67108863, 1];
                this.length = 3;
            }
            if (endian !== "le") return;
            this._initArray(this.toArray(), base, endian);
        };
        BN.prototype._initArray = function _initArray(number, base, endian) {
            assert(typeof number.length === "number");
            if (number.length <= 0) {
                this.words = [0];
                this.length = 1;
                return this;
            }
            this.length = Math.ceil(number.length / 3);
            this.words = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                this.words[i] = 0;
            }
            var j, w;
            var off = 0;
            if (endian === "be") {
                for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
                    w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
                    this.words[j] |= (w << off) & 67108863;
                    this.words[j + 1] = (w >>> (26 - off)) & 67108863;
                    off += 24;
                    if (off >= 26) {
                        off -= 26;
                        j++;
                    }
                }
            } else if (endian === "le") {
                for (i = 0, j = 0; i < number.length; i += 3) {
                    w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
                    this.words[j] |= (w << off) & 67108863;
                    this.words[j + 1] = (w >>> (26 - off)) & 67108863;
                    off += 24;
                    if (off >= 26) {
                        off -= 26;
                        j++;
                    }
                }
            }
            return this.strip();
        };
        function parseHex4Bits(string, index) {
            var c = string.charCodeAt(index);
            if (c >= 65 && c <= 70) {
                return c - 55;
            } else if (c >= 97 && c <= 102) {
                return c - 87;
            } else {
                return (c - 48) & 15;
            }
        }
        function parseHexByte(string, lowerBound, index) {
            var r = parseHex4Bits(string, index);
            if (index - 1 >= lowerBound) {
                r |= parseHex4Bits(string, index - 1) << 4;
            }
            return r;
        }
        BN.prototype._parseHex = function _parseHex(number, start, endian) {
            this.length = Math.ceil((number.length - start) / 6);
            this.words = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                this.words[i] = 0;
            }
            var off = 0;
            var j = 0;
            var w;
            if (endian === "be") {
                for (i = number.length - 1; i >= start; i -= 2) {
                    w = parseHexByte(number, start, i) << off;
                    this.words[j] |= w & 67108863;
                    if (off >= 18) {
                        off -= 18;
                        j += 1;
                        this.words[j] |= w >>> 26;
                    } else {
                        off += 8;
                    }
                }
            } else {
                var parseLength = number.length - start;
                for (
                    i = parseLength % 2 === 0 ? start + 1 : start;
                    i < number.length;
                    i += 2
                ) {
                    w = parseHexByte(number, start, i) << off;
                    this.words[j] |= w & 67108863;
                    if (off >= 18) {
                        off -= 18;
                        j += 1;
                        this.words[j] |= w >>> 26;
                    } else {
                        off += 8;
                    }
                }
            }
            this.strip();
        };
        function parseBase(str, start, end, mul) {
            var r = 0;
            var len = Math.min(str.length, end);
            for (var i = start; i < len; i++) {
                var c = str.charCodeAt(i) - 48;
                r *= mul;
                if (c >= 49) {
                    r += c - 49 + 10;
                } else if (c >= 17) {
                    r += c - 17 + 10;
                } else {
                    r += c;
                }
            }
            return r;
        }
        BN.prototype._parseBase = function _parseBase(number, base, start) {
            this.words = [0];
            this.length = 1;
            for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) {
                limbLen++;
            }
            limbLen--;
            limbPow = (limbPow / base) | 0;
            var total = number.length - start;
            var mod = total % limbLen;
            var end = Math.min(total, total - mod) + start;
            var word = 0;
            for (var i = start; i < end; i += limbLen) {
                word = parseBase(number, i, i + limbLen, base);
                this.imuln(limbPow);
                if (this.words[0] + word < 67108864) {
                    this.words[0] += word;
                } else {
                    this._iaddn(word);
                }
            }
            if (mod !== 0) {
                var pow = 1;
                word = parseBase(number, i, number.length, base);
                for (i = 0; i < mod; i++) {
                    pow *= base;
                }
                this.imuln(pow);
                if (this.words[0] + word < 67108864) {
                    this.words[0] += word;
                } else {
                    this._iaddn(word);
                }
            }
            this.strip();
        };
        BN.prototype.copy = function copy(dest) {
            dest.words = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                dest.words[i] = this.words[i];
            }
            dest.length = this.length;
            dest.negative = this.negative;
            dest.red = this.red;
        };
        BN.prototype.clone = function clone() {
            var r = new BN(null);
            this.copy(r);
            return r;
        };
        BN.prototype._expand = function _expand(size) {
            while (this.length < size) {
                this.words[this.length++] = 0;
            }
            return this;
        };
        BN.prototype.strip = function strip() {
            while (this.length > 1 && this.words[this.length - 1] === 0) {
                this.length--;
            }
            return this._normSign();
        };
        BN.prototype._normSign = function _normSign() {
            if (this.length === 1 && this.words[0] === 0) {
                this.negative = 0;
            }
            return this;
        };
        BN.prototype.inspect = function inspect() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        };
        var zeros = [
            "",
            "0",
            "00",
            "000",
            "0000",
            "00000",
            "000000",
            "0000000",
            "00000000",
            "000000000",
            "0000000000",
            "00000000000",
            "000000000000",
            "0000000000000",
            "00000000000000",
            "000000000000000",
            "0000000000000000",
            "00000000000000000",
            "000000000000000000",
            "0000000000000000000",
            "00000000000000000000",
            "000000000000000000000",
            "0000000000000000000000",
            "00000000000000000000000",
            "000000000000000000000000",
            "0000000000000000000000000",
        ];
        var groupSizes = [
            0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5,
            5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        ];
        var groupBases = [
            0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607,
            16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625,
            16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343,
            7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151,
            33554432, 39135393, 45435424, 52521875, 60466176,
        ];
        BN.prototype.toString = function toString(base, padding) {
            base = base || 10;
            padding = padding | 0 || 1;
            var out;
            if (base === 16 || base === "hex") {
                out = "";
                var off = 0;
                var carry = 0;
                for (var i = 0; i < this.length; i++) {
                    var w = this.words[i];
                    var word = (((w << off) | carry) & 16777215).toString(16);
                    carry = (w >>> (24 - off)) & 16777215;
                    if (carry !== 0 || i !== this.length - 1) {
                        out = zeros[6 - word.length] + word + out;
                    } else {
                        out = word + out;
                    }
                    off += 2;
                    if (off >= 26) {
                        off -= 26;
                        i--;
                    }
                }
                if (carry !== 0) {
                    out = carry.toString(16) + out;
                }
                while (out.length % padding !== 0) {
                    out = "0" + out;
                }
                if (this.negative !== 0) {
                    out = "-" + out;
                }
                return out;
            }
            if (base === (base | 0) && base >= 2 && base <= 36) {
                var groupSize = groupSizes[base];
                var groupBase = groupBases[base];
                out = "";
                var c = this.clone();
                c.negative = 0;
                while (!c.isZero()) {
                    var r = c.modn(groupBase).toString(base);
                    c = c.idivn(groupBase);
                    if (!c.isZero()) {
                        out = zeros[groupSize - r.length] + r + out;
                    } else {
                        out = r + out;
                    }
                }
                if (this.isZero()) {
                    out = "0" + out;
                }
                while (out.length % padding !== 0) {
                    out = "0" + out;
                }
                if (this.negative !== 0) {
                    out = "-" + out;
                }
                return out;
            }
            assert(false, "Base should be between 2 and 36");
        };
        BN.prototype.toNumber = function toNumber() {
            var ret = this.words[0];
            if (this.length === 2) {
                ret += this.words[1] * 67108864;
            } else if (this.length === 3 && this.words[2] === 1) {
                ret += 4503599627370496 + this.words[1] * 67108864;
            } else if (this.length > 2) {
                assert(false, "Number can only safely store up to 53 bits");
            }
            return this.negative !== 0 ? -ret : ret;
        };
        BN.prototype.toJSON = function toJSON() {
            return this.toString(16);
        };
        BN.prototype.toBuffer = function toBuffer(endian, length) {
            assert(typeof Buffer !== "undefined");
            return this.toArrayLike(Buffer, endian, length);
        };
        BN.prototype.toArray = function toArray(endian, length) {
            return this.toArrayLike(Array, endian, length);
        };
        BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
            var byteLength = this.byteLength();
            var reqLength = length || Math.max(1, byteLength);
            assert(byteLength <= reqLength, "byte array longer than desired length");
            assert(reqLength > 0, "Requested array length <= 0");
            this.strip();
            var littleEndian = endian === "le";
            var res = new ArrayType(reqLength);
            var b, i;
            var q = this.clone();
            if (!littleEndian) {
                for (i = 0; i < reqLength - byteLength; i++) {
                    res[i] = 0;
                }
                for (i = 0; !q.isZero(); i++) {
                    b = q.andln(255);
                    q.iushrn(8);
                    res[reqLength - i - 1] = b;
                }
            } else {
                for (i = 0; !q.isZero(); i++) {
                    b = q.andln(255);
                    q.iushrn(8);
                    res[i] = b;
                }
                for (; i < reqLength; i++) {
                    res[i] = 0;
                }
            }
            return res;
        };
        if (Math.clz32) {
            BN.prototype._countBits = function _countBits(w) {
                return 32 - Math.clz32(w);
            };
        } else {
            BN.prototype._countBits = function _countBits(w) {
                var t = w;
                var r = 0;
                if (t >= 4096) {
                    r += 13;
                    t >>>= 13;
                }
                if (t >= 64) {
                    r += 7;
                    t >>>= 7;
                }
                if (t >= 8) {
                    r += 4;
                    t >>>= 4;
                }
                if (t >= 2) {
                    r += 2;
                    t >>>= 2;
                }
                return r + t;
            };
        }
        BN.prototype._zeroBits = function _zeroBits(w) {
            if (w === 0) return 26;
            var t = w;
            var r = 0;
            if ((t & 8191) === 0) {
                r += 13;
                t >>>= 13;
            }
            if ((t & 127) === 0) {
                r += 7;
                t >>>= 7;
            }
            if ((t & 15) === 0) {
                r += 4;
                t >>>= 4;
            }
            if ((t & 3) === 0) {
                r += 2;
                t >>>= 2;
            }
            if ((t & 1) === 0) {
                r++;
            }
            return r;
        };
        BN.prototype.bitLength = function bitLength() {
            var w = this.words[this.length - 1];
            var hi = this._countBits(w);
            return (this.length - 1) * 26 + hi;
        };
        function toBitArray(num) {
            var w = new Array(num.bitLength());
            for (var bit = 0; bit < w.length; bit++) {
                var off = (bit / 26) | 0;
                var wbit = bit % 26;
                w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
            }
            return w;
        }
        BN.prototype.zeroBits = function zeroBits() {
            if (this.isZero()) return 0;
            var r = 0;
            for (var i = 0; i < this.length; i++) {
                var b = this._zeroBits(this.words[i]);
                r += b;
                if (b !== 26) break;
            }
            return r;
        };
        BN.prototype.byteLength = function byteLength() {
            return Math.ceil(this.bitLength() / 8);
        };
        BN.prototype.toTwos = function toTwos(width) {
            if (this.negative !== 0) {
                return this.abs().inotn(width).iaddn(1);
            }
            return this.clone();
        };
        BN.prototype.fromTwos = function fromTwos(width) {
            if (this.testn(width - 1)) {
                return this.notn(width).iaddn(1).ineg();
            }
            return this.clone();
        };
        BN.prototype.isNeg = function isNeg() {
            return this.negative !== 0;
        };
        BN.prototype.neg = function neg() {
            return this.clone().ineg();
        };
        BN.prototype.ineg = function ineg() {
            if (!this.isZero()) {
                this.negative ^= 1;
            }
            return this;
        };
        BN.prototype.iuor = function iuor(num) {
            while (this.length < num.length) {
                this.words[this.length++] = 0;
            }
            for (var i = 0; i < num.length; i++) {
                this.words[i] = this.words[i] | num.words[i];
            }
            return this.strip();
        };
        BN.prototype.ior = function ior(num) {
            assert((this.negative | num.negative) === 0);
            return this.iuor(num);
        };
        BN.prototype.or = function or(num) {
            if (this.length > num.length) return this.clone().ior(num);
            return num.clone().ior(this);
        };
        BN.prototype.uor = function uor(num) {
            if (this.length > num.length) return this.clone().iuor(num);
            return num.clone().iuor(this);
        };
        BN.prototype.iuand = function iuand(num) {
            var b;
            if (this.length > num.length) {
                b = num;
            } else {
                b = this;
            }
            for (var i = 0; i < b.length; i++) {
                this.words[i] = this.words[i] & num.words[i];
            }
            this.length = b.length;
            return this.strip();
        };
        BN.prototype.iand = function iand(num) {
            assert((this.negative | num.negative) === 0);
            return this.iuand(num);
        };
        BN.prototype.and = function and(num) {
            if (this.length > num.length) return this.clone().iand(num);
            return num.clone().iand(this);
        };
        BN.prototype.uand = function uand(num) {
            if (this.length > num.length) return this.clone().iuand(num);
            return num.clone().iuand(this);
        };
        BN.prototype.iuxor = function iuxor(num) {
            var a;
            var b;
            if (this.length > num.length) {
                a = this;
                b = num;
            } else {
                a = num;
                b = this;
            }
            for (var i = 0; i < b.length; i++) {
                this.words[i] = a.words[i] ^ b.words[i];
            }
            if (this !== a) {
                for (; i < a.length; i++) {
                    this.words[i] = a.words[i];
                }
            }
            this.length = a.length;
            return this.strip();
        };
        BN.prototype.ixor = function ixor(num) {
            assert((this.negative | num.negative) === 0);
            return this.iuxor(num);
        };
        BN.prototype.xor = function xor(num) {
            if (this.length > num.length) return this.clone().ixor(num);
            return num.clone().ixor(this);
        };
        BN.prototype.uxor = function uxor(num) {
            if (this.length > num.length) return this.clone().iuxor(num);
            return num.clone().iuxor(this);
        };
        BN.prototype.inotn = function inotn(width) {
            assert(typeof width === "number" && width >= 0);
            var bytesNeeded = Math.ceil(width / 26) | 0;
            var bitsLeft = width % 26;
            this._expand(bytesNeeded);
            if (bitsLeft > 0) {
                bytesNeeded--;
            }
            for (var i = 0; i < bytesNeeded; i++) {
                this.words[i] = ~this.words[i] & 67108863;
            }
            if (bitsLeft > 0) {
                this.words[i] = ~this.words[i] & (67108863 >> (26 - bitsLeft));
            }
            return this.strip();
        };
        BN.prototype.notn = function notn(width) {
            return this.clone().inotn(width);
        };
        BN.prototype.setn = function setn(bit, val) {
            assert(typeof bit === "number" && bit >= 0);
            var off = (bit / 26) | 0;
            var wbit = bit % 26;
            this._expand(off + 1);
            if (val) {
                this.words[off] = this.words[off] | (1 << wbit);
            } else {
                this.words[off] = this.words[off] & ~(1 << wbit);
            }
            return this.strip();
        };
        BN.prototype.iadd = function iadd(num) {
            var r;
            if (this.negative !== 0 && num.negative === 0) {
                this.negative = 0;
                r = this.isub(num);
                this.negative ^= 1;
                return this._normSign();
            } else if (this.negative === 0 && num.negative !== 0) {
                num.negative = 0;
                r = this.isub(num);
                num.negative = 1;
                return r._normSign();
            }
            var a, b;
            if (this.length > num.length) {
                a = this;
                b = num;
            } else {
                a = num;
                b = this;
            }
            var carry = 0;
            for (var i = 0; i < b.length; i++) {
                r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
                this.words[i] = r & 67108863;
                carry = r >>> 26;
            }
            for (; carry !== 0 && i < a.length; i++) {
                r = (a.words[i] | 0) + carry;
                this.words[i] = r & 67108863;
                carry = r >>> 26;
            }
            this.length = a.length;
            if (carry !== 0) {
                this.words[this.length] = carry;
                this.length++;
            } else if (a !== this) {
                for (; i < a.length; i++) {
                    this.words[i] = a.words[i];
                }
            }
            return this;
        };
        BN.prototype.add = function add(num) {
            var res;
            if (num.negative !== 0 && this.negative === 0) {
                num.negative = 0;
                res = this.sub(num);
                num.negative ^= 1;
                return res;
            } else if (num.negative === 0 && this.negative !== 0) {
                this.negative = 0;
                res = num.sub(this);
                this.negative = 1;
                return res;
            }
            if (this.length > num.length) return this.clone().iadd(num);
            return num.clone().iadd(this);
        };
        BN.prototype.isub = function isub(num) {
            if (num.negative !== 0) {
                num.negative = 0;
                var r = this.iadd(num);
                num.negative = 1;
                return r._normSign();
            } else if (this.negative !== 0) {
                this.negative = 0;
                this.iadd(num);
                this.negative = 1;
                return this._normSign();
            }
            var cmp = this.cmp(num);
            if (cmp === 0) {
                this.negative = 0;
                this.length = 1;
                this.words[0] = 0;
                return this;
            }
            var a, b;
            if (cmp > 0) {
                a = this;
                b = num;
            } else {
                a = num;
                b = this;
            }
            var carry = 0;
            for (var i = 0; i < b.length; i++) {
                r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
                carry = r >> 26;
                this.words[i] = r & 67108863;
            }
            for (; carry !== 0 && i < a.length; i++) {
                r = (a.words[i] | 0) + carry;
                carry = r >> 26;
                this.words[i] = r & 67108863;
            }
            if (carry === 0 && i < a.length && a !== this) {
                for (; i < a.length; i++) {
                    this.words[i] = a.words[i];
                }
            }
            this.length = Math.max(this.length, i);
            if (a !== this) {
                this.negative = 1;
            }
            return this.strip();
        };
        BN.prototype.sub = function sub(num) {
            return this.clone().isub(num);
        };
        function smallMulTo(self, num, out) {
            out.negative = num.negative ^ self.negative;
            var len = (self.length + num.length) | 0;
            out.length = len;
            len = (len - 1) | 0;
            var a = self.words[0] | 0;
            var b = num.words[0] | 0;
            var r = a * b;
            var lo = r & 67108863;
            var carry = (r / 67108864) | 0;
            out.words[0] = lo;
            for (var k = 1; k < len; k++) {
                var ncarry = carry >>> 26;
                var rword = carry & 67108863;
                var maxJ = Math.min(k, num.length - 1);
                for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
                    var i = (k - j) | 0;
                    a = self.words[i] | 0;
                    b = num.words[j] | 0;
                    r = a * b + rword;
                    ncarry += (r / 67108864) | 0;
                    rword = r & 67108863;
                }
                out.words[k] = rword | 0;
                carry = ncarry | 0;
            }
            if (carry !== 0) {
                out.words[k] = carry | 0;
            } else {
                out.length--;
            }
            return out.strip();
        }
        var comb10MulTo = function comb10MulTo(self, num, out) {
            var a = self.words;
            var b = num.words;
            var o = out.words;
            var c = 0;
            var lo;
            var mid;
            var hi;
            var a0 = a[0] | 0;
            var al0 = a0 & 8191;
            var ah0 = a0 >>> 13;
            var a1 = a[1] | 0;
            var al1 = a1 & 8191;
            var ah1 = a1 >>> 13;
            var a2 = a[2] | 0;
            var al2 = a2 & 8191;
            var ah2 = a2 >>> 13;
            var a3 = a[3] | 0;
            var al3 = a3 & 8191;
            var ah3 = a3 >>> 13;
            var a4 = a[4] | 0;
            var al4 = a4 & 8191;
            var ah4 = a4 >>> 13;
            var a5 = a[5] | 0;
            var al5 = a5 & 8191;
            var ah5 = a5 >>> 13;
            var a6 = a[6] | 0;
            var al6 = a6 & 8191;
            var ah6 = a6 >>> 13;
            var a7 = a[7] | 0;
            var al7 = a7 & 8191;
            var ah7 = a7 >>> 13;
            var a8 = a[8] | 0;
            var al8 = a8 & 8191;
            var ah8 = a8 >>> 13;
            var a9 = a[9] | 0;
            var al9 = a9 & 8191;
            var ah9 = a9 >>> 13;
            var b0 = b[0] | 0;
            var bl0 = b0 & 8191;
            var bh0 = b0 >>> 13;
            var b1 = b[1] | 0;
            var bl1 = b1 & 8191;
            var bh1 = b1 >>> 13;
            var b2 = b[2] | 0;
            var bl2 = b2 & 8191;
            var bh2 = b2 >>> 13;
            var b3 = b[3] | 0;
            var bl3 = b3 & 8191;
            var bh3 = b3 >>> 13;
            var b4 = b[4] | 0;
            var bl4 = b4 & 8191;
            var bh4 = b4 >>> 13;
            var b5 = b[5] | 0;
            var bl5 = b5 & 8191;
            var bh5 = b5 >>> 13;
            var b6 = b[6] | 0;
            var bl6 = b6 & 8191;
            var bh6 = b6 >>> 13;
            var b7 = b[7] | 0;
            var bl7 = b7 & 8191;
            var bh7 = b7 >>> 13;
            var b8 = b[8] | 0;
            var bl8 = b8 & 8191;
            var bh8 = b8 >>> 13;
            var b9 = b[9] | 0;
            var bl9 = b9 & 8191;
            var bh9 = b9 >>> 13;
            out.negative = self.negative ^ num.negative;
            out.length = 19;
            lo = Math.imul(al0, bl0);
            mid = Math.imul(al0, bh0);
            mid = (mid + Math.imul(ah0, bl0)) | 0;
            hi = Math.imul(ah0, bh0);
            var w0 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
            w0 &= 67108863;
            lo = Math.imul(al1, bl0);
            mid = Math.imul(al1, bh0);
            mid = (mid + Math.imul(ah1, bl0)) | 0;
            hi = Math.imul(ah1, bh0);
            lo = (lo + Math.imul(al0, bl1)) | 0;
            mid = (mid + Math.imul(al0, bh1)) | 0;
            mid = (mid + Math.imul(ah0, bl1)) | 0;
            hi = (hi + Math.imul(ah0, bh1)) | 0;
            var w1 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
            w1 &= 67108863;
            lo = Math.imul(al2, bl0);
            mid = Math.imul(al2, bh0);
            mid = (mid + Math.imul(ah2, bl0)) | 0;
            hi = Math.imul(ah2, bh0);
            lo = (lo + Math.imul(al1, bl1)) | 0;
            mid = (mid + Math.imul(al1, bh1)) | 0;
            mid = (mid + Math.imul(ah1, bl1)) | 0;
            hi = (hi + Math.imul(ah1, bh1)) | 0;
            lo = (lo + Math.imul(al0, bl2)) | 0;
            mid = (mid + Math.imul(al0, bh2)) | 0;
            mid = (mid + Math.imul(ah0, bl2)) | 0;
            hi = (hi + Math.imul(ah0, bh2)) | 0;
            var w2 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
            w2 &= 67108863;
            lo = Math.imul(al3, bl0);
            mid = Math.imul(al3, bh0);
            mid = (mid + Math.imul(ah3, bl0)) | 0;
            hi = Math.imul(ah3, bh0);
            lo = (lo + Math.imul(al2, bl1)) | 0;
            mid = (mid + Math.imul(al2, bh1)) | 0;
            mid = (mid + Math.imul(ah2, bl1)) | 0;
            hi = (hi + Math.imul(ah2, bh1)) | 0;
            lo = (lo + Math.imul(al1, bl2)) | 0;
            mid = (mid + Math.imul(al1, bh2)) | 0;
            mid = (mid + Math.imul(ah1, bl2)) | 0;
            hi = (hi + Math.imul(ah1, bh2)) | 0;
            lo = (lo + Math.imul(al0, bl3)) | 0;
            mid = (mid + Math.imul(al0, bh3)) | 0;
            mid = (mid + Math.imul(ah0, bl3)) | 0;
            hi = (hi + Math.imul(ah0, bh3)) | 0;
            var w3 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
            w3 &= 67108863;
            lo = Math.imul(al4, bl0);
            mid = Math.imul(al4, bh0);
            mid = (mid + Math.imul(ah4, bl0)) | 0;
            hi = Math.imul(ah4, bh0);
            lo = (lo + Math.imul(al3, bl1)) | 0;
            mid = (mid + Math.imul(al3, bh1)) | 0;
            mid = (mid + Math.imul(ah3, bl1)) | 0;
            hi = (hi + Math.imul(ah3, bh1)) | 0;
            lo = (lo + Math.imul(al2, bl2)) | 0;
            mid = (mid + Math.imul(al2, bh2)) | 0;
            mid = (mid + Math.imul(ah2, bl2)) | 0;
            hi = (hi + Math.imul(ah2, bh2)) | 0;
            lo = (lo + Math.imul(al1, bl3)) | 0;
            mid = (mid + Math.imul(al1, bh3)) | 0;
            mid = (mid + Math.imul(ah1, bl3)) | 0;
            hi = (hi + Math.imul(ah1, bh3)) | 0;
            lo = (lo + Math.imul(al0, bl4)) | 0;
            mid = (mid + Math.imul(al0, bh4)) | 0;
            mid = (mid + Math.imul(ah0, bl4)) | 0;
            hi = (hi + Math.imul(ah0, bh4)) | 0;
            var w4 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
            w4 &= 67108863;
            lo = Math.imul(al5, bl0);
            mid = Math.imul(al5, bh0);
            mid = (mid + Math.imul(ah5, bl0)) | 0;
            hi = Math.imul(ah5, bh0);
            lo = (lo + Math.imul(al4, bl1)) | 0;
            mid = (mid + Math.imul(al4, bh1)) | 0;
            mid = (mid + Math.imul(ah4, bl1)) | 0;
            hi = (hi + Math.imul(ah4, bh1)) | 0;
            lo = (lo + Math.imul(al3, bl2)) | 0;
            mid = (mid + Math.imul(al3, bh2)) | 0;
            mid = (mid + Math.imul(ah3, bl2)) | 0;
            hi = (hi + Math.imul(ah3, bh2)) | 0;
            lo = (lo + Math.imul(al2, bl3)) | 0;
            mid = (mid + Math.imul(al2, bh3)) | 0;
            mid = (mid + Math.imul(ah2, bl3)) | 0;
            hi = (hi + Math.imul(ah2, bh3)) | 0;
            lo = (lo + Math.imul(al1, bl4)) | 0;
            mid = (mid + Math.imul(al1, bh4)) | 0;
            mid = (mid + Math.imul(ah1, bl4)) | 0;
            hi = (hi + Math.imul(ah1, bh4)) | 0;
            lo = (lo + Math.imul(al0, bl5)) | 0;
            mid = (mid + Math.imul(al0, bh5)) | 0;
            mid = (mid + Math.imul(ah0, bl5)) | 0;
            hi = (hi + Math.imul(ah0, bh5)) | 0;
            var w5 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
            w5 &= 67108863;
            lo = Math.imul(al6, bl0);
            mid = Math.imul(al6, bh0);
            mid = (mid + Math.imul(ah6, bl0)) | 0;
            hi = Math.imul(ah6, bh0);
            lo = (lo + Math.imul(al5, bl1)) | 0;
            mid = (mid + Math.imul(al5, bh1)) | 0;
            mid = (mid + Math.imul(ah5, bl1)) | 0;
            hi = (hi + Math.imul(ah5, bh1)) | 0;
            lo = (lo + Math.imul(al4, bl2)) | 0;
            mid = (mid + Math.imul(al4, bh2)) | 0;
            mid = (mid + Math.imul(ah4, bl2)) | 0;
            hi = (hi + Math.imul(ah4, bh2)) | 0;
            lo = (lo + Math.imul(al3, bl3)) | 0;
            mid = (mid + Math.imul(al3, bh3)) | 0;
            mid = (mid + Math.imul(ah3, bl3)) | 0;
            hi = (hi + Math.imul(ah3, bh3)) | 0;
            lo = (lo + Math.imul(al2, bl4)) | 0;
            mid = (mid + Math.imul(al2, bh4)) | 0;
            mid = (mid + Math.imul(ah2, bl4)) | 0;
            hi = (hi + Math.imul(ah2, bh4)) | 0;
            lo = (lo + Math.imul(al1, bl5)) | 0;
            mid = (mid + Math.imul(al1, bh5)) | 0;
            mid = (mid + Math.imul(ah1, bl5)) | 0;
            hi = (hi + Math.imul(ah1, bh5)) | 0;
            lo = (lo + Math.imul(al0, bl6)) | 0;
            mid = (mid + Math.imul(al0, bh6)) | 0;
            mid = (mid + Math.imul(ah0, bl6)) | 0;
            hi = (hi + Math.imul(ah0, bh6)) | 0;
            var w6 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
            w6 &= 67108863;
            lo = Math.imul(al7, bl0);
            mid = Math.imul(al7, bh0);
            mid = (mid + Math.imul(ah7, bl0)) | 0;
            hi = Math.imul(ah7, bh0);
            lo = (lo + Math.imul(al6, bl1)) | 0;
            mid = (mid + Math.imul(al6, bh1)) | 0;
            mid = (mid + Math.imul(ah6, bl1)) | 0;
            hi = (hi + Math.imul(ah6, bh1)) | 0;
            lo = (lo + Math.imul(al5, bl2)) | 0;
            mid = (mid + Math.imul(al5, bh2)) | 0;
            mid = (mid + Math.imul(ah5, bl2)) | 0;
            hi = (hi + Math.imul(ah5, bh2)) | 0;
            lo = (lo + Math.imul(al4, bl3)) | 0;
            mid = (mid + Math.imul(al4, bh3)) | 0;
            mid = (mid + Math.imul(ah4, bl3)) | 0;
            hi = (hi + Math.imul(ah4, bh3)) | 0;
            lo = (lo + Math.imul(al3, bl4)) | 0;
            mid = (mid + Math.imul(al3, bh4)) | 0;
            mid = (mid + Math.imul(ah3, bl4)) | 0;
            hi = (hi + Math.imul(ah3, bh4)) | 0;
            lo = (lo + Math.imul(al2, bl5)) | 0;
            mid = (mid + Math.imul(al2, bh5)) | 0;
            mid = (mid + Math.imul(ah2, bl5)) | 0;
            hi = (hi + Math.imul(ah2, bh5)) | 0;
            lo = (lo + Math.imul(al1, bl6)) | 0;
            mid = (mid + Math.imul(al1, bh6)) | 0;
            mid = (mid + Math.imul(ah1, bl6)) | 0;
            hi = (hi + Math.imul(ah1, bh6)) | 0;
            lo = (lo + Math.imul(al0, bl7)) | 0;
            mid = (mid + Math.imul(al0, bh7)) | 0;
            mid = (mid + Math.imul(ah0, bl7)) | 0;
            hi = (hi + Math.imul(ah0, bh7)) | 0;
            var w7 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
            w7 &= 67108863;
            lo = Math.imul(al8, bl0);
            mid = Math.imul(al8, bh0);
            mid = (mid + Math.imul(ah8, bl0)) | 0;
            hi = Math.imul(ah8, bh0);
            lo = (lo + Math.imul(al7, bl1)) | 0;
            mid = (mid + Math.imul(al7, bh1)) | 0;
            mid = (mid + Math.imul(ah7, bl1)) | 0;
            hi = (hi + Math.imul(ah7, bh1)) | 0;
            lo = (lo + Math.imul(al6, bl2)) | 0;
            mid = (mid + Math.imul(al6, bh2)) | 0;
            mid = (mid + Math.imul(ah6, bl2)) | 0;
            hi = (hi + Math.imul(ah6, bh2)) | 0;
            lo = (lo + Math.imul(al5, bl3)) | 0;
            mid = (mid + Math.imul(al5, bh3)) | 0;
            mid = (mid + Math.imul(ah5, bl3)) | 0;
            hi = (hi + Math.imul(ah5, bh3)) | 0;
            lo = (lo + Math.imul(al4, bl4)) | 0;
            mid = (mid + Math.imul(al4, bh4)) | 0;
            mid = (mid + Math.imul(ah4, bl4)) | 0;
            hi = (hi + Math.imul(ah4, bh4)) | 0;
            lo = (lo + Math.imul(al3, bl5)) | 0;
            mid = (mid + Math.imul(al3, bh5)) | 0;
            mid = (mid + Math.imul(ah3, bl5)) | 0;
            hi = (hi + Math.imul(ah3, bh5)) | 0;
            lo = (lo + Math.imul(al2, bl6)) | 0;
            mid = (mid + Math.imul(al2, bh6)) | 0;
            mid = (mid + Math.imul(ah2, bl6)) | 0;
            hi = (hi + Math.imul(ah2, bh6)) | 0;
            lo = (lo + Math.imul(al1, bl7)) | 0;
            mid = (mid + Math.imul(al1, bh7)) | 0;
            mid = (mid + Math.imul(ah1, bl7)) | 0;
            hi = (hi + Math.imul(ah1, bh7)) | 0;
            lo = (lo + Math.imul(al0, bl8)) | 0;
            mid = (mid + Math.imul(al0, bh8)) | 0;
            mid = (mid + Math.imul(ah0, bl8)) | 0;
            hi = (hi + Math.imul(ah0, bh8)) | 0;
            var w8 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
            w8 &= 67108863;
            lo = Math.imul(al9, bl0);
            mid = Math.imul(al9, bh0);
            mid = (mid + Math.imul(ah9, bl0)) | 0;
            hi = Math.imul(ah9, bh0);
            lo = (lo + Math.imul(al8, bl1)) | 0;
            mid = (mid + Math.imul(al8, bh1)) | 0;
            mid = (mid + Math.imul(ah8, bl1)) | 0;
            hi = (hi + Math.imul(ah8, bh1)) | 0;
            lo = (lo + Math.imul(al7, bl2)) | 0;
            mid = (mid + Math.imul(al7, bh2)) | 0;
            mid = (mid + Math.imul(ah7, bl2)) | 0;
            hi = (hi + Math.imul(ah7, bh2)) | 0;
            lo = (lo + Math.imul(al6, bl3)) | 0;
            mid = (mid + Math.imul(al6, bh3)) | 0;
            mid = (mid + Math.imul(ah6, bl3)) | 0;
            hi = (hi + Math.imul(ah6, bh3)) | 0;
            lo = (lo + Math.imul(al5, bl4)) | 0;
            mid = (mid + Math.imul(al5, bh4)) | 0;
            mid = (mid + Math.imul(ah5, bl4)) | 0;
            hi = (hi + Math.imul(ah5, bh4)) | 0;
            lo = (lo + Math.imul(al4, bl5)) | 0;
            mid = (mid + Math.imul(al4, bh5)) | 0;
            mid = (mid + Math.imul(ah4, bl5)) | 0;
            hi = (hi + Math.imul(ah4, bh5)) | 0;
            lo = (lo + Math.imul(al3, bl6)) | 0;
            mid = (mid + Math.imul(al3, bh6)) | 0;
            mid = (mid + Math.imul(ah3, bl6)) | 0;
            hi = (hi + Math.imul(ah3, bh6)) | 0;
            lo = (lo + Math.imul(al2, bl7)) | 0;
            mid = (mid + Math.imul(al2, bh7)) | 0;
            mid = (mid + Math.imul(ah2, bl7)) | 0;
            hi = (hi + Math.imul(ah2, bh7)) | 0;
            lo = (lo + Math.imul(al1, bl8)) | 0;
            mid = (mid + Math.imul(al1, bh8)) | 0;
            mid = (mid + Math.imul(ah1, bl8)) | 0;
            hi = (hi + Math.imul(ah1, bh8)) | 0;
            lo = (lo + Math.imul(al0, bl9)) | 0;
            mid = (mid + Math.imul(al0, bh9)) | 0;
            mid = (mid + Math.imul(ah0, bl9)) | 0;
            hi = (hi + Math.imul(ah0, bh9)) | 0;
            var w9 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
            w9 &= 67108863;
            lo = Math.imul(al9, bl1);
            mid = Math.imul(al9, bh1);
            mid = (mid + Math.imul(ah9, bl1)) | 0;
            hi = Math.imul(ah9, bh1);
            lo = (lo + Math.imul(al8, bl2)) | 0;
            mid = (mid + Math.imul(al8, bh2)) | 0;
            mid = (mid + Math.imul(ah8, bl2)) | 0;
            hi = (hi + Math.imul(ah8, bh2)) | 0;
            lo = (lo + Math.imul(al7, bl3)) | 0;
            mid = (mid + Math.imul(al7, bh3)) | 0;
            mid = (mid + Math.imul(ah7, bl3)) | 0;
            hi = (hi + Math.imul(ah7, bh3)) | 0;
            lo = (lo + Math.imul(al6, bl4)) | 0;
            mid = (mid + Math.imul(al6, bh4)) | 0;
            mid = (mid + Math.imul(ah6, bl4)) | 0;
            hi = (hi + Math.imul(ah6, bh4)) | 0;
            lo = (lo + Math.imul(al5, bl5)) | 0;
            mid = (mid + Math.imul(al5, bh5)) | 0;
            mid = (mid + Math.imul(ah5, bl5)) | 0;
            hi = (hi + Math.imul(ah5, bh5)) | 0;
            lo = (lo + Math.imul(al4, bl6)) | 0;
            mid = (mid + Math.imul(al4, bh6)) | 0;
            mid = (mid + Math.imul(ah4, bl6)) | 0;
            hi = (hi + Math.imul(ah4, bh6)) | 0;
            lo = (lo + Math.imul(al3, bl7)) | 0;
            mid = (mid + Math.imul(al3, bh7)) | 0;
            mid = (mid + Math.imul(ah3, bl7)) | 0;
            hi = (hi + Math.imul(ah3, bh7)) | 0;
            lo = (lo + Math.imul(al2, bl8)) | 0;
            mid = (mid + Math.imul(al2, bh8)) | 0;
            mid = (mid + Math.imul(ah2, bl8)) | 0;
            hi = (hi + Math.imul(ah2, bh8)) | 0;
            lo = (lo + Math.imul(al1, bl9)) | 0;
            mid = (mid + Math.imul(al1, bh9)) | 0;
            mid = (mid + Math.imul(ah1, bl9)) | 0;
            hi = (hi + Math.imul(ah1, bh9)) | 0;
            var w10 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
            w10 &= 67108863;
            lo = Math.imul(al9, bl2);
            mid = Math.imul(al9, bh2);
            mid = (mid + Math.imul(ah9, bl2)) | 0;
            hi = Math.imul(ah9, bh2);
            lo = (lo + Math.imul(al8, bl3)) | 0;
            mid = (mid + Math.imul(al8, bh3)) | 0;
            mid = (mid + Math.imul(ah8, bl3)) | 0;
            hi = (hi + Math.imul(ah8, bh3)) | 0;
            lo = (lo + Math.imul(al7, bl4)) | 0;
            mid = (mid + Math.imul(al7, bh4)) | 0;
            mid = (mid + Math.imul(ah7, bl4)) | 0;
            hi = (hi + Math.imul(ah7, bh4)) | 0;
            lo = (lo + Math.imul(al6, bl5)) | 0;
            mid = (mid + Math.imul(al6, bh5)) | 0;
            mid = (mid + Math.imul(ah6, bl5)) | 0;
            hi = (hi + Math.imul(ah6, bh5)) | 0;
            lo = (lo + Math.imul(al5, bl6)) | 0;
            mid = (mid + Math.imul(al5, bh6)) | 0;
            mid = (mid + Math.imul(ah5, bl6)) | 0;
            hi = (hi + Math.imul(ah5, bh6)) | 0;
            lo = (lo + Math.imul(al4, bl7)) | 0;
            mid = (mid + Math.imul(al4, bh7)) | 0;
            mid = (mid + Math.imul(ah4, bl7)) | 0;
            hi = (hi + Math.imul(ah4, bh7)) | 0;
            lo = (lo + Math.imul(al3, bl8)) | 0;
            mid = (mid + Math.imul(al3, bh8)) | 0;
            mid = (mid + Math.imul(ah3, bl8)) | 0;
            hi = (hi + Math.imul(ah3, bh8)) | 0;
            lo = (lo + Math.imul(al2, bl9)) | 0;
            mid = (mid + Math.imul(al2, bh9)) | 0;
            mid = (mid + Math.imul(ah2, bl9)) | 0;
            hi = (hi + Math.imul(ah2, bh9)) | 0;
            var w11 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
            w11 &= 67108863;
            lo = Math.imul(al9, bl3);
            mid = Math.imul(al9, bh3);
            mid = (mid + Math.imul(ah9, bl3)) | 0;
            hi = Math.imul(ah9, bh3);
            lo = (lo + Math.imul(al8, bl4)) | 0;
            mid = (mid + Math.imul(al8, bh4)) | 0;
            mid = (mid + Math.imul(ah8, bl4)) | 0;
            hi = (hi + Math.imul(ah8, bh4)) | 0;
            lo = (lo + Math.imul(al7, bl5)) | 0;
            mid = (mid + Math.imul(al7, bh5)) | 0;
            mid = (mid + Math.imul(ah7, bl5)) | 0;
            hi = (hi + Math.imul(ah7, bh5)) | 0;
            lo = (lo + Math.imul(al6, bl6)) | 0;
            mid = (mid + Math.imul(al6, bh6)) | 0;
            mid = (mid + Math.imul(ah6, bl6)) | 0;
            hi = (hi + Math.imul(ah6, bh6)) | 0;
            lo = (lo + Math.imul(al5, bl7)) | 0;
            mid = (mid + Math.imul(al5, bh7)) | 0;
            mid = (mid + Math.imul(ah5, bl7)) | 0;
            hi = (hi + Math.imul(ah5, bh7)) | 0;
            lo = (lo + Math.imul(al4, bl8)) | 0;
            mid = (mid + Math.imul(al4, bh8)) | 0;
            mid = (mid + Math.imul(ah4, bl8)) | 0;
            hi = (hi + Math.imul(ah4, bh8)) | 0;
            lo = (lo + Math.imul(al3, bl9)) | 0;
            mid = (mid + Math.imul(al3, bh9)) | 0;
            mid = (mid + Math.imul(ah3, bl9)) | 0;
            hi = (hi + Math.imul(ah3, bh9)) | 0;
            var w12 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
            w12 &= 67108863;
            lo = Math.imul(al9, bl4);
            mid = Math.imul(al9, bh4);
            mid = (mid + Math.imul(ah9, bl4)) | 0;
            hi = Math.imul(ah9, bh4);
            lo = (lo + Math.imul(al8, bl5)) | 0;
            mid = (mid + Math.imul(al8, bh5)) | 0;
            mid = (mid + Math.imul(ah8, bl5)) | 0;
            hi = (hi + Math.imul(ah8, bh5)) | 0;
            lo = (lo + Math.imul(al7, bl6)) | 0;
            mid = (mid + Math.imul(al7, bh6)) | 0;
            mid = (mid + Math.imul(ah7, bl6)) | 0;
            hi = (hi + Math.imul(ah7, bh6)) | 0;
            lo = (lo + Math.imul(al6, bl7)) | 0;
            mid = (mid + Math.imul(al6, bh7)) | 0;
            mid = (mid + Math.imul(ah6, bl7)) | 0;
            hi = (hi + Math.imul(ah6, bh7)) | 0;
            lo = (lo + Math.imul(al5, bl8)) | 0;
            mid = (mid + Math.imul(al5, bh8)) | 0;
            mid = (mid + Math.imul(ah5, bl8)) | 0;
            hi = (hi + Math.imul(ah5, bh8)) | 0;
            lo = (lo + Math.imul(al4, bl9)) | 0;
            mid = (mid + Math.imul(al4, bh9)) | 0;
            mid = (mid + Math.imul(ah4, bl9)) | 0;
            hi = (hi + Math.imul(ah4, bh9)) | 0;
            var w13 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
            w13 &= 67108863;
            lo = Math.imul(al9, bl5);
            mid = Math.imul(al9, bh5);
            mid = (mid + Math.imul(ah9, bl5)) | 0;
            hi = Math.imul(ah9, bh5);
            lo = (lo + Math.imul(al8, bl6)) | 0;
            mid = (mid + Math.imul(al8, bh6)) | 0;
            mid = (mid + Math.imul(ah8, bl6)) | 0;
            hi = (hi + Math.imul(ah8, bh6)) | 0;
            lo = (lo + Math.imul(al7, bl7)) | 0;
            mid = (mid + Math.imul(al7, bh7)) | 0;
            mid = (mid + Math.imul(ah7, bl7)) | 0;
            hi = (hi + Math.imul(ah7, bh7)) | 0;
            lo = (lo + Math.imul(al6, bl8)) | 0;
            mid = (mid + Math.imul(al6, bh8)) | 0;
            mid = (mid + Math.imul(ah6, bl8)) | 0;
            hi = (hi + Math.imul(ah6, bh8)) | 0;
            lo = (lo + Math.imul(al5, bl9)) | 0;
            mid = (mid + Math.imul(al5, bh9)) | 0;
            mid = (mid + Math.imul(ah5, bl9)) | 0;
            hi = (hi + Math.imul(ah5, bh9)) | 0;
            var w14 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
            w14 &= 67108863;
            lo = Math.imul(al9, bl6);
            mid = Math.imul(al9, bh6);
            mid = (mid + Math.imul(ah9, bl6)) | 0;
            hi = Math.imul(ah9, bh6);
            lo = (lo + Math.imul(al8, bl7)) | 0;
            mid = (mid + Math.imul(al8, bh7)) | 0;
            mid = (mid + Math.imul(ah8, bl7)) | 0;
            hi = (hi + Math.imul(ah8, bh7)) | 0;
            lo = (lo + Math.imul(al7, bl8)) | 0;
            mid = (mid + Math.imul(al7, bh8)) | 0;
            mid = (mid + Math.imul(ah7, bl8)) | 0;
            hi = (hi + Math.imul(ah7, bh8)) | 0;
            lo = (lo + Math.imul(al6, bl9)) | 0;
            mid = (mid + Math.imul(al6, bh9)) | 0;
            mid = (mid + Math.imul(ah6, bl9)) | 0;
            hi = (hi + Math.imul(ah6, bh9)) | 0;
            var w15 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
            w15 &= 67108863;
            lo = Math.imul(al9, bl7);
            mid = Math.imul(al9, bh7);
            mid = (mid + Math.imul(ah9, bl7)) | 0;
            hi = Math.imul(ah9, bh7);
            lo = (lo + Math.imul(al8, bl8)) | 0;
            mid = (mid + Math.imul(al8, bh8)) | 0;
            mid = (mid + Math.imul(ah8, bl8)) | 0;
            hi = (hi + Math.imul(ah8, bh8)) | 0;
            lo = (lo + Math.imul(al7, bl9)) | 0;
            mid = (mid + Math.imul(al7, bh9)) | 0;
            mid = (mid + Math.imul(ah7, bl9)) | 0;
            hi = (hi + Math.imul(ah7, bh9)) | 0;
            var w16 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
            w16 &= 67108863;
            lo = Math.imul(al9, bl8);
            mid = Math.imul(al9, bh8);
            mid = (mid + Math.imul(ah9, bl8)) | 0;
            hi = Math.imul(ah9, bh8);
            lo = (lo + Math.imul(al8, bl9)) | 0;
            mid = (mid + Math.imul(al8, bh9)) | 0;
            mid = (mid + Math.imul(ah8, bl9)) | 0;
            hi = (hi + Math.imul(ah8, bh9)) | 0;
            var w17 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
            w17 &= 67108863;
            lo = Math.imul(al9, bl9);
            mid = Math.imul(al9, bh9);
            mid = (mid + Math.imul(ah9, bl9)) | 0;
            hi = Math.imul(ah9, bh9);
            var w18 = (((c + lo) | 0) + ((mid & 8191) << 13)) | 0;
            c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
            w18 &= 67108863;
            o[0] = w0;
            o[1] = w1;
            o[2] = w2;
            o[3] = w3;
            o[4] = w4;
            o[5] = w5;
            o[6] = w6;
            o[7] = w7;
            o[8] = w8;
            o[9] = w9;
            o[10] = w10;
            o[11] = w11;
            o[12] = w12;
            o[13] = w13;
            o[14] = w14;
            o[15] = w15;
            o[16] = w16;
            o[17] = w17;
            o[18] = w18;
            if (c !== 0) {
                o[19] = c;
                out.length++;
            }
            return out;
        };
        if (!Math.imul) {
            comb10MulTo = smallMulTo;
        }
        function bigMulTo(self, num, out) {
            out.negative = num.negative ^ self.negative;
            out.length = self.length + num.length;
            var carry = 0;
            var hncarry = 0;
            for (var k = 0; k < out.length - 1; k++) {
                var ncarry = hncarry;
                hncarry = 0;
                var rword = carry & 67108863;
                var maxJ = Math.min(k, num.length - 1);
                for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
                    var i = k - j;
                    var a = self.words[i] | 0;
                    var b = num.words[j] | 0;
                    var r = a * b;
                    var lo = r & 67108863;
                    ncarry = (ncarry + ((r / 67108864) | 0)) | 0;
                    lo = (lo + rword) | 0;
                    rword = lo & 67108863;
                    ncarry = (ncarry + (lo >>> 26)) | 0;
                    hncarry += ncarry >>> 26;
                    ncarry &= 67108863;
                }
                out.words[k] = rword;
                carry = ncarry;
                ncarry = hncarry;
            }
            if (carry !== 0) {
                out.words[k] = carry;
            } else {
                out.length--;
            }
            return out.strip();
        }
        function jumboMulTo(self, num, out) {
            var fftm = new FFTM();
            return fftm.mulp(self, num, out);
        }
        BN.prototype.mulTo = function mulTo(num, out) {
            var res;
            var len = this.length + num.length;
            if (this.length === 10 && num.length === 10) {
                res = comb10MulTo(this, num, out);
            } else if (len < 63) {
                res = smallMulTo(this, num, out);
            } else if (len < 1024) {
                res = bigMulTo(this, num, out);
            } else {
                res = jumboMulTo(this, num, out);
            }
            return res;
        };
        function FFTM(x, y) {
            this.x = x;
            this.y = y;
        }
        FFTM.prototype.makeRBT = function makeRBT(N) {
            var t = new Array(N);
            var l = BN.prototype._countBits(N) - 1;
            for (var i = 0; i < N; i++) {
                t[i] = this.revBin(i, l, N);
            }
            return t;
        };
        FFTM.prototype.revBin = function revBin(x, l, N) {
            if (x === 0 || x === N - 1) return x;
            var rb = 0;
            for (var i = 0; i < l; i++) {
                rb |= (x & 1) << (l - i - 1);
                x >>= 1;
            }
            return rb;
        };
        FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
            for (var i = 0; i < N; i++) {
                rtws[i] = rws[rbt[i]];
                itws[i] = iws[rbt[i]];
            }
        };
        FFTM.prototype.transform = function transform(
            rws,
            iws,
            rtws,
            itws,
            N,
            rbt
        ) {
            this.permute(rbt, rws, iws, rtws, itws, N);
            for (var s = 1; s < N; s <<= 1) {
                var l = s << 1;
                var rtwdf = Math.cos((2 * Math.PI) / l);
                var itwdf = Math.sin((2 * Math.PI) / l);
                for (var p = 0; p < N; p += l) {
                    var rtwdf_ = rtwdf;
                    var itwdf_ = itwdf;
                    for (var j = 0; j < s; j++) {
                        var re = rtws[p + j];
                        var ie = itws[p + j];
                        var ro = rtws[p + j + s];
                        var io = itws[p + j + s];
                        var rx = rtwdf_ * ro - itwdf_ * io;
                        io = rtwdf_ * io + itwdf_ * ro;
                        ro = rx;
                        rtws[p + j] = re + ro;
                        itws[p + j] = ie + io;
                        rtws[p + j + s] = re - ro;
                        itws[p + j + s] = ie - io;
                        if (j !== l) {
                            rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                            rtwdf_ = rx;
                        }
                    }
                }
            }
        };
        FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
            var N = Math.max(m, n) | 1;
            var odd = N & 1;
            var i = 0;
            for (N = (N / 2) | 0; N; N = N >>> 1) {
                i++;
            }
            return 1 << (i + 1 + odd);
        };
        FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
            if (N <= 1) return;
            for (var i = 0; i < N / 2; i++) {
                var t = rws[i];
                rws[i] = rws[N - i - 1];
                rws[N - i - 1] = t;
                t = iws[i];
                iws[i] = -iws[N - i - 1];
                iws[N - i - 1] = -t;
            }
        };
        FFTM.prototype.normalize13b = function normalize13b(ws, N) {
            var carry = 0;
            for (var i = 0; i < N / 2; i++) {
                var w =
                    Math.round(ws[2 * i + 1] / N) * 8192 +
                    Math.round(ws[2 * i] / N) +
                    carry;
                ws[i] = w & 67108863;
                if (w < 67108864) {
                    carry = 0;
                } else {
                    carry = (w / 67108864) | 0;
                }
            }
            return ws;
        };
        FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
            var carry = 0;
            for (var i = 0; i < len; i++) {
                carry = carry + (ws[i] | 0);
                rws[2 * i] = carry & 8191;
                carry = carry >>> 13;
                rws[2 * i + 1] = carry & 8191;
                carry = carry >>> 13;
            }
            for (i = 2 * len; i < N; ++i) {
                rws[i] = 0;
            }
            assert(carry === 0);
            assert((carry & ~8191) === 0);
        };
        FFTM.prototype.stub = function stub(N) {
            var ph = new Array(N);
            for (var i = 0; i < N; i++) {
                ph[i] = 0;
            }
            return ph;
        };
        FFTM.prototype.mulp = function mulp(x, y, out) {
            var N = 2 * this.guessLen13b(x.length, y.length);
            var rbt = this.makeRBT(N);
            var _ = this.stub(N);
            var rws = new Array(N);
            var rwst = new Array(N);
            var iwst = new Array(N);
            var nrws = new Array(N);
            var nrwst = new Array(N);
            var niwst = new Array(N);
            var rmws = out.words;
            rmws.length = N;
            this.convert13b(x.words, x.length, rws, N);
            this.convert13b(y.words, y.length, nrws, N);
            this.transform(rws, _, rwst, iwst, N, rbt);
            this.transform(nrws, _, nrwst, niwst, N, rbt);
            for (var i = 0; i < N; i++) {
                var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
                iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
                rwst[i] = rx;
            }
            this.conjugate(rwst, iwst, N);
            this.transform(rwst, iwst, rmws, _, N, rbt);
            this.conjugate(rmws, _, N);
            this.normalize13b(rmws, N);
            out.negative = x.negative ^ y.negative;
            out.length = x.length + y.length;
            return out.strip();
        };
        BN.prototype.mul = function mul(num) {
            var out = new BN(null);
            out.words = new Array(this.length + num.length);
            return this.mulTo(num, out);
        };
        BN.prototype.mulf = function mulf(num) {
            var out = new BN(null);
            out.words = new Array(this.length + num.length);
            return jumboMulTo(this, num, out);
        };
        BN.prototype.imul = function imul(num) {
            return this.clone().mulTo(num, this);
        };
        BN.prototype.imuln = function imuln(num) {
            assert(typeof num === "number");
            assert(num < 67108864);
            var carry = 0;
            for (var i = 0; i < this.length; i++) {
                var w = (this.words[i] | 0) * num;
                var lo = (w & 67108863) + (carry & 67108863);
                carry >>= 26;
                carry += (w / 67108864) | 0;
                carry += lo >>> 26;
                this.words[i] = lo & 67108863;
            }
            if (carry !== 0) {
                this.words[i] = carry;
                this.length++;
            }
            return this;
        };
        BN.prototype.muln = function muln(num) {
            return this.clone().imuln(num);
        };
        BN.prototype.sqr = function sqr() {
            return this.mul(this);
        };
        BN.prototype.isqr = function isqr() {
            return this.imul(this.clone());
        };
        BN.prototype.pow = function pow(num) {
            var w = toBitArray(num);
            if (w.length === 0) return new BN(1);
            var res = this;
            for (var i = 0; i < w.length; i++, res = res.sqr()) {
                if (w[i] !== 0) break;
            }
            if (++i < w.length) {
                for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
                    if (w[i] === 0) continue;
                    res = res.mul(q);
                }
            }
            return res;
        };
        BN.prototype.iushln = function iushln(bits) {
            assert(typeof bits === "number" && bits >= 0);
            var r = bits % 26;
            var s = (bits - r) / 26;
            var carryMask = (67108863 >>> (26 - r)) << (26 - r);
            var i;
            if (r !== 0) {
                var carry = 0;
                for (i = 0; i < this.length; i++) {
                    var newCarry = this.words[i] & carryMask;
                    var c = ((this.words[i] | 0) - newCarry) << r;
                    this.words[i] = c | carry;
                    carry = newCarry >>> (26 - r);
                }
                if (carry) {
                    this.words[i] = carry;
                    this.length++;
                }
            }
            if (s !== 0) {
                for (i = this.length - 1; i >= 0; i--) {
                    this.words[i + s] = this.words[i];
                }
                for (i = 0; i < s; i++) {
                    this.words[i] = 0;
                }
                this.length += s;
            }
            return this.strip();
        };
        BN.prototype.ishln = function ishln(bits) {
            assert(this.negative === 0);
            return this.iushln(bits);
        };
        BN.prototype.iushrn = function iushrn(bits, hint, extended) {
            assert(typeof bits === "number" && bits >= 0);
            var h;
            if (hint) {
                h = (hint - (hint % 26)) / 26;
            } else {
                h = 0;
            }
            var r = bits % 26;
            var s = Math.min((bits - r) / 26, this.length);
            var mask = 67108863 ^ ((67108863 >>> r) << r);
            var maskedWords = extended;
            h -= s;
            h = Math.max(0, h);
            if (maskedWords) {
                for (var i = 0; i < s; i++) {
                    maskedWords.words[i] = this.words[i];
                }
                maskedWords.length = s;
            }
            if (s === 0) {
            } else if (this.length > s) {
                this.length -= s;
                for (i = 0; i < this.length; i++) {
                    this.words[i] = this.words[i + s];
                }
            } else {
                this.words[0] = 0;
                this.length = 1;
            }
            var carry = 0;
            for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
                var word = this.words[i] | 0;
                this.words[i] = (carry << (26 - r)) | (word >>> r);
                carry = word & mask;
            }
            if (maskedWords && carry !== 0) {
                maskedWords.words[maskedWords.length++] = carry;
            }
            if (this.length === 0) {
                this.words[0] = 0;
                this.length = 1;
            }
            return this.strip();
        };
        BN.prototype.ishrn = function ishrn(bits, hint, extended) {
            assert(this.negative === 0);
            return this.iushrn(bits, hint, extended);
        };
        BN.prototype.shln = function shln(bits) {
            return this.clone().ishln(bits);
        };
        BN.prototype.ushln = function ushln(bits) {
            return this.clone().iushln(bits);
        };
        BN.prototype.shrn = function shrn(bits) {
            return this.clone().ishrn(bits);
        };
        BN.prototype.ushrn = function ushrn(bits) {
            return this.clone().iushrn(bits);
        };
        BN.prototype.testn = function testn(bit) {
            assert(typeof bit === "number" && bit >= 0);
            var r = bit % 26;
            var s = (bit - r) / 26;
            var q = 1 << r;
            if (this.length <= s) return false;
            var w = this.words[s];
            return !!(w & q);
        };
        BN.prototype.imaskn = function imaskn(bits) {
            assert(typeof bits === "number" && bits >= 0);
            var r = bits % 26;
            var s = (bits - r) / 26;
            assert(this.negative === 0, "imaskn works only with positive numbers");
            if (this.length <= s) {
                return this;
            }
            if (r !== 0) {
                s++;
            }
            this.length = Math.min(s, this.length);
            if (r !== 0) {
                var mask = 67108863 ^ ((67108863 >>> r) << r);
                this.words[this.length - 1] &= mask;
            }
            return this.strip();
        };
        BN.prototype.maskn = function maskn(bits) {
            return this.clone().imaskn(bits);
        };
        BN.prototype.iaddn = function iaddn(num) {
            assert(typeof num === "number");
            assert(num < 67108864);
            if (num < 0) return this.isubn(-num);
            if (this.negative !== 0) {
                if (this.length === 1 && (this.words[0] | 0) < num) {
                    this.words[0] = num - (this.words[0] | 0);
                    this.negative = 0;
                    return this;
                }
                this.negative = 0;
                this.isubn(num);
                this.negative = 1;
                return this;
            }
            return this._iaddn(num);
        };
        BN.prototype._iaddn = function _iaddn(num) {
            this.words[0] += num;
            for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
                this.words[i] -= 67108864;
                if (i === this.length - 1) {
                    this.words[i + 1] = 1;
                } else {
                    this.words[i + 1]++;
                }
            }
            this.length = Math.max(this.length, i + 1);
            return this;
        };
        BN.prototype.isubn = function isubn(num) {
            assert(typeof num === "number");
            assert(num < 67108864);
            if (num < 0) return this.iaddn(-num);
            if (this.negative !== 0) {
                this.negative = 0;
                this.iaddn(num);
                this.negative = 1;
                return this;
            }
            this.words[0] -= num;
            if (this.length === 1 && this.words[0] < 0) {
                this.words[0] = -this.words[0];
                this.negative = 1;
            } else {
                for (var i = 0; i < this.length && this.words[i] < 0; i++) {
                    this.words[i] += 67108864;
                    this.words[i + 1] -= 1;
                }
            }
            return this.strip();
        };
        BN.prototype.addn = function addn(num) {
            return this.clone().iaddn(num);
        };
        BN.prototype.subn = function subn(num) {
            return this.clone().isubn(num);
        };
        BN.prototype.iabs = function iabs() {
            this.negative = 0;
            return this;
        };
        BN.prototype.abs = function abs() {
            return this.clone().iabs();
        };
        BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
            var len = num.length + shift;
            var i;
            this._expand(len);
            var w;
            var carry = 0;
            for (i = 0; i < num.length; i++) {
                w = (this.words[i + shift] | 0) + carry;
                var right = (num.words[i] | 0) * mul;
                w -= right & 67108863;
                carry = (w >> 26) - ((right / 67108864) | 0);
                this.words[i + shift] = w & 67108863;
            }
            for (; i < this.length - shift; i++) {
                w = (this.words[i + shift] | 0) + carry;
                carry = w >> 26;
                this.words[i + shift] = w & 67108863;
            }
            if (carry === 0) return this.strip();
            assert(carry === -1);
            carry = 0;
            for (i = 0; i < this.length; i++) {
                w = -(this.words[i] | 0) + carry;
                carry = w >> 26;
                this.words[i] = w & 67108863;
            }
            this.negative = 1;
            return this.strip();
        };
        BN.prototype._wordDiv = function _wordDiv(num, mode) {
            var shift = this.length - num.length;
            var a = this.clone();
            var b = num;
            var bhi = b.words[b.length - 1] | 0;
            var bhiBits = this._countBits(bhi);
            shift = 26 - bhiBits;
            if (shift !== 0) {
                b = b.ushln(shift);
                a.iushln(shift);
                bhi = b.words[b.length - 1] | 0;
            }
            var m = a.length - b.length;
            var q;
            if (mode !== "mod") {
                q = new BN(null);
                q.length = m + 1;
                q.words = new Array(q.length);
                for (var i = 0; i < q.length; i++) {
                    q.words[i] = 0;
                }
            }
            var diff = a.clone()._ishlnsubmul(b, 1, m);
            if (diff.negative === 0) {
                a = diff;
                if (q) {
                    q.words[m] = 1;
                }
            }
            for (var j = m - 1; j >= 0; j--) {
                var qj =
                    (a.words[b.length + j] | 0) * 67108864 +
                    (a.words[b.length + j - 1] | 0);
                qj = Math.min((qj / bhi) | 0, 67108863);
                a._ishlnsubmul(b, qj, j);
                while (a.negative !== 0) {
                    qj--;
                    a.negative = 0;
                    a._ishlnsubmul(b, 1, j);
                    if (!a.isZero()) {
                        a.negative ^= 1;
                    }
                }
                if (q) {
                    q.words[j] = qj;
                }
            }
            if (q) {
                q.strip();
            }
            a.strip();
            if (mode !== "div" && shift !== 0) {
                a.iushrn(shift);
            }
            return { div: q || null, mod: a };
        };
        BN.prototype.divmod = function divmod(num, mode, positive) {
            assert(!num.isZero());
            if (this.isZero()) {
                return { div: new BN(0), mod: new BN(0) };
            }
            var div, mod, res;
            if (this.negative !== 0 && num.negative === 0) {
                res = this.neg().divmod(num, mode);
                if (mode !== "mod") {
                    div = res.div.neg();
                }
                if (mode !== "div") {
                    mod = res.mod.neg();
                    if (positive && mod.negative !== 0) {
                        mod.iadd(num);
                    }
                }
                return { div: div, mod: mod };
            }
            if (this.negative === 0 && num.negative !== 0) {
                res = this.divmod(num.neg(), mode);
                if (mode !== "mod") {
                    div = res.div.neg();
                }
                return { div: div, mod: res.mod };
            }
            if ((this.negative & num.negative) !== 0) {
                res = this.neg().divmod(num.neg(), mode);
                if (mode !== "div") {
                    mod = res.mod.neg();
                    if (positive && mod.negative !== 0) {
                        mod.isub(num);
                    }
                }
                return { div: res.div, mod: mod };
            }
            if (num.length > this.length || this.cmp(num) < 0) {
                return { div: new BN(0), mod: this };
            }
            if (num.length === 1) {
                if (mode === "div") {
                    return { div: this.divn(num.words[0]), mod: null };
                }
                if (mode === "mod") {
                    return { div: null, mod: new BN(this.modn(num.words[0])) };
                }
                return {
                    div: this.divn(num.words[0]),
                    mod: new BN(this.modn(num.words[0])),
                };
            }
            return this._wordDiv(num, mode);
        };
        BN.prototype.div = function div(num) {
            return this.divmod(num, "div", false).div;
        };
        BN.prototype.mod = function mod(num) {
            return this.divmod(num, "mod", false).mod;
        };
        BN.prototype.umod = function umod(num) {
            return this.divmod(num, "mod", true).mod;
        };
        BN.prototype.divRound = function divRound(num) {
            var dm = this.divmod(num);
            if (dm.mod.isZero()) return dm.div;
            var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
            var half = num.ushrn(1);
            var r2 = num.andln(1);
            var cmp = mod.cmp(half);
            if (cmp < 0 || (r2 === 1 && cmp === 0)) return dm.div;
            return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
        };
        BN.prototype.modn = function modn(num) {
            assert(num <= 67108863);
            var p = (1 << 26) % num;
            var acc = 0;
            for (var i = this.length - 1; i >= 0; i--) {
                acc = (p * acc + (this.words[i] | 0)) % num;
            }
            return acc;
        };
        BN.prototype.idivn = function idivn(num) {
            assert(num <= 67108863);
            var carry = 0;
            for (var i = this.length - 1; i >= 0; i--) {
                var w = (this.words[i] | 0) + carry * 67108864;
                this.words[i] = (w / num) | 0;
                carry = w % num;
            }
            return this.strip();
        };
        BN.prototype.divn = function divn(num) {
            return this.clone().idivn(num);
        };
        BN.prototype.egcd = function egcd(p) {
            assert(p.negative === 0);
            assert(!p.isZero());
            var x = this;
            var y = p.clone();
            if (x.negative !== 0) {
                x = x.umod(p);
            } else {
                x = x.clone();
            }
            var A = new BN(1);
            var B = new BN(0);
            var C = new BN(0);
            var D = new BN(1);
            var g = 0;
            while (x.isEven() && y.isEven()) {
                x.iushrn(1);
                y.iushrn(1);
                ++g;
            }
            var yp = y.clone();
            var xp = x.clone();
            while (!x.isZero()) {
                for (
                    var i = 0, im = 1;
                    (x.words[0] & im) === 0 && i < 26;
                    ++i, im <<= 1
                );
                if (i > 0) {
                    x.iushrn(i);
                    while (i-- > 0) {
                        if (A.isOdd() || B.isOdd()) {
                            A.iadd(yp);
                            B.isub(xp);
                        }
                        A.iushrn(1);
                        B.iushrn(1);
                    }
                }
                for (
                    var j = 0, jm = 1;
                    (y.words[0] & jm) === 0 && j < 26;
                    ++j, jm <<= 1
                );
                if (j > 0) {
                    y.iushrn(j);
                    while (j-- > 0) {
                        if (C.isOdd() || D.isOdd()) {
                            C.iadd(yp);
                            D.isub(xp);
                        }
                        C.iushrn(1);
                        D.iushrn(1);
                    }
                }
                if (x.cmp(y) >= 0) {
                    x.isub(y);
                    A.isub(C);
                    B.isub(D);
                } else {
                    y.isub(x);
                    C.isub(A);
                    D.isub(B);
                }
            }
            return { a: C, b: D, gcd: y.iushln(g) };
        };
        BN.prototype._invmp = function _invmp(p) {
            assert(p.negative === 0);
            assert(!p.isZero());
            var a = this;
            var b = p.clone();
            if (a.negative !== 0) {
                a = a.umod(p);
            } else {
                a = a.clone();
            }
            var x1 = new BN(1);
            var x2 = new BN(0);
            var delta = b.clone();
            while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
                for (
                    var i = 0, im = 1;
                    (a.words[0] & im) === 0 && i < 26;
                    ++i, im <<= 1
                );
                if (i > 0) {
                    a.iushrn(i);
                    while (i-- > 0) {
                        if (x1.isOdd()) {
                            x1.iadd(delta);
                        }
                        x1.iushrn(1);
                    }
                }
                for (
                    var j = 0, jm = 1;
                    (b.words[0] & jm) === 0 && j < 26;
                    ++j, jm <<= 1
                );
                if (j > 0) {
                    b.iushrn(j);
                    while (j-- > 0) {
                        if (x2.isOdd()) {
                            x2.iadd(delta);
                        }
                        x2.iushrn(1);
                    }
                }
                if (a.cmp(b) >= 0) {
                    a.isub(b);
                    x1.isub(x2);
                } else {
                    b.isub(a);
                    x2.isub(x1);
                }
            }
            var res;
            if (a.cmpn(1) === 0) {
                res = x1;
            } else {
                res = x2;
            }
            if (res.cmpn(0) < 0) {
                res.iadd(p);
            }
            return res;
        };
        BN.prototype.gcd = function gcd(num) {
            if (this.isZero()) return num.abs();
            if (num.isZero()) return this.abs();
            var a = this.clone();
            var b = num.clone();
            a.negative = 0;
            b.negative = 0;
            for (var shift = 0; a.isEven() && b.isEven(); shift++) {
                a.iushrn(1);
                b.iushrn(1);
            }
            do {
                while (a.isEven()) {
                    a.iushrn(1);
                }
                while (b.isEven()) {
                    b.iushrn(1);
                }
                var r = a.cmp(b);
                if (r < 0) {
                    var t = a;
                    a = b;
                    b = t;
                } else if (r === 0 || b.cmpn(1) === 0) {
                    break;
                }
                a.isub(b);
            } while (true);
            return b.iushln(shift);
        };
        BN.prototype.invm = function invm(num) {
            return this.egcd(num).a.umod(num);
        };
        BN.prototype.isEven = function isEven() {
            return (this.words[0] & 1) === 0;
        };
        BN.prototype.isOdd = function isOdd() {
            return (this.words[0] & 1) === 1;
        };
        BN.prototype.andln = function andln(num) {
            return this.words[0] & num;
        };
        BN.prototype.bincn = function bincn(bit) {
            assert(typeof bit === "number");
            var r = bit % 26;
            var s = (bit - r) / 26;
            var q = 1 << r;
            if (this.length <= s) {
                this._expand(s + 1);
                this.words[s] |= q;
                return this;
            }
            var carry = q;
            for (var i = s; carry !== 0 && i < this.length; i++) {
                var w = this.words[i] | 0;
                w += carry;
                carry = w >>> 26;
                w &= 67108863;
                this.words[i] = w;
            }
            if (carry !== 0) {
                this.words[i] = carry;
                this.length++;
            }
            return this;
        };
        BN.prototype.isZero = function isZero() {
            return this.length === 1 && this.words[0] === 0;
        };
        BN.prototype.cmpn = function cmpn(num) {
            var negative = num < 0;
            if (this.negative !== 0 && !negative) return -1;
            if (this.negative === 0 && negative) return 1;
            this.strip();
            var res;
            if (this.length > 1) {
                res = 1;
            } else {
                if (negative) {
                    num = -num;
                }
                assert(num <= 67108863, "Number is too big");
                var w = this.words[0] | 0;
                res = w === num ? 0 : w < num ? -1 : 1;
            }
            if (this.negative !== 0) return -res | 0;
            return res;
        };
        BN.prototype.cmp = function cmp(num) {
            if (this.negative !== 0 && num.negative === 0) return -1;
            if (this.negative === 0 && num.negative !== 0) return 1;
            var res = this.ucmp(num);
            if (this.negative !== 0) return -res | 0;
            return res;
        };
        BN.prototype.ucmp = function ucmp(num) {
            if (this.length > num.length) return 1;
            if (this.length < num.length) return -1;
            var res = 0;
            for (var i = this.length - 1; i >= 0; i--) {
                var a = this.words[i] | 0;
                var b = num.words[i] | 0;
                if (a === b) continue;
                if (a < b) {
                    res = -1;
                } else if (a > b) {
                    res = 1;
                }
                break;
            }
            return res;
        };
        BN.prototype.gtn = function gtn(num) {
            return this.cmpn(num) === 1;
        };
        BN.prototype.gt = function gt(num) {
            return this.cmp(num) === 1;
        };
        BN.prototype.gten = function gten(num) {
            return this.cmpn(num) >= 0;
        };
        BN.prototype.gte = function gte(num) {
            return this.cmp(num) >= 0;
        };
        BN.prototype.ltn = function ltn(num) {
            return this.cmpn(num) === -1;
        };
        BN.prototype.lt = function lt(num) {
            return this.cmp(num) === -1;
        };
        BN.prototype.lten = function lten(num) {
            return this.cmpn(num) <= 0;
        };
        BN.prototype.lte = function lte(num) {
            return this.cmp(num) <= 0;
        };
        BN.prototype.eqn = function eqn(num) {
            return this.cmpn(num) === 0;
        };
        BN.prototype.eq = function eq(num) {
            return this.cmp(num) === 0;
        };
        BN.red = function red(num) {
            return new Red(num);
        };
        BN.prototype.toRed = function toRed(ctx) {
            assert(!this.red, "Already a number in reduction context");
            assert(this.negative === 0, "red works only with positives");
            return ctx.convertTo(this)._forceRed(ctx);
        };
        BN.prototype.fromRed = function fromRed() {
            assert(this.red, "fromRed works only with numbers in reduction context");
            return this.red.convertFrom(this);
        };
        BN.prototype._forceRed = function _forceRed(ctx) {
            this.red = ctx;
            return this;
        };
        BN.prototype.forceRed = function forceRed(ctx) {
            assert(!this.red, "Already a number in reduction context");
            return this._forceRed(ctx);
        };
        BN.prototype.redAdd = function redAdd(num) {
            assert(this.red, "redAdd works only with red numbers");
            return this.red.add(this, num);
        };
        BN.prototype.redIAdd = function redIAdd(num) {
            assert(this.red, "redIAdd works only with red numbers");
            return this.red.iadd(this, num);
        };
        BN.prototype.redSub = function redSub(num) {
            assert(this.red, "redSub works only with red numbers");
            return this.red.sub(this, num);
        };
        BN.prototype.redISub = function redISub(num) {
            assert(this.red, "redISub works only with red numbers");
            return this.red.isub(this, num);
        };
        BN.prototype.redShl = function redShl(num) {
            assert(this.red, "redShl works only with red numbers");
            return this.red.shl(this, num);
        };
        BN.prototype.redMul = function redMul(num) {
            assert(this.red, "redMul works only with red numbers");
            this.red._verify2(this, num);
            return this.red.mul(this, num);
        };
        BN.prototype.redIMul = function redIMul(num) {
            assert(this.red, "redMul works only with red numbers");
            this.red._verify2(this, num);
            return this.red.imul(this, num);
        };
        BN.prototype.redSqr = function redSqr() {
            assert(this.red, "redSqr works only with red numbers");
            this.red._verify1(this);
            return this.red.sqr(this);
        };
        BN.prototype.redISqr = function redISqr() {
            assert(this.red, "redISqr works only with red numbers");
            this.red._verify1(this);
            return this.red.isqr(this);
        };
        BN.prototype.redSqrt = function redSqrt() {
            assert(this.red, "redSqrt works only with red numbers");
            this.red._verify1(this);
            return this.red.sqrt(this);
        };
        BN.prototype.redInvm = function redInvm() {
            assert(this.red, "redInvm works only with red numbers");
            this.red._verify1(this);
            return this.red.invm(this);
        };
        BN.prototype.redNeg = function redNeg() {
            assert(this.red, "redNeg works only with red numbers");
            this.red._verify1(this);
            return this.red.neg(this);
        };
        BN.prototype.redPow = function redPow(num) {
            assert(this.red && !num.red, "redPow(normalNum)");
            this.red._verify1(this);
            return this.red.pow(this, num);
        };
        var primes = { k256: null, p224: null, p192: null, p25519: null };
        function MPrime(name, p) {
            this.name = name;
            this.p = new BN(p, 16);
            this.n = this.p.bitLength();
            this.k = new BN(1).iushln(this.n).isub(this.p);
            this.tmp = this._tmp();
        }
        MPrime.prototype._tmp = function _tmp() {
            var tmp = new BN(null);
            tmp.words = new Array(Math.ceil(this.n / 13));
            return tmp;
        };
        MPrime.prototype.ireduce = function ireduce(num) {
            var r = num;
            var rlen;
            do {
                this.split(r, this.tmp);
                r = this.imulK(r);
                r = r.iadd(this.tmp);
                rlen = r.bitLength();
            } while (rlen > this.n);
            var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
            if (cmp === 0) {
                r.words[0] = 0;
                r.length = 1;
            } else if (cmp > 0) {
                r.isub(this.p);
            } else {
                if (r.strip !== undefined) {
                    r.strip();
                } else {
                    r._strip();
                }
            }
            return r;
        };
        MPrime.prototype.split = function split(input, out) {
            input.iushrn(this.n, 0, out);
        };
        MPrime.prototype.imulK = function imulK(num) {
            return num.imul(this.k);
        };
        function K256() {
            MPrime.call(
                this,
                "k256",
                "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
            );
        }
        inherits(K256, MPrime);
        K256.prototype.split = function split(input, output) {
            var mask = 4194303;
            var outLen = Math.min(input.length, 9);
            for (var i = 0; i < outLen; i++) {
                output.words[i] = input.words[i];
            }
            output.length = outLen;
            if (input.length <= 9) {
                input.words[0] = 0;
                input.length = 1;
                return;
            }
            var prev = input.words[9];
            output.words[output.length++] = prev & mask;
            for (i = 10; i < input.length; i++) {
                var next = input.words[i] | 0;
                input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
                prev = next;
            }
            prev >>>= 22;
            input.words[i - 10] = prev;
            if (prev === 0 && input.length > 10) {
                input.length -= 10;
            } else {
                input.length -= 9;
            }
        };
        K256.prototype.imulK = function imulK(num) {
            num.words[num.length] = 0;
            num.words[num.length + 1] = 0;
            num.length += 2;
            var lo = 0;
            for (var i = 0; i < num.length; i++) {
                var w = num.words[i] | 0;
                lo += w * 977;
                num.words[i] = lo & 67108863;
                lo = w * 64 + ((lo / 67108864) | 0);
            }
            if (num.words[num.length - 1] === 0) {
                num.length--;
                if (num.words[num.length - 1] === 0) {
                    num.length--;
                }
            }
            return num;
        };
        function P224() {
            MPrime.call(
                this,
                "p224",
                "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
            );
        }
        inherits(P224, MPrime);
        function P192() {
            MPrime.call(
                this,
                "p192",
                "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
            );
        }
        inherits(P192, MPrime);
        function P25519() {
            MPrime.call(
                this,
                "25519",
                "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
            );
        }
        inherits(P25519, MPrime);
        P25519.prototype.imulK = function imulK(num) {
            var carry = 0;
            for (var i = 0; i < num.length; i++) {
                var hi = (num.words[i] | 0) * 19 + carry;
                var lo = hi & 67108863;
                hi >>>= 26;
                num.words[i] = lo;
                carry = hi;
            }
            if (carry !== 0) {
                num.words[num.length++] = carry;
            }
            return num;
        };
        BN._prime = function prime(name) {
            if (primes[name]) return primes[name];
            var prime;
            if (name === "k256") {
                prime = new K256();
            } else if (name === "p224") {
                prime = new P224();
            } else if (name === "p192") {
                prime = new P192();
            } else if (name === "p25519") {
                prime = new P25519();
            } else {
                throw new Error("Unknown prime " + name);
            }
            primes[name] = prime;
            return prime;
        };
        function Red(m) {
            if (typeof m === "string") {
                var prime = BN._prime(m);
                this.m = prime.p;
                this.prime = prime;
            } else {
                assert(m.gtn(1), "modulus must be greater than 1");
                this.m = m;
                this.prime = null;
            }
        }
        Red.prototype._verify1 = function _verify1(a) {
            assert(a.negative === 0, "red works only with positives");
            assert(a.red, "red works only with red numbers");
        };
        Red.prototype._verify2 = function _verify2(a, b) {
            assert((a.negative | b.negative) === 0, "red works only with positives");
            assert(a.red && a.red === b.red, "red works only with red numbers");
        };
        Red.prototype.imod = function imod(a) {
            if (this.prime) return this.prime.ireduce(a)._forceRed(this);
            return a.umod(this.m)._forceRed(this);
        };
        Red.prototype.neg = function neg(a) {
            if (a.isZero()) {
                return a.clone();
            }
            return this.m.sub(a)._forceRed(this);
        };
        Red.prototype.add = function add(a, b) {
            this._verify2(a, b);
            var res = a.add(b);
            if (res.cmp(this.m) >= 0) {
                res.isub(this.m);
            }
            return res._forceRed(this);
        };
        Red.prototype.iadd = function iadd(a, b) {
            this._verify2(a, b);
            var res = a.iadd(b);
            if (res.cmp(this.m) >= 0) {
                res.isub(this.m);
            }
            return res;
        };
        Red.prototype.sub = function sub(a, b) {
            this._verify2(a, b);
            var res = a.sub(b);
            if (res.cmpn(0) < 0) {
                res.iadd(this.m);
            }
            return res._forceRed(this);
        };
        Red.prototype.isub = function isub(a, b) {
            this._verify2(a, b);
            var res = a.isub(b);
            if (res.cmpn(0) < 0) {
                res.iadd(this.m);
            }
            return res;
        };
        Red.prototype.shl = function shl(a, num) {
            this._verify1(a);
            return this.imod(a.ushln(num));
        };
        Red.prototype.imul = function imul(a, b) {
            this._verify2(a, b);
            return this.imod(a.imul(b));
        };
        Red.prototype.mul = function mul(a, b) {
            this._verify2(a, b);
            return this.imod(a.mul(b));
        };
        Red.prototype.isqr = function isqr(a) {
            return this.imul(a, a.clone());
        };
        Red.prototype.sqr = function sqr(a) {
            return this.mul(a, a);
        };
        Red.prototype.sqrt = function sqrt(a) {
            if (a.isZero()) return a.clone();
            var mod3 = this.m.andln(3);
            assert(mod3 % 2 === 1);
            if (mod3 === 3) {
                var pow = this.m.add(new BN(1)).iushrn(2);
                return this.pow(a, pow);
            }
            var q = this.m.subn(1);
            var s = 0;
            while (!q.isZero() && q.andln(1) === 0) {
                s++;
                q.iushrn(1);
            }
            assert(!q.isZero());
            var one = new BN(1).toRed(this);
            var nOne = one.redNeg();
            var lpow = this.m.subn(1).iushrn(1);
            var z = this.m.bitLength();
            z = new BN(2 * z * z).toRed(this);
            while (this.pow(z, lpow).cmp(nOne) !== 0) {
                z.redIAdd(nOne);
            }
            var c = this.pow(z, q);
            var r = this.pow(a, q.addn(1).iushrn(1));
            var t = this.pow(a, q);
            var m = s;
            while (t.cmp(one) !== 0) {
                var tmp = t;
                for (var i = 0; tmp.cmp(one) !== 0; i++) {
                    tmp = tmp.redSqr();
                }
                assert(i < m);
                var b = this.pow(c, new BN(1).iushln(m - i - 1));
                r = r.redMul(b);
                c = b.redSqr();
                t = t.redMul(c);
                m = i;
            }
            return r;
        };
        Red.prototype.invm = function invm(a) {
            var inv = a._invmp(this.m);
            if (inv.negative !== 0) {
                inv.negative = 0;
                return this.imod(inv).redNeg();
            } else {
                return this.imod(inv);
            }
        };
        Red.prototype.pow = function pow(a, num) {
            if (num.isZero()) return new BN(1).toRed(this);
            if (num.cmpn(1) === 0) return a.clone();
            var windowSize = 4;
            var wnd = new Array(1 << windowSize);
            wnd[0] = new BN(1).toRed(this);
            wnd[1] = a;
            for (var i = 2; i < wnd.length; i++) {
                wnd[i] = this.mul(wnd[i - 1], a);
            }
            var res = wnd[0];
            var current = 0;
            var currentLen = 0;
            var start = num.bitLength() % 26;
            if (start === 0) {
                start = 26;
            }
            for (i = num.length - 1; i >= 0; i--) {
                var word = num.words[i];
                for (var j = start - 1; j >= 0; j--) {
                    var bit = (word >> j) & 1;
                    if (res !== wnd[0]) {
                        res = this.sqr(res);
                    }
                    if (bit === 0 && current === 0) {
                        currentLen = 0;
                        continue;
                    }
                    current <<= 1;
                    current |= bit;
                    currentLen++;
                    if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
                    res = this.mul(res, wnd[current]);
                    currentLen = 0;
                    current = 0;
                }
                start = 26;
            }
            return res;
        };
        Red.prototype.convertTo = function convertTo(num) {
            var r = num.umod(this.m);
            return r === num ? r.clone() : r;
        };
        Red.prototype.convertFrom = function convertFrom(num) {
            var res = num.clone();
            res.red = null;
            return res;
        };
        BN.mont = function mont(num) {
            return new Mont(num);
        };
        function Mont(m) {
            Red.call(this, m);
            this.shift = this.m.bitLength();
            if (this.shift % 26 !== 0) {
                this.shift += 26 - (this.shift % 26);
            }
            this.r = new BN(1).iushln(this.shift);
            this.r2 = this.imod(this.r.sqr());
            this.rinv = this.r._invmp(this.m);
            this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
            this.minv = this.minv.umod(this.r);
            this.minv = this.r.sub(this.minv);
        }
        inherits(Mont, Red);
        Mont.prototype.convertTo = function convertTo(num) {
            return this.imod(num.ushln(this.shift));
        };
        Mont.prototype.convertFrom = function convertFrom(num) {
            var r = this.imod(num.mul(this.rinv));
            r.red = null;
            return r;
        };
        Mont.prototype.imul = function imul(a, b) {
            if (a.isZero() || b.isZero()) {
                a.words[0] = 0;
                a.length = 1;
                return a;
            }
            var t = a.imul(b);
            var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
            var u = t.isub(c).iushrn(this.shift);
            var res = u;
            if (u.cmp(this.m) >= 0) {
                res = u.isub(this.m);
            } else if (u.cmpn(0) < 0) {
                res = u.iadd(this.m);
            }
            return res._forceRed(this);
        };
        Mont.prototype.mul = function mul(a, b) {
            if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
            var t = a.mul(b);
            var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
            var u = t.isub(c).iushrn(this.shift);
            var res = u;
            if (u.cmp(this.m) >= 0) {
                res = u.isub(this.m);
            } else if (u.cmpn(0) < 0) {
                res = u.iadd(this.m);
            }
            return res._forceRed(this);
        };
        Mont.prototype.invm = function invm(a) {
            var res = this.imod(a._invmp(this.m).mul(this.r2));
            return res._forceRed(this);
        };
    })("object" === "undefined" || module, commonjsGlobal);
});
const version = "logger/5.1.0";
("use strict");
let _permanentCensorErrors = false;
let _censorErrors = false;
const LogLevels = {
    debug: 1,
    default: 2,
    info: 2,
    warning: 3,
    error: 4,
    off: 5,
};
let _logLevel = LogLevels["default"];
let _globalLogger = null;
function _checkNormalize() {
    try {
        const missing = [];
        ["NFD", "NFC", "NFKD", "NFKC"].forEach((form) => {
            try {
                if ("test".normalize(form) !== "test") {
                    throw new Error("bad normalize");
                }
            } catch (error) {
                missing.push(form);
            }
        });
        if (missing.length) {
            throw new Error("missing " + missing.join(", "));
        }
        if (
            String.fromCharCode(233).normalize("NFD") !==
            String.fromCharCode(101, 769)
        ) {
            throw new Error("broken implementation");
        }
    } catch (error) {
        return error.message;
    }
    return null;
}
const _normalizeError = _checkNormalize();
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
    ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
    ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
    ErrorCode["MISSING_NEW"] = "MISSING_NEW";
    ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
    ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
    ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
    ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
    ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
    ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
})(ErrorCode || (ErrorCode = {}));
class Logger {
    constructor(version) {
        Object.defineProperty(this, "version", {
            enumerable: true,
            value: version,
            writable: false,
        });
    }
    _log(logLevel, args) {
        const level = logLevel.toLowerCase();
        if (LogLevels[level] == null) {
            this.throwArgumentError("invalid log level name", "logLevel", logLevel);
        }
        if (_logLevel > LogLevels[level]) {
            return;
        }
        console.log.apply(console, args);
    }
    debug(...args) {
        this._log(Logger.levels.DEBUG, args);
    }
    info(...args) {
        this._log(Logger.levels.INFO, args);
    }
    warn(...args) {
        this._log(Logger.levels.WARNING, args);
    }
    makeError(message, code, params) {
        if (_censorErrors) {
            return this.makeError("censored error", code, {});
        }
        if (!code) {
            code = Logger.errors.UNKNOWN_ERROR;
        }
        if (!params) {
            params = {};
        }
        const messageDetails = [];
        Object.keys(params).forEach((key) => {
            try {
                messageDetails.push(key + "=" + JSON.stringify(params[key]));
            } catch (error) {
                messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
            }
        });
        messageDetails.push(`code=${code}`);
        messageDetails.push(`version=${this.version}`);
        const reason = message;
        if (messageDetails.length) {
            message += " (" + messageDetails.join(", ") + ")";
        }
        const error = new Error(message);
        error.reason = reason;
        error.code = code;
        Object.keys(params).forEach(function (key) {
            error[key] = params[key];
        });
        return error;
    }
    throwError(message, code, params) {
        throw this.makeError(message, code, params);
    }
    throwArgumentError(message, name, value) {
        return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
            argument: name,
            value: value,
        });
    }
    assert(condition, message, code, params) {
        if (!!condition) {
            return;
        }
        this.throwError(message, code, params);
    }
    assertArgument(condition, message, name, value) {
        if (!!condition) {
            return;
        }
        this.throwArgumentError(message, name, value);
    }
    checkNormalize(message) {
        if (message == null) {
            message = "platform missing String.prototype.normalize";
        }
        if (_normalizeError) {
            this.throwError(
                "platform missing String.prototype.normalize",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "String.prototype.normalize", form: _normalizeError }
            );
        }
    }
    checkSafeUint53(value, message) {
        if (typeof value !== "number") {
            return;
        }
        if (message == null) {
            message = "value not safe";
        }
        if (value < 0 || value >= 9007199254740991) {
            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "out-of-safe-range",
                value: value,
            });
        }
        if (value % 1) {
            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "non-integer",
                value: value,
            });
        }
    }
    checkArgumentCount(count, expectedCount, message) {
        if (message) {
            message = ": " + message;
        } else {
            message = "";
        }
        if (count < expectedCount) {
            this.throwError(
                "missing argument" + message,
                Logger.errors.MISSING_ARGUMENT,
                { count: count, expectedCount: expectedCount }
            );
        }
        if (count > expectedCount) {
            this.throwError(
                "too many arguments" + message,
                Logger.errors.UNEXPECTED_ARGUMENT,
                { count: count, expectedCount: expectedCount }
            );
        }
    }
    checkNew(target, kind) {
        if (target === Object || target == null) {
            this.throwError("missing new", Logger.errors.MISSING_NEW, {
                name: kind.name,
            });
        }
    }
    checkAbstract(target, kind) {
        if (target === kind) {
            this.throwError(
                "cannot instantiate abstract class " +
                JSON.stringify(kind.name) +
                " directly; use a sub-class",
                Logger.errors.UNSUPPORTED_OPERATION,
                { name: target.name, operation: "new" }
            );
        } else if (target === Object || target == null) {
            this.throwError("missing new", Logger.errors.MISSING_NEW, {
                name: kind.name,
            });
        }
    }
    static globalLogger() {
        if (!_globalLogger) {
            _globalLogger = new Logger(version);
        }
        return _globalLogger;
    }
    static setCensorship(censorship, permanent) {
        if (!censorship && permanent) {
            this.globalLogger().throwError(
                "cannot permanently disable censorship",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "setCensorship" }
            );
        }
        if (_permanentCensorErrors) {
            if (!censorship) {
                return;
            }
            this.globalLogger().throwError(
                "error censorship permanent",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "setCensorship" }
            );
        }
        _censorErrors = !!censorship;
        _permanentCensorErrors = !!permanent;
    }
    static setLogLevel(logLevel) {
        const level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            Logger.globalLogger().warn("invalid log level - " + logLevel);
            return;
        }
        _logLevel = level;
    }
    static from(version) {
        return new Logger(version);
    }
}
Logger.errors = ErrorCode;
Logger.levels = LogLevel;
const version$1 = "bytes/5.1.0";
("use strict");
const logger = new Logger(version$1);
function isHexable(value) {
    return !!value.toHexString;
}
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        const args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
    };
    return array;
}
function isBytesLike(value) {
    return (isHexString(value) && !(value.length % 2)) || isBytes(value);
}
function isBytes(value) {
    if (value == null) {
        return false;
    }
    if (value.constructor === Uint8Array) {
        return true;
    }
    if (typeof value === "string") {
        return false;
    }
    if (value.length == null) {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (typeof v !== "number" || v < 0 || v >= 256 || v % 1) {
            return false;
        }
    }
    return true;
}
function arrayify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof value === "number") {
        logger.checkSafeUint53(value, "invalid arrayify value");
        const result = [];
        while (value) {
            result.unshift(value & 255);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return addSlice(new Uint8Array(result));
    }
    if (
        options.allowMissingPrefix &&
        typeof value === "string" &&
        value.substring(0, 2) !== "0x"
    ) {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (isHexString(value)) {
        let hex = value.substring(2);
        if (hex.length % 2) {
            if (options.hexPad === "left") {
                hex = "0x0" + hex.substring(2);
            } else if (options.hexPad === "right") {
                hex += "0";
            } else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        const result = [];
        for (let i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isBytes(value)) {
        return addSlice(new Uint8Array(value));
    }
    return logger.throwArgumentError("invalid arrayify value", "value", value);
}
function concat(items) {
    const objects = items.map((item) => arrayify(item));
    const length = objects.reduce((accum, item) => accum + item.length, 0);
    const result = new Uint8Array(length);
    objects.reduce((offset, object) => {
        result.set(object, offset);
        return offset + object.length;
    }, 0);
    return addSlice(result);
}
function stripZeros(value) {
    let result = arrayify(value);
    if (result.length === 0) {
        return result;
    }
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }
    if (start) {
        result = result.slice(start);
    }
    return result;
}
function zeroPad(value, length) {
    value = arrayify(value);
    if (value.length > length) {
        logger.throwArgumentError("value out of range", "value", arguments[0]);
    }
    const result = new Uint8Array(length);
    result.set(value, length - value.length);
    return addSlice(result);
}
function isHexString(value, length) {
    if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
const HexCharacters = "0123456789abcdef";
function hexlify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof value === "number") {
        logger.checkSafeUint53(value, "invalid hexlify value");
        let hex = "";
        while (value) {
            hex = HexCharacters[value & 15] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = "0" + hex;
            }
            return "0x" + hex;
        }
        return "0x00";
    }
    if (
        options.allowMissingPrefix &&
        typeof value === "string" &&
        value.substring(0, 2) !== "0x"
    ) {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        return value.toHexString();
    }
    if (isHexString(value)) {
        if (value.length % 2) {
            if (options.hexPad === "left") {
                value = "0x0" + value.substring(2);
            } else if (options.hexPad === "right") {
                value += "0";
            } else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        return value.toLowerCase();
    }
    if (isBytes(value)) {
        let result = "0x";
        for (let i = 0; i < value.length; i++) {
            let v = value[i];
            result += HexCharacters[(v & 240) >> 4] + HexCharacters[v & 15];
        }
        return result;
    }
    return logger.throwArgumentError("invalid hexlify value", "value", value);
}
function hexDataLength(data) {
    if (typeof data !== "string") {
        data = hexlify(data);
    } else if (!isHexString(data) || data.length % 2) {
        return null;
    }
    return (data.length - 2) / 2;
}
function hexDataSlice(data, offset, endOffset) {
    if (typeof data !== "string") {
        data = hexlify(data);
    } else if (!isHexString(data) || data.length % 2) {
        logger.throwArgumentError("invalid hexData", "value", data);
    }
    offset = 2 + 2 * offset;
    if (endOffset != null) {
        return "0x" + data.substring(offset, 2 + 2 * endOffset);
    }
    return "0x" + data.substring(offset);
}
function hexConcat(items) {
    let result = "0x";
    items.forEach((item) => {
        result += hexlify(item).substring(2);
    });
    return result;
}
function hexValue(value) {
    const trimmed = hexStripZeros(hexlify(value, { hexPad: "left" }));
    if (trimmed === "0x") {
        return "0x0";
    }
    return trimmed;
}
function hexStripZeros(value) {
    if (typeof value !== "string") {
        value = hexlify(value);
    }
    if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    value = value.substring(2);
    let offset = 0;
    while (offset < value.length && value[offset] === "0") {
        offset++;
    }
    return "0x" + value.substring(offset);
}
function hexZeroPad(value, length) {
    if (typeof value !== "string") {
        value = hexlify(value);
    } else if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    if (value.length > 2 * length + 2) {
        logger.throwArgumentError("value out of range", "value", arguments[1]);
    }
    while (value.length < 2 * length + 2) {
        value = "0x0" + value.substring(2);
    }
    return value;
}
function splitSignature(signature) {
    const result = { r: "0x", s: "0x", _vs: "0x", recoveryParam: 0, v: 0 };
    if (isBytesLike(signature)) {
        const bytes = arrayify(signature);
        if (bytes.length !== 65) {
            logger.throwArgumentError(
                "invalid signature string; must be 65 bytes",
                "signature",
                signature
            );
        }
        result.r = hexlify(bytes.slice(0, 32));
        result.s = hexlify(bytes.slice(32, 64));
        result.v = bytes[64];
        if (result.v < 27) {
            if (result.v === 0 || result.v === 1) {
                result.v += 27;
            } else {
                logger.throwArgumentError(
                    "signature invalid v byte",
                    "signature",
                    signature
                );
            }
        }
        result.recoveryParam = 1 - (result.v % 2);
        if (result.recoveryParam) {
            bytes[32] |= 128;
        }
        result._vs = hexlify(bytes.slice(32, 64));
    } else {
        result.r = signature.r;
        result.s = signature.s;
        result.v = signature.v;
        result.recoveryParam = signature.recoveryParam;
        result._vs = signature._vs;
        if (result._vs != null) {
            const vs = zeroPad(arrayify(result._vs), 32);
            result._vs = hexlify(vs);
            const recoveryParam = vs[0] >= 128 ? 1 : 0;
            if (result.recoveryParam == null) {
                result.recoveryParam = recoveryParam;
            } else if (result.recoveryParam !== recoveryParam) {
                logger.throwArgumentError(
                    "signature recoveryParam mismatch _vs",
                    "signature",
                    signature
                );
            }
            vs[0] &= 127;
            const s = hexlify(vs);
            if (result.s == null) {
                result.s = s;
            } else if (result.s !== s) {
                logger.throwArgumentError(
                    "signature v mismatch _vs",
                    "signature",
                    signature
                );
            }
        }
        if (result.recoveryParam == null) {
            if (result.v == null) {
                logger.throwArgumentError(
                    "signature missing v and recoveryParam",
                    "signature",
                    signature
                );
            } else if (result.v === 0 || result.v === 1) {
                result.recoveryParam = result.v;
            } else {
                result.recoveryParam = 1 - (result.v % 2);
            }
        } else {
            if (result.v == null) {
                result.v = 27 + result.recoveryParam;
            } else if (result.recoveryParam !== 1 - (result.v % 2)) {
                logger.throwArgumentError(
                    "signature recoveryParam mismatch v",
                    "signature",
                    signature
                );
            }
        }
        if (result.r == null || !isHexString(result.r)) {
            logger.throwArgumentError(
                "signature missing or invalid r",
                "signature",
                signature
            );
        } else {
            result.r = hexZeroPad(result.r, 32);
        }
        if (result.s == null || !isHexString(result.s)) {
            logger.throwArgumentError(
                "signature missing or invalid s",
                "signature",
                signature
            );
        } else {
            result.s = hexZeroPad(result.s, 32);
        }
        const vs = arrayify(result.s);
        if (vs[0] >= 128) {
            logger.throwArgumentError(
                "signature s out of range",
                "signature",
                signature
            );
        }
        if (result.recoveryParam) {
            vs[0] |= 128;
        }
        const _vs = hexlify(vs);
        if (result._vs) {
            if (!isHexString(result._vs)) {
                logger.throwArgumentError(
                    "signature invalid _vs",
                    "signature",
                    signature
                );
            }
            result._vs = hexZeroPad(result._vs, 32);
        }
        if (result._vs == null) {
            result._vs = _vs;
        } else if (result._vs !== _vs) {
            logger.throwArgumentError(
                "signature _vs mismatch v and s",
                "signature",
                signature
            );
        }
    }
    return result;
}
function joinSignature(signature) {
    signature = splitSignature(signature);
    return hexlify(
        concat([
            signature.r,
            signature.s,
            signature.recoveryParam ? "0x1c" : "0x1b",
        ])
    );
}
const version$2 = "bignumber/5.1.1";
("use strict");
var BN = bn.BN;
const logger$1 = new Logger(version$2);
const _constructorGuard = {};
const MAX_SAFE = 9007199254740991;
function isBigNumberish(value) {
    return (
        value != null &&
        (BigNumber.isBigNumber(value) ||
            (typeof value === "number" && value % 1 === 0) ||
            (typeof value === "string" && !!value.match(/^-?[0-9]+$/)) ||
            isHexString(value) ||
            typeof value === "bigint" ||
            isBytes(value))
    );
}
let _warnedToStringRadix = false;
class BigNumber {
    constructor(constructorGuard, hex) {
        logger$1.checkNew(new.target, BigNumber);
        if (constructorGuard !== _constructorGuard) {
            logger$1.throwError(
                "cannot call constructor directly; use BigNumber.from",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "new (BigNumber)" }
            );
        }
        this._hex = hex;
        this._isBigNumber = true;
        Object.freeze(this);
    }
    fromTwos(value) {
        return toBigNumber(toBN(this).fromTwos(value));
    }
    toTwos(value) {
        return toBigNumber(toBN(this).toTwos(value));
    }
    abs() {
        if (this._hex[0] === "-") {
            return BigNumber.from(this._hex.substring(1));
        }
        return this;
    }
    add(other) {
        return toBigNumber(toBN(this).add(toBN(other)));
    }
    sub(other) {
        return toBigNumber(toBN(this).sub(toBN(other)));
    }
    div(other) {
        const o = BigNumber.from(other);
        if (o.isZero()) {
            throwFault("division by zero", "div");
        }
        return toBigNumber(toBN(this).div(toBN(other)));
    }
    mul(other) {
        return toBigNumber(toBN(this).mul(toBN(other)));
    }
    mod(other) {
        const value = toBN(other);
        if (value.isNeg()) {
            throwFault("cannot modulo negative values", "mod");
        }
        return toBigNumber(toBN(this).umod(value));
    }
    pow(other) {
        const value = toBN(other);
        if (value.isNeg()) {
            throwFault("cannot raise to negative values", "pow");
        }
        return toBigNumber(toBN(this).pow(value));
    }
    and(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("cannot 'and' negative values", "and");
        }
        return toBigNumber(toBN(this).and(value));
    }
    or(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("cannot 'or' negative values", "or");
        }
        return toBigNumber(toBN(this).or(value));
    }
    xor(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("cannot 'xor' negative values", "xor");
        }
        return toBigNumber(toBN(this).xor(value));
    }
    mask(value) {
        if (this.isNegative() || value < 0) {
            throwFault("cannot mask negative values", "mask");
        }
        return toBigNumber(toBN(this).maskn(value));
    }
    shl(value) {
        if (this.isNegative() || value < 0) {
            throwFault("cannot shift negative values", "shl");
        }
        return toBigNumber(toBN(this).shln(value));
    }
    shr(value) {
        if (this.isNegative() || value < 0) {
            throwFault("cannot shift negative values", "shr");
        }
        return toBigNumber(toBN(this).shrn(value));
    }
    eq(other) {
        return toBN(this).eq(toBN(other));
    }
    lt(other) {
        return toBN(this).lt(toBN(other));
    }
    lte(other) {
        return toBN(this).lte(toBN(other));
    }
    gt(other) {
        return toBN(this).gt(toBN(other));
    }
    gte(other) {
        return toBN(this).gte(toBN(other));
    }
    isNegative() {
        return this._hex[0] === "-";
    }
    isZero() {
        return toBN(this).isZero();
    }
    toNumber() {
        try {
            return toBN(this).toNumber();
        } catch (error) {
            throwFault("overflow", "toNumber", this.toString());
        }
        return null;
    }
    toBigInt() {
        try {
            return BigInt(this.toString());
        } catch (e) { }
        return logger$1.throwError(
            "this platform does not support BigInt",
            Logger.errors.UNSUPPORTED_OPERATION,
            { value: this.toString() }
        );
    }
    toString() {
        if (arguments.length > 0) {
            if (arguments[0] === 10) {
                if (!_warnedToStringRadix) {
                    _warnedToStringRadix = true;
                    logger$1.warn(
                        "BigNumber.toString does not accept any parameters; base-10 is assumed"
                    );
                }
            } else if (arguments[0] === 16) {
                logger$1.throwError(
                    "BigNumber.toString does not accept any parameters; use bigNumber.toHexString()",
                    Logger.errors.UNEXPECTED_ARGUMENT,
                    {}
                );
            } else {
                logger$1.throwError(
                    "BigNumber.toString does not accept parameters",
                    Logger.errors.UNEXPECTED_ARGUMENT,
                    {}
                );
            }
        }
        return toBN(this).toString(10);
    }
    toHexString() {
        return this._hex;
    }
    toJSON(key) {
        return { type: "BigNumber", hex: this.toHexString() };
    }
    static from(value) {
        if (value instanceof BigNumber) {
            return value;
        }
        if (typeof value === "string") {
            if (value.match(/^-?0x[0-9a-f]+$/i)) {
                return new BigNumber(_constructorGuard, toHex(value));
            }
            if (value.match(/^-?[0-9]+$/)) {
                return new BigNumber(_constructorGuard, toHex(new BN(value)));
            }
            return logger$1.throwArgumentError(
                "invalid BigNumber string",
                "value",
                value
            );
        }
        if (typeof value === "number") {
            if (value % 1) {
                throwFault("underflow", "BigNumber.from", value);
            }
            if (value >= MAX_SAFE || value <= -MAX_SAFE) {
                throwFault("overflow", "BigNumber.from", value);
            }
            return BigNumber.from(String(value));
        }
        const anyValue = value;
        if (typeof anyValue === "bigint") {
            return BigNumber.from(anyValue.toString());
        }
        if (isBytes(anyValue)) {
            return BigNumber.from(hexlify(anyValue));
        }
        if (anyValue) {
            if (anyValue.toHexString) {
                const hex = anyValue.toHexString();
                if (typeof hex === "string") {
                    return BigNumber.from(hex);
                }
            } else {
                let hex = anyValue._hex;
                if (hex == null && anyValue.type === "BigNumber") {
                    hex = anyValue.hex;
                }
                if (typeof hex === "string") {
                    if (
                        isHexString(hex) ||
                        (hex[0] === "-" && isHexString(hex.substring(1)))
                    ) {
                        return BigNumber.from(hex);
                    }
                }
            }
        }
        return logger$1.throwArgumentError(
            "invalid BigNumber value",
            "value",
            value
        );
    }
    static isBigNumber(value) {
        return !!(value && value._isBigNumber);
    }
}
function toHex(value) {
    if (typeof value !== "string") {
        return toHex(value.toString(16));
    }
    if (value[0] === "-") {
        value = value.substring(1);
        if (value[0] === "-") {
            logger$1.throwArgumentError("invalid hex", "value", value);
        }
        value = toHex(value);
        if (value === "0x00") {
            return value;
        }
        return "-" + value;
    }
    if (value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (value === "0x") {
        return "0x00";
    }
    if (value.length % 2) {
        value = "0x0" + value.substring(2);
    }
    while (value.length > 4 && value.substring(0, 4) === "0x00") {
        value = "0x" + value.substring(4);
    }
    return value;
}
function toBigNumber(value) {
    return BigNumber.from(toHex(value));
}
function toBN(value) {
    const hex = BigNumber.from(value).toHexString();
    if (hex[0] === "-") {
        return new BN("-" + hex.substring(3), 16);
    }
    return new BN(hex.substring(2), 16);
}
function throwFault(fault, operation, value) {
    const params = { fault: fault, operation: operation };
    if (value != null) {
        params.value = value;
    }
    return logger$1.throwError(fault, Logger.errors.NUMERIC_FAULT, params);
}
function _base36To16(value) {
    return new BN(value, 36).toString(16);
}
function _base16To36(value) {
    return new BN(value, 16).toString(36);
}
("use strict");
const logger$2 = new Logger(version$2);
const _constructorGuard$1 = {};
const Zero = BigNumber.from(0);
const NegativeOne = BigNumber.from(-1);
function throwFault$1(message, fault, operation, value) {
    const params = { fault: fault, operation: operation };
    if (value !== undefined) {
        params.value = value;
    }
    return logger$2.throwError(message, Logger.errors.NUMERIC_FAULT, params);
}
let zeros = "0";
while (zeros.length < 256) {
    zeros += zeros;
}
function getMultiplier(decimals) {
    if (typeof decimals !== "number") {
        try {
            decimals = BigNumber.from(decimals).toNumber();
        } catch (e) { }
    }
    if (
        typeof decimals === "number" &&
        decimals >= 0 &&
        decimals <= 256 &&
        !(decimals % 1)
    ) {
        return "1" + zeros.substring(0, decimals);
    }
    return logger$2.throwArgumentError(
        "invalid decimal size",
        "decimals",
        decimals
    );
}
function formatFixed(value, decimals) {
    if (decimals == null) {
        decimals = 0;
    }
    const multiplier = getMultiplier(decimals);
    value = BigNumber.from(value);
    const negative = value.lt(Zero);
    if (negative) {
        value = value.mul(NegativeOne);
    }
    let fraction = value.mod(multiplier).toString();
    while (fraction.length < multiplier.length - 1) {
        fraction = "0" + fraction;
    }
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    const whole = value.div(multiplier).toString();
    value = whole + "." + fraction;
    if (negative) {
        value = "-" + value;
    }
    return value;
}
function parseFixed(value, decimals) {
    if (decimals == null) {
        decimals = 0;
    }
    const multiplier = getMultiplier(decimals);
    if (typeof value !== "string" || !value.match(/^-?[0-9.,]+$/)) {
        logger$2.throwArgumentError("invalid decimal value", "value", value);
    }
    if (multiplier.length - 1 === 0) {
        return BigNumber.from(value);
    }
    const negative = value.substring(0, 1) === "-";
    if (negative) {
        value = value.substring(1);
    }
    if (value === ".") {
        logger$2.throwArgumentError("missing value", "value", value);
    }
    const comps = value.split(".");
    if (comps.length > 2) {
        logger$2.throwArgumentError("too many decimal points", "value", value);
    }
    let whole = comps[0],
        fraction = comps[1];
    if (!whole) {
        whole = "0";
    }
    if (!fraction) {
        fraction = "0";
    }
    if (fraction.length > multiplier.length - 1) {
        throwFault$1(
            "fractional component exceeds decimals",
            "underflow",
            "parseFixed"
        );
    }
    while (fraction.length < multiplier.length - 1) {
        fraction += "0";
    }
    const wholeValue = BigNumber.from(whole);
    const fractionValue = BigNumber.from(fraction);
    let wei = wholeValue.mul(multiplier).add(fractionValue);
    if (negative) {
        wei = wei.mul(NegativeOne);
    }
    return wei;
}
class FixedFormat {
    constructor(constructorGuard, signed, width, decimals) {
        if (constructorGuard !== _constructorGuard$1) {
            logger$2.throwError(
                "cannot use FixedFormat constructor; use FixedFormat.from",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "new FixedFormat" }
            );
        }
        this.signed = signed;
        this.width = width;
        this.decimals = decimals;
        this.name =
            (signed ? "" : "u") + "fixed" + String(width) + "x" + String(decimals);
        this._multiplier = getMultiplier(decimals);
        Object.freeze(this);
    }
    static from(value) {
        if (value instanceof FixedFormat) {
            return value;
        }
        let signed = true;
        let width = 128;
        let decimals = 18;
        if (typeof value === "string") {
            if (value === "fixed") {
            } else if (value === "ufixed") {
                signed = false;
            } else if (value != null) {
                const match = value.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
                if (!match) {
                    logger$2.throwArgumentError("invalid fixed format", "format", value);
                }
                signed = match[1] !== "u";
                width = parseInt(match[2]);
                decimals = parseInt(match[3]);
            }
        } else if (value) {
            const check = (key, type, defaultValue) => {
                if (value[key] == null) {
                    return defaultValue;
                }
                if (typeof value[key] !== type) {
                    logger$2.throwArgumentError(
                        "invalid fixed format (" + key + " not " + type + ")",
                        "format." + key,
                        value[key]
                    );
                }
                return value[key];
            };
            signed = check("signed", "boolean", signed);
            width = check("width", "number", width);
            decimals = check("decimals", "number", decimals);
        }
        if (width % 8) {
            logger$2.throwArgumentError(
                "invalid fixed format width (not byte aligned)",
                "format.width",
                width
            );
        }
        if (decimals > 80) {
            logger$2.throwArgumentError(
                "invalid fixed format (decimals too large)",
                "format.decimals",
                decimals
            );
        }
        return new FixedFormat(_constructorGuard$1, signed, width, decimals);
    }
}
class FixedNumber {
    constructor(constructorGuard, hex, value, format) {
        logger$2.checkNew(new.target, FixedNumber);
        if (constructorGuard !== _constructorGuard$1) {
            logger$2.throwError(
                "cannot use FixedNumber constructor; use FixedNumber.from",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "new FixedFormat" }
            );
        }
        this.format = format;
        this._hex = hex;
        this._value = value;
        this._isFixedNumber = true;
        Object.freeze(this);
    }
    _checkFormat(other) {
        if (this.format.name !== other.format.name) {
            logger$2.throwArgumentError(
                "incompatible format; use fixedNumber.toFormat",
                "other",
                other
            );
        }
    }
    addUnsafe(other) {
        this._checkFormat(other);
        const a = parseFixed(this._value, this.format.decimals);
        const b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.add(b), this.format.decimals, this.format);
    }
    subUnsafe(other) {
        this._checkFormat(other);
        const a = parseFixed(this._value, this.format.decimals);
        const b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.sub(b), this.format.decimals, this.format);
    }
    mulUnsafe(other) {
        this._checkFormat(other);
        const a = parseFixed(this._value, this.format.decimals);
        const b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(
            a.mul(b).div(this.format._multiplier),
            this.format.decimals,
            this.format
        );
    }
    divUnsafe(other) {
        this._checkFormat(other);
        const a = parseFixed(this._value, this.format.decimals);
        const b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(
            a.mul(this.format._multiplier).div(b),
            this.format.decimals,
            this.format
        );
    }
    floor() {
        let comps = this.toString().split(".");
        let result = FixedNumber.from(comps[0], this.format);
        const hasFraction = !comps[1].match(/^(0*)$/);
        if (this.isNegative() && hasFraction) {
            result = result.subUnsafe(ONE);
        }
        return result;
    }
    ceiling() {
        let comps = this.toString().split(".");
        let result = FixedNumber.from(comps[0], this.format);
        const hasFraction = !comps[1].match(/^(0*)$/);
        if (!this.isNegative() && hasFraction) {
            result = result.addUnsafe(ONE);
        }
        return result;
    }
    round(decimals) {
        if (decimals == null) {
            decimals = 0;
        }
        let comps = this.toString().split(".");
        if (decimals < 0 || decimals > 80 || decimals % 1) {
            logger$2.throwArgumentError(
                "invalid decimal count",
                "decimals",
                decimals
            );
        }
        if (comps[1].length <= decimals) {
            return this;
        }
        const factor = FixedNumber.from("1" + zeros.substring(0, decimals));
        return this.mulUnsafe(factor).addUnsafe(BUMP).floor().divUnsafe(factor);
    }
    isZero() {
        return this._value === "0.0";
    }
    isNegative() {
        return this._value[0] === "-";
    }
    toString() {
        return this._value;
    }
    toHexString(width) {
        if (width == null) {
            return this._hex;
        }
        if (width % 8) {
            logger$2.throwArgumentError("invalid byte width", "width", width);
        }
        const hex = BigNumber.from(this._hex)
            .fromTwos(this.format.width)
            .toTwos(width)
            .toHexString();
        return hexZeroPad(hex, width / 8);
    }
    toUnsafeFloat() {
        return parseFloat(this.toString());
    }
    toFormat(format) {
        return FixedNumber.fromString(this._value, format);
    }
    static fromValue(value, decimals, format) {
        if (format == null && decimals != null && !isBigNumberish(decimals)) {
            format = decimals;
            decimals = null;
        }
        if (decimals == null) {
            decimals = 0;
        }
        if (format == null) {
            format = "fixed";
        }
        return FixedNumber.fromString(
            formatFixed(value, decimals),
            FixedFormat.from(format)
        );
    }
    static fromString(value, format) {
        if (format == null) {
            format = "fixed";
        }
        const fixedFormat = FixedFormat.from(format);
        const numeric = parseFixed(value, fixedFormat.decimals);
        if (!fixedFormat.signed && numeric.lt(Zero)) {
            throwFault$1(
                "unsigned value cannot be negative",
                "overflow",
                "value",
                value
            );
        }
        let hex = null;
        if (fixedFormat.signed) {
            hex = numeric.toTwos(fixedFormat.width).toHexString();
        } else {
            hex = numeric.toHexString();
            hex = hexZeroPad(hex, fixedFormat.width / 8);
        }
        const decimal = formatFixed(numeric, fixedFormat.decimals);
        return new FixedNumber(_constructorGuard$1, hex, decimal, fixedFormat);
    }
    static fromBytes(value, format) {
        if (format == null) {
            format = "fixed";
        }
        const fixedFormat = FixedFormat.from(format);
        if (arrayify(value).length > fixedFormat.width / 8) {
            throw new Error("overflow");
        }
        let numeric = BigNumber.from(value);
        if (fixedFormat.signed) {
            numeric = numeric.fromTwos(fixedFormat.width);
        }
        const hex = numeric
            .toTwos((fixedFormat.signed ? 0 : 1) + fixedFormat.width)
            .toHexString();
        const decimal = formatFixed(numeric, fixedFormat.decimals);
        return new FixedNumber(_constructorGuard$1, hex, decimal, fixedFormat);
    }
    static from(value, format) {
        if (typeof value === "string") {
            return FixedNumber.fromString(value, format);
        }
        if (isBytes(value)) {
            return FixedNumber.fromBytes(value, format);
        }
        try {
            return FixedNumber.fromValue(value, 0, format);
        } catch (error) {
            if (error.code !== Logger.errors.INVALID_ARGUMENT) {
                throw error;
            }
        }
        return logger$2.throwArgumentError(
            "invalid FixedNumber value",
            "value",
            value
        );
    }
    static isFixedNumber(value) {
        return !!(value && value._isFixedNumber);
    }
}
const ONE = FixedNumber.from(1);
const BUMP = FixedNumber.from("0.5");
const version$3 = "properties/5.1.0";
("use strict");
var __awaiter =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$3 = new Logger(version$3);
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}
function getStatic(ctor, key) {
    for (let i = 0; i < 32; i++) {
        if (ctor[key]) {
            return ctor[key];
        }
        if (!ctor.prototype || typeof ctor.prototype !== "object") {
            break;
        }
        ctor = Object.getPrototypeOf(ctor.prototype).constructor;
    }
    return null;
}
function resolveProperties(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = Object.keys(object).map((key) => {
            const value = object[key];
            return Promise.resolve(value).then((v) => ({ key: key, value: v }));
        });
        const results = yield Promise.all(promises);
        return results.reduce((accum, result) => {
            accum[result.key] = result.value;
            return accum;
        }, {});
    });
}
function checkProperties(object, properties) {
    if (!object || typeof object !== "object") {
        logger$3.throwArgumentError("invalid object", "object", object);
    }
    Object.keys(object).forEach((key) => {
        if (!properties[key]) {
            logger$3.throwArgumentError(
                "invalid object key - " + key,
                "transaction:" + key,
                object
            );
        }
    });
}
function shallowCopy(object) {
    const result = {};
    for (const key in object) {
        result[key] = object[key];
    }
    return result;
}
const opaque = {
    bigint: true,
    boolean: true,
    function: true,
    number: true,
    string: true,
};
function _isFrozen(object) {
    if (object === undefined || object === null || opaque[typeof object]) {
        return true;
    }
    if (Array.isArray(object) || typeof object === "object") {
        if (!Object.isFrozen(object)) {
            return false;
        }
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            if (!_isFrozen(object[keys[i]])) {
                return false;
            }
        }
        return true;
    }
    return logger$3.throwArgumentError(
        `Cannot deepCopy ${typeof object}`,
        "object",
        object
    );
}
function _deepCopy(object) {
    if (_isFrozen(object)) {
        return object;
    }
    if (Array.isArray(object)) {
        return Object.freeze(object.map((item) => deepCopy(item)));
    }
    if (typeof object === "object") {
        const result = {};
        for (const key in object) {
            const value = object[key];
            if (value === undefined) {
                continue;
            }
            defineReadOnly(result, key, deepCopy(value));
        }
        return result;
    }
    return logger$3.throwArgumentError(
        `Cannot deepCopy ${typeof object}`,
        "object",
        object
    );
}
function deepCopy(object) {
    return _deepCopy(object);
}
class Description {
    constructor(info) {
        for (const key in info) {
            this[key] = deepCopy(info[key]);
        }
    }
}
const version$4 = "abi/5.1.2";
("use strict");
const logger$4 = new Logger(version$4);
const _constructorGuard$2 = {};
let ModifiersBytes = { calldata: true, memory: true, storage: true };
let ModifiersNest = { calldata: true, memory: true };
function checkModifier(type, name) {
    if (type === "bytes" || type === "string") {
        if (ModifiersBytes[name]) {
            return true;
        }
    } else if (type === "address") {
        if (name === "payable") {
            return true;
        }
    } else if (type.indexOf("[") >= 0 || type === "tuple") {
        if (ModifiersNest[name]) {
            return true;
        }
    }
    if (ModifiersBytes[name] || name === "payable") {
        logger$4.throwArgumentError("invalid modifier", "name", name);
    }
    return false;
}
function parseParamType(param, allowIndexed) {
    let originalParam = param;
    function throwError(i) {
        logger$4.throwArgumentError(
            `unexpected character at position ${i}`,
            "param",
            param
        );
    }
    param = param.replace(/\s/g, " ");
    function newNode(parent) {
        let node = {
            type: "",
            name: "",
            parent: parent,
            state: { allowType: true },
        };
        if (allowIndexed) {
            node.indexed = false;
        }
        return node;
    }
    let parent = { type: "", name: "", state: { allowType: true } };
    let node = parent;
    for (let i = 0; i < param.length; i++) {
        let c = param[i];
        switch (c) {
            case "(":
                if (node.state.allowType && node.type === "") {
                    node.type = "tuple";
                } else if (!node.state.allowParams) {
                    throwError(i);
                }
                node.state.allowType = false;
                node.type = verifyType(node.type);
                node.components = [newNode(node)];
                node = node.components[0];
                break;
            case ")":
                delete node.state;
                if (node.name === "indexed") {
                    if (!allowIndexed) {
                        throwError(i);
                    }
                    node.indexed = true;
                    node.name = "";
                }
                if (checkModifier(node.type, node.name)) {
                    node.name = "";
                }
                node.type = verifyType(node.type);
                let child = node;
                node = node.parent;
                if (!node) {
                    throwError(i);
                }
                delete child.parent;
                node.state.allowParams = false;
                node.state.allowName = true;
                node.state.allowArray = true;
                break;
            case ",":
                delete node.state;
                if (node.name === "indexed") {
                    if (!allowIndexed) {
                        throwError(i);
                    }
                    node.indexed = true;
                    node.name = "";
                }
                if (checkModifier(node.type, node.name)) {
                    node.name = "";
                }
                node.type = verifyType(node.type);
                let sibling = newNode(node.parent);
                node.parent.components.push(sibling);
                delete node.parent;
                node = sibling;
                break;
            case " ":
                if (node.state.allowType) {
                    if (node.type !== "") {
                        node.type = verifyType(node.type);
                        delete node.state.allowType;
                        node.state.allowName = true;
                        node.state.allowParams = true;
                    }
                }
                if (node.state.allowName) {
                    if (node.name !== "") {
                        if (node.name === "indexed") {
                            if (!allowIndexed) {
                                throwError(i);
                            }
                            if (node.indexed) {
                                throwError(i);
                            }
                            node.indexed = true;
                            node.name = "";
                        } else if (checkModifier(node.type, node.name)) {
                            node.name = "";
                        } else {
                            node.state.allowName = false;
                        }
                    }
                }
                break;
            case "[":
                if (!node.state.allowArray) {
                    throwError(i);
                }
                node.type += c;
                node.state.allowArray = false;
                node.state.allowName = false;
                node.state.readArray = true;
                break;
            case "]":
                if (!node.state.readArray) {
                    throwError(i);
                }
                node.type += c;
                node.state.readArray = false;
                node.state.allowArray = true;
                node.state.allowName = true;
                break;
            default:
                if (node.state.allowType) {
                    node.type += c;
                    node.state.allowParams = true;
                    node.state.allowArray = true;
                } else if (node.state.allowName) {
                    node.name += c;
                    delete node.state.allowArray;
                } else if (node.state.readArray) {
                    node.type += c;
                } else {
                    throwError(i);
                }
        }
    }
    if (node.parent) {
        logger$4.throwArgumentError("unexpected eof", "param", param);
    }
    delete parent.state;
    if (node.name === "indexed") {
        if (!allowIndexed) {
            throwError(originalParam.length - 7);
        }
        if (node.indexed) {
            throwError(originalParam.length - 7);
        }
        node.indexed = true;
        node.name = "";
    } else if (checkModifier(node.type, node.name)) {
        node.name = "";
    }
    parent.type = verifyType(parent.type);
    return parent;
}
function populate(object, params) {
    for (let key in params) {
        defineReadOnly(object, key, params[key]);
    }
}
const FormatTypes = Object.freeze({
    sighash: "sighash",
    minimal: "minimal",
    full: "full",
    json: "json",
});
const paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);
class ParamType {
    constructor(constructorGuard, params) {
        if (constructorGuard !== _constructorGuard$2) {
            logger$4.throwError(
                "use fromString",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "new ParamType()" }
            );
        }
        populate(this, params);
        let match = this.type.match(paramTypeArray);
        if (match) {
            populate(this, {
                arrayLength: parseInt(match[2] || "-1"),
                arrayChildren: ParamType.fromObject({
                    type: match[1],
                    components: this.components,
                }),
                baseType: "array",
            });
        } else {
            populate(this, {
                arrayLength: null,
                arrayChildren: null,
                baseType: this.components != null ? "tuple" : this.type,
            });
        }
        this._isParamType = true;
        Object.freeze(this);
    }
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger$4.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            let result = {
                type: this.baseType === "tuple" ? "tuple" : this.type,
                name: this.name || undefined,
            };
            if (typeof this.indexed === "boolean") {
                result.indexed = this.indexed;
            }
            if (this.components) {
                result.components = this.components.map((comp) =>
                    JSON.parse(comp.format(format))
                );
            }
            return JSON.stringify(result);
        }
        let result = "";
        if (this.baseType === "array") {
            result += this.arrayChildren.format(format);
            result +=
                "[" + (this.arrayLength < 0 ? "" : String(this.arrayLength)) + "]";
        } else {
            if (this.baseType === "tuple") {
                if (format !== FormatTypes.sighash) {
                    result += this.type;
                }
                result +=
                    "(" +
                    this.components
                        .map((comp) => comp.format(format))
                        .join(format === FormatTypes.full ? ", " : ",") +
                    ")";
            } else {
                result += this.type;
            }
        }
        if (format !== FormatTypes.sighash) {
            if (this.indexed === true) {
                result += " indexed";
            }
            if (format === FormatTypes.full && this.name) {
                result += " " + this.name;
            }
        }
        return result;
    }
    static from(value, allowIndexed) {
        if (typeof value === "string") {
            return ParamType.fromString(value, allowIndexed);
        }
        return ParamType.fromObject(value);
    }
    static fromObject(value) {
        if (ParamType.isParamType(value)) {
            return value;
        }
        return new ParamType(_constructorGuard$2, {
            name: value.name || null,
            type: verifyType(value.type),
            indexed: value.indexed == null ? null : !!value.indexed,
            components: value.components
                ? value.components.map(ParamType.fromObject)
                : null,
        });
    }
    static fromString(value, allowIndexed) {
        function ParamTypify(node) {
            return ParamType.fromObject({
                name: node.name,
                type: node.type,
                indexed: node.indexed,
                components: node.components,
            });
        }
        return ParamTypify(parseParamType(value, !!allowIndexed));
    }
    static isParamType(value) {
        return !!(value != null && value._isParamType);
    }
}
function parseParams(value, allowIndex) {
    return splitNesting(value).map((param) =>
        ParamType.fromString(param, allowIndex)
    );
}
class Fragment {
    constructor(constructorGuard, params) {
        if (constructorGuard !== _constructorGuard$2) {
            logger$4.throwError(
                "use a static from method",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "new Fragment()" }
            );
        }
        populate(this, params);
        this._isFragment = true;
        Object.freeze(this);
    }
    static from(value) {
        if (Fragment.isFragment(value)) {
            return value;
        }
        if (typeof value === "string") {
            return Fragment.fromString(value);
        }
        return Fragment.fromObject(value);
    }
    static fromObject(value) {
        if (Fragment.isFragment(value)) {
            return value;
        }
        switch (value.type) {
            case "function":
                return FunctionFragment.fromObject(value);
            case "event":
                return EventFragment.fromObject(value);
            case "constructor":
                return ConstructorFragment.fromObject(value);
            case "error":
            case "fallback":
            case "receive":
                return null;
        }
        return logger$4.throwArgumentError(
            "invalid fragment object",
            "value",
            value
        );
    }
    static fromString(value) {
        value = value.replace(/\s/g, " ");
        value = value
            .replace(/\(/g, " (")
            .replace(/\)/g, ") ")
            .replace(/\s+/g, " ");
        value = value.trim();
        if (value.split(" ")[0] === "event") {
            return EventFragment.fromString(value.substring(5).trim());
        } else if (value.split(" ")[0] === "function") {
            return FunctionFragment.fromString(value.substring(8).trim());
        } else if (value.split("(")[0].trim() === "constructor") {
            return ConstructorFragment.fromString(value.trim());
        }
        return logger$4.throwArgumentError("unsupported fragment", "value", value);
    }
    static isFragment(value) {
        return !!(value && value._isFragment);
    }
}
class EventFragment extends Fragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger$4.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "event",
                anonymous: this.anonymous,
                name: this.name,
                inputs: this.inputs.map((input) => JSON.parse(input.format(format))),
            });
        }
        let result = "";
        if (format !== FormatTypes.sighash) {
            result += "event ";
        }
        result +=
            this.name +
            "(" +
            this.inputs
                .map((input) => input.format(format))
                .join(format === FormatTypes.full ? ", " : ",") +
            ") ";
        if (format !== FormatTypes.sighash) {
            if (this.anonymous) {
                result += "anonymous ";
            }
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return EventFragment.fromString(value);
        }
        return EventFragment.fromObject(value);
    }
    static fromObject(value) {
        if (EventFragment.isEventFragment(value)) {
            return value;
        }
        if (value.type !== "event") {
            logger$4.throwArgumentError("invalid event object", "value", value);
        }
        const params = {
            name: verifyIdentifier(value.name),
            anonymous: value.anonymous,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            type: "event",
        };
        return new EventFragment(_constructorGuard$2, params);
    }
    static fromString(value) {
        let match = value.match(regexParen);
        if (!match) {
            logger$4.throwArgumentError("invalid event string", "value", value);
        }
        let anonymous = false;
        match[3].split(" ").forEach((modifier) => {
            switch (modifier.trim()) {
                case "anonymous":
                    anonymous = true;
                    break;
                case "":
                    break;
                default:
                    logger$4.warn("unknown modifier: " + modifier);
            }
        });
        return EventFragment.fromObject({
            name: match[1].trim(),
            anonymous: anonymous,
            inputs: parseParams(match[2], true),
            type: "event",
        });
    }
    static isEventFragment(value) {
        return value && value._isFragment && value.type === "event";
    }
}
function parseGas(value, params) {
    params.gas = null;
    let comps = value.split("@");
    if (comps.length !== 1) {
        if (comps.length > 2) {
            logger$4.throwArgumentError(
                "invalid human-readable ABI signature",
                "value",
                value
            );
        }
        if (!comps[1].match(/^[0-9]+$/)) {
            logger$4.throwArgumentError(
                "invalid human-readable ABI signature gas",
                "value",
                value
            );
        }
        params.gas = BigNumber.from(comps[1]);
        return comps[0];
    }
    return value;
}
function parseModifiers(value, params) {
    params.constant = false;
    params.payable = false;
    params.stateMutability = "nonpayable";
    value.split(" ").forEach((modifier) => {
        switch (modifier.trim()) {
            case "constant":
                params.constant = true;
                break;
            case "payable":
                params.payable = true;
                params.stateMutability = "payable";
                break;
            case "nonpayable":
                params.payable = false;
                params.stateMutability = "nonpayable";
                break;
            case "pure":
                params.constant = true;
                params.stateMutability = "pure";
                break;
            case "view":
                params.constant = true;
                params.stateMutability = "view";
                break;
            case "external":
            case "public":
            case "":
                break;
            default:
                console.log("unknown modifier: " + modifier);
        }
    });
}
function verifyState(value) {
    let result = { constant: false, payable: true, stateMutability: "payable" };
    if (value.stateMutability != null) {
        result.stateMutability = value.stateMutability;
        result.constant =
            result.stateMutability === "view" || result.stateMutability === "pure";
        if (value.constant != null) {
            if (!!value.constant !== result.constant) {
                logger$4.throwArgumentError(
                    "cannot have constant function with mutability " +
                    result.stateMutability,
                    "value",
                    value
                );
            }
        }
        result.payable = result.stateMutability === "payable";
        if (value.payable != null) {
            if (!!value.payable !== result.payable) {
                logger$4.throwArgumentError(
                    "cannot have payable function with mutability " +
                    result.stateMutability,
                    "value",
                    value
                );
            }
        }
    } else if (value.payable != null) {
        result.payable = !!value.payable;
        if (
            value.constant == null &&
            !result.payable &&
            value.type !== "constructor"
        ) {
            logger$4.throwArgumentError(
                "unable to determine stateMutability",
                "value",
                value
            );
        }
        result.constant = !!value.constant;
        if (result.constant) {
            result.stateMutability = "view";
        } else {
            result.stateMutability = result.payable ? "payable" : "nonpayable";
        }
        if (result.payable && result.constant) {
            logger$4.throwArgumentError(
                "cannot have constant payable function",
                "value",
                value
            );
        }
    } else if (value.constant != null) {
        result.constant = !!value.constant;
        result.payable = !result.constant;
        result.stateMutability = result.constant ? "view" : "payable";
    } else if (value.type !== "constructor") {
        logger$4.throwArgumentError(
            "unable to determine stateMutability",
            "value",
            value
        );
    }
    return result;
}
class ConstructorFragment extends Fragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger$4.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "constructor",
                stateMutability:
                    this.stateMutability !== "nonpayable"
                        ? this.stateMutability
                        : undefined,
                payable: this.payable,
                gas: this.gas ? this.gas.toNumber() : undefined,
                inputs: this.inputs.map((input) => JSON.parse(input.format(format))),
            });
        }
        if (format === FormatTypes.sighash) {
            logger$4.throwError(
                "cannot format a constructor for sighash",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "format(sighash)" }
            );
        }
        let result =
            "constructor(" +
            this.inputs
                .map((input) => input.format(format))
                .join(format === FormatTypes.full ? ", " : ",") +
            ") ";
        if (this.stateMutability && this.stateMutability !== "nonpayable") {
            result += this.stateMutability + " ";
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return ConstructorFragment.fromString(value);
        }
        return ConstructorFragment.fromObject(value);
    }
    static fromObject(value) {
        if (ConstructorFragment.isConstructorFragment(value)) {
            return value;
        }
        if (value.type !== "constructor") {
            logger$4.throwArgumentError("invalid constructor object", "value", value);
        }
        let state = verifyState(value);
        if (state.constant) {
            logger$4.throwArgumentError(
                "constructor cannot be constant",
                "value",
                value
            );
        }
        const params = {
            name: null,
            type: value.type,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            payable: state.payable,
            stateMutability: state.stateMutability,
            gas: value.gas ? BigNumber.from(value.gas) : null,
        };
        return new ConstructorFragment(_constructorGuard$2, params);
    }
    static fromString(value) {
        let params = { type: "constructor" };
        value = parseGas(value, params);
        let parens = value.match(regexParen);
        if (!parens || parens[1].trim() !== "constructor") {
            logger$4.throwArgumentError("invalid constructor string", "value", value);
        }
        params.inputs = parseParams(parens[2].trim(), false);
        parseModifiers(parens[3].trim(), params);
        return ConstructorFragment.fromObject(params);
    }
    static isConstructorFragment(value) {
        return value && value._isFragment && value.type === "constructor";
    }
}
class FunctionFragment extends ConstructorFragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger$4.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "function",
                name: this.name,
                constant: this.constant,
                stateMutability:
                    this.stateMutability !== "nonpayable"
                        ? this.stateMutability
                        : undefined,
                payable: this.payable,
                gas: this.gas ? this.gas.toNumber() : undefined,
                inputs: this.inputs.map((input) => JSON.parse(input.format(format))),
                outputs: this.outputs.map((output) =>
                    JSON.parse(output.format(format))
                ),
            });
        }
        let result = "";
        if (format !== FormatTypes.sighash) {
            result += "function ";
        }
        result +=
            this.name +
            "(" +
            this.inputs
                .map((input) => input.format(format))
                .join(format === FormatTypes.full ? ", " : ",") +
            ") ";
        if (format !== FormatTypes.sighash) {
            if (this.stateMutability) {
                if (this.stateMutability !== "nonpayable") {
                    result += this.stateMutability + " ";
                }
            } else if (this.constant) {
                result += "view ";
            }
            if (this.outputs && this.outputs.length) {
                result +=
                    "returns (" +
                    this.outputs.map((output) => output.format(format)).join(", ") +
                    ") ";
            }
            if (this.gas != null) {
                result += "@" + this.gas.toString() + " ";
            }
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return FunctionFragment.fromString(value);
        }
        return FunctionFragment.fromObject(value);
    }
    static fromObject(value) {
        if (FunctionFragment.isFunctionFragment(value)) {
            return value;
        }
        if (value.type !== "function") {
            logger$4.throwArgumentError("invalid function object", "value", value);
        }
        let state = verifyState(value);
        const params = {
            type: value.type,
            name: verifyIdentifier(value.name),
            constant: state.constant,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            outputs: value.outputs ? value.outputs.map(ParamType.fromObject) : [],
            payable: state.payable,
            stateMutability: state.stateMutability,
            gas: value.gas ? BigNumber.from(value.gas) : null,
        };
        return new FunctionFragment(_constructorGuard$2, params);
    }
    static fromString(value) {
        let params = { type: "function" };
        value = parseGas(value, params);
        let comps = value.split(" returns ");
        if (comps.length > 2) {
            logger$4.throwArgumentError("invalid function string", "value", value);
        }
        let parens = comps[0].match(regexParen);
        if (!parens) {
            logger$4.throwArgumentError("invalid function signature", "value", value);
        }
        params.name = parens[1].trim();
        if (params.name) {
            verifyIdentifier(params.name);
        }
        params.inputs = parseParams(parens[2], false);
        parseModifiers(parens[3].trim(), params);
        if (comps.length > 1) {
            let returns = comps[1].match(regexParen);
            if (returns[1].trim() != "" || returns[3].trim() != "") {
                logger$4.throwArgumentError("unexpected tokens", "value", value);
            }
            params.outputs = parseParams(returns[2], false);
        } else {
            params.outputs = [];
        }
        return FunctionFragment.fromObject(params);
    }
    static isFunctionFragment(value) {
        return value && value._isFragment && value.type === "function";
    }
}
function verifyType(type) {
    if (type.match(/^uint($|[^1-9])/)) {
        type = "uint256" + type.substring(4);
    } else if (type.match(/^int($|[^1-9])/)) {
        type = "int256" + type.substring(3);
    }
    return type;
}
const regexIdentifier = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
function verifyIdentifier(value) {
    if (!value || !value.match(regexIdentifier)) {
        logger$4.throwArgumentError(
            `invalid identifier "${value}"`,
            "value",
            value
        );
    }
    return value;
}
const regexParen = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$");
function splitNesting(value) {
    value = value.trim();
    let result = [];
    let accum = "";
    let depth = 0;
    for (let offset = 0; offset < value.length; offset++) {
        let c = value[offset];
        if (c === "," && depth === 0) {
            result.push(accum);
            accum = "";
        } else {
            accum += c;
            if (c === "(") {
                depth++;
            } else if (c === ")") {
                depth--;
                if (depth === -1) {
                    logger$4.throwArgumentError("unbalanced parenthesis", "value", value);
                }
            }
        }
    }
    if (accum) {
        result.push(accum);
    }
    return result;
}
("use strict");
const logger$5 = new Logger(version$4);
function checkResultErrors(result) {
    const errors = [];
    const checkErrors = function (path, object) {
        if (!Array.isArray(object)) {
            return;
        }
        for (let key in object) {
            const childPath = path.slice();
            childPath.push(key);
            try {
                checkErrors(childPath, object[key]);
            } catch (error) {
                errors.push({ path: childPath, error: error });
            }
        }
    };
    checkErrors([], result);
    return errors;
}
class Coder {
    constructor(name, type, localName, dynamic) {
        this.name = name;
        this.type = type;
        this.localName = localName;
        this.dynamic = dynamic;
    }
    _throwError(message, value) {
        logger$5.throwArgumentError(message, this.localName, value);
    }
}
class Writer {
    constructor(wordSize) {
        defineReadOnly(this, "wordSize", wordSize || 32);
        this._data = [];
        this._dataLength = 0;
        this._padding = new Uint8Array(wordSize);
    }
    get data() {
        return hexConcat(this._data);
    }
    get length() {
        return this._dataLength;
    }
    _writeData(data) {
        this._data.push(data);
        this._dataLength += data.length;
        return data.length;
    }
    appendWriter(writer) {
        return this._writeData(concat(writer._data));
    }
    writeBytes(value) {
        let bytes = arrayify(value);
        const paddingOffset = bytes.length % this.wordSize;
        if (paddingOffset) {
            bytes = concat([bytes, this._padding.slice(paddingOffset)]);
        }
        return this._writeData(bytes);
    }
    _getValue(value) {
        let bytes = arrayify(BigNumber.from(value));
        if (bytes.length > this.wordSize) {
            logger$5.throwError("value out-of-bounds", Logger.errors.BUFFER_OVERRUN, {
                length: this.wordSize,
                offset: bytes.length,
            });
        }
        if (bytes.length % this.wordSize) {
            bytes = concat([
                this._padding.slice(bytes.length % this.wordSize),
                bytes,
            ]);
        }
        return bytes;
    }
    writeValue(value) {
        return this._writeData(this._getValue(value));
    }
    writeUpdatableValue() {
        const offset = this._data.length;
        this._data.push(this._padding);
        this._dataLength += this.wordSize;
        return (value) => {
            this._data[offset] = this._getValue(value);
        };
    }
}
class Reader {
    constructor(data, wordSize, coerceFunc, allowLoose) {
        defineReadOnly(this, "_data", arrayify(data));
        defineReadOnly(this, "wordSize", wordSize || 32);
        defineReadOnly(this, "_coerceFunc", coerceFunc);
        defineReadOnly(this, "allowLoose", allowLoose);
        this._offset = 0;
    }
    get data() {
        return hexlify(this._data);
    }
    get consumed() {
        return this._offset;
    }
    static coerce(name, value) {
        let match = name.match("^u?int([0-9]+)$");
        if (match && parseInt(match[1]) <= 48) {
            value = value.toNumber();
        }
        return value;
    }
    coerce(name, value) {
        if (this._coerceFunc) {
            return this._coerceFunc(name, value);
        }
        return Reader.coerce(name, value);
    }
    _peekBytes(offset, length, loose) {
        let alignedLength = Math.ceil(length / this.wordSize) * this.wordSize;
        if (this._offset + alignedLength > this._data.length) {
            if (
                this.allowLoose &&
                loose &&
                this._offset + length <= this._data.length
            ) {
                alignedLength = length;
            } else {
                logger$5.throwError(
                    "data out-of-bounds",
                    Logger.errors.BUFFER_OVERRUN,
                    { length: this._data.length, offset: this._offset + alignedLength }
                );
            }
        }
        return this._data.slice(this._offset, this._offset + alignedLength);
    }
    subReader(offset) {
        return new Reader(
            this._data.slice(this._offset + offset),
            this.wordSize,
            this._coerceFunc,
            this.allowLoose
        );
    }
    readBytes(length, loose) {
        let bytes = this._peekBytes(0, length, !!loose);
        this._offset += bytes.length;
        return bytes.slice(0, length);
    }
    readValue() {
        return BigNumber.from(this.readBytes(this.wordSize));
    }
}
var sha3 = createCommonjsModule(function (module) {
    (function () {
        "use strict";
        var root = typeof window === "object" ? window : {};
        var NODE_JS =
            !root.JS_SHA3_NO_NODE_JS &&
            typeof process === "object" &&
            process.versions &&
            process.versions.node;
        if (NODE_JS) {
            root = commonjsGlobal;
        }
        var COMMON_JS =
            !root.JS_SHA3_NO_COMMON_JS && "object" === "object" && module.exports;
        var HEX_CHARS = "0123456789abcdef".split("");
        var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
        var KECCAK_PADDING = [1, 256, 65536, 16777216];
        var PADDING = [6, 1536, 393216, 100663296];
        var SHIFT = [0, 8, 16, 24];
        var RC = [
            1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0,
            2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0,
            2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905,
            2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778,
            0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648,
            2147483649, 0, 2147516424, 2147483648,
        ];
        var BITS = [224, 256, 384, 512];
        var SHAKE_BITS = [128, 256];
        var OUTPUT_TYPES = ["hex", "buffer", "arrayBuffer", "array"];
        var createOutputMethod = function (bits, padding, outputType) {
            return function (message) {
                return new Keccak(bits, padding, bits).update(message)[outputType]();
            };
        };
        var createShakeOutputMethod = function (bits, padding, outputType) {
            return function (message, outputBits) {
                return new Keccak(bits, padding, outputBits)
                    .update(message)
                [outputType]();
            };
        };
        var createMethod = function (bits, padding) {
            var method = createOutputMethod(bits, padding, "hex");
            method.create = function () {
                return new Keccak(bits, padding, bits);
            };
            method.update = function (message) {
                return method.create().update(message);
            };
            for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                var type = OUTPUT_TYPES[i];
                method[type] = createOutputMethod(bits, padding, type);
            }
            return method;
        };
        var createShakeMethod = function (bits, padding) {
            var method = createShakeOutputMethod(bits, padding, "hex");
            method.create = function (outputBits) {
                return new Keccak(bits, padding, outputBits);
            };
            method.update = function (message, outputBits) {
                return method.create(outputBits).update(message);
            };
            for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                var type = OUTPUT_TYPES[i];
                method[type] = createShakeOutputMethod(bits, padding, type);
            }
            return method;
        };
        var algorithms = [
            {
                name: "keccak",
                padding: KECCAK_PADDING,
                bits: BITS,
                createMethod: createMethod,
            },
            {
                name: "sha3",
                padding: PADDING,
                bits: BITS,
                createMethod: createMethod,
            },
            {
                name: "shake",
                padding: SHAKE_PADDING,
                bits: SHAKE_BITS,
                createMethod: createShakeMethod,
            },
        ];
        var methods = {},
            methodNames = [];
        for (var i = 0; i < algorithms.length; ++i) {
            var algorithm = algorithms[i];
            var bits = algorithm.bits;
            for (var j = 0; j < bits.length; ++j) {
                var methodName = algorithm.name + "_" + bits[j];
                methodNames.push(methodName);
                methods[methodName] = algorithm.createMethod(
                    bits[j],
                    algorithm.padding
                );
            }
        }
        function Keccak(bits, padding, outputBits) {
            this.blocks = [];
            this.s = [];
            this.padding = padding;
            this.outputBits = outputBits;
            this.reset = true;
            this.block = 0;
            this.start = 0;
            this.blockCount = (1600 - (bits << 1)) >> 5;
            this.byteCount = this.blockCount << 2;
            this.outputBlocks = outputBits >> 5;
            this.extraBytes = (outputBits & 31) >> 3;
            for (var i = 0; i < 50; ++i) {
                this.s[i] = 0;
            }
        }
        Keccak.prototype.update = function (message) {
            var notString = typeof message !== "string";
            if (notString && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
            }
            var length = message.length,
                blocks = this.blocks,
                byteCount = this.byteCount,
                blockCount = this.blockCount,
                index = 0,
                s = this.s,
                i,
                code;
            while (index < length) {
                if (this.reset) {
                    this.reset = false;
                    blocks[0] = this.block;
                    for (i = 1; i < blockCount + 1; ++i) {
                        blocks[i] = 0;
                    }
                }
                if (notString) {
                    for (i = this.start; index < length && i < byteCount; ++index) {
                        blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                    }
                } else {
                    for (i = this.start; index < length && i < byteCount; ++index) {
                        code = message.charCodeAt(index);
                        if (code < 128) {
                            blocks[i >> 2] |= code << SHIFT[i++ & 3];
                        } else if (code < 2048) {
                            blocks[i >> 2] |= (192 | (code >> 6)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | (code & 63)) << SHIFT[i++ & 3];
                        } else if (code < 55296 || code >= 57344) {
                            blocks[i >> 2] |= (224 | (code >> 12)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | ((code >> 6) & 63)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | (code & 63)) << SHIFT[i++ & 3];
                        } else {
                            code =
                                65536 +
                                (((code & 1023) << 10) | (message.charCodeAt(++index) & 1023));
                            blocks[i >> 2] |= (240 | (code >> 18)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | ((code >> 12) & 63)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | ((code >> 6) & 63)) << SHIFT[i++ & 3];
                            blocks[i >> 2] |= (128 | (code & 63)) << SHIFT[i++ & 3];
                        }
                    }
                }
                this.lastByteIndex = i;
                if (i >= byteCount) {
                    this.start = i - byteCount;
                    this.block = blocks[blockCount];
                    for (i = 0; i < blockCount; ++i) {
                        s[i] ^= blocks[i];
                    }
                    f(s);
                    this.reset = true;
                } else {
                    this.start = i;
                }
            }
            return this;
        };
        Keccak.prototype.finalize = function () {
            var blocks = this.blocks,
                i = this.lastByteIndex,
                blockCount = this.blockCount,
                s = this.s;
            blocks[i >> 2] |= this.padding[i & 3];
            if (this.lastByteIndex === this.byteCount) {
                blocks[0] = blocks[blockCount];
                for (i = 1; i < blockCount + 1; ++i) {
                    blocks[i] = 0;
                }
            }
            blocks[blockCount - 1] |= 2147483648;
            for (i = 0; i < blockCount; ++i) {
                s[i] ^= blocks[i];
            }
            f(s);
        };
        Keccak.prototype.toString = Keccak.prototype.hex = function () {
            this.finalize();
            var blockCount = this.blockCount,
                s = this.s,
                outputBlocks = this.outputBlocks,
                extraBytes = this.extraBytes,
                i = 0,
                j = 0;
            var hex = "",
                block;
            while (j < outputBlocks) {
                for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                    block = s[i];
                    hex +=
                        HEX_CHARS[(block >> 4) & 15] +
                        HEX_CHARS[block & 15] +
                        HEX_CHARS[(block >> 12) & 15] +
                        HEX_CHARS[(block >> 8) & 15] +
                        HEX_CHARS[(block >> 20) & 15] +
                        HEX_CHARS[(block >> 16) & 15] +
                        HEX_CHARS[(block >> 28) & 15] +
                        HEX_CHARS[(block >> 24) & 15];
                }
                if (j % blockCount === 0) {
                    f(s);
                    i = 0;
                }
            }
            if (extraBytes) {
                block = s[i];
                if (extraBytes > 0) {
                    hex += HEX_CHARS[(block >> 4) & 15] + HEX_CHARS[block & 15];
                }
                if (extraBytes > 1) {
                    hex += HEX_CHARS[(block >> 12) & 15] + HEX_CHARS[(block >> 8) & 15];
                }
                if (extraBytes > 2) {
                    hex += HEX_CHARS[(block >> 20) & 15] + HEX_CHARS[(block >> 16) & 15];
                }
            }
            return hex;
        };
        Keccak.prototype.arrayBuffer = function () {
            this.finalize();
            var blockCount = this.blockCount,
                s = this.s,
                outputBlocks = this.outputBlocks,
                extraBytes = this.extraBytes,
                i = 0,
                j = 0;
            var bytes = this.outputBits >> 3;
            var buffer;
            if (extraBytes) {
                buffer = new ArrayBuffer((outputBlocks + 1) << 2);
            } else {
                buffer = new ArrayBuffer(bytes);
            }
            var array = new Uint32Array(buffer);
            while (j < outputBlocks) {
                for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                    array[j] = s[i];
                }
                if (j % blockCount === 0) {
                    f(s);
                }
            }
            if (extraBytes) {
                array[i] = s[i];
                buffer = buffer.slice(0, bytes);
            }
            return buffer;
        };
        Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
        Keccak.prototype.digest = Keccak.prototype.array = function () {
            this.finalize();
            var blockCount = this.blockCount,
                s = this.s,
                outputBlocks = this.outputBlocks,
                extraBytes = this.extraBytes,
                i = 0,
                j = 0;
            var array = [],
                offset,
                block;
            while (j < outputBlocks) {
                for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                    offset = j << 2;
                    block = s[i];
                    array[offset] = block & 255;
                    array[offset + 1] = (block >> 8) & 255;
                    array[offset + 2] = (block >> 16) & 255;
                    array[offset + 3] = (block >> 24) & 255;
                }
                if (j % blockCount === 0) {
                    f(s);
                }
            }
            if (extraBytes) {
                offset = j << 2;
                block = s[i];
                if (extraBytes > 0) {
                    array[offset] = block & 255;
                }
                if (extraBytes > 1) {
                    array[offset + 1] = (block >> 8) & 255;
                }
                if (extraBytes > 2) {
                    array[offset + 2] = (block >> 16) & 255;
                }
            }
            return array;
        };
        var f = function (s) {
            var h,
                l,
                n,
                c0,
                c1,
                c2,
                c3,
                c4,
                c5,
                c6,
                c7,
                c8,
                c9,
                b0,
                b1,
                b2,
                b3,
                b4,
                b5,
                b6,
                b7,
                b8,
                b9,
                b10,
                b11,
                b12,
                b13,
                b14,
                b15,
                b16,
                b17,
                b18,
                b19,
                b20,
                b21,
                b22,
                b23,
                b24,
                b25,
                b26,
                b27,
                b28,
                b29,
                b30,
                b31,
                b32,
                b33,
                b34,
                b35,
                b36,
                b37,
                b38,
                b39,
                b40,
                b41,
                b42,
                b43,
                b44,
                b45,
                b46,
                b47,
                b48,
                b49;
            for (n = 0; n < 48; n += 2) {
                c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
                c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
                c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
                c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
                c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
                c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
                c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
                c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
                c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
                c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
                h = c8 ^ ((c2 << 1) | (c3 >>> 31));
                l = c9 ^ ((c3 << 1) | (c2 >>> 31));
                s[0] ^= h;
                s[1] ^= l;
                s[10] ^= h;
                s[11] ^= l;
                s[20] ^= h;
                s[21] ^= l;
                s[30] ^= h;
                s[31] ^= l;
                s[40] ^= h;
                s[41] ^= l;
                h = c0 ^ ((c4 << 1) | (c5 >>> 31));
                l = c1 ^ ((c5 << 1) | (c4 >>> 31));
                s[2] ^= h;
                s[3] ^= l;
                s[12] ^= h;
                s[13] ^= l;
                s[22] ^= h;
                s[23] ^= l;
                s[32] ^= h;
                s[33] ^= l;
                s[42] ^= h;
                s[43] ^= l;
                h = c2 ^ ((c6 << 1) | (c7 >>> 31));
                l = c3 ^ ((c7 << 1) | (c6 >>> 31));
                s[4] ^= h;
                s[5] ^= l;
                s[14] ^= h;
                s[15] ^= l;
                s[24] ^= h;
                s[25] ^= l;
                s[34] ^= h;
                s[35] ^= l;
                s[44] ^= h;
                s[45] ^= l;
                h = c4 ^ ((c8 << 1) | (c9 >>> 31));
                l = c5 ^ ((c9 << 1) | (c8 >>> 31));
                s[6] ^= h;
                s[7] ^= l;
                s[16] ^= h;
                s[17] ^= l;
                s[26] ^= h;
                s[27] ^= l;
                s[36] ^= h;
                s[37] ^= l;
                s[46] ^= h;
                s[47] ^= l;
                h = c6 ^ ((c0 << 1) | (c1 >>> 31));
                l = c7 ^ ((c1 << 1) | (c0 >>> 31));
                s[8] ^= h;
                s[9] ^= l;
                s[18] ^= h;
                s[19] ^= l;
                s[28] ^= h;
                s[29] ^= l;
                s[38] ^= h;
                s[39] ^= l;
                s[48] ^= h;
                s[49] ^= l;
                b0 = s[0];
                b1 = s[1];
                b32 = (s[11] << 4) | (s[10] >>> 28);
                b33 = (s[10] << 4) | (s[11] >>> 28);
                b14 = (s[20] << 3) | (s[21] >>> 29);
                b15 = (s[21] << 3) | (s[20] >>> 29);
                b46 = (s[31] << 9) | (s[30] >>> 23);
                b47 = (s[30] << 9) | (s[31] >>> 23);
                b28 = (s[40] << 18) | (s[41] >>> 14);
                b29 = (s[41] << 18) | (s[40] >>> 14);
                b20 = (s[2] << 1) | (s[3] >>> 31);
                b21 = (s[3] << 1) | (s[2] >>> 31);
                b2 = (s[13] << 12) | (s[12] >>> 20);
                b3 = (s[12] << 12) | (s[13] >>> 20);
                b34 = (s[22] << 10) | (s[23] >>> 22);
                b35 = (s[23] << 10) | (s[22] >>> 22);
                b16 = (s[33] << 13) | (s[32] >>> 19);
                b17 = (s[32] << 13) | (s[33] >>> 19);
                b48 = (s[42] << 2) | (s[43] >>> 30);
                b49 = (s[43] << 2) | (s[42] >>> 30);
                b40 = (s[5] << 30) | (s[4] >>> 2);
                b41 = (s[4] << 30) | (s[5] >>> 2);
                b22 = (s[14] << 6) | (s[15] >>> 26);
                b23 = (s[15] << 6) | (s[14] >>> 26);
                b4 = (s[25] << 11) | (s[24] >>> 21);
                b5 = (s[24] << 11) | (s[25] >>> 21);
                b36 = (s[34] << 15) | (s[35] >>> 17);
                b37 = (s[35] << 15) | (s[34] >>> 17);
                b18 = (s[45] << 29) | (s[44] >>> 3);
                b19 = (s[44] << 29) | (s[45] >>> 3);
                b10 = (s[6] << 28) | (s[7] >>> 4);
                b11 = (s[7] << 28) | (s[6] >>> 4);
                b42 = (s[17] << 23) | (s[16] >>> 9);
                b43 = (s[16] << 23) | (s[17] >>> 9);
                b24 = (s[26] << 25) | (s[27] >>> 7);
                b25 = (s[27] << 25) | (s[26] >>> 7);
                b6 = (s[36] << 21) | (s[37] >>> 11);
                b7 = (s[37] << 21) | (s[36] >>> 11);
                b38 = (s[47] << 24) | (s[46] >>> 8);
                b39 = (s[46] << 24) | (s[47] >>> 8);
                b30 = (s[8] << 27) | (s[9] >>> 5);
                b31 = (s[9] << 27) | (s[8] >>> 5);
                b12 = (s[18] << 20) | (s[19] >>> 12);
                b13 = (s[19] << 20) | (s[18] >>> 12);
                b44 = (s[29] << 7) | (s[28] >>> 25);
                b45 = (s[28] << 7) | (s[29] >>> 25);
                b26 = (s[38] << 8) | (s[39] >>> 24);
                b27 = (s[39] << 8) | (s[38] >>> 24);
                b8 = (s[48] << 14) | (s[49] >>> 18);
                b9 = (s[49] << 14) | (s[48] >>> 18);
                s[0] = b0 ^ (~b2 & b4);
                s[1] = b1 ^ (~b3 & b5);
                s[10] = b10 ^ (~b12 & b14);
                s[11] = b11 ^ (~b13 & b15);
                s[20] = b20 ^ (~b22 & b24);
                s[21] = b21 ^ (~b23 & b25);
                s[30] = b30 ^ (~b32 & b34);
                s[31] = b31 ^ (~b33 & b35);
                s[40] = b40 ^ (~b42 & b44);
                s[41] = b41 ^ (~b43 & b45);
                s[2] = b2 ^ (~b4 & b6);
                s[3] = b3 ^ (~b5 & b7);
                s[12] = b12 ^ (~b14 & b16);
                s[13] = b13 ^ (~b15 & b17);
                s[22] = b22 ^ (~b24 & b26);
                s[23] = b23 ^ (~b25 & b27);
                s[32] = b32 ^ (~b34 & b36);
                s[33] = b33 ^ (~b35 & b37);
                s[42] = b42 ^ (~b44 & b46);
                s[43] = b43 ^ (~b45 & b47);
                s[4] = b4 ^ (~b6 & b8);
                s[5] = b5 ^ (~b7 & b9);
                s[14] = b14 ^ (~b16 & b18);
                s[15] = b15 ^ (~b17 & b19);
                s[24] = b24 ^ (~b26 & b28);
                s[25] = b25 ^ (~b27 & b29);
                s[34] = b34 ^ (~b36 & b38);
                s[35] = b35 ^ (~b37 & b39);
                s[44] = b44 ^ (~b46 & b48);
                s[45] = b45 ^ (~b47 & b49);
                s[6] = b6 ^ (~b8 & b0);
                s[7] = b7 ^ (~b9 & b1);
                s[16] = b16 ^ (~b18 & b10);
                s[17] = b17 ^ (~b19 & b11);
                s[26] = b26 ^ (~b28 & b20);
                s[27] = b27 ^ (~b29 & b21);
                s[36] = b36 ^ (~b38 & b30);
                s[37] = b37 ^ (~b39 & b31);
                s[46] = b46 ^ (~b48 & b40);
                s[47] = b47 ^ (~b49 & b41);
                s[8] = b8 ^ (~b0 & b2);
                s[9] = b9 ^ (~b1 & b3);
                s[18] = b18 ^ (~b10 & b12);
                s[19] = b19 ^ (~b11 & b13);
                s[28] = b28 ^ (~b20 & b22);
                s[29] = b29 ^ (~b21 & b23);
                s[38] = b38 ^ (~b30 & b32);
                s[39] = b39 ^ (~b31 & b33);
                s[48] = b48 ^ (~b40 & b42);
                s[49] = b49 ^ (~b41 & b43);
                s[0] ^= RC[n];
                s[1] ^= RC[n + 1];
            }
        };
        if (COMMON_JS) {
            module.exports = methods;
        } else {
            for (var i = 0; i < methodNames.length; ++i) {
                root[methodNames[i]] = methods[methodNames[i]];
            }
        }
    })();
});
("use strict");
function keccak256(data) {
    return "0x" + sha3.keccak_256(arrayify(data));
}
const version$5 = "rlp/5.1.0";
("use strict");
const logger$6 = new Logger(version$5);
function arrayifyInteger(value) {
    const result = [];
    while (value) {
        result.unshift(value & 255);
        value >>= 8;
    }
    return result;
}
function unarrayifyInteger(data, offset, length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result = result * 256 + data[offset + i];
    }
    return result;
}
function _encode(object) {
    if (Array.isArray(object)) {
        let payload = [];
        object.forEach(function (child) {
            payload = payload.concat(_encode(child));
        });
        if (payload.length <= 55) {
            payload.unshift(192 + payload.length);
            return payload;
        }
        const length = arrayifyInteger(payload.length);
        length.unshift(247 + length.length);
        return length.concat(payload);
    }
    if (!isBytesLike(object)) {
        logger$6.throwArgumentError(
            "RLP object must be BytesLike",
            "object",
            object
        );
    }
    const data = Array.prototype.slice.call(arrayify(object));
    if (data.length === 1 && data[0] <= 127) {
        return data;
    } else if (data.length <= 55) {
        data.unshift(128 + data.length);
        return data;
    }
    const length = arrayifyInteger(data.length);
    length.unshift(183 + length.length);
    return length.concat(data);
}
function encode(object) {
    return hexlify(_encode(object));
}
function _decodeChildren(data, offset, childOffset, length) {
    const result = [];
    while (childOffset < offset + 1 + length) {
        const decoded = _decode(data, childOffset);
        result.push(decoded.result);
        childOffset += decoded.consumed;
        if (childOffset > offset + 1 + length) {
            logger$6.throwError(
                "child data too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
    }
    return { consumed: 1 + length, result: result };
}
function _decode(data, offset) {
    if (data.length === 0) {
        logger$6.throwError("data too short", Logger.errors.BUFFER_OVERRUN, {});
    }
    if (data[offset] >= 248) {
        const lengthLength = data[offset] - 247;
        if (offset + 1 + lengthLength > data.length) {
            logger$6.throwError(
                "data short segment too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length > data.length) {
            logger$6.throwError(
                "data long segment too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
        return _decodeChildren(
            data,
            offset,
            offset + 1 + lengthLength,
            lengthLength + length
        );
    } else if (data[offset] >= 192) {
        const length = data[offset] - 192;
        if (offset + 1 + length > data.length) {
            logger$6.throwError(
                "data array too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
        return _decodeChildren(data, offset, offset + 1, length);
    } else if (data[offset] >= 184) {
        const lengthLength = data[offset] - 183;
        if (offset + 1 + lengthLength > data.length) {
            logger$6.throwError(
                "data array too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length > data.length) {
            logger$6.throwError(
                "data array too short",
                Logger.errors.BUFFER_OVERRUN,
                {}
            );
        }
        const result = hexlify(
            data.slice(offset + 1 + lengthLength, offset + 1 + lengthLength + length)
        );
        return { consumed: 1 + lengthLength + length, result: result };
    } else if (data[offset] >= 128) {
        const length = data[offset] - 128;
        if (offset + 1 + length > data.length) {
            logger$6.throwError("data too short", Logger.errors.BUFFER_OVERRUN, {});
        }
        const result = hexlify(data.slice(offset + 1, offset + 1 + length));
        return { consumed: 1 + length, result: result };
    }
    return { consumed: 1, result: hexlify(data[offset]) };
}
function decode(data) {
    const bytes = arrayify(data);
    const decoded = _decode(bytes, 0);
    if (decoded.consumed !== bytes.length) {
        logger$6.throwArgumentError("invalid rlp data", "data", data);
    }
    return decoded.result;
}
var index = Object.freeze({ __proto__: null, encode: encode, decode: decode });
const version$6 = "address/5.1.0";
("use strict");
const logger$7 = new Logger(version$6);
function getChecksumAddress(address) {
    if (!isHexString(address, 20)) {
        logger$7.throwArgumentError("invalid address", "address", address);
    }
    address = address.toLowerCase();
    const chars = address.substring(2).split("");
    const expanded = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
        expanded[i] = chars[i].charCodeAt(0);
    }
    const hashed = arrayify(keccak256(expanded));
    for (let i = 0; i < 40; i += 2) {
        if (hashed[i >> 1] >> 4 >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 15) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }
    return "0x" + chars.join("");
}
const MAX_SAFE_INTEGER = 9007199254740991;
function log10(x) {
    if (Math.log10) {
        return Math.log10(x);
    }
    return Math.log(x) / Math.LN10;
}
const ibanLookup = {};
for (let i = 0; i < 10; i++) {
    ibanLookup[String(i)] = String(i);
}
for (let i = 0; i < 26; i++) {
    ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
}
const safeDigits = Math.floor(log10(MAX_SAFE_INTEGER));
function ibanChecksum(address) {
    address = address.toUpperCase();
    address = address.substring(4) + address.substring(0, 2) + "00";
    let expanded = address
        .split("")
        .map((c) => {
            return ibanLookup[c];
        })
        .join("");
    while (expanded.length >= safeDigits) {
        let block = expanded.substring(0, safeDigits);
        expanded = (parseInt(block, 10) % 97) + expanded.substring(block.length);
    }
    let checksum = String(98 - (parseInt(expanded, 10) % 97));
    while (checksum.length < 2) {
        checksum = "0" + checksum;
    }
    return checksum;
}
function getAddress(address) {
    let result = null;
    if (typeof address !== "string") {
        logger$7.throwArgumentError("invalid address", "address", address);
    }
    if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
        if (address.substring(0, 2) !== "0x") {
            address = "0x" + address;
        }
        result = getChecksumAddress(address);
        if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
            logger$7.throwArgumentError("bad address checksum", "address", address);
        }
    } else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
        if (address.substring(2, 4) !== ibanChecksum(address)) {
            logger$7.throwArgumentError("bad icap checksum", "address", address);
        }
        result = _base36To16(address.substring(4));
        while (result.length < 40) {
            result = "0" + result;
        }
        result = getChecksumAddress("0x" + result);
    } else {
        logger$7.throwArgumentError("invalid address", "address", address);
    }
    return result;
}
function isAddress(address) {
    try {
        getAddress(address);
        return true;
    } catch (error) { }
    return false;
}
function getIcapAddress(address) {
    let base36 = _base16To36(getAddress(address).substring(2)).toUpperCase();
    while (base36.length < 30) {
        base36 = "0" + base36;
    }
    return "XE" + ibanChecksum("XE00" + base36) + base36;
}
function getContractAddress(transaction) {
    let from = null;
    try {
        from = getAddress(transaction.from);
    } catch (error) {
        logger$7.throwArgumentError(
            "missing from address",
            "transaction",
            transaction
        );
    }
    const nonce = stripZeros(
        arrayify(BigNumber.from(transaction.nonce).toHexString())
    );
    return getAddress(hexDataSlice(keccak256(encode([from, nonce])), 12));
}
function getCreate2Address(from, salt, initCodeHash) {
    if (hexDataLength(salt) !== 32) {
        logger$7.throwArgumentError("salt must be 32 bytes", "salt", salt);
    }
    if (hexDataLength(initCodeHash) !== 32) {
        logger$7.throwArgumentError(
            "initCodeHash must be 32 bytes",
            "initCodeHash",
            initCodeHash
        );
    }
    return getAddress(
        hexDataSlice(
            keccak256(concat(["0xff", getAddress(from), salt, initCodeHash])),
            12
        )
    );
}
("use strict");
class AddressCoder extends Coder {
    constructor(localName) {
        super("address", "address", localName, false);
    }
    defaultValue() {
        return "0x0000000000000000000000000000000000000000";
    }
    encode(writer, value) {
        try {
            getAddress(value);
        } catch (error) {
            this._throwError(error.message, value);
        }
        return writer.writeValue(value);
    }
    decode(reader) {
        return getAddress(hexZeroPad(reader.readValue().toHexString(), 20));
    }
}
("use strict");
class AnonymousCoder extends Coder {
    constructor(coder) {
        super(coder.name, coder.type, undefined, coder.dynamic);
        this.coder = coder;
    }
    defaultValue() {
        return this.coder.defaultValue();
    }
    encode(writer, value) {
        return this.coder.encode(writer, value);
    }
    decode(reader) {
        return this.coder.decode(reader);
    }
}
("use strict");
const logger$8 = new Logger(version$4);
function pack(writer, coders, values) {
    let arrayValues = null;
    if (Array.isArray(values)) {
        arrayValues = values;
    } else if (values && typeof values === "object") {
        let unique = {};
        arrayValues = coders.map((coder) => {
            const name = coder.localName;
            if (!name) {
                logger$8.throwError(
                    "cannot encode object for signature with missing names",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "values", coder: coder, value: values }
                );
            }
            if (unique[name]) {
                logger$8.throwError(
                    "cannot encode object for signature with duplicate names",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "values", coder: coder, value: values }
                );
            }
            unique[name] = true;
            return values[name];
        });
    } else {
        logger$8.throwArgumentError("invalid tuple value", "tuple", values);
    }
    if (coders.length !== arrayValues.length) {
        logger$8.throwArgumentError("types/value length mismatch", "tuple", values);
    }
    let staticWriter = new Writer(writer.wordSize);
    let dynamicWriter = new Writer(writer.wordSize);
    let updateFuncs = [];
    coders.forEach((coder, index) => {
        let value = arrayValues[index];
        if (coder.dynamic) {
            let dynamicOffset = dynamicWriter.length;
            coder.encode(dynamicWriter, value);
            let updateFunc = staticWriter.writeUpdatableValue();
            updateFuncs.push((baseOffset) => {
                updateFunc(baseOffset + dynamicOffset);
            });
        } else {
            coder.encode(staticWriter, value);
        }
    });
    updateFuncs.forEach((func) => {
        func(staticWriter.length);
    });
    let length = writer.appendWriter(staticWriter);
    length += writer.appendWriter(dynamicWriter);
    return length;
}
function unpack(reader, coders) {
    let values = [];
    let baseReader = reader.subReader(0);
    coders.forEach((coder) => {
        let value = null;
        if (coder.dynamic) {
            let offset = reader.readValue();
            let offsetReader = baseReader.subReader(offset.toNumber());
            try {
                value = coder.decode(offsetReader);
            } catch (error) {
                if (error.code === Logger.errors.BUFFER_OVERRUN) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        } else {
            try {
                value = coder.decode(reader);
            } catch (error) {
                if (error.code === Logger.errors.BUFFER_OVERRUN) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        }
        if (value != undefined) {
            values.push(value);
        }
    });
    const uniqueNames = coders.reduce((accum, coder) => {
        const name = coder.localName;
        if (name) {
            if (!accum[name]) {
                accum[name] = 0;
            }
            accum[name]++;
        }
        return accum;
    }, {});
    coders.forEach((coder, index) => {
        let name = coder.localName;
        if (!name || uniqueNames[name] !== 1) {
            return;
        }
        if (name === "length") {
            name = "_length";
        }
        if (values[name] != null) {
            return;
        }
        const value = values[index];
        if (value instanceof Error) {
            Object.defineProperty(values, name, {
                get: () => {
                    throw value;
                },
            });
        } else {
            values[name] = value;
        }
    });
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value instanceof Error) {
            Object.defineProperty(values, i, {
                get: () => {
                    throw value;
                },
            });
        }
    }
    return Object.freeze(values);
}
class ArrayCoder extends Coder {
    constructor(coder, length, localName) {
        const type = coder.type + "[" + (length >= 0 ? length : "") + "]";
        const dynamic = length === -1 || coder.dynamic;
        super("array", type, localName, dynamic);
        this.coder = coder;
        this.length = length;
    }
    defaultValue() {
        const defaultChild = this.coder.defaultValue();
        const result = [];
        for (let i = 0; i < this.length; i++) {
            result.push(defaultChild);
        }
        return result;
    }
    encode(writer, value) {
        if (!Array.isArray(value)) {
            this._throwError("expected array value", value);
        }
        let count = this.length;
        if (count === -1) {
            count = value.length;
            writer.writeValue(value.length);
        }
        logger$8.checkArgumentCount(
            value.length,
            count,
            "coder array" + (this.localName ? " " + this.localName : "")
        );
        let coders = [];
        for (let i = 0; i < value.length; i++) {
            coders.push(this.coder);
        }
        return pack(writer, coders, value);
    }
    decode(reader) {
        let count = this.length;
        if (count === -1) {
            count = reader.readValue().toNumber();
            if (count * 32 > reader._data.length) {
                logger$8.throwError(
                    "insufficient data length",
                    Logger.errors.BUFFER_OVERRUN,
                    { length: reader._data.length, count: count }
                );
            }
        }
        let coders = [];
        for (let i = 0; i < count; i++) {
            coders.push(new AnonymousCoder(this.coder));
        }
        return reader.coerce(this.name, unpack(reader, coders));
    }
}
("use strict");
class BooleanCoder extends Coder {
    constructor(localName) {
        super("bool", "bool", localName, false);
    }
    defaultValue() {
        return false;
    }
    encode(writer, value) {
        return writer.writeValue(value ? 1 : 0);
    }
    decode(reader) {
        return reader.coerce(this.type, !reader.readValue().isZero());
    }
}
("use strict");
class DynamicBytesCoder extends Coder {
    constructor(type, localName) {
        super(type, type, localName, true);
    }
    defaultValue() {
        return "0x";
    }
    encode(writer, value) {
        value = arrayify(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }
    decode(reader) {
        return reader.readBytes(reader.readValue().toNumber(), true);
    }
}
class BytesCoder extends DynamicBytesCoder {
    constructor(localName) {
        super("bytes", localName);
    }
    decode(reader) {
        return reader.coerce(this.name, hexlify(super.decode(reader)));
    }
}
("use strict");
class FixedBytesCoder extends Coder {
    constructor(size, localName) {
        let name = "bytes" + String(size);
        super(name, name, localName, false);
        this.size = size;
    }
    defaultValue() {
        return "0x0000000000000000000000000000000000000000000000000000000000000000".substring(
            0,
            2 + this.size * 2
        );
    }
    encode(writer, value) {
        let data = arrayify(value);
        if (data.length !== this.size) {
            this._throwError("incorrect data length", value);
        }
        return writer.writeBytes(data);
    }
    decode(reader) {
        return reader.coerce(this.name, hexlify(reader.readBytes(this.size)));
    }
}
("use strict");
class NullCoder extends Coder {
    constructor(localName) {
        super("null", "", localName, false);
    }
    defaultValue() {
        return null;
    }
    encode(writer, value) {
        if (value != null) {
            this._throwError("not null", value);
        }
        return writer.writeBytes([]);
    }
    decode(reader) {
        reader.readBytes(0);
        return reader.coerce(this.name, null);
    }
}
const AddressZero = "0x0000000000000000000000000000000000000000";
const NegativeOne$1 = BigNumber.from(-1);
const Zero$1 = BigNumber.from(0);
const One = BigNumber.from(1);
const Two = BigNumber.from(2);
const WeiPerEther = BigNumber.from("1000000000000000000");
const MaxUint256 = BigNumber.from(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
const HashZero =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
const EtherSymbol = "Ξ";
("use strict");
var index$1 = Object.freeze({
    __proto__: null,
    AddressZero: AddressZero,
    NegativeOne: NegativeOne$1,
    Zero: Zero$1,
    One: One,
    Two: Two,
    WeiPerEther: WeiPerEther,
    MaxUint256: MaxUint256,
    HashZero: HashZero,
    EtherSymbol: EtherSymbol,
});
("use strict");
class NumberCoder extends Coder {
    constructor(size, signed, localName) {
        const name = (signed ? "int" : "uint") + size * 8;
        super(name, name, localName, false);
        this.size = size;
        this.signed = signed;
    }
    defaultValue() {
        return 0;
    }
    encode(writer, value) {
        let v = BigNumber.from(value);
        let maxUintValue = MaxUint256.mask(writer.wordSize * 8);
        if (this.signed) {
            let bounds = maxUintValue.mask(this.size * 8 - 1);
            if (v.gt(bounds) || v.lt(bounds.add(One).mul(NegativeOne$1))) {
                this._throwError("value out-of-bounds", value);
            }
        } else if (v.lt(Zero$1) || v.gt(maxUintValue.mask(this.size * 8))) {
            this._throwError("value out-of-bounds", value);
        }
        v = v.toTwos(this.size * 8).mask(this.size * 8);
        if (this.signed) {
            v = v.fromTwos(this.size * 8).toTwos(8 * writer.wordSize);
        }
        return writer.writeValue(v);
    }
    decode(reader) {
        let value = reader.readValue().mask(this.size * 8);
        if (this.signed) {
            value = value.fromTwos(this.size * 8);
        }
        return reader.coerce(this.name, value);
    }
}
const version$7 = "strings/5.1.0";
("use strict");
const logger$9 = new Logger(version$7);
var UnicodeNormalizationForm;
(function (UnicodeNormalizationForm) {
    UnicodeNormalizationForm["current"] = "";
    UnicodeNormalizationForm["NFC"] = "NFC";
    UnicodeNormalizationForm["NFD"] = "NFD";
    UnicodeNormalizationForm["NFKC"] = "NFKC";
    UnicodeNormalizationForm["NFKD"] = "NFKD";
})(UnicodeNormalizationForm || (UnicodeNormalizationForm = {}));
var Utf8ErrorReason;
(function (Utf8ErrorReason) {
    Utf8ErrorReason["UNEXPECTED_CONTINUE"] = "unexpected continuation byte";
    Utf8ErrorReason["BAD_PREFIX"] = "bad codepoint prefix";
    Utf8ErrorReason["OVERRUN"] = "string overrun";
    Utf8ErrorReason["MISSING_CONTINUE"] = "missing continuation byte";
    Utf8ErrorReason["OUT_OF_RANGE"] = "out of UTF-8 range";
    Utf8ErrorReason["UTF16_SURROGATE"] = "UTF-16 surrogate";
    Utf8ErrorReason["OVERLONG"] = "overlong representation";
})(Utf8ErrorReason || (Utf8ErrorReason = {}));
function errorFunc(reason, offset, bytes, output, badCodepoint) {
    return logger$9.throwArgumentError(
        `invalid codepoint at offset ${offset}; ${reason}`,
        "bytes",
        bytes
    );
}
function ignoreFunc(reason, offset, bytes, output, badCodepoint) {
    if (
        reason === Utf8ErrorReason.BAD_PREFIX ||
        reason === Utf8ErrorReason.UNEXPECTED_CONTINUE
    ) {
        let i = 0;
        for (let o = offset + 1; o < bytes.length; o++) {
            if (bytes[o] >> 6 !== 2) {
                break;
            }
            i++;
        }
        return i;
    }
    if (reason === Utf8ErrorReason.OVERRUN) {
        return bytes.length - offset - 1;
    }
    return 0;
}
function replaceFunc(reason, offset, bytes, output, badCodepoint) {
    if (reason === Utf8ErrorReason.OVERLONG) {
        output.push(badCodepoint);
        return 0;
    }
    output.push(65533);
    return ignoreFunc(reason, offset, bytes, output, badCodepoint);
}
const Utf8ErrorFuncs = Object.freeze({
    error: errorFunc,
    ignore: ignoreFunc,
    replace: replaceFunc,
});
function getUtf8CodePoints(bytes, onError) {
    if (onError == null) {
        onError = Utf8ErrorFuncs.error;
    }
    bytes = arrayify(bytes);
    const result = [];
    let i = 0;
    while (i < bytes.length) {
        const c = bytes[i++];
        if (c >> 7 === 0) {
            result.push(c);
            continue;
        }
        let extraLength = null;
        let overlongMask = null;
        if ((c & 224) === 192) {
            extraLength = 1;
            overlongMask = 127;
        } else if ((c & 240) === 224) {
            extraLength = 2;
            overlongMask = 2047;
        } else if ((c & 248) === 240) {
            extraLength = 3;
            overlongMask = 65535;
        } else {
            if ((c & 192) === 128) {
                i += onError(Utf8ErrorReason.UNEXPECTED_CONTINUE, i - 1, bytes, result);
            } else {
                i += onError(Utf8ErrorReason.BAD_PREFIX, i - 1, bytes, result);
            }
            continue;
        }
        if (i - 1 + extraLength >= bytes.length) {
            i += onError(Utf8ErrorReason.OVERRUN, i - 1, bytes, result);
            continue;
        }
        let res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (let j = 0; j < extraLength; j++) {
            let nextChar = bytes[i];
            if ((nextChar & 192) != 128) {
                i += onError(Utf8ErrorReason.MISSING_CONTINUE, i, bytes, result);
                res = null;
                break;
            }
            res = (res << 6) | (nextChar & 63);
            i++;
        }
        if (res === null) {
            continue;
        }
        if (res > 1114111) {
            i += onError(
                Utf8ErrorReason.OUT_OF_RANGE,
                i - 1 - extraLength,
                bytes,
                result,
                res
            );
            continue;
        }
        if (res >= 55296 && res <= 57343) {
            i += onError(
                Utf8ErrorReason.UTF16_SURROGATE,
                i - 1 - extraLength,
                bytes,
                result,
                res
            );
            continue;
        }
        if (res <= overlongMask) {
            i += onError(
                Utf8ErrorReason.OVERLONG,
                i - 1 - extraLength,
                bytes,
                result,
                res
            );
            continue;
        }
        result.push(res);
    }
    return result;
}
function toUtf8Bytes(str, form = UnicodeNormalizationForm.current) {
    if (form != UnicodeNormalizationForm.current) {
        logger$9.checkNormalize();
        str = str.normalize(form);
    }
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 128) {
            result.push(c);
        } else if (c < 2048) {
            result.push((c >> 6) | 192);
            result.push((c & 63) | 128);
        } else if ((c & 64512) == 55296) {
            i++;
            const c2 = str.charCodeAt(i);
            if (i >= str.length || (c2 & 64512) !== 56320) {
                throw new Error("invalid utf-8 string");
            }
            const pair = 65536 + ((c & 1023) << 10) + (c2 & 1023);
            result.push((pair >> 18) | 240);
            result.push(((pair >> 12) & 63) | 128);
            result.push(((pair >> 6) & 63) | 128);
            result.push((pair & 63) | 128);
        } else {
            result.push((c >> 12) | 224);
            result.push(((c >> 6) & 63) | 128);
            result.push((c & 63) | 128);
        }
    }
    return arrayify(result);
}
function escapeChar(value) {
    const hex = "0000" + value.toString(16);
    return "\\u" + hex.substring(hex.length - 4);
}
function _toEscapedUtf8String(bytes, onError) {
    return (
        '"' +
        getUtf8CodePoints(bytes, onError)
            .map((codePoint) => {
                if (codePoint < 256) {
                    switch (codePoint) {
                        case 8:
                            return "\\b";
                        case 9:
                            return "\\t";
                        case 10:
                            return "\\n";
                        case 13:
                            return "\\r";
                        case 34:
                            return '\\"';
                        case 92:
                            return "\\\\";
                    }
                    if (codePoint >= 32 && codePoint < 127) {
                        return String.fromCharCode(codePoint);
                    }
                }
                if (codePoint <= 65535) {
                    return escapeChar(codePoint);
                }
                codePoint -= 65536;
                return (
                    escapeChar(((codePoint >> 10) & 1023) + 55296) +
                    escapeChar((codePoint & 1023) + 56320)
                );
            })
            .join("") +
        '"'
    );
}
function _toUtf8String(codePoints) {
    return codePoints
        .map((codePoint) => {
            if (codePoint <= 65535) {
                return String.fromCharCode(codePoint);
            }
            codePoint -= 65536;
            return String.fromCharCode(
                ((codePoint >> 10) & 1023) + 55296,
                (codePoint & 1023) + 56320
            );
        })
        .join("");
}
function toUtf8String(bytes, onError) {
    return _toUtf8String(getUtf8CodePoints(bytes, onError));
}
function toUtf8CodePoints(str, form = UnicodeNormalizationForm.current) {
    return getUtf8CodePoints(toUtf8Bytes(str, form));
}
("use strict");
function formatBytes32String(text) {
    const bytes = toUtf8Bytes(text);
    if (bytes.length > 31) {
        throw new Error("bytes32 string must be less than 32 bytes");
    }
    return hexlify(concat([bytes, HashZero]).slice(0, 32));
}
function parseBytes32String(bytes) {
    const data = arrayify(bytes);
    if (data.length !== 32) {
        throw new Error("invalid bytes32 - not 32 bytes long");
    }
    if (data[31] !== 0) {
        throw new Error("invalid bytes32 string - no null terminator");
    }
    let length = 31;
    while (data[length - 1] === 0) {
        length--;
    }
    return toUtf8String(data.slice(0, length));
}
("use strict");
function bytes2(data) {
    if (data.length % 4 !== 0) {
        throw new Error("bad data");
    }
    let result = [];
    for (let i = 0; i < data.length; i += 4) {
        result.push(parseInt(data.substring(i, i + 4), 16));
    }
    return result;
}
function createTable(data, func) {
    if (!func) {
        func = function (value) {
            return [parseInt(value, 16)];
        };
    }
    let lo = 0;
    let result = {};
    data.split(",").forEach((pair) => {
        let comps = pair.split(":");
        lo += parseInt(comps[0], 16);
        result[lo] = func(comps[1]);
    });
    return result;
}
function createRangeTable(data) {
    let hi = 0;
    return data.split(",").map((v) => {
        let comps = v.split("-");
        if (comps.length === 1) {
            comps[1] = "0";
        } else if (comps[1] === "") {
            comps[1] = "1";
        }
        let lo = hi + parseInt(comps[0], 16);
        hi = parseInt(comps[1], 16);
        return { l: lo, h: hi };
    });
}
function matchMap(value, ranges) {
    let lo = 0;
    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        lo += range.l;
        if (
            value >= lo &&
            value <= lo + range.h &&
            (value - lo) % (range.d || 1) === 0
        ) {
            if (range.e && range.e.indexOf(value - lo) !== -1) {
                continue;
            }
            return range;
        }
    }
    return null;
}
const Table_A_1_ranges = createRangeTable(
    "221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d"
);
const Table_B_1_flags = "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff"
    .split(",")
    .map((v) => parseInt(v, 16));
const Table_B_2_ranges = [
    { h: 25, s: 32, l: 65 },
    { h: 30, s: 32, e: [23], l: 127 },
    { h: 54, s: 1, e: [48], l: 64, d: 2 },
    { h: 14, s: 1, l: 57, d: 2 },
    { h: 44, s: 1, l: 17, d: 2 },
    { h: 10, s: 1, e: [2, 6, 8], l: 61, d: 2 },
    { h: 16, s: 1, l: 68, d: 2 },
    { h: 84, s: 1, e: [18, 24, 66], l: 19, d: 2 },
    { h: 26, s: 32, e: [17], l: 435 },
    { h: 22, s: 1, l: 71, d: 2 },
    { h: 15, s: 80, l: 40 },
    { h: 31, s: 32, l: 16 },
    { h: 32, s: 1, l: 80, d: 2 },
    { h: 52, s: 1, l: 42, d: 2 },
    { h: 12, s: 1, l: 55, d: 2 },
    { h: 40, s: 1, e: [38], l: 15, d: 2 },
    { h: 14, s: 1, l: 48, d: 2 },
    { h: 37, s: 48, l: 49 },
    { h: 148, s: 1, l: 6351, d: 2 },
    { h: 88, s: 1, l: 160, d: 2 },
    { h: 15, s: 16, l: 704 },
    { h: 25, s: 26, l: 854 },
    { h: 25, s: 32, l: 55915 },
    { h: 37, s: 40, l: 1247 },
    { h: 25, s: -119711, l: 53248 },
    { h: 25, s: -119763, l: 52 },
    { h: 25, s: -119815, l: 52 },
    { h: 25, s: -119867, e: [1, 4, 5, 7, 8, 11, 12, 17], l: 52 },
    { h: 25, s: -119919, l: 52 },
    { h: 24, s: -119971, e: [2, 7, 8, 17], l: 52 },
    { h: 24, s: -120023, e: [2, 7, 13, 15, 16, 17], l: 52 },
    { h: 25, s: -120075, l: 52 },
    { h: 25, s: -120127, l: 52 },
    { h: 25, s: -120179, l: 52 },
    { h: 25, s: -120231, l: 52 },
    { h: 25, s: -120283, l: 52 },
    { h: 25, s: -120335, l: 52 },
    { h: 24, s: -119543, e: [17], l: 56 },
    { h: 24, s: -119601, e: [17], l: 58 },
    { h: 24, s: -119659, e: [17], l: 58 },
    { h: 24, s: -119717, e: [17], l: 58 },
    { h: 24, s: -119775, e: [17], l: 58 },
];
const Table_B_2_lut_abs = createTable(
    "b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3"
);
const Table_B_2_lut_rel = createTable(
    "179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7"
);
const Table_B_2_complex = createTable(
    "df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D",
    bytes2
);
const Table_C_ranges = createRangeTable(
    "80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001"
);
function flatten(values) {
    return values.reduce((accum, value) => {
        value.forEach((value) => {
            accum.push(value);
        });
        return accum;
    }, []);
}
function _nameprepTableA1(codepoint) {
    return !!matchMap(codepoint, Table_A_1_ranges);
}
function _nameprepTableB2(codepoint) {
    let range = matchMap(codepoint, Table_B_2_ranges);
    if (range) {
        return [codepoint + range.s];
    }
    let codes = Table_B_2_lut_abs[codepoint];
    if (codes) {
        return codes;
    }
    let shift = Table_B_2_lut_rel[codepoint];
    if (shift) {
        return [codepoint + shift[0]];
    }
    let complex = Table_B_2_complex[codepoint];
    if (complex) {
        return complex;
    }
    return null;
}
function _nameprepTableC(codepoint) {
    return !!matchMap(codepoint, Table_C_ranges);
}
function nameprep(value) {
    if (value.match(/^[a-z0-9-]*$/i) && value.length <= 59) {
        return value.toLowerCase();
    }
    let codes = toUtf8CodePoints(value);
    codes = flatten(
        codes.map((code) => {
            if (Table_B_1_flags.indexOf(code) >= 0) {
                return [];
            }
            if (code >= 65024 && code <= 65039) {
                return [];
            }
            let codesTableB2 = _nameprepTableB2(code);
            if (codesTableB2) {
                return codesTableB2;
            }
            return [code];
        })
    );
    codes = toUtf8CodePoints(_toUtf8String(codes), UnicodeNormalizationForm.NFKC);
    codes.forEach((code) => {
        if (_nameprepTableC(code)) {
            throw new Error("STRINGPREP_CONTAINS_PROHIBITED");
        }
    });
    codes.forEach((code) => {
        if (_nameprepTableA1(code)) {
            throw new Error("STRINGPREP_CONTAINS_UNASSIGNED");
        }
    });
    let name = _toUtf8String(codes);
    if (
        name.substring(0, 1) === "-" ||
        name.substring(2, 4) === "--" ||
        name.substring(name.length - 1) === "-"
    ) {
        throw new Error("invalid hyphen");
    }
    if (name.length > 63) {
        throw new Error("too long");
    }
    return name;
}
("use strict");
("use strict");
class StringCoder extends DynamicBytesCoder {
    constructor(localName) {
        super("string", localName);
    }
    defaultValue() {
        return "";
    }
    encode(writer, value) {
        return super.encode(writer, toUtf8Bytes(value));
    }
    decode(reader) {
        return toUtf8String(super.decode(reader));
    }
}
("use strict");
class TupleCoder extends Coder {
    constructor(coders, localName) {
        let dynamic = false;
        const types = [];
        coders.forEach((coder) => {
            if (coder.dynamic) {
                dynamic = true;
            }
            types.push(coder.type);
        });
        const type = "tuple(" + types.join(",") + ")";
        super("tuple", type, localName, dynamic);
        this.coders = coders;
    }
    defaultValue() {
        const values = [];
        this.coders.forEach((coder) => {
            values.push(coder.defaultValue());
        });
        const uniqueNames = this.coders.reduce((accum, coder) => {
            const name = coder.localName;
            if (name) {
                if (!accum[name]) {
                    accum[name] = 0;
                }
                accum[name]++;
            }
            return accum;
        }, {});
        this.coders.forEach((coder, index) => {
            let name = coder.localName;
            if (!name || uniqueNames[name] !== 1) {
                return;
            }
            if (name === "length") {
                name = "_length";
            }
            if (values[name] != null) {
                return;
            }
            values[name] = values[index];
        });
        return Object.freeze(values);
    }
    encode(writer, value) {
        return pack(writer, this.coders, value);
    }
    decode(reader) {
        return reader.coerce(this.name, unpack(reader, this.coders));
    }
}
("use strict");
const logger$a = new Logger(version$4);
const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
class AbiCoder {
    constructor(coerceFunc) {
        logger$a.checkNew(new.target, AbiCoder);
        defineReadOnly(this, "coerceFunc", coerceFunc || null);
    }
    _getCoder(param) {
        switch (param.baseType) {
            case "address":
                return new AddressCoder(param.name);
            case "bool":
                return new BooleanCoder(param.name);
            case "string":
                return new StringCoder(param.name);
            case "bytes":
                return new BytesCoder(param.name);
            case "array":
                return new ArrayCoder(
                    this._getCoder(param.arrayChildren),
                    param.arrayLength,
                    param.name
                );
            case "tuple":
                return new TupleCoder(
                    (param.components || []).map((component) => {
                        return this._getCoder(component);
                    }),
                    param.name
                );
            case "":
                return new NullCoder(param.name);
        }
        let match = param.type.match(paramTypeNumber);
        if (match) {
            let size = parseInt(match[2] || "256");
            if (size === 0 || size > 256 || size % 8 !== 0) {
                logger$a.throwArgumentError(
                    "invalid " + match[1] + " bit length",
                    "param",
                    param
                );
            }
            return new NumberCoder(size / 8, match[1] === "int", param.name);
        }
        match = param.type.match(paramTypeBytes);
        if (match) {
            let size = parseInt(match[1]);
            if (size === 0 || size > 32) {
                logger$a.throwArgumentError("invalid bytes length", "param", param);
            }
            return new FixedBytesCoder(size, param.name);
        }
        return logger$a.throwArgumentError("invalid type", "type", param.type);
    }
    _getWordSize() {
        return 32;
    }
    _getReader(data, allowLoose) {
        return new Reader(data, this._getWordSize(), this.coerceFunc, allowLoose);
    }
    _getWriter() {
        return new Writer(this._getWordSize());
    }
    getDefaultValue(types) {
        const coders = types.map((type) => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.defaultValue();
    }
    encode(types, values) {
        if (types.length !== values.length) {
            logger$a.throwError(
                "types/values length mismatch",
                Logger.errors.INVALID_ARGUMENT,
                {
                    count: { types: types.length, values: values.length },
                    value: { types: types, values: values },
                }
            );
        }
        const coders = types.map((type) => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        const writer = this._getWriter();
        coder.encode(writer, values);
        return writer.data;
    }
    decode(types, data, loose) {
        const coders = types.map((type) => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.decode(this._getReader(arrayify(data), loose));
    }
}
const defaultAbiCoder = new AbiCoder();
function id(text) {
    return keccak256(toUtf8Bytes(text));
}
const version$8 = "hash/5.1.0";
const logger$b = new Logger(version$8);
const Zeros = new Uint8Array(32);
Zeros.fill(0);
const Partition = new RegExp("^((.*)\\.)?([^.]+)$");
function isValidName(name) {
    try {
        const comps = name.split(".");
        for (let i = 0; i < comps.length; i++) {
            if (nameprep(comps[i]).length === 0) {
                throw new Error("empty");
            }
        }
        return true;
    } catch (error) { }
    return false;
}
function namehash(name) {
    if (typeof name !== "string") {
        logger$b.throwArgumentError(
            "invalid address - " + String(name),
            "name",
            name
        );
    }
    let result = Zeros;
    while (name.length) {
        const partition = name.match(Partition);
        const label = toUtf8Bytes(nameprep(partition[3]));
        result = keccak256(concat([result, keccak256(label)]));
        name = partition[2] || "";
    }
    return hexlify(result);
}
const messagePrefix = "Ethereum Signed Message:\n";
function hashMessage(message) {
    if (typeof message === "string") {
        message = toUtf8Bytes(message);
    }
    return keccak256(
        concat([
            toUtf8Bytes(messagePrefix),
            toUtf8Bytes(String(message.length)),
            message,
        ])
    );
}
var __awaiter$1 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$c = new Logger(version$8);
const padding = new Uint8Array(32);
padding.fill(0);
const NegativeOne$2 = BigNumber.from(-1);
const Zero$2 = BigNumber.from(0);
const One$1 = BigNumber.from(1);
const MaxUint256$1 = BigNumber.from(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function hexPadRight(value) {
    const bytes = arrayify(value);
    const padOffset = bytes.length % 32;
    if (padOffset) {
        return hexConcat([bytes, padding.slice(padOffset)]);
    }
    return hexlify(bytes);
}
const hexTrue = hexZeroPad(One$1.toHexString(), 32);
const hexFalse = hexZeroPad(Zero$2.toHexString(), 32);
const domainFieldTypes = {
    name: "string",
    version: "string",
    chainId: "uint256",
    verifyingContract: "address",
    salt: "bytes32",
};
const domainFieldNames = [
    "name",
    "version",
    "chainId",
    "verifyingContract",
    "salt",
];
function checkString(key) {
    return function (value) {
        if (typeof value !== "string") {
            logger$c.throwArgumentError(
                `invalid domain value for ${JSON.stringify(key)}`,
                `domain.${key}`,
                value
            );
        }
        return value;
    };
}
const domainChecks = {
    name: checkString("name"),
    version: checkString("version"),
    chainId: function (value) {
        try {
            return BigNumber.from(value).toString();
        } catch (error) { }
        return logger$c.throwArgumentError(
            `invalid domain value for "chainId"`,
            "domain.chainId",
            value
        );
    },
    verifyingContract: function (value) {
        try {
            return getAddress(value).toLowerCase();
        } catch (error) { }
        return logger$c.throwArgumentError(
            `invalid domain value "verifyingContract"`,
            "domain.verifyingContract",
            value
        );
    },
    salt: function (value) {
        try {
            const bytes = arrayify(value);
            if (bytes.length !== 32) {
                throw new Error("bad length");
            }
            return hexlify(bytes);
        } catch (error) { }
        return logger$c.throwArgumentError(
            `invalid domain value "salt"`,
            "domain.salt",
            value
        );
    },
};
function getBaseEncoder(type) {
    {
        const match = type.match(/^(u?)int(\d*)$/);
        if (match) {
            const signed = match[1] === "";
            const width = parseInt(match[2] || "256");
            if (
                width % 8 !== 0 ||
                width > 256 ||
                (match[2] && match[2] !== String(width))
            ) {
                logger$c.throwArgumentError("invalid numeric width", "type", type);
            }
            const boundsUpper = MaxUint256$1.mask(signed ? width - 1 : width);
            const boundsLower = signed
                ? boundsUpper.add(One$1).mul(NegativeOne$2)
                : Zero$2;
            return function (value) {
                const v = BigNumber.from(value);
                if (v.lt(boundsLower) || v.gt(boundsUpper)) {
                    logger$c.throwArgumentError(
                        `value out-of-bounds for ${type}`,
                        "value",
                        value
                    );
                }
                return hexZeroPad(v.toTwos(256).toHexString(), 32);
            };
        }
    }
    {
        const match = type.match(/^bytes(\d+)$/);
        if (match) {
            const width = parseInt(match[1]);
            if (width === 0 || width > 32 || match[1] !== String(width)) {
                logger$c.throwArgumentError("invalid bytes width", "type", type);
            }
            return function (value) {
                const bytes = arrayify(value);
                if (bytes.length !== width) {
                    logger$c.throwArgumentError(
                        `invalid length for ${type}`,
                        "value",
                        value
                    );
                }
                return hexPadRight(value);
            };
        }
    }
    switch (type) {
        case "address":
            return function (value) {
                return hexZeroPad(getAddress(value), 32);
            };
        case "bool":
            return function (value) {
                return !value ? hexFalse : hexTrue;
            };
        case "bytes":
            return function (value) {
                return keccak256(value);
            };
        case "string":
            return function (value) {
                return id(value);
            };
    }
    return null;
}
function encodeType(name, fields) {
    return `${name}(${fields
        .map(({ name: name, type: type }) => type + " " + name)
        .join(",")})`;
}
class TypedDataEncoder {
    constructor(types) {
        defineReadOnly(this, "types", Object.freeze(deepCopy(types)));
        defineReadOnly(this, "_encoderCache", {});
        defineReadOnly(this, "_types", {});
        const links = {};
        const parents = {};
        const subtypes = {};
        Object.keys(types).forEach((type) => {
            links[type] = {};
            parents[type] = [];
            subtypes[type] = {};
        });
        for (const name in types) {
            const uniqueNames = {};
            types[name].forEach((field) => {
                if (uniqueNames[field.name]) {
                    logger$c.throwArgumentError(
                        `duplicate variable name ${JSON.stringify(
                            field.name
                        )} in ${JSON.stringify(name)}`,
                        "types",
                        types
                    );
                }
                uniqueNames[field.name] = true;
                const baseType = field.type.match(/^([^\x5b]*)(\x5b|$)/)[1];
                if (baseType === name) {
                    logger$c.throwArgumentError(
                        `circular type reference to ${JSON.stringify(baseType)}`,
                        "types",
                        types
                    );
                }
                const encoder = getBaseEncoder(baseType);
                if (encoder) {
                    return;
                }
                if (!parents[baseType]) {
                    logger$c.throwArgumentError(
                        `unknown type ${JSON.stringify(baseType)}`,
                        "types",
                        types
                    );
                }
                parents[baseType].push(name);
                links[name][baseType] = true;
            });
        }
        const primaryTypes = Object.keys(parents).filter(
            (n) => parents[n].length === 0
        );
        if (primaryTypes.length === 0) {
            logger$c.throwArgumentError("missing primary type", "types", types);
        } else if (primaryTypes.length > 1) {
            logger$c.throwArgumentError(
                `ambiguous primary types or unused types: ${primaryTypes
                    .map((t) => JSON.stringify(t))
                    .join(", ")}`,
                "types",
                types
            );
        }
        defineReadOnly(this, "primaryType", primaryTypes[0]);
        function checkCircular(type, found) {
            if (found[type]) {
                logger$c.throwArgumentError(
                    `circular type reference to ${JSON.stringify(type)}`,
                    "types",
                    types
                );
            }
            found[type] = true;
            Object.keys(links[type]).forEach((child) => {
                if (!parents[child]) {
                    return;
                }
                checkCircular(child, found);
                Object.keys(found).forEach((subtype) => {
                    subtypes[subtype][child] = true;
                });
            });
            delete found[type];
        }
        checkCircular(this.primaryType, {});
        for (const name in subtypes) {
            const st = Object.keys(subtypes[name]);
            st.sort();
            this._types[name] =
                encodeType(name, types[name]) +
                st.map((t) => encodeType(t, types[t])).join("");
        }
    }
    getEncoder(type) {
        let encoder = this._encoderCache[type];
        if (!encoder) {
            encoder = this._encoderCache[type] = this._getEncoder(type);
        }
        return encoder;
    }
    _getEncoder(type) {
        {
            const encoder = getBaseEncoder(type);
            if (encoder) {
                return encoder;
            }
        }
        const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
        if (match) {
            const subtype = match[1];
            const subEncoder = this.getEncoder(subtype);
            const length = parseInt(match[3]);
            return (value) => {
                if (length >= 0 && value.length !== length) {
                    logger$c.throwArgumentError(
                        "array length mismatch; expected length ${ arrayLength }",
                        "value",
                        value
                    );
                }
                let result = value.map(subEncoder);
                if (this._types[subtype]) {
                    result = result.map(keccak256);
                }
                return keccak256(hexConcat(result));
            };
        }
        const fields = this.types[type];
        if (fields) {
            const encodedType = id(this._types[type]);
            return (value) => {
                const values = fields.map(({ name: name, type: type }) => {
                    const result = this.getEncoder(type)(value[name]);
                    if (this._types[type]) {
                        return keccak256(result);
                    }
                    return result;
                });
                values.unshift(encodedType);
                return hexConcat(values);
            };
        }
        return logger$c.throwArgumentError(`unknown type: ${type}`, "type", type);
    }
    encodeType(name) {
        const result = this._types[name];
        if (!result) {
            logger$c.throwArgumentError(
                `unknown type: ${JSON.stringify(name)}`,
                "name",
                name
            );
        }
        return result;
    }
    encodeData(type, value) {
        return this.getEncoder(type)(value);
    }
    hashStruct(name, value) {
        return keccak256(this.encodeData(name, value));
    }
    encode(value) {
        return this.encodeData(this.primaryType, value);
    }
    hash(value) {
        return this.hashStruct(this.primaryType, value);
    }
    _visit(type, value, callback) {
        {
            const encoder = getBaseEncoder(type);
            if (encoder) {
                return callback(type, value);
            }
        }
        const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
        if (match) {
            const subtype = match[1];
            const length = parseInt(match[3]);
            if (length >= 0 && value.length !== length) {
                logger$c.throwArgumentError(
                    "array length mismatch; expected length ${ arrayLength }",
                    "value",
                    value
                );
            }
            return value.map((v) => this._visit(subtype, v, callback));
        }
        const fields = this.types[type];
        if (fields) {
            return fields.reduce((accum, { name: name, type: type }) => {
                accum[name] = this._visit(type, value[name], callback);
                return accum;
            }, {});
        }
        return logger$c.throwArgumentError(`unknown type: ${type}`, "type", type);
    }
    visit(value, callback) {
        return this._visit(this.primaryType, value, callback);
    }
    static from(types) {
        return new TypedDataEncoder(types);
    }
    static getPrimaryType(types) {
        return TypedDataEncoder.from(types).primaryType;
    }
    static hashStruct(name, types, value) {
        return TypedDataEncoder.from(types).hashStruct(name, value);
    }
    static hashDomain(domain) {
        const domainFields = [];
        for (const name in domain) {
            const type = domainFieldTypes[name];
            if (!type) {
                logger$c.throwArgumentError(
                    `invalid typed-data domain key: ${JSON.stringify(name)}`,
                    "domain",
                    domain
                );
            }
            domainFields.push({ name: name, type: type });
        }
        domainFields.sort((a, b) => {
            return (
                domainFieldNames.indexOf(a.name) - domainFieldNames.indexOf(b.name)
            );
        });
        return TypedDataEncoder.hashStruct(
            "EIP712Domain",
            { EIP712Domain: domainFields },
            domain
        );
    }
    static encode(domain, types, value) {
        return hexConcat([
            "0x1901",
            TypedDataEncoder.hashDomain(domain),
            TypedDataEncoder.from(types).hash(value),
        ]);
    }
    static hash(domain, types, value) {
        return keccak256(TypedDataEncoder.encode(domain, types, value));
    }
    static resolveNames(domain, types, value, resolveName) {
        return __awaiter$1(this, void 0, void 0, function* () {
            domain = shallowCopy(domain);
            const ensCache = {};
            if (
                domain.verifyingContract &&
                !isHexString(domain.verifyingContract, 20)
            ) {
                ensCache[domain.verifyingContract] = "0x";
            }
            const encoder = TypedDataEncoder.from(types);
            encoder.visit(value, (type, value) => {
                if (type === "address" && !isHexString(value, 20)) {
                    ensCache[value] = "0x";
                }
                return value;
            });
            for (const name in ensCache) {
                ensCache[name] = yield resolveName(name);
            }
            if (domain.verifyingContract && ensCache[domain.verifyingContract]) {
                domain.verifyingContract = ensCache[domain.verifyingContract];
            }
            value = encoder.visit(value, (type, value) => {
                if (type === "address" && ensCache[value]) {
                    return ensCache[value];
                }
                return value;
            });
            return { domain: domain, value: value };
        });
    }
    static getPayload(domain, types, value) {
        TypedDataEncoder.hashDomain(domain);
        const domainValues = {};
        const domainTypes = [];
        domainFieldNames.forEach((name) => {
            const value = domain[name];
            if (value == null) {
                return;
            }
            domainValues[name] = domainChecks[name](value);
            domainTypes.push({ name: name, type: domainFieldTypes[name] });
        });
        const encoder = TypedDataEncoder.from(types);
        const typesWithDomain = shallowCopy(types);
        if (typesWithDomain.EIP712Domain) {
            logger$c.throwArgumentError(
                "types must not contain EIP712Domain type",
                "types.EIP712Domain",
                types
            );
        } else {
            typesWithDomain.EIP712Domain = domainTypes;
        }
        encoder.encode(value);
        return {
            types: typesWithDomain,
            domain: domainValues,
            primaryType: encoder.primaryType,
            message: encoder.visit(value, (type, value) => {
                if (type.match(/^bytes(\d*)/)) {
                    return hexlify(arrayify(value));
                }
                if (type.match(/^u?int/)) {
                    return BigNumber.from(value).toString();
                }
                switch (type) {
                    case "address":
                        return value.toLowerCase();
                    case "bool":
                        return !!value;
                    case "string":
                        if (typeof value !== "string") {
                            logger$c.throwArgumentError(`invalid string`, "value", value);
                        }
                        return value;
                }
                return logger$c.throwArgumentError("unsupported type", "type", type);
            }),
        };
    }
}
("use strict");
("use strict");
const logger$d = new Logger(version$4);
class LogDescription extends Description { }
class TransactionDescription extends Description { }
class Indexed extends Description {
    static isIndexed(value) {
        return !!(value && value._isIndexed);
    }
}
function wrapAccessError(property, error) {
    const wrap = new Error(
        `deferred error during ABI decoding triggered accessing ${property}`
    );
    wrap.error = error;
    return wrap;
}
class Interface {
    constructor(fragments) {
        logger$d.checkNew(new.target, Interface);
        let abi = [];
        if (typeof fragments === "string") {
            abi = JSON.parse(fragments);
        } else {
            abi = fragments;
        }
        defineReadOnly(
            this,
            "fragments",
            abi
                .map((fragment) => {
                    return Fragment.from(fragment);
                })
                .filter((fragment) => fragment != null)
        );
        defineReadOnly(this, "_abiCoder", getStatic(new.target, "getAbiCoder")());
        defineReadOnly(this, "functions", {});
        defineReadOnly(this, "errors", {});
        defineReadOnly(this, "events", {});
        defineReadOnly(this, "structs", {});
        this.fragments.forEach((fragment) => {
            let bucket = null;
            switch (fragment.type) {
                case "constructor":
                    if (this.deploy) {
                        logger$d.warn("duplicate definition - constructor");
                        return;
                    }
                    defineReadOnly(this, "deploy", fragment);
                    return;
                case "function":
                    bucket = this.functions;
                    break;
                case "event":
                    bucket = this.events;
                    break;
                default:
                    return;
            }
            let signature = fragment.format();
            if (bucket[signature]) {
                logger$d.warn("duplicate definition - " + signature);
                return;
            }
            bucket[signature] = fragment;
        });
        if (!this.deploy) {
            defineReadOnly(
                this,
                "deploy",
                ConstructorFragment.from({ payable: false, type: "constructor" })
            );
        }
        defineReadOnly(this, "_isInterface", true);
    }
    format(format) {
        if (!format) {
            format = FormatTypes.full;
        }
        if (format === FormatTypes.sighash) {
            logger$d.throwArgumentError(
                "interface does not support formatting sighash",
                "format",
                format
            );
        }
        const abi = this.fragments.map((fragment) => fragment.format(format));
        if (format === FormatTypes.json) {
            return JSON.stringify(abi.map((j) => JSON.parse(j)));
        }
        return abi;
    }
    static getAbiCoder() {
        return defaultAbiCoder;
    }
    static getAddress(address) {
        return getAddress(address);
    }
    static getSighash(functionFragment) {
        return hexDataSlice(id(functionFragment.format()), 0, 4);
    }
    static getEventTopic(eventFragment) {
        return id(eventFragment.format());
    }
    getFunction(nameOrSignatureOrSighash) {
        if (isHexString(nameOrSignatureOrSighash)) {
            for (const name in this.functions) {
                if (nameOrSignatureOrSighash === this.getSighash(name)) {
                    return this.functions[name];
                }
            }
            logger$d.throwArgumentError(
                "no matching function",
                "sighash",
                nameOrSignatureOrSighash
            );
        }
        if (nameOrSignatureOrSighash.indexOf("(") === -1) {
            const name = nameOrSignatureOrSighash.trim();
            const matching = Object.keys(this.functions).filter(
                (f) => f.split("(")[0] === name
            );
            if (matching.length === 0) {
                logger$d.throwArgumentError("no matching function", "name", name);
            } else if (matching.length > 1) {
                logger$d.throwArgumentError(
                    "multiple matching functions",
                    "name",
                    name
                );
            }
            return this.functions[matching[0]];
        }
        const result =
            this.functions[
            FunctionFragment.fromString(nameOrSignatureOrSighash).format()
            ];
        if (!result) {
            logger$d.throwArgumentError(
                "no matching function",
                "signature",
                nameOrSignatureOrSighash
            );
        }
        return result;
    }
    getEvent(nameOrSignatureOrTopic) {
        if (isHexString(nameOrSignatureOrTopic)) {
            const topichash = nameOrSignatureOrTopic.toLowerCase();
            for (const name in this.events) {
                if (topichash === this.getEventTopic(name)) {
                    return this.events[name];
                }
            }
            logger$d.throwArgumentError("no matching event", "topichash", topichash);
        }
        if (nameOrSignatureOrTopic.indexOf("(") === -1) {
            const name = nameOrSignatureOrTopic.trim();
            const matching = Object.keys(this.events).filter(
                (f) => f.split("(")[0] === name
            );
            if (matching.length === 0) {
                logger$d.throwArgumentError("no matching event", "name", name);
            } else if (matching.length > 1) {
                logger$d.throwArgumentError("multiple matching events", "name", name);
            }
            return this.events[matching[0]];
        }
        const result =
            this.events[EventFragment.fromString(nameOrSignatureOrTopic).format()];
        if (!result) {
            logger$d.throwArgumentError(
                "no matching event",
                "signature",
                nameOrSignatureOrTopic
            );
        }
        return result;
    }
    getSighash(functionFragment) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return getStatic(this.constructor, "getSighash")(functionFragment);
    }
    getEventTopic(eventFragment) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        return getStatic(this.constructor, "getEventTopic")(eventFragment);
    }
    _decodeParams(params, data) {
        return this._abiCoder.decode(params, data);
    }
    _encodeParams(params, values) {
        return this._abiCoder.encode(params, values);
    }
    encodeDeploy(values) {
        return this._encodeParams(this.deploy.inputs, values || []);
    }
    decodeFunctionData(functionFragment, data) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        const bytes = arrayify(data);
        if (hexlify(bytes.slice(0, 4)) !== this.getSighash(functionFragment)) {
            logger$d.throwArgumentError(
                `data signature does not match function ${functionFragment.name}.`,
                "data",
                hexlify(bytes)
            );
        }
        return this._decodeParams(functionFragment.inputs, bytes.slice(4));
    }
    encodeFunctionData(functionFragment, values) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return hexlify(
            concat([
                this.getSighash(functionFragment),
                this._encodeParams(functionFragment.inputs, values || []),
            ])
        );
    }
    decodeFunctionResult(functionFragment, data) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        let bytes = arrayify(data);
        let reason = null;
        let errorSignature = null;
        switch (bytes.length % this._abiCoder._getWordSize()) {
            case 0:
                try {
                    return this._abiCoder.decode(functionFragment.outputs, bytes);
                } catch (error) { }
                break;
            case 4:
                if (hexlify(bytes.slice(0, 4)) === "0x08c379a0") {
                    errorSignature = "Error(string)";
                    reason = this._abiCoder.decode(["string"], bytes.slice(4))[0];
                }
                break;
        }
        return logger$d.throwError(
            "call revert exception",
            Logger.errors.CALL_EXCEPTION,
            {
                method: functionFragment.format(),
                errorSignature: errorSignature,
                errorArgs: [reason],
                reason: reason,
            }
        );
    }
    encodeFunctionResult(functionFragment, values) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return hexlify(
            this._abiCoder.encode(functionFragment.outputs, values || [])
        );
    }
    encodeFilterTopics(eventFragment, values) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (values.length > eventFragment.inputs.length) {
            logger$d.throwError(
                "too many arguments for " + eventFragment.format(),
                Logger.errors.UNEXPECTED_ARGUMENT,
                { argument: "values", value: values }
            );
        }
        let topics = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        const encodeTopic = (param, value) => {
            if (param.type === "string") {
                return id(value);
            } else if (param.type === "bytes") {
                return keccak256(hexlify(value));
            }
            if (param.type === "address") {
                this._abiCoder.encode(["address"], [value]);
            }
            return hexZeroPad(hexlify(value), 32);
        };
        values.forEach((value, index) => {
            let param = eventFragment.inputs[index];
            if (!param.indexed) {
                if (value != null) {
                    logger$d.throwArgumentError(
                        "cannot filter non-indexed parameters; must be null",
                        "contract." + param.name,
                        value
                    );
                }
                return;
            }
            if (value == null) {
                topics.push(null);
            } else if (param.baseType === "array" || param.baseType === "tuple") {
                logger$d.throwArgumentError(
                    "filtering with tuples or arrays not supported",
                    "contract." + param.name,
                    value
                );
            } else if (Array.isArray(value)) {
                topics.push(value.map((value) => encodeTopic(param, value)));
            } else {
                topics.push(encodeTopic(param, value));
            }
        });
        while (topics.length && topics[topics.length - 1] === null) {
            topics.pop();
        }
        return topics;
    }
    encodeEventLog(eventFragment, values) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        const topics = [];
        const dataTypes = [];
        const dataValues = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        if (values.length !== eventFragment.inputs.length) {
            logger$d.throwArgumentError(
                "event arguments/values mismatch",
                "values",
                values
            );
        }
        eventFragment.inputs.forEach((param, index) => {
            const value = values[index];
            if (param.indexed) {
                if (param.type === "string") {
                    topics.push(id(value));
                } else if (param.type === "bytes") {
                    topics.push(keccak256(value));
                } else if (param.baseType === "tuple" || param.baseType === "array") {
                    throw new Error("not implemented");
                } else {
                    topics.push(this._abiCoder.encode([param.type], [value]));
                }
            } else {
                dataTypes.push(param);
                dataValues.push(value);
            }
        });
        return {
            data: this._abiCoder.encode(dataTypes, dataValues),
            topics: topics,
        };
    }
    decodeEventLog(eventFragment, data, topics) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (topics != null && !eventFragment.anonymous) {
            let topicHash = this.getEventTopic(eventFragment);
            if (
                !isHexString(topics[0], 32) ||
                topics[0].toLowerCase() !== topicHash
            ) {
                logger$d.throwError(
                    "fragment/topic mismatch",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "topics[0]", expected: topicHash, value: topics[0] }
                );
            }
            topics = topics.slice(1);
        }
        let indexed = [];
        let nonIndexed = [];
        let dynamic = [];
        eventFragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (
                    param.type === "string" ||
                    param.type === "bytes" ||
                    param.baseType === "tuple" ||
                    param.baseType === "array"
                ) {
                    indexed.push(
                        ParamType.fromObject({ type: "bytes32", name: param.name })
                    );
                    dynamic.push(true);
                } else {
                    indexed.push(param);
                    dynamic.push(false);
                }
            } else {
                nonIndexed.push(param);
                dynamic.push(false);
            }
        });
        let resultIndexed =
            topics != null ? this._abiCoder.decode(indexed, concat(topics)) : null;
        let resultNonIndexed = this._abiCoder.decode(nonIndexed, data, true);
        let result = [];
        let nonIndexedIndex = 0,
            indexedIndex = 0;
        eventFragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (resultIndexed == null) {
                    result[index] = new Indexed({ _isIndexed: true, hash: null });
                } else if (dynamic[index]) {
                    result[index] = new Indexed({
                        _isIndexed: true,
                        hash: resultIndexed[indexedIndex++],
                    });
                } else {
                    try {
                        result[index] = resultIndexed[indexedIndex++];
                    } catch (error) {
                        result[index] = error;
                    }
                }
            } else {
                try {
                    result[index] = resultNonIndexed[nonIndexedIndex++];
                } catch (error) {
                    result[index] = error;
                }
            }
            if (param.name && result[param.name] == null) {
                const value = result[index];
                if (value instanceof Error) {
                    Object.defineProperty(result, param.name, {
                        get: () => {
                            throw wrapAccessError(
                                `property ${JSON.stringify(param.name)}`,
                                value
                            );
                        },
                    });
                } else {
                    result[param.name] = value;
                }
            }
        });
        for (let i = 0; i < result.length; i++) {
            const value = result[i];
            if (value instanceof Error) {
                Object.defineProperty(result, i, {
                    get: () => {
                        throw wrapAccessError(`index ${i}`, value);
                    },
                });
            }
        }
        return Object.freeze(result);
    }
    parseTransaction(tx) {
        let fragment = this.getFunction(tx.data.substring(0, 10).toLowerCase());
        if (!fragment) {
            return null;
        }
        return new TransactionDescription({
            args: this._abiCoder.decode(
                fragment.inputs,
                "0x" + tx.data.substring(10)
            ),
            functionFragment: fragment,
            name: fragment.name,
            signature: fragment.format(),
            sighash: this.getSighash(fragment),
            value: BigNumber.from(tx.value || "0"),
        });
    }
    parseLog(log) {
        let fragment = this.getEvent(log.topics[0]);
        if (!fragment || fragment.anonymous) {
            return null;
        }
        return new LogDescription({
            eventFragment: fragment,
            name: fragment.name,
            signature: fragment.format(),
            topic: this.getEventTopic(fragment),
            args: this.decodeEventLog(fragment, log.data, log.topics),
        });
    }
    static isInterface(value) {
        return !!(value && value._isInterface);
    }
}
("use strict");
const version$9 = "abstract-provider/5.1.0";
("use strict");
const logger$e = new Logger(version$9);
class ForkEvent extends Description {
    static isForkEvent(value) {
        return !!(value && value._isForkEvent);
    }
}
class BlockForkEvent extends ForkEvent {
    constructor(blockHash, expiry) {
        if (!isHexString(blockHash, 32)) {
            logger$e.throwArgumentError("invalid blockHash", "blockHash", blockHash);
        }
        super({
            _isForkEvent: true,
            _isBlockForkEvent: true,
            expiry: expiry || 0,
            blockHash: blockHash,
        });
    }
}
class TransactionForkEvent extends ForkEvent {
    constructor(hash, expiry) {
        if (!isHexString(hash, 32)) {
            logger$e.throwArgumentError("invalid transaction hash", "hash", hash);
        }
        super({
            _isForkEvent: true,
            _isTransactionForkEvent: true,
            expiry: expiry || 0,
            hash: hash,
        });
    }
}
class TransactionOrderForkEvent extends ForkEvent {
    constructor(beforeHash, afterHash, expiry) {
        if (!isHexString(beforeHash, 32)) {
            logger$e.throwArgumentError(
                "invalid transaction hash",
                "beforeHash",
                beforeHash
            );
        }
        if (!isHexString(afterHash, 32)) {
            logger$e.throwArgumentError(
                "invalid transaction hash",
                "afterHash",
                afterHash
            );
        }
        super({
            _isForkEvent: true,
            _isTransactionOrderForkEvent: true,
            expiry: expiry || 0,
            beforeHash: beforeHash,
            afterHash: afterHash,
        });
    }
}
class Provider {
    constructor() {
        logger$e.checkAbstract(new.target, Provider);
        defineReadOnly(this, "_isProvider", true);
    }
    addListener(eventName, listener) {
        return this.on(eventName, listener);
    }
    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }
    static isProvider(value) {
        return !!(value && value._isProvider);
    }
}
const version$a = "abstract-signer/5.1.0";
("use strict");
var __awaiter$2 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$f = new Logger(version$a);
const allowedTransactionKeys = [
    "accessList",
    "chainId",
    "data",
    "from",
    "gasLimit",
    "gasPrice",
    "nonce",
    "to",
    "type",
    "value",
];
const forwardErrors = [
    Logger.errors.INSUFFICIENT_FUNDS,
    Logger.errors.NONCE_EXPIRED,
    Logger.errors.REPLACEMENT_UNDERPRICED,
];
class Signer {
    constructor() {
        logger$f.checkAbstract(new.target, Signer);
        defineReadOnly(this, "_isSigner", true);
    }
    getBalance(blockTag) {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("getBalance");
            return yield this.provider.getBalance(this.getAddress(), blockTag);
        });
    }
    getTransactionCount(blockTag) {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("getTransactionCount");
            return yield this.provider.getTransactionCount(
                this.getAddress(),
                blockTag
            );
        });
    }
    estimateGas(transaction) {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("estimateGas");
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            return yield this.provider.estimateGas(tx);
        });
    }
    call(transaction, blockTag) {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("call");
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            return yield this.provider.call(tx, blockTag);
        });
    }
    sendTransaction(transaction) {
        this._checkProvider("sendTransaction");
        return this.populateTransaction(transaction).then((tx) => {
            return this.signTransaction(tx).then((signedTx) => {
                return this.provider.sendTransaction(signedTx);
            });
        });
    }
    getChainId() {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("getChainId");
            const network = yield this.provider.getNetwork();
            return network.chainId;
        });
    }
    getGasPrice() {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("getGasPrice");
            return yield this.provider.getGasPrice();
        });
    }
    resolveName(name) {
        return __awaiter$2(this, void 0, void 0, function* () {
            this._checkProvider("resolveName");
            return yield this.provider.resolveName(name);
        });
    }
    checkTransaction(transaction) {
        for (const key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
                logger$f.throwArgumentError(
                    "invalid transaction key: " + key,
                    "transaction",
                    transaction
                );
            }
        }
        const tx = shallowCopy(transaction);
        if (tx.from == null) {
            tx.from = this.getAddress();
        } else {
            tx.from = Promise.all([Promise.resolve(tx.from), this.getAddress()]).then(
                (result) => {
                    if (result[0].toLowerCase() !== result[1].toLowerCase()) {
                        logger$f.throwArgumentError(
                            "from address mismatch",
                            "transaction",
                            transaction
                        );
                    }
                    return result[0];
                }
            );
        }
        return tx;
    }
    populateTransaction(transaction) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            if (tx.to != null) {
                tx.to = Promise.resolve(tx.to).then((to) =>
                    __awaiter$2(this, void 0, void 0, function* () {
                        if (to == null) {
                            return null;
                        }
                        const address = yield this.resolveName(to);
                        if (address == null) {
                            logger$f.throwArgumentError(
                                "provided ENS name resolves to null",
                                "tx.to",
                                to
                            );
                        }
                        return address;
                    })
                );
            }
            if (tx.gasPrice == null) {
                tx.gasPrice = this.getGasPrice();
            }
            if (tx.nonce == null) {
                tx.nonce = this.getTransactionCount("pending");
            }
            if (tx.gasLimit == null) {
                tx.gasLimit = this.estimateGas(tx).catch((error) => {
                    if (forwardErrors.indexOf(error.code) >= 0) {
                        throw error;
                    }
                    return logger$f.throwError(
                        "cannot estimate gas; transaction may fail or may require manual gas limit",
                        Logger.errors.UNPREDICTABLE_GAS_LIMIT,
                        { error: error, tx: tx }
                    );
                });
            }
            if (tx.chainId == null) {
                tx.chainId = this.getChainId();
            } else {
                tx.chainId = Promise.all([
                    Promise.resolve(tx.chainId),
                    this.getChainId(),
                ]).then((results) => {
                    if (results[1] !== 0 && results[0] !== results[1]) {
                        logger$f.throwArgumentError(
                            "chainId address mismatch",
                            "transaction",
                            transaction
                        );
                    }
                    return results[0];
                });
            }
            return yield resolveProperties(tx);
        });
    }
    _checkProvider(operation) {
        if (!this.provider) {
            logger$f.throwError(
                "missing provider",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: operation || "_checkProvider" }
            );
        }
    }
    static isSigner(value) {
        return !!(value && value._isSigner);
    }
}
class VoidSigner extends Signer {
    constructor(address, provider) {
        logger$f.checkNew(new.target, VoidSigner);
        super();
        defineReadOnly(this, "address", address);
        defineReadOnly(this, "provider", provider || null);
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    _fail(message, operation) {
        return Promise.resolve().then(() => {
            logger$f.throwError(message, Logger.errors.UNSUPPORTED_OPERATION, {
                operation: operation,
            });
        });
    }
    signMessage(message) {
        return this._fail("VoidSigner cannot sign messages", "signMessage");
    }
    signTransaction(transaction) {
        return this._fail("VoidSigner cannot sign transactions", "signTransaction");
    }
    _signTypedData(domain, types, value) {
        return this._fail("VoidSigner cannot sign typed data", "signTypedData");
    }
    connect(provider) {
        return new VoidSigner(this.address, provider);
    }
}
var minimalisticAssert = assert;
function assert(val, msg) {
    if (!val) throw new Error(msg || "Assertion failed");
}
assert.equal = function assertEqual(l, r, msg) {
    if (l != r) throw new Error(msg || "Assertion failed: " + l + " != " + r);
};
var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: false,
                        writable: true,
                        configurable: true,
                    },
                });
            }
        };
    } else {
        module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
                ctor.super_ = superCtor;
                var TempCtor = function () { };
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
            }
        };
    }
});
var inherits = createCommonjsModule(function (module) {
    try {
        var util = null;
        if (typeof util.inherits !== "function") throw "";
        module.exports = util.inherits;
    } catch (e) {
        module.exports = inherits_browser;
    }
});
("use strict");
var inherits_1 = inherits;
function toArray(msg, enc) {
    if (Array.isArray(msg)) return msg.slice();
    if (!msg) return [];
    var res = [];
    if (typeof msg === "string") {
        if (!enc) {
            for (var i = 0; i < msg.length; i++) {
                var c = msg.charCodeAt(i);
                var hi = c >> 8;
                var lo = c & 255;
                if (hi) res.push(hi, lo);
                else res.push(lo);
            }
        } else if (enc === "hex") {
            msg = msg.replace(/[^a-z0-9]+/gi, "");
            if (msg.length % 2 !== 0) msg = "0" + msg;
            for (i = 0; i < msg.length; i += 2)
                res.push(parseInt(msg[i] + msg[i + 1], 16));
        }
    } else {
        for (i = 0; i < msg.length; i++) res[i] = msg[i] | 0;
    }
    return res;
}
var toArray_1 = toArray;
function toHex$1(msg) {
    var res = "";
    for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
    return res;
}
var toHex_1 = toHex$1;
function htonl(w) {
    var res =
        (w >>> 24) |
        ((w >>> 8) & 65280) |
        ((w << 8) & 16711680) |
        ((w & 255) << 24);
    return res >>> 0;
}
var htonl_1 = htonl;
function toHex32(msg, endian) {
    var res = "";
    for (var i = 0; i < msg.length; i++) {
        var w = msg[i];
        if (endian === "little") w = htonl(w);
        res += zero8(w.toString(16));
    }
    return res;
}
var toHex32_1 = toHex32;
function zero2(word) {
    if (word.length === 1) return "0" + word;
    else return word;
}
var zero2_1 = zero2;
function zero8(word) {
    if (word.length === 7) return "0" + word;
    else if (word.length === 6) return "00" + word;
    else if (word.length === 5) return "000" + word;
    else if (word.length === 4) return "0000" + word;
    else if (word.length === 3) return "00000" + word;
    else if (word.length === 2) return "000000" + word;
    else if (word.length === 1) return "0000000" + word;
    else return word;
}
var zero8_1 = zero8;
function join32(msg, start, end, endian) {
    var len = end - start;
    minimalisticAssert(len % 4 === 0);
    var res = new Array(len / 4);
    for (var i = 0, k = start; i < res.length; i++, k += 4) {
        var w;
        if (endian === "big")
            w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
        else
            w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
        res[i] = w >>> 0;
    }
    return res;
}
var join32_1 = join32;
function split32(msg, endian) {
    var res = new Array(msg.length * 4);
    for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
        var m = msg[i];
        if (endian === "big") {
            res[k] = m >>> 24;
            res[k + 1] = (m >>> 16) & 255;
            res[k + 2] = (m >>> 8) & 255;
            res[k + 3] = m & 255;
        } else {
            res[k + 3] = m >>> 24;
            res[k + 2] = (m >>> 16) & 255;
            res[k + 1] = (m >>> 8) & 255;
            res[k] = m & 255;
        }
    }
    return res;
}
var split32_1 = split32;
function rotr32(w, b) {
    return (w >>> b) | (w << (32 - b));
}
var rotr32_1 = rotr32;
function rotl32(w, b) {
    return (w << b) | (w >>> (32 - b));
}
var rotl32_1 = rotl32;
function sum32(a, b) {
    return (a + b) >>> 0;
}
var sum32_1 = sum32;
function sum32_3(a, b, c) {
    return (a + b + c) >>> 0;
}
var sum32_3_1 = sum32_3;
function sum32_4(a, b, c, d) {
    return (a + b + c + d) >>> 0;
}
var sum32_4_1 = sum32_4;
function sum32_5(a, b, c, d, e) {
    return (a + b + c + d + e) >>> 0;
}
var sum32_5_1 = sum32_5;
function sum64(buf, pos, ah, al) {
    var bh = buf[pos];
    var bl = buf[pos + 1];
    var lo = (al + bl) >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
}
var sum64_1 = sum64;
function sum64_hi(ah, al, bh, bl) {
    var lo = (al + bl) >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
}
var sum64_hi_1 = sum64_hi;
function sum64_lo(ah, al, bh, bl) {
    var lo = al + bl;
    return lo >>> 0;
}
var sum64_lo_1 = sum64_lo;
function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
    var carry = 0;
    var lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;
    var hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
}
var sum64_4_hi_1 = sum64_4_hi;
function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
    var lo = al + bl + cl + dl;
    return lo >>> 0;
}
var sum64_4_lo_1 = sum64_4_lo;
function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var carry = 0;
    var lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = (lo + el) >>> 0;
    carry += lo < el ? 1 : 0;
    var hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
}
var sum64_5_hi_1 = sum64_5_hi;
function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var lo = al + bl + cl + dl + el;
    return lo >>> 0;
}
var sum64_5_lo_1 = sum64_5_lo;
function rotr64_hi(ah, al, num) {
    var r = (al << (32 - num)) | (ah >>> num);
    return r >>> 0;
}
var rotr64_hi_1 = rotr64_hi;
function rotr64_lo(ah, al, num) {
    var r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
}
var rotr64_lo_1 = rotr64_lo;
function shr64_hi(ah, al, num) {
    return ah >>> num;
}
var shr64_hi_1 = shr64_hi;
function shr64_lo(ah, al, num) {
    var r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
}
var shr64_lo_1 = shr64_lo;
var utils = {
    inherits: inherits_1,
    toArray: toArray_1,
    toHex: toHex_1,
    htonl: htonl_1,
    toHex32: toHex32_1,
    zero2: zero2_1,
    zero8: zero8_1,
    join32: join32_1,
    split32: split32_1,
    rotr32: rotr32_1,
    rotl32: rotl32_1,
    sum32: sum32_1,
    sum32_3: sum32_3_1,
    sum32_4: sum32_4_1,
    sum32_5: sum32_5_1,
    sum64: sum64_1,
    sum64_hi: sum64_hi_1,
    sum64_lo: sum64_lo_1,
    sum64_4_hi: sum64_4_hi_1,
    sum64_4_lo: sum64_4_lo_1,
    sum64_5_hi: sum64_5_hi_1,
    sum64_5_lo: sum64_5_lo_1,
    rotr64_hi: rotr64_hi_1,
    rotr64_lo: rotr64_lo_1,
    shr64_hi: shr64_hi_1,
    shr64_lo: shr64_lo_1,
};
("use strict");
function BlockHash() {
    this.pending = null;
    this.pendingTotal = 0;
    this.blockSize = this.constructor.blockSize;
    this.outSize = this.constructor.outSize;
    this.hmacStrength = this.constructor.hmacStrength;
    this.padLength = this.constructor.padLength / 8;
    this.endian = "big";
    this._delta8 = this.blockSize / 8;
    this._delta32 = this.blockSize / 32;
}
var BlockHash_1 = BlockHash;
BlockHash.prototype.update = function update(msg, enc) {
    msg = utils.toArray(msg, enc);
    if (!this.pending) this.pending = msg;
    else this.pending = this.pending.concat(msg);
    this.pendingTotal += msg.length;
    if (this.pending.length >= this._delta8) {
        msg = this.pending;
        var r = msg.length % this._delta8;
        this.pending = msg.slice(msg.length - r, msg.length);
        if (this.pending.length === 0) this.pending = null;
        msg = utils.join32(msg, 0, msg.length - r, this.endian);
        for (var i = 0; i < msg.length; i += this._delta32)
            this._update(msg, i, i + this._delta32);
    }
    return this;
};
BlockHash.prototype.digest = function digest(enc) {
    this.update(this._pad());
    minimalisticAssert(this.pending === null);
    return this._digest(enc);
};
BlockHash.prototype._pad = function pad() {
    var len = this.pendingTotal;
    var bytes = this._delta8;
    var k = bytes - ((len + this.padLength) % bytes);
    var res = new Array(k + this.padLength);
    res[0] = 128;
    for (var i = 1; i < k; i++) res[i] = 0;
    len <<= 3;
    if (this.endian === "big") {
        for (var t = 8; t < this.padLength; t++) res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = (len >>> 24) & 255;
        res[i++] = (len >>> 16) & 255;
        res[i++] = (len >>> 8) & 255;
        res[i++] = len & 255;
    } else {
        res[i++] = len & 255;
        res[i++] = (len >>> 8) & 255;
        res[i++] = (len >>> 16) & 255;
        res[i++] = (len >>> 24) & 255;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        for (t = 8; t < this.padLength; t++) res[i++] = 0;
    }
    return res;
};
var common = { BlockHash: BlockHash_1 };
("use strict");
var rotr32$1 = utils.rotr32;
function ft_1(s, x, y, z) {
    if (s === 0) return ch32(x, y, z);
    if (s === 1 || s === 3) return p32(x, y, z);
    if (s === 2) return maj32(x, y, z);
}
var ft_1_1 = ft_1;
function ch32(x, y, z) {
    return (x & y) ^ (~x & z);
}
var ch32_1 = ch32;
function maj32(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
var maj32_1 = maj32;
function p32(x, y, z) {
    return x ^ y ^ z;
}
var p32_1 = p32;
function s0_256(x) {
    return rotr32$1(x, 2) ^ rotr32$1(x, 13) ^ rotr32$1(x, 22);
}
var s0_256_1 = s0_256;
function s1_256(x) {
    return rotr32$1(x, 6) ^ rotr32$1(x, 11) ^ rotr32$1(x, 25);
}
var s1_256_1 = s1_256;
function g0_256(x) {
    return rotr32$1(x, 7) ^ rotr32$1(x, 18) ^ (x >>> 3);
}
var g0_256_1 = g0_256;
function g1_256(x) {
    return rotr32$1(x, 17) ^ rotr32$1(x, 19) ^ (x >>> 10);
}
var g1_256_1 = g1_256;
var common$1 = {
    ft_1: ft_1_1,
    ch32: ch32_1,
    maj32: maj32_1,
    p32: p32_1,
    s0_256: s0_256_1,
    s1_256: s1_256_1,
    g0_256: g0_256_1,
    g1_256: g1_256_1,
};
("use strict");
var rotl32$1 = utils.rotl32;
var sum32$1 = utils.sum32;
var sum32_5$1 = utils.sum32_5;
var ft_1$1 = common$1.ft_1;
var BlockHash$1 = common.BlockHash;
var sha1_K = [1518500249, 1859775393, 2400959708, 3395469782];
function SHA1() {
    if (!(this instanceof SHA1)) return new SHA1();
    BlockHash$1.call(this);
    this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    this.W = new Array(80);
}
utils.inherits(SHA1, BlockHash$1);
var _1 = SHA1;
SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;
SHA1.prototype._update = function _update(msg, start) {
    var W = this.W;
    for (var i = 0; i < 16; i++) W[i] = msg[start + i];
    for (; i < W.length; i++)
        W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    for (i = 0; i < W.length; i++) {
        var s = ~~(i / 20);
        var t = sum32_5$1(rotl32$1(a, 5), ft_1$1(s, b, c, d), e, W[i], sha1_K[s]);
        e = d;
        d = c;
        c = rotl32$1(b, 30);
        b = a;
        a = t;
    }
    this.h[0] = sum32$1(this.h[0], a);
    this.h[1] = sum32$1(this.h[1], b);
    this.h[2] = sum32$1(this.h[2], c);
    this.h[3] = sum32$1(this.h[3], d);
    this.h[4] = sum32$1(this.h[4], e);
};
SHA1.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h, "big");
    else return utils.split32(this.h, "big");
};
("use strict");
var sum32$2 = utils.sum32;
var sum32_4$1 = utils.sum32_4;
var sum32_5$2 = utils.sum32_5;
var ch32$1 = common$1.ch32;
var maj32$1 = common$1.maj32;
var s0_256$1 = common$1.s0_256;
var s1_256$1 = common$1.s1_256;
var g0_256$1 = common$1.g0_256;
var g1_256$1 = common$1.g1_256;
var BlockHash$2 = common.BlockHash;
var sha256_K = [
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
    2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
    1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
    3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063,
    1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474,
    2756734187, 3204031479, 3329325298,
];
function SHA256() {
    if (!(this instanceof SHA256)) return new SHA256();
    BlockHash$2.call(this);
    this.h = [
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
        528734635, 1541459225,
    ];
    this.k = sha256_K;
    this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash$2);
var _256 = SHA256;
SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;
SHA256.prototype._update = function _update(msg, start) {
    var W = this.W;
    for (var i = 0; i < 16; i++) W[i] = msg[start + i];
    for (; i < W.length; i++)
        W[i] = sum32_4$1(
            g1_256$1(W[i - 2]),
            W[i - 7],
            g0_256$1(W[i - 15]),
            W[i - 16]
        );
    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    var f = this.h[5];
    var g = this.h[6];
    var h = this.h[7];
    minimalisticAssert(this.k.length === W.length);
    for (i = 0; i < W.length; i++) {
        var T1 = sum32_5$2(h, s1_256$1(e), ch32$1(e, f, g), this.k[i], W[i]);
        var T2 = sum32$2(s0_256$1(a), maj32$1(a, b, c));
        h = g;
        g = f;
        f = e;
        e = sum32$2(d, T1);
        d = c;
        c = b;
        b = a;
        a = sum32$2(T1, T2);
    }
    this.h[0] = sum32$2(this.h[0], a);
    this.h[1] = sum32$2(this.h[1], b);
    this.h[2] = sum32$2(this.h[2], c);
    this.h[3] = sum32$2(this.h[3], d);
    this.h[4] = sum32$2(this.h[4], e);
    this.h[5] = sum32$2(this.h[5], f);
    this.h[6] = sum32$2(this.h[6], g);
    this.h[7] = sum32$2(this.h[7], h);
};
SHA256.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h, "big");
    else return utils.split32(this.h, "big");
};
("use strict");
function SHA224() {
    if (!(this instanceof SHA224)) return new SHA224();
    _256.call(this);
    this.h = [
        3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025,
        1694076839, 3204075428,
    ];
}
utils.inherits(SHA224, _256);
var _224 = SHA224;
SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;
SHA224.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h.slice(0, 7), "big");
    else return utils.split32(this.h.slice(0, 7), "big");
};
("use strict");
var rotr64_hi$1 = utils.rotr64_hi;
var rotr64_lo$1 = utils.rotr64_lo;
var shr64_hi$1 = utils.shr64_hi;
var shr64_lo$1 = utils.shr64_lo;
var sum64$1 = utils.sum64;
var sum64_hi$1 = utils.sum64_hi;
var sum64_lo$1 = utils.sum64_lo;
var sum64_4_hi$1 = utils.sum64_4_hi;
var sum64_4_lo$1 = utils.sum64_4_lo;
var sum64_5_hi$1 = utils.sum64_5_hi;
var sum64_5_lo$1 = utils.sum64_5_lo;
var BlockHash$3 = common.BlockHash;
var sha512_K = [
    1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399,
    3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265,
    2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394,
    310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994,
    1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317,
    3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139,
    264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901,
    1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837,
    2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879,
    3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901,
    113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912,
    1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700,
    2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037,
    344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800,
    3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804,
    1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734,
    3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877,
    3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063,
    2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815,
    1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474,
    593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298,
    3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606,
    3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421,
    2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836,
    852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676,
    1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468,
    1816402316, 1246189591,
];
function SHA512() {
    if (!(this instanceof SHA512)) return new SHA512();
    BlockHash$3.call(this);
    this.h = [
        1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723,
        2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199,
        528734635, 4215389547, 1541459225, 327033209,
    ];
    this.k = sha512_K;
    this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash$3);
var _512 = SHA512;
SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;
SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
    var W = this.W;
    for (var i = 0; i < 32; i++) W[i] = msg[start + i];
    for (; i < W.length; i += 2) {
        var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
        var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
        var c1_hi = W[i - 14];
        var c1_lo = W[i - 13];
        var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
        var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
        var c3_hi = W[i - 32];
        var c3_lo = W[i - 31];
        W[i] = sum64_4_hi$1(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
        W[i + 1] = sum64_4_lo$1(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo
        );
    }
};
SHA512.prototype._update = function _update(msg, start) {
    this._prepareBlock(msg, start);
    var W = this.W;
    var ah = this.h[0];
    var al = this.h[1];
    var bh = this.h[2];
    var bl = this.h[3];
    var ch = this.h[4];
    var cl = this.h[5];
    var dh = this.h[6];
    var dl = this.h[7];
    var eh = this.h[8];
    var el = this.h[9];
    var fh = this.h[10];
    var fl = this.h[11];
    var gh = this.h[12];
    var gl = this.h[13];
    var hh = this.h[14];
    var hl = this.h[15];
    minimalisticAssert(this.k.length === W.length);
    for (var i = 0; i < W.length; i += 2) {
        var c0_hi = hh;
        var c0_lo = hl;
        var c1_hi = s1_512_hi(eh, el);
        var c1_lo = s1_512_lo(eh, el);
        var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
        var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
        var c3_hi = this.k[i];
        var c3_lo = this.k[i + 1];
        var c4_hi = W[i];
        var c4_lo = W[i + 1];
        var T1_hi = sum64_5_hi$1(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo,
            c4_hi,
            c4_lo
        );
        var T1_lo = sum64_5_lo$1(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo,
            c4_hi,
            c4_lo
        );
        c0_hi = s0_512_hi(ah, al);
        c0_lo = s0_512_lo(ah, al);
        c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
        c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
        var T2_hi = sum64_hi$1(c0_hi, c0_lo, c1_hi, c1_lo);
        var T2_lo = sum64_lo$1(c0_hi, c0_lo, c1_hi, c1_lo);
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        eh = sum64_hi$1(dh, dl, T1_hi, T1_lo);
        el = sum64_lo$1(dl, dl, T1_hi, T1_lo);
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        ah = sum64_hi$1(T1_hi, T1_lo, T2_hi, T2_lo);
        al = sum64_lo$1(T1_hi, T1_lo, T2_hi, T2_lo);
    }
    sum64$1(this.h, 0, ah, al);
    sum64$1(this.h, 2, bh, bl);
    sum64$1(this.h, 4, ch, cl);
    sum64$1(this.h, 6, dh, dl);
    sum64$1(this.h, 8, eh, el);
    sum64$1(this.h, 10, fh, fl);
    sum64$1(this.h, 12, gh, gl);
    sum64$1(this.h, 14, hh, hl);
};
SHA512.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h, "big");
    else return utils.split32(this.h, "big");
};
function ch64_hi(xh, xl, yh, yl, zh) {
    var r = (xh & yh) ^ (~xh & zh);
    if (r < 0) r += 4294967296;
    return r;
}
function ch64_lo(xh, xl, yh, yl, zh, zl) {
    var r = (xl & yl) ^ (~xl & zl);
    if (r < 0) r += 4294967296;
    return r;
}
function maj64_hi(xh, xl, yh, yl, zh) {
    var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
    if (r < 0) r += 4294967296;
    return r;
}
function maj64_lo(xh, xl, yh, yl, zh, zl) {
    var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
    if (r < 0) r += 4294967296;
    return r;
}
function s0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 28);
    var c1_hi = rotr64_hi$1(xl, xh, 2);
    var c2_hi = rotr64_hi$1(xl, xh, 7);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 4294967296;
    return r;
}
function s0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 28);
    var c1_lo = rotr64_lo$1(xl, xh, 2);
    var c2_lo = rotr64_lo$1(xl, xh, 7);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 4294967296;
    return r;
}
function s1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 14);
    var c1_hi = rotr64_hi$1(xh, xl, 18);
    var c2_hi = rotr64_hi$1(xl, xh, 9);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 4294967296;
    return r;
}
function s1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 14);
    var c1_lo = rotr64_lo$1(xh, xl, 18);
    var c2_lo = rotr64_lo$1(xl, xh, 9);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 4294967296;
    return r;
}
function g0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 1);
    var c1_hi = rotr64_hi$1(xh, xl, 8);
    var c2_hi = shr64_hi$1(xh, xl, 7);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 4294967296;
    return r;
}
function g0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 1);
    var c1_lo = rotr64_lo$1(xh, xl, 8);
    var c2_lo = shr64_lo$1(xh, xl, 7);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 4294967296;
    return r;
}
function g1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 19);
    var c1_hi = rotr64_hi$1(xl, xh, 29);
    var c2_hi = shr64_hi$1(xh, xl, 6);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 4294967296;
    return r;
}
function g1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 19);
    var c1_lo = rotr64_lo$1(xl, xh, 29);
    var c2_lo = shr64_lo$1(xh, xl, 6);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 4294967296;
    return r;
}
("use strict");
function SHA384() {
    if (!(this instanceof SHA384)) return new SHA384();
    _512.call(this);
    this.h = [
        3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999,
        355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025,
        3675008525, 1694076839, 1203062813, 3204075428,
    ];
}
utils.inherits(SHA384, _512);
var _384 = SHA384;
SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;
SHA384.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h.slice(0, 12), "big");
    else return utils.split32(this.h.slice(0, 12), "big");
};
("use strict");
var sha1 = _1;
var sha224 = _224;
var sha256 = _256;
var sha384 = _384;
var sha512 = _512;
var sha = {
    sha1: sha1,
    sha224: sha224,
    sha256: sha256,
    sha384: sha384,
    sha512: sha512,
};
("use strict");
var rotl32$2 = utils.rotl32;
var sum32$3 = utils.sum32;
var sum32_3$1 = utils.sum32_3;
var sum32_4$2 = utils.sum32_4;
var BlockHash$4 = common.BlockHash;
function RIPEMD160() {
    if (!(this instanceof RIPEMD160)) return new RIPEMD160();
    BlockHash$4.call(this);
    this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    this.endian = "little";
}
utils.inherits(RIPEMD160, BlockHash$4);
var ripemd160 = RIPEMD160;
RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;
RIPEMD160.prototype._update = function update(msg, start) {
    var A = this.h[0];
    var B = this.h[1];
    var C = this.h[2];
    var D = this.h[3];
    var E = this.h[4];
    var Ah = A;
    var Bh = B;
    var Ch = C;
    var Dh = D;
    var Eh = E;
    for (var j = 0; j < 80; j++) {
        var T = sum32$3(
            rotl32$2(sum32_4$2(A, f(j, B, C, D), msg[r[j] + start], K(j)), s[j]),
            E
        );
        A = E;
        E = D;
        D = rotl32$2(C, 10);
        C = B;
        B = T;
        T = sum32$3(
            rotl32$2(
                sum32_4$2(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
                sh[j]
            ),
            Eh
        );
        Ah = Eh;
        Eh = Dh;
        Dh = rotl32$2(Ch, 10);
        Ch = Bh;
        Bh = T;
    }
    T = sum32_3$1(this.h[1], C, Dh);
    this.h[1] = sum32_3$1(this.h[2], D, Eh);
    this.h[2] = sum32_3$1(this.h[3], E, Ah);
    this.h[3] = sum32_3$1(this.h[4], A, Bh);
    this.h[4] = sum32_3$1(this.h[0], B, Ch);
    this.h[0] = T;
};
RIPEMD160.prototype._digest = function digest(enc) {
    if (enc === "hex") return utils.toHex32(this.h, "little");
    else return utils.split32(this.h, "little");
};
function f(j, x, y, z) {
    if (j <= 15) return x ^ y ^ z;
    else if (j <= 31) return (x & y) | (~x & z);
    else if (j <= 47) return (x | ~y) ^ z;
    else if (j <= 63) return (x & z) | (y & ~z);
    else return x ^ (y | ~z);
}
function K(j) {
    if (j <= 15) return 0;
    else if (j <= 31) return 1518500249;
    else if (j <= 47) return 1859775393;
    else if (j <= 63) return 2400959708;
    else return 2840853838;
}
function Kh(j) {
    if (j <= 15) return 1352829926;
    else if (j <= 31) return 1548603684;
    else if (j <= 47) return 1836072691;
    else if (j <= 63) return 2053994217;
    else return 0;
}
var r = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15,
    3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11,
    5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7,
    12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
];
var rh = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
    10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0,
    4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1,
    5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
];
var s = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7,
    15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5,
    12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5,
    11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
];
var sh = [
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
    9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
    13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
    12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
];
var ripemd = { ripemd160: ripemd160 };
("use strict");
function Hmac(hash, key, enc) {
    if (!(this instanceof Hmac)) return new Hmac(hash, key, enc);
    this.Hash = hash;
    this.blockSize = hash.blockSize / 8;
    this.outSize = hash.outSize / 8;
    this.inner = null;
    this.outer = null;
    this._init(utils.toArray(key, enc));
}
var hmac = Hmac;
Hmac.prototype._init = function init(key) {
    if (key.length > this.blockSize) key = new this.Hash().update(key).digest();
    minimalisticAssert(key.length <= this.blockSize);
    for (var i = key.length; i < this.blockSize; i++) key.push(0);
    for (i = 0; i < key.length; i++) key[i] ^= 54;
    this.inner = new this.Hash().update(key);
    for (i = 0; i < key.length; i++) key[i] ^= 106;
    this.outer = new this.Hash().update(key);
};
Hmac.prototype.update = function update(msg, enc) {
    this.inner.update(msg, enc);
    return this;
};
Hmac.prototype.digest = function digest(enc) {
    this.outer.update(this.inner.digest());
    return this.outer.digest(enc);
};
var hash_1 = createCommonjsModule(function (module, exports) {
    var hash = exports;
    hash.utils = utils;
    hash.common = common;
    hash.sha = sha;
    hash.ripemd = ripemd;
    hash.hmac = hmac;
    hash.sha1 = hash.sha.sha1;
    hash.sha256 = hash.sha.sha256;
    hash.sha224 = hash.sha.sha224;
    hash.sha384 = hash.sha.sha384;
    hash.sha512 = hash.sha.sha512;
    hash.ripemd160 = hash.ripemd.ripemd160;
});
var commonjsGlobal$1 =
    typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
            ? window
            : typeof global !== "undefined"
                ? global
                : typeof self !== "undefined"
                    ? self
                    : {};
function getDefaultExportFromCjs$1(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
        ? x["default"]
        : x;
}
function createCommonjsModule$1(fn, basedir, module) {
    return (
        (module = {
            path: basedir,
            exports: {},
            require: function (path, base) {
                return commonjsRequire$1(
                    path,
                    base === undefined || base === null ? module.path : base
                );
            },
        }),
        fn(module, module.exports),
        module.exports
    );
}
function getDefaultExportFromNamespaceIfPresent$1(n) {
    return n && Object.prototype.hasOwnProperty.call(n, "default")
        ? n["default"]
        : n;
}
function getDefaultExportFromNamespaceIfNotNamed$1(n) {
    return n &&
        Object.prototype.hasOwnProperty.call(n, "default") &&
        Object.keys(n).length === 1
        ? n["default"]
        : n;
}
function getAugmentedNamespace$1(n) {
    if (n.__esModule) return n;
    var a = Object.defineProperty({}, "__esModule", { value: true });
    Object.keys(n).forEach(function (k) {
        var d = Object.getOwnPropertyDescriptor(n, k);
        Object.defineProperty(
            a,
            k,
            d.get
                ? d
                : {
                    enumerable: true,
                    get: function () {
                        return n[k];
                    },
                }
        );
    });
    return a;
}
function commonjsRequire$1() {
    throw new Error(
        "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
    );
}
var minimalisticAssert$1 = assert$1;
function assert$1(val, msg) {
    if (!val) throw new Error(msg || "Assertion failed");
}
assert$1.equal = function assertEqual(l, r, msg) {
    if (l != r) throw new Error(msg || "Assertion failed: " + l + " != " + r);
};
var utils_1 = createCommonjsModule$1(function (module, exports) {
    "use strict";
    var utils = exports;
    function toArray(msg, enc) {
        if (Array.isArray(msg)) return msg.slice();
        if (!msg) return [];
        var res = [];
        if (typeof msg !== "string") {
            for (var i = 0; i < msg.length; i++) res[i] = msg[i] | 0;
            return res;
        }
        if (enc === "hex") {
            msg = msg.replace(/[^a-z0-9]+/gi, "");
            if (msg.length % 2 !== 0) msg = "0" + msg;
            for (var i = 0; i < msg.length; i += 2)
                res.push(parseInt(msg[i] + msg[i + 1], 16));
        } else {
            for (var i = 0; i < msg.length; i++) {
                var c = msg.charCodeAt(i);
                var hi = c >> 8;
                var lo = c & 255;
                if (hi) res.push(hi, lo);
                else res.push(lo);
            }
        }
        return res;
    }
    utils.toArray = toArray;
    function zero2(word) {
        if (word.length === 1) return "0" + word;
        else return word;
    }
    utils.zero2 = zero2;
    function toHex(msg) {
        var res = "";
        for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
        return res;
    }
    utils.toHex = toHex;
    utils.encode = function encode(arr, enc) {
        if (enc === "hex") return toHex(arr);
        else return arr;
    };
});
var utils_1$1 = createCommonjsModule$1(function (module, exports) {
    "use strict";
    var utils = exports;
    utils.assert = minimalisticAssert$1;
    utils.toArray = utils_1.toArray;
    utils.zero2 = utils_1.zero2;
    utils.toHex = utils_1.toHex;
    utils.encode = utils_1.encode;
    function getNAF(num, w, bits) {
        var naf = new Array(Math.max(num.bitLength(), bits) + 1);
        naf.fill(0);
        var ws = 1 << (w + 1);
        var k = num.clone();
        for (var i = 0; i < naf.length; i++) {
            var z;
            var mod = k.andln(ws - 1);
            if (k.isOdd()) {
                if (mod > (ws >> 1) - 1) z = (ws >> 1) - mod;
                else z = mod;
                k.isubn(z);
            } else {
                z = 0;
            }
            naf[i] = z;
            k.iushrn(1);
        }
        return naf;
    }
    utils.getNAF = getNAF;
    function getJSF(k1, k2) {
        var jsf = [[], []];
        k1 = k1.clone();
        k2 = k2.clone();
        var d1 = 0;
        var d2 = 0;
        var m8;
        while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
            var m14 = (k1.andln(3) + d1) & 3;
            var m24 = (k2.andln(3) + d2) & 3;
            if (m14 === 3) m14 = -1;
            if (m24 === 3) m24 = -1;
            var u1;
            if ((m14 & 1) === 0) {
                u1 = 0;
            } else {
                m8 = (k1.andln(7) + d1) & 7;
                if ((m8 === 3 || m8 === 5) && m24 === 2) u1 = -m14;
                else u1 = m14;
            }
            jsf[0].push(u1);
            var u2;
            if ((m24 & 1) === 0) {
                u2 = 0;
            } else {
                m8 = (k2.andln(7) + d2) & 7;
                if ((m8 === 3 || m8 === 5) && m14 === 2) u2 = -m24;
                else u2 = m24;
            }
            jsf[1].push(u2);
            if (2 * d1 === u1 + 1) d1 = 1 - d1;
            if (2 * d2 === u2 + 1) d2 = 1 - d2;
            k1.iushrn(1);
            k2.iushrn(1);
        }
        return jsf;
    }
    utils.getJSF = getJSF;
    function cachedProperty(obj, name, computer) {
        var key = "_" + name;
        obj.prototype[name] = function cachedProperty() {
            return this[key] !== undefined
                ? this[key]
                : (this[key] = computer.call(this));
        };
    }
    utils.cachedProperty = cachedProperty;
    function parseBytes(bytes) {
        return typeof bytes === "string" ? utils.toArray(bytes, "hex") : bytes;
    }
    utils.parseBytes = parseBytes;
    function intFromLE(bytes) {
        return new bn(bytes, "hex", "le");
    }
    utils.intFromLE = intFromLE;
});
("use strict");
var getNAF = utils_1$1.getNAF;
var getJSF = utils_1$1.getJSF;
var assert$1$1 = utils_1$1.assert;
function BaseCurve(type, conf) {
    this.type = type;
    this.p = new bn(conf.p, 16);
    this.red = conf.prime ? bn.red(conf.prime) : bn.mont(this.p);
    this.zero = new bn(0).toRed(this.red);
    this.one = new bn(1).toRed(this.red);
    this.two = new bn(2).toRed(this.red);
    this.n = conf.n && new bn(conf.n, 16);
    this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
    this._wnafT1 = new Array(4);
    this._wnafT2 = new Array(4);
    this._wnafT3 = new Array(4);
    this._wnafT4 = new Array(4);
    this._bitLength = this.n ? this.n.bitLength() : 0;
    var adjustCount = this.n && this.p.div(this.n);
    if (!adjustCount || adjustCount.cmpn(100) > 0) {
        this.redN = null;
    } else {
        this._maxwellTrick = true;
        this.redN = this.n.toRed(this.red);
    }
}
var base = BaseCurve;
BaseCurve.prototype.point = function point() {
    throw new Error("Not implemented");
};
BaseCurve.prototype.validate = function validate() {
    throw new Error("Not implemented");
};
BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
    assert$1$1(p.precomputed);
    var doubles = p._getDoubles();
    var naf = getNAF(k, 1, this._bitLength);
    var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
    I /= 3;
    var repr = [];
    var j;
    var nafW;
    for (j = 0; j < naf.length; j += doubles.step) {
        nafW = 0;
        for (var l = j + doubles.step - 1; l >= j; l--) nafW = (nafW << 1) + naf[l];
        repr.push(nafW);
    }
    var a = this.jpoint(null, null, null);
    var b = this.jpoint(null, null, null);
    for (var i = I; i > 0; i--) {
        for (j = 0; j < repr.length; j++) {
            nafW = repr[j];
            if (nafW === i) b = b.mixedAdd(doubles.points[j]);
            else if (nafW === -i) b = b.mixedAdd(doubles.points[j].neg());
        }
        a = a.add(b);
    }
    return a.toP();
};
BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
    var w = 4;
    var nafPoints = p._getNAFPoints(w);
    w = nafPoints.wnd;
    var wnd = nafPoints.points;
    var naf = getNAF(k, w, this._bitLength);
    var acc = this.jpoint(null, null, null);
    for (var i = naf.length - 1; i >= 0; i--) {
        for (var l = 0; i >= 0 && naf[i] === 0; i--) l++;
        if (i >= 0) l++;
        acc = acc.dblp(l);
        if (i < 0) break;
        var z = naf[i];
        assert$1$1(z !== 0);
        if (p.type === "affine") {
            if (z > 0) acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
            else acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
        } else {
            if (z > 0) acc = acc.add(wnd[(z - 1) >> 1]);
            else acc = acc.add(wnd[(-z - 1) >> 1].neg());
        }
    }
    return p.type === "affine" ? acc.toP() : acc;
};
BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(
    defW,
    points,
    coeffs,
    len,
    jacobianResult
) {
    var wndWidth = this._wnafT1;
    var wnd = this._wnafT2;
    var naf = this._wnafT3;
    var max = 0;
    var i;
    var j;
    var p;
    for (i = 0; i < len; i++) {
        p = points[i];
        var nafPoints = p._getNAFPoints(defW);
        wndWidth[i] = nafPoints.wnd;
        wnd[i] = nafPoints.points;
    }
    for (i = len - 1; i >= 1; i -= 2) {
        var a = i - 1;
        var b = i;
        if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
            naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
            naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
            max = Math.max(naf[a].length, max);
            max = Math.max(naf[b].length, max);
            continue;
        }
        var comb = [points[a], null, null, points[b]];
        if (points[a].y.cmp(points[b].y) === 0) {
            comb[1] = points[a].add(points[b]);
            comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
            comb[1] = points[a].toJ().mixedAdd(points[b]);
            comb[2] = points[a].add(points[b].neg());
        } else {
            comb[1] = points[a].toJ().mixedAdd(points[b]);
            comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        }
        var index = [-3, -1, -5, -7, 0, 7, 5, 1, 3];
        var jsf = getJSF(coeffs[a], coeffs[b]);
        max = Math.max(jsf[0].length, max);
        naf[a] = new Array(max);
        naf[b] = new Array(max);
        for (j = 0; j < max; j++) {
            var ja = jsf[0][j] | 0;
            var jb = jsf[1][j] | 0;
            naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
            naf[b][j] = 0;
            wnd[a] = comb;
        }
    }
    var acc = this.jpoint(null, null, null);
    var tmp = this._wnafT4;
    for (i = max; i >= 0; i--) {
        var k = 0;
        while (i >= 0) {
            var zero = true;
            for (j = 0; j < len; j++) {
                tmp[j] = naf[j][i] | 0;
                if (tmp[j] !== 0) zero = false;
            }
            if (!zero) break;
            k++;
            i--;
        }
        if (i >= 0) k++;
        acc = acc.dblp(k);
        if (i < 0) break;
        for (j = 0; j < len; j++) {
            var z = tmp[j];
            p;
            if (z === 0) continue;
            else if (z > 0) p = wnd[j][(z - 1) >> 1];
            else if (z < 0) p = wnd[j][(-z - 1) >> 1].neg();
            if (p.type === "affine") acc = acc.mixedAdd(p);
            else acc = acc.add(p);
        }
    }
    for (i = 0; i < len; i++) wnd[i] = null;
    if (jacobianResult) return acc;
    else return acc.toP();
};
function BasePoint(curve, type) {
    this.curve = curve;
    this.type = type;
    this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;
BasePoint.prototype.eq = function eq() {
    throw new Error("Not implemented");
};
BasePoint.prototype.validate = function validate() {
    return this.curve.validate(this);
};
BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    bytes = utils_1$1.toArray(bytes, enc);
    var len = this.p.byteLength();
    if (
        (bytes[0] === 4 || bytes[0] === 6 || bytes[0] === 7) &&
        bytes.length - 1 === 2 * len
    ) {
        if (bytes[0] === 6) assert$1$1(bytes[bytes.length - 1] % 2 === 0);
        else if (bytes[0] === 7) assert$1$1(bytes[bytes.length - 1] % 2 === 1);
        var res = this.point(
            bytes.slice(1, 1 + len),
            bytes.slice(1 + len, 1 + 2 * len)
        );
        return res;
    } else if ((bytes[0] === 2 || bytes[0] === 3) && bytes.length - 1 === len) {
        return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 3);
    }
    throw new Error("Unknown point format");
};
BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
    return this.encode(enc, true);
};
BasePoint.prototype._encode = function _encode(compact) {
    var len = this.curve.p.byteLength();
    var x = this.getX().toArray("be", len);
    if (compact) return [this.getY().isEven() ? 2 : 3].concat(x);
    return [4].concat(x, this.getY().toArray("be", len));
};
BasePoint.prototype.encode = function encode(enc, compact) {
    return utils_1$1.encode(this._encode(compact), enc);
};
BasePoint.prototype.precompute = function precompute(power) {
    if (this.precomputed) return this;
    var precomputed = { doubles: null, naf: null, beta: null };
    precomputed.naf = this._getNAFPoints(8);
    precomputed.doubles = this._getDoubles(4, power);
    precomputed.beta = this._getBeta();
    this.precomputed = precomputed;
    return this;
};
BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
    if (!this.precomputed) return false;
    var doubles = this.precomputed.doubles;
    if (!doubles) return false;
    return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};
BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
    if (this.precomputed && this.precomputed.doubles)
        return this.precomputed.doubles;
    var doubles = [this];
    var acc = this;
    for (var i = 0; i < power; i += step) {
        for (var j = 0; j < step; j++) acc = acc.dbl();
        doubles.push(acc);
    }
    return { step: step, points: doubles };
};
BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
    if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
    var res = [this];
    var max = (1 << wnd) - 1;
    var dbl = max === 1 ? null : this.dbl();
    for (var i = 1; i < max; i++) res[i] = res[i - 1].add(dbl);
    return { wnd: wnd, points: res };
};
BasePoint.prototype._getBeta = function _getBeta() {
    return null;
};
BasePoint.prototype.dblp = function dblp(k) {
    var r = this;
    for (var i = 0; i < k; i++) r = r.dbl();
    return r;
};
var inherits_browser$1 = createCommonjsModule$1(function (module) {
    if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: false,
                        writable: true,
                        configurable: true,
                    },
                });
            }
        };
    } else {
        module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
                ctor.super_ = superCtor;
                var TempCtor = function () { };
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
            }
        };
    }
});
("use strict");
var assert$2 = utils_1$1.assert;
function ShortCurve(conf) {
    base.call(this, "short", conf);
    this.a = new bn(conf.a, 16).toRed(this.red);
    this.b = new bn(conf.b, 16).toRed(this.red);
    this.tinv = this.two.redInvm();
    this.zeroA = this.a.fromRed().cmpn(0) === 0;
    this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;
    this.endo = this._getEndomorphism(conf);
    this._endoWnafT1 = new Array(4);
    this._endoWnafT2 = new Array(4);
}
inherits_browser$1(ShortCurve, base);
var short_1 = ShortCurve;
ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
    if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1) return;
    var beta;
    var lambda;
    if (conf.beta) {
        beta = new bn(conf.beta, 16).toRed(this.red);
    } else {
        var betas = this._getEndoRoots(this.p);
        beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
        beta = beta.toRed(this.red);
    }
    if (conf.lambda) {
        lambda = new bn(conf.lambda, 16);
    } else {
        var lambdas = this._getEndoRoots(this.n);
        if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
            lambda = lambdas[0];
        } else {
            lambda = lambdas[1];
            assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
        }
    }
    var basis;
    if (conf.basis) {
        basis = conf.basis.map(function (vec) {
            return { a: new bn(vec.a, 16), b: new bn(vec.b, 16) };
        });
    } else {
        basis = this._getEndoBasis(lambda);
    }
    return { beta: beta, lambda: lambda, basis: basis };
};
ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
    var red = num === this.p ? this.red : bn.mont(num);
    var tinv = new bn(2).toRed(red).redInvm();
    var ntinv = tinv.redNeg();
    var s = new bn(3).toRed(red).redNeg().redSqrt().redMul(tinv);
    var l1 = ntinv.redAdd(s).fromRed();
    var l2 = ntinv.redSub(s).fromRed();
    return [l1, l2];
};
ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
    var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
    var u = lambda;
    var v = this.n.clone();
    var x1 = new bn(1);
    var y1 = new bn(0);
    var x2 = new bn(0);
    var y2 = new bn(1);
    var a0;
    var b0;
    var a1;
    var b1;
    var a2;
    var b2;
    var prevR;
    var i = 0;
    var r;
    var x;
    while (u.cmpn(0) !== 0) {
        var q = v.div(u);
        r = v.sub(q.mul(u));
        x = x2.sub(q.mul(x1));
        var y = y2.sub(q.mul(y1));
        if (!a1 && r.cmp(aprxSqrt) < 0) {
            a0 = prevR.neg();
            b0 = x1;
            a1 = r.neg();
            b1 = x;
        } else if (a1 && ++i === 2) {
            break;
        }
        prevR = r;
        v = u;
        u = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
    }
    a2 = r.neg();
    b2 = x;
    var len1 = a1.sqr().add(b1.sqr());
    var len2 = a2.sqr().add(b2.sqr());
    if (len2.cmp(len1) >= 0) {
        a2 = a0;
        b2 = b0;
    }
    if (a1.negative) {
        a1 = a1.neg();
        b1 = b1.neg();
    }
    if (a2.negative) {
        a2 = a2.neg();
        b2 = b2.neg();
    }
    return [
        { a: a1, b: b1 },
        { a: a2, b: b2 },
    ];
};
ShortCurve.prototype._endoSplit = function _endoSplit(k) {
    var basis = this.endo.basis;
    var v1 = basis[0];
    var v2 = basis[1];
    var c1 = v2.b.mul(k).divRound(this.n);
    var c2 = v1.b.neg().mul(k).divRound(this.n);
    var p1 = c1.mul(v1.a);
    var p2 = c2.mul(v2.a);
    var q1 = c1.mul(v1.b);
    var q2 = c2.mul(v2.b);
    var k1 = k.sub(p1).sub(p2);
    var k2 = q1.add(q2).neg();
    return { k1: k1, k2: k2 };
};
ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new bn(x, 16);
    if (!x.red) x = x.toRed(this.red);
    var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
        throw new Error("invalid point");
    var isOdd = y.fromRed().isOdd();
    if ((odd && !isOdd) || (!odd && isOdd)) y = y.redNeg();
    return this.point(x, y);
};
ShortCurve.prototype.validate = function validate(point) {
    if (point.inf) return true;
    var x = point.x;
    var y = point.y;
    var ax = this.a.redMul(x);
    var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
    return y.redSqr().redISub(rhs).cmpn(0) === 0;
};
ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(
    points,
    coeffs,
    jacobianResult
) {
    var npoints = this._endoWnafT1;
    var ncoeffs = this._endoWnafT2;
    for (var i = 0; i < points.length; i++) {
        var split = this._endoSplit(coeffs[i]);
        var p = points[i];
        var beta = p._getBeta();
        if (split.k1.negative) {
            split.k1.ineg();
            p = p.neg(true);
        }
        if (split.k2.negative) {
            split.k2.ineg();
            beta = beta.neg(true);
        }
        npoints[i * 2] = p;
        npoints[i * 2 + 1] = beta;
        ncoeffs[i * 2] = split.k1;
        ncoeffs[i * 2 + 1] = split.k2;
    }
    var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);
    for (var j = 0; j < i * 2; j++) {
        npoints[j] = null;
        ncoeffs[j] = null;
    }
    return res;
};
function Point(curve, x, y, isRed) {
    base.BasePoint.call(this, curve, "affine");
    if (x === null && y === null) {
        this.x = null;
        this.y = null;
        this.inf = true;
    } else {
        this.x = new bn(x, 16);
        this.y = new bn(y, 16);
        if (isRed) {
            this.x.forceRed(this.curve.red);
            this.y.forceRed(this.curve.red);
        }
        if (!this.x.red) this.x = this.x.toRed(this.curve.red);
        if (!this.y.red) this.y = this.y.toRed(this.curve.red);
        this.inf = false;
    }
}
inherits_browser$1(Point, base.BasePoint);
ShortCurve.prototype.point = function point(x, y, isRed) {
    return new Point(this, x, y, isRed);
};
ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
    return Point.fromJSON(this, obj, red);
};
Point.prototype._getBeta = function _getBeta() {
    if (!this.curve.endo) return;
    var pre = this.precomputed;
    if (pre && pre.beta) return pre.beta;
    var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (pre) {
        var curve = this.curve;
        var endoMul = function (p) {
            return curve.point(p.x.redMul(curve.endo.beta), p.y);
        };
        pre.beta = beta;
        beta.precomputed = {
            beta: null,
            naf: pre.naf && { wnd: pre.naf.wnd, points: pre.naf.points.map(endoMul) },
            doubles: pre.doubles && {
                step: pre.doubles.step,
                points: pre.doubles.points.map(endoMul),
            },
        };
    }
    return beta;
};
Point.prototype.toJSON = function toJSON() {
    if (!this.precomputed) return [this.x, this.y];
    return [
        this.x,
        this.y,
        this.precomputed && {
            doubles: this.precomputed.doubles && {
                step: this.precomputed.doubles.step,
                points: this.precomputed.doubles.points.slice(1),
            },
            naf: this.precomputed.naf && {
                wnd: this.precomputed.naf.wnd,
                points: this.precomputed.naf.points.slice(1),
            },
        },
    ];
};
Point.fromJSON = function fromJSON(curve, obj, red) {
    if (typeof obj === "string") obj = JSON.parse(obj);
    var res = curve.point(obj[0], obj[1], red);
    if (!obj[2]) return res;
    function obj2point(obj) {
        return curve.point(obj[0], obj[1], red);
    }
    var pre = obj[2];
    res.precomputed = {
        beta: null,
        doubles: pre.doubles && {
            step: pre.doubles.step,
            points: [res].concat(pre.doubles.points.map(obj2point)),
        },
        naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: [res].concat(pre.naf.points.map(obj2point)),
        },
    };
    return res;
};
Point.prototype.inspect = function inspect() {
    if (this.isInfinity()) return "<EC Point Infinity>";
    return (
        "<EC Point x: " +
        this.x.fromRed().toString(16, 2) +
        " y: " +
        this.y.fromRed().toString(16, 2) +
        ">"
    );
};
Point.prototype.isInfinity = function isInfinity() {
    return this.inf;
};
Point.prototype.add = function add(p) {
    if (this.inf) return p;
    if (p.inf) return this;
    if (this.eq(p)) return this.dbl();
    if (this.neg().eq(p)) return this.curve.point(null, null);
    if (this.x.cmp(p.x) === 0) return this.curve.point(null, null);
    var c = this.y.redSub(p.y);
    if (c.cmpn(0) !== 0) c = c.redMul(this.x.redSub(p.x).redInvm());
    var nx = c.redSqr().redISub(this.x).redISub(p.x);
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
};
Point.prototype.dbl = function dbl() {
    if (this.inf) return this;
    var ys1 = this.y.redAdd(this.y);
    if (ys1.cmpn(0) === 0) return this.curve.point(null, null);
    var a = this.curve.a;
    var x2 = this.x.redSqr();
    var dyinv = ys1.redInvm();
    var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
    var nx = c.redSqr().redISub(this.x.redAdd(this.x));
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
};
Point.prototype.getX = function getX() {
    return this.x.fromRed();
};
Point.prototype.getY = function getY() {
    return this.y.fromRed();
};
Point.prototype.mul = function mul(k) {
    k = new bn(k, 16);
    if (this.isInfinity()) return this;
    else if (this._hasDoubles(k)) return this.curve._fixedNafMul(this, k);
    else if (this.curve.endo) return this.curve._endoWnafMulAdd([this], [k]);
    else return this.curve._wnafMul(this, k);
};
Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo) return this.curve._endoWnafMulAdd(points, coeffs);
    else return this.curve._wnafMulAdd(1, points, coeffs, 2);
};
Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo) return this.curve._endoWnafMulAdd(points, coeffs, true);
    else return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};
Point.prototype.eq = function eq(p) {
    return (
        this === p ||
        (this.inf === p.inf &&
            (this.inf || (this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0)))
    );
};
Point.prototype.neg = function neg(_precompute) {
    if (this.inf) return this;
    var res = this.curve.point(this.x, this.y.redNeg());
    if (_precompute && this.precomputed) {
        var pre = this.precomputed;
        var negate = function (p) {
            return p.neg();
        };
        res.precomputed = {
            naf: pre.naf && { wnd: pre.naf.wnd, points: pre.naf.points.map(negate) },
            doubles: pre.doubles && {
                step: pre.doubles.step,
                points: pre.doubles.points.map(negate),
            },
        };
    }
    return res;
};
Point.prototype.toJ = function toJ() {
    if (this.inf) return this.curve.jpoint(null, null, null);
    var res = this.curve.jpoint(this.x, this.y, this.curve.one);
    return res;
};
function JPoint(curve, x, y, z) {
    base.BasePoint.call(this, curve, "jacobian");
    if (x === null && y === null && z === null) {
        this.x = this.curve.one;
        this.y = this.curve.one;
        this.z = new bn(0);
    } else {
        this.x = new bn(x, 16);
        this.y = new bn(y, 16);
        this.z = new bn(z, 16);
    }
    if (!this.x.red) this.x = this.x.toRed(this.curve.red);
    if (!this.y.red) this.y = this.y.toRed(this.curve.red);
    if (!this.z.red) this.z = this.z.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;
}
inherits_browser$1(JPoint, base.BasePoint);
ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
    return new JPoint(this, x, y, z);
};
JPoint.prototype.toP = function toP() {
    if (this.isInfinity()) return this.curve.point(null, null);
    var zinv = this.z.redInvm();
    var zinv2 = zinv.redSqr();
    var ax = this.x.redMul(zinv2);
    var ay = this.y.redMul(zinv2).redMul(zinv);
    return this.curve.point(ax, ay);
};
JPoint.prototype.neg = function neg() {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
JPoint.prototype.add = function add(p) {
    if (this.isInfinity()) return p;
    if (p.isInfinity()) return this;
    var pz2 = p.z.redSqr();
    var z2 = this.z.redSqr();
    var u1 = this.x.redMul(pz2);
    var u2 = p.x.redMul(z2);
    var s1 = this.y.redMul(pz2.redMul(p.z));
    var s2 = p.y.redMul(z2.redMul(this.z));
    var h = u1.redSub(u2);
    var r = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0) return this.curve.jpoint(null, null, null);
        else return this.dbl();
    }
    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(p.z).redMul(h);
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.mixedAdd = function mixedAdd(p) {
    if (this.isInfinity()) return p.toJ();
    if (p.isInfinity()) return this;
    var z2 = this.z.redSqr();
    var u1 = this.x;
    var u2 = p.x.redMul(z2);
    var s1 = this.y;
    var s2 = p.y.redMul(z2).redMul(this.z);
    var h = u1.redSub(u2);
    var r = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0) return this.curve.jpoint(null, null, null);
        else return this.dbl();
    }
    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(h);
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.dblp = function dblp(pow) {
    if (pow === 0) return this;
    if (this.isInfinity()) return this;
    if (!pow) return this.dbl();
    var i;
    if (this.curve.zeroA || this.curve.threeA) {
        var r = this;
        for (i = 0; i < pow; i++) r = r.dbl();
        return r;
    }
    var a = this.curve.a;
    var tinv = this.curve.tinv;
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();
    var jyd = jy.redAdd(jy);
    for (i = 0; i < pow; i++) {
        var jx2 = jx.redSqr();
        var jyd2 = jyd.redSqr();
        var jyd4 = jyd2.redSqr();
        var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
        var t1 = jx.redMul(jyd2);
        var nx = c.redSqr().redISub(t1.redAdd(t1));
        var t2 = t1.redISub(nx);
        var dny = c.redMul(t2);
        dny = dny.redIAdd(dny).redISub(jyd4);
        var nz = jyd.redMul(jz);
        if (i + 1 < pow) jz4 = jz4.redMul(jyd4);
        jx = nx;
        jz = nz;
        jyd = dny;
    }
    return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};
JPoint.prototype.dbl = function dbl() {
    if (this.isInfinity()) return this;
    if (this.curve.zeroA) return this._zeroDbl();
    else if (this.curve.threeA) return this._threeDbl();
    else return this._dbl();
};
JPoint.prototype._zeroDbl = function _zeroDbl() {
    var nx;
    var ny;
    var nz;
    if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx);
        var t = m.redSqr().redISub(s).redISub(s);
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        nx = t;
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
    } else {
        var a = this.x.redSqr();
        var b = this.y.redSqr();
        var c = b.redSqr();
        var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
        d = d.redIAdd(d);
        var e = a.redAdd(a).redIAdd(a);
        var f = e.redSqr();
        var c8 = c.redIAdd(c);
        c8 = c8.redIAdd(c8);
        c8 = c8.redIAdd(c8);
        nx = f.redISub(d).redISub(d);
        ny = e.redMul(d.redISub(nx)).redISub(c8);
        nz = this.y.redMul(this.z);
        nz = nz.redIAdd(nz);
    }
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype._threeDbl = function _threeDbl() {
    var nx;
    var ny;
    var nz;
    if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
        var t = m.redSqr().redISub(s).redISub(s);
        nx = t;
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
    } else {
        var delta = this.z.redSqr();
        var gamma = this.y.redSqr();
        var beta = this.x.redMul(gamma);
        var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
        alpha = alpha.redAdd(alpha).redIAdd(alpha);
        var beta4 = beta.redIAdd(beta);
        beta4 = beta4.redIAdd(beta4);
        var beta8 = beta4.redAdd(beta4);
        nx = alpha.redSqr().redISub(beta8);
        nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
        var ggamma8 = gamma.redSqr();
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
    }
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype._dbl = function _dbl() {
    var a = this.curve.a;
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();
    var jx2 = jx.redSqr();
    var jy2 = jy.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
    var jxd4 = jx.redAdd(jx);
    jxd4 = jxd4.redIAdd(jxd4);
    var t1 = jxd4.redMul(jy2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var jyd8 = jy2.redSqr();
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    var ny = c.redMul(t2).redISub(jyd8);
    var nz = jy.redAdd(jy).redMul(jz);
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.trpl = function trpl() {
    if (!this.curve.zeroA) return this.dbl().add(this);
    var xx = this.x.redSqr();
    var yy = this.y.redSqr();
    var zz = this.z.redSqr();
    var yyyy = yy.redSqr();
    var m = xx.redAdd(xx).redIAdd(xx);
    var mm = m.redSqr();
    var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    e = e.redIAdd(e);
    e = e.redAdd(e).redIAdd(e);
    e = e.redISub(mm);
    var ee = e.redSqr();
    var t = yyyy.redIAdd(yyyy);
    t = t.redIAdd(t);
    t = t.redIAdd(t);
    t = t.redIAdd(t);
    var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
    var yyu4 = yy.redMul(u);
    yyu4 = yyu4.redIAdd(yyu4);
    yyu4 = yyu4.redIAdd(yyu4);
    var nx = this.x.redMul(ee).redISub(yyu4);
    nx = nx.redIAdd(nx);
    nx = nx.redIAdd(nx);
    var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
    return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.mul = function mul(k, kbase) {
    k = new bn(k, kbase);
    return this.curve._wnafMul(this, k);
};
JPoint.prototype.eq = function eq(p) {
    if (p.type === "affine") return this.eq(p.toJ());
    if (this === p) return true;
    var z2 = this.z.redSqr();
    var pz2 = p.z.redSqr();
    if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0) return false;
    var z3 = z2.redMul(this.z);
    var pz3 = pz2.redMul(p.z);
    return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};
JPoint.prototype.eqXToP = function eqXToP(x) {
    var zs = this.z.redSqr();
    var rx = x.toRed(this.curve.red).redMul(zs);
    if (this.x.cmp(rx) === 0) return true;
    var xc = x.clone();
    var t = this.curve.redN.redMul(zs);
    for (; ;) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0) return false;
        rx.redIAdd(t);
        if (this.x.cmp(rx) === 0) return true;
    }
};
JPoint.prototype.inspect = function inspect() {
    if (this.isInfinity()) return "<EC JPoint Infinity>";
    return (
        "<EC JPoint x: " +
        this.x.toString(16, 2) +
        " y: " +
        this.y.toString(16, 2) +
        " z: " +
        this.z.toString(16, 2) +
        ">"
    );
};
JPoint.prototype.isInfinity = function isInfinity() {
    return this.z.cmpn(0) === 0;
};
var curve_1 = createCommonjsModule$1(function (module, exports) {
    "use strict";
    var curve = exports;
    curve.base = base;
    curve.short = short_1;
    curve.mont = null;
    curve.edwards = null;
});
var curves_1 = createCommonjsModule$1(function (module, exports) {
    "use strict";
    var curves = exports;
    var assert = utils_1$1.assert;
    function PresetCurve(options) {
        if (options.type === "short") this.curve = new curve_1.short(options);
        else if (options.type === "edwards")
            this.curve = new curve_1.edwards(options);
        else this.curve = new curve_1.mont(options);
        this.g = this.curve.g;
        this.n = this.curve.n;
        this.hash = options.hash;
        assert(this.g.validate(), "Invalid curve");
        assert(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    curves.PresetCurve = PresetCurve;
    function defineCurve(name, options) {
        Object.defineProperty(curves, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                var curve = new PresetCurve(options);
                Object.defineProperty(curves, name, {
                    configurable: true,
                    enumerable: true,
                    value: curve,
                });
                return curve;
            },
        });
    }
    defineCurve("p192", {
        type: "short",
        prime: "p192",
        p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
        b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
        n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
        hash: hash_1.sha256,
        gRed: false,
        g: [
            "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
            "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811",
        ],
    });
    defineCurve("p224", {
        type: "short",
        prime: "p224",
        p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
        b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
        n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
        hash: hash_1.sha256,
        gRed: false,
        g: [
            "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
            "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34",
        ],
    });
    defineCurve("p256", {
        type: "short",
        prime: null,
        p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
        a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
        b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
        n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
        hash: hash_1.sha256,
        gRed: false,
        g: [
            "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
            "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5",
        ],
    });
    defineCurve("p384", {
        type: "short",
        prime: null,
        p:
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "fffffffe ffffffff 00000000 00000000 ffffffff",
        a:
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "fffffffe ffffffff 00000000 00000000 fffffffc",
        b:
            "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f " +
            "5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
        n:
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 " +
            "f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
        hash: hash_1.sha384,
        gRed: false,
        g: [
            "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 " +
            "5502f25d bf55296c 3a545e38 72760ab7",
            "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 " +
            "0a60b1ce 1d7e819d 7a431d7c 90ea0e5f",
        ],
    });
    defineCurve("p521", {
        type: "short",
        prime: null,
        p:
            "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "ffffffff ffffffff ffffffff ffffffff ffffffff",
        a:
            "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "ffffffff ffffffff ffffffff ffffffff fffffffc",
        b:
            "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b " +
            "99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd " +
            "3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
        n:
            "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff " +
            "ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 " +
            "f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
        hash: hash_1.sha512,
        gRed: false,
        g: [
            "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 " +
            "053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 " +
            "a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
            "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 " +
            "579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 " +
            "3fad0761 353c7086 a272c240 88be9476 9fd16650",
        ],
    });
    defineCurve("curve25519", {
        type: "mont",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "76d06",
        b: "1",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: hash_1.sha256,
        gRed: false,
        g: ["9"],
    });
    defineCurve("ed25519", {
        type: "edwards",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "-1",
        c: "1",
        d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: hash_1.sha256,
        gRed: false,
        g: [
            "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
            "6666666666666666666666666666666666666666666666666666666666666658",
        ],
    });
    var pre;
    try {
        pre = null.crash();
    } catch (e) {
        pre = undefined;
    }
    defineCurve("secp256k1", {
        type: "short",
        prime: "k256",
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
        a: "0",
        b: "7",
        n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
        h: "1",
        hash: hash_1.sha256,
        beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
        lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
        basis: [
            {
                a: "3086d221a7d46bcde86c90e49284eb15",
                b: "-e4437ed6010e88286f547fa90abfe4c3",
            },
            {
                a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                b: "3086d221a7d46bcde86c90e49284eb15",
            },
        ],
        gRed: false,
        g: [
            "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
            "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
            pre,
        ],
    });
});
("use strict");
function HmacDRBG(options) {
    if (!(this instanceof HmacDRBG)) return new HmacDRBG(options);
    this.hash = options.hash;
    this.predResist = !!options.predResist;
    this.outLen = this.hash.outSize;
    this.minEntropy = options.minEntropy || this.hash.hmacStrength;
    this._reseed = null;
    this.reseedInterval = null;
    this.K = null;
    this.V = null;
    var entropy = utils_1.toArray(options.entropy, options.entropyEnc || "hex");
    var nonce = utils_1.toArray(options.nonce, options.nonceEnc || "hex");
    var pers = utils_1.toArray(options.pers, options.persEnc || "hex");
    minimalisticAssert$1(
        entropy.length >= this.minEntropy / 8,
        "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    );
    this._init(entropy, nonce, pers);
}
var hmacDrbg = HmacDRBG;
HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
    var seed = entropy.concat(nonce).concat(pers);
    this.K = new Array(this.outLen / 8);
    this.V = new Array(this.outLen / 8);
    for (var i = 0; i < this.V.length; i++) {
        this.K[i] = 0;
        this.V[i] = 1;
    }
    this._update(seed);
    this._reseed = 1;
    this.reseedInterval = 281474976710656;
};
HmacDRBG.prototype._hmac = function hmac() {
    return new hash_1.hmac(this.hash, this.K);
};
HmacDRBG.prototype._update = function update(seed) {
    var kmac = this._hmac().update(this.V).update([0]);
    if (seed) kmac = kmac.update(seed);
    this.K = kmac.digest();
    this.V = this._hmac().update(this.V).digest();
    if (!seed) return;
    this.K = this._hmac().update(this.V).update([1]).update(seed).digest();
    this.V = this._hmac().update(this.V).digest();
};
HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
    if (typeof entropyEnc !== "string") {
        addEnc = add;
        add = entropyEnc;
        entropyEnc = null;
    }
    entropy = utils_1.toArray(entropy, entropyEnc);
    add = utils_1.toArray(add, addEnc);
    minimalisticAssert$1(
        entropy.length >= this.minEntropy / 8,
        "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    );
    this._update(entropy.concat(add || []));
    this._reseed = 1;
};
HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
    if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
    if (typeof enc !== "string") {
        addEnc = add;
        add = enc;
        enc = null;
    }
    if (add) {
        add = utils_1.toArray(add, addEnc || "hex");
        this._update(add);
    }
    var temp = [];
    while (temp.length < len) {
        this.V = this._hmac().update(this.V).digest();
        temp = temp.concat(this.V);
    }
    var res = temp.slice(0, len);
    this._update(add);
    this._reseed++;
    return utils_1.encode(res, enc);
};
("use strict");
var assert$3 = utils_1$1.assert;
function KeyPair(ec, options) {
    this.ec = ec;
    this.priv = null;
    this.pub = null;
    if (options.priv) this._importPrivate(options.priv, options.privEnc);
    if (options.pub) this._importPublic(options.pub, options.pubEnc);
}
var key = KeyPair;
KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
    if (pub instanceof KeyPair) return pub;
    return new KeyPair(ec, { pub: pub, pubEnc: enc });
};
KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
    if (priv instanceof KeyPair) return priv;
    return new KeyPair(ec, { priv: priv, privEnc: enc });
};
KeyPair.prototype.validate = function validate() {
    var pub = this.getPublic();
    if (pub.isInfinity()) return { result: false, reason: "Invalid public key" };
    if (!pub.validate())
        return { result: false, reason: "Public key is not a point" };
    if (!pub.mul(this.ec.curve.n).isInfinity())
        return { result: false, reason: "Public key * N != O" };
    return { result: true, reason: null };
};
KeyPair.prototype.getPublic = function getPublic(compact, enc) {
    if (typeof compact === "string") {
        enc = compact;
        compact = null;
    }
    if (!this.pub) this.pub = this.ec.g.mul(this.priv);
    if (!enc) return this.pub;
    return this.pub.encode(enc, compact);
};
KeyPair.prototype.getPrivate = function getPrivate(enc) {
    if (enc === "hex") return this.priv.toString(16, 2);
    else return this.priv;
};
KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
    this.priv = new bn(key, enc || 16);
    this.priv = this.priv.umod(this.ec.curve.n);
};
KeyPair.prototype._importPublic = function _importPublic(key, enc) {
    if (key.x || key.y) {
        if (this.ec.curve.type === "mont") {
            assert$3(key.x, "Need x coordinate");
        } else if (
            this.ec.curve.type === "short" ||
            this.ec.curve.type === "edwards"
        ) {
            assert$3(key.x && key.y, "Need both x and y coordinate");
        }
        this.pub = this.ec.curve.point(key.x, key.y);
        return;
    }
    this.pub = this.ec.curve.decodePoint(key, enc);
};
KeyPair.prototype.derive = function derive(pub) {
    if (!pub.validate()) {
        assert$3(pub.validate(), "public point not validated");
    }
    return pub.mul(this.priv).getX();
};
KeyPair.prototype.sign = function sign(msg, enc, options) {
    return this.ec.sign(msg, this, enc, options);
};
KeyPair.prototype.verify = function verify(msg, signature) {
    return this.ec.verify(msg, signature, this);
};
KeyPair.prototype.inspect = function inspect() {
    return (
        "<Key priv: " +
        (this.priv && this.priv.toString(16, 2)) +
        " pub: " +
        (this.pub && this.pub.inspect()) +
        " >"
    );
};
("use strict");
var assert$4 = utils_1$1.assert;
function Signature(options, enc) {
    if (options instanceof Signature) return options;
    if (this._importDER(options, enc)) return;
    assert$4(options.r && options.s, "Signature without r or s");
    this.r = new bn(options.r, 16);
    this.s = new bn(options.s, 16);
    if (options.recoveryParam === undefined) this.recoveryParam = null;
    else this.recoveryParam = options.recoveryParam;
}
var signature = Signature;
function Position() {
    this.place = 0;
}
function getLength(buf, p) {
    var initial = buf[p.place++];
    if (!(initial & 128)) {
        return initial;
    }
    var octetLen = initial & 15;
    if (octetLen === 0 || octetLen > 4) {
        return false;
    }
    var val = 0;
    for (var i = 0, off = p.place; i < octetLen; i++, off++) {
        val <<= 8;
        val |= buf[off];
        val >>>= 0;
    }
    if (val <= 127) {
        return false;
    }
    p.place = off;
    return val;
}
function rmPadding(buf) {
    var i = 0;
    var len = buf.length - 1;
    while (!buf[i] && !(buf[i + 1] & 128) && i < len) {
        i++;
    }
    if (i === 0) {
        return buf;
    }
    return buf.slice(i);
}
Signature.prototype._importDER = function _importDER(data, enc) {
    data = utils_1$1.toArray(data, enc);
    var p = new Position();
    if (data[p.place++] !== 48) {
        return false;
    }
    var len = getLength(data, p);
    if (len === false) {
        return false;
    }
    if (len + p.place !== data.length) {
        return false;
    }
    if (data[p.place++] !== 2) {
        return false;
    }
    var rlen = getLength(data, p);
    if (rlen === false) {
        return false;
    }
    var r = data.slice(p.place, rlen + p.place);
    p.place += rlen;
    if (data[p.place++] !== 2) {
        return false;
    }
    var slen = getLength(data, p);
    if (slen === false) {
        return false;
    }
    if (data.length !== slen + p.place) {
        return false;
    }
    var s = data.slice(p.place, slen + p.place);
    if (r[0] === 0) {
        if (r[1] & 128) {
            r = r.slice(1);
        } else {
            return false;
        }
    }
    if (s[0] === 0) {
        if (s[1] & 128) {
            s = s.slice(1);
        } else {
            return false;
        }
    }
    this.r = new bn(r);
    this.s = new bn(s);
    this.recoveryParam = null;
    return true;
};
function constructLength(arr, len) {
    if (len < 128) {
        arr.push(len);
        return;
    }
    var octets = 1 + ((Math.log(len) / Math.LN2) >>> 3);
    arr.push(octets | 128);
    while (--octets) {
        arr.push((len >>> (octets << 3)) & 255);
    }
    arr.push(len);
}
Signature.prototype.toDER = function toDER(enc) {
    var r = this.r.toArray();
    var s = this.s.toArray();
    if (r[0] & 128) r = [0].concat(r);
    if (s[0] & 128) s = [0].concat(s);
    r = rmPadding(r);
    s = rmPadding(s);
    while (!s[0] && !(s[1] & 128)) {
        s = s.slice(1);
    }
    var arr = [2];
    constructLength(arr, r.length);
    arr = arr.concat(r);
    arr.push(2);
    constructLength(arr, s.length);
    var backHalf = arr.concat(s);
    var res = [48];
    constructLength(res, backHalf.length);
    res = res.concat(backHalf);
    return utils_1$1.encode(res, enc);
};
("use strict");
var rand = function () {
    throw new Error("unsupported");
};
var assert$5 = utils_1$1.assert;
function EC(options) {
    if (!(this instanceof EC)) return new EC(options);
    if (typeof options === "string") {
        assert$5(
            Object.prototype.hasOwnProperty.call(curves_1, options),
            "Unknown curve " + options
        );
        options = curves_1[options];
    }
    if (options instanceof curves_1.PresetCurve) options = { curve: options };
    this.curve = options.curve.curve;
    this.n = this.curve.n;
    this.nh = this.n.ushrn(1);
    this.g = this.curve.g;
    this.g = options.curve.g;
    this.g.precompute(options.curve.n.bitLength() + 1);
    this.hash = options.hash || options.curve.hash;
}
var ec = EC;
EC.prototype.keyPair = function keyPair(options) {
    return new key(this, options);
};
EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
    return key.fromPrivate(this, priv, enc);
};
EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
    return key.fromPublic(this, pub, enc);
};
EC.prototype.genKeyPair = function genKeyPair(options) {
    if (!options) options = {};
    var drbg = new hmacDrbg({
        hash: this.hash,
        pers: options.pers,
        persEnc: options.persEnc || "utf8",
        entropy: options.entropy || rand(this.hash.hmacStrength),
        entropyEnc: (options.entropy && options.entropyEnc) || "utf8",
        nonce: this.n.toArray(),
    });
    var bytes = this.n.byteLength();
    var ns2 = this.n.sub(new bn(2));
    for (; ;) {
        var priv = new bn(drbg.generate(bytes));
        if (priv.cmp(ns2) > 0) continue;
        priv.iaddn(1);
        return this.keyFromPrivate(priv);
    }
};
EC.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
    var delta = msg.byteLength() * 8 - this.n.bitLength();
    if (delta > 0) msg = msg.ushrn(delta);
    if (!truncOnly && msg.cmp(this.n) >= 0) return msg.sub(this.n);
    else return msg;
};
EC.prototype.sign = function sign(msg, key, enc, options) {
    if (typeof enc === "object") {
        options = enc;
        enc = null;
    }
    if (!options) options = {};
    key = this.keyFromPrivate(key, enc);
    msg = this._truncateToN(new bn(msg, 16));
    var bytes = this.n.byteLength();
    var bkey = key.getPrivate().toArray("be", bytes);
    var nonce = msg.toArray("be", bytes);
    var drbg = new hmacDrbg({
        hash: this.hash,
        entropy: bkey,
        nonce: nonce,
        pers: options.pers,
        persEnc: options.persEnc || "utf8",
    });
    var ns1 = this.n.sub(new bn(1));
    for (var iter = 0; ; iter++) {
        var k = options.k
            ? options.k(iter)
            : new bn(drbg.generate(this.n.byteLength()));
        k = this._truncateToN(k, true);
        if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0) continue;
        var kp = this.g.mul(k);
        if (kp.isInfinity()) continue;
        var kpX = kp.getX();
        var r = kpX.umod(this.n);
        if (r.cmpn(0) === 0) continue;
        var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
        s = s.umod(this.n);
        if (s.cmpn(0) === 0) continue;
        var recoveryParam =
            (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r) !== 0 ? 2 : 0);
        if (options.canonical && s.cmp(this.nh) > 0) {
            s = this.n.sub(s);
            recoveryParam ^= 1;
        }
        return new signature({ r: r, s: s, recoveryParam: recoveryParam });
    }
};
EC.prototype.verify = function verify(msg, signature$1, key, enc) {
    msg = this._truncateToN(new bn(msg, 16));
    key = this.keyFromPublic(key, enc);
    signature$1 = new signature(signature$1, "hex");
    var r = signature$1.r;
    var s = signature$1.s;
    if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0) return false;
    if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return false;
    var sinv = s.invm(this.n);
    var u1 = sinv.mul(msg).umod(this.n);
    var u2 = sinv.mul(r).umod(this.n);
    var p;
    if (!this.curve._maxwellTrick) {
        p = this.g.mulAdd(u1, key.getPublic(), u2);
        if (p.isInfinity()) return false;
        return p.getX().umod(this.n).cmp(r) === 0;
    }
    p = this.g.jmulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity()) return false;
    return p.eqXToP(r);
};
EC.prototype.recoverPubKey = function (msg, signature$1, j, enc) {
    assert$5((3 & j) === j, "The recovery param is more than two bits");
    signature$1 = new signature(signature$1, enc);
    var n = this.n;
    var e = new bn(msg);
    var r = signature$1.r;
    var s = signature$1.s;
    var isYOdd = j & 1;
    var isSecondKey = j >> 1;
    if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
        throw new Error("Unable to find sencond key candinate");
    if (isSecondKey) r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
    else r = this.curve.pointFromX(r, isYOdd);
    var rInv = signature$1.r.invm(n);
    var s1 = n.sub(e).mul(rInv).umod(n);
    var s2 = s.mul(rInv).umod(n);
    return this.g.mulAdd(s1, r, s2);
};
EC.prototype.getKeyRecoveryParam = function (e, signature$1, Q, enc) {
    signature$1 = new signature(signature$1, enc);
    if (signature$1.recoveryParam !== null) return signature$1.recoveryParam;
    for (var i = 0; i < 4; i++) {
        var Qprime;
        try {
            Qprime = this.recoverPubKey(e, signature$1, i);
        } catch (e) {
            continue;
        }
        if (Qprime.eq(Q)) return i;
    }
    throw new Error("Unable to find valid recovery factor");
};
var elliptic_1 = createCommonjsModule$1(function (module, exports) {
    "use strict";
    var elliptic = exports;
    elliptic.version = { version: "6.5.4" }.version;
    elliptic.utils = utils_1$1;
    elliptic.rand = function () {
        throw new Error("unsupported");
    };
    elliptic.curve = curve_1;
    elliptic.curves = curves_1;
    elliptic.ec = ec;
    elliptic.eddsa = null;
});
var EC$1 = elliptic_1.ec;
const version$b = "signing-key/5.1.0";
("use strict");
const logger$g = new Logger(version$b);
let _curve = null;
function getCurve() {
    if (!_curve) {
        _curve = new EC$1("secp256k1");
    }
    return _curve;
}
class SigningKey {
    constructor(privateKey) {
        defineReadOnly(this, "curve", "secp256k1");
        defineReadOnly(this, "privateKey", hexlify(privateKey));
        const keyPair = getCurve().keyFromPrivate(arrayify(this.privateKey));
        defineReadOnly(this, "publicKey", "0x" + keyPair.getPublic(false, "hex"));
        defineReadOnly(
            this,
            "compressedPublicKey",
            "0x" + keyPair.getPublic(true, "hex")
        );
        defineReadOnly(this, "_isSigningKey", true);
    }
    _addPoint(other) {
        const p0 = getCurve().keyFromPublic(arrayify(this.publicKey));
        const p1 = getCurve().keyFromPublic(arrayify(other));
        return "0x" + p0.pub.add(p1.pub).encodeCompressed("hex");
    }
    signDigest(digest) {
        const keyPair = getCurve().keyFromPrivate(arrayify(this.privateKey));
        const digestBytes = arrayify(digest);
        if (digestBytes.length !== 32) {
            logger$g.throwArgumentError("bad digest length", "digest", digest);
        }
        const signature = keyPair.sign(digestBytes, { canonical: true });
        return splitSignature({
            recoveryParam: signature.recoveryParam,
            r: hexZeroPad("0x" + signature.r.toString(16), 32),
            s: hexZeroPad("0x" + signature.s.toString(16), 32),
        });
    }
    computeSharedSecret(otherKey) {
        const keyPair = getCurve().keyFromPrivate(arrayify(this.privateKey));
        const otherKeyPair = getCurve().keyFromPublic(
            arrayify(computePublicKey(otherKey))
        );
        return hexZeroPad(
            "0x" + keyPair.derive(otherKeyPair.getPublic()).toString(16),
            32
        );
    }
    static isSigningKey(value) {
        return !!(value && value._isSigningKey);
    }
}
function recoverPublicKey(digest, signature) {
    const sig = splitSignature(signature);
    const rs = { r: arrayify(sig.r), s: arrayify(sig.s) };
    return (
        "0x" +
        getCurve()
            .recoverPubKey(arrayify(digest), rs, sig.recoveryParam)
            .encode("hex", false)
    );
}
function computePublicKey(key, compressed) {
    const bytes = arrayify(key);
    if (bytes.length === 32) {
        const signingKey = new SigningKey(bytes);
        if (compressed) {
            return "0x" + getCurve().keyFromPrivate(bytes).getPublic(true, "hex");
        }
        return signingKey.publicKey;
    } else if (bytes.length === 33) {
        if (compressed) {
            return hexlify(bytes);
        }
        return "0x" + getCurve().keyFromPublic(bytes).getPublic(false, "hex");
    } else if (bytes.length === 65) {
        if (!compressed) {
            return hexlify(bytes);
        }
        return "0x" + getCurve().keyFromPublic(bytes).getPublic(true, "hex");
    }
    return logger$g.throwArgumentError(
        "invalid public or private key",
        "key",
        "[REDACTED]"
    );
}
const version$c = "transactions/5.1.1";
("use strict");
const logger$h = new Logger(version$c);
function handleAddress(value) {
    if (value === "0x") {
        return null;
    }
    return getAddress(value);
}
function handleNumber(value) {
    if (value === "0x") {
        return Zero$1;
    }
    return BigNumber.from(value);
}
const transactionFields = [
    { name: "nonce", maxLength: 32, numeric: true },
    { name: "gasPrice", maxLength: 32, numeric: true },
    { name: "gasLimit", maxLength: 32, numeric: true },
    { name: "to", length: 20 },
    { name: "value", maxLength: 32, numeric: true },
    { name: "data" },
];
const allowedTransactionKeys$1 = {
    chainId: true,
    data: true,
    gasLimit: true,
    gasPrice: true,
    nonce: true,
    to: true,
    value: true,
};
function computeAddress(key) {
    const publicKey = computePublicKey(key);
    return getAddress(hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12));
}
function recoverAddress(digest, signature) {
    return computeAddress(recoverPublicKey(arrayify(digest), signature));
}
function formatNumber(value, name) {
    const result = stripZeros(BigNumber.from(value).toHexString());
    if (result.length > 32) {
        logger$h.throwArgumentError(
            "invalid length for " + name,
            "transaction:" + name,
            value
        );
    }
    return result;
}
function accessSetify(addr, storageKeys) {
    return {
        address: getAddress(addr),
        storageKeys: (storageKeys || []).map((storageKey, index) => {
            if (hexDataLength(storageKey) !== 32) {
                logger$h.throwArgumentError(
                    "invalid access list storageKey",
                    `accessList[${addr}:${index}]`,
                    storageKey
                );
            }
            return storageKey.toLowerCase();
        }),
    };
}
function accessListify(value) {
    if (Array.isArray(value)) {
        return value.map((set, index) => {
            if (Array.isArray(set)) {
                if (set.length > 2) {
                    logger$h.throwArgumentError(
                        "access list expected to be [ address, storageKeys[] ]",
                        `value[${index}]`,
                        set
                    );
                }
                return accessSetify(set[0], set[1]);
            }
            return accessSetify(set.address, set.storageKeys);
        });
    }
    const result = Object.keys(value).map((addr) => {
        const storageKeys = value[addr].reduce((accum, storageKey) => {
            accum[storageKey] = true;
            return accum;
        }, {});
        return accessSetify(addr, Object.keys(storageKeys).sort());
    });
    result.sort((a, b) => a.address.localeCompare(b.address));
    return result;
}
function formatAccessList(value) {
    return accessListify(value).map((set) => [set.address, set.storageKeys]);
}
function _serializeEip2930(transaction, signature) {
    const fields = [
        formatNumber(transaction.chainId || 0, "chainId"),
        formatNumber(transaction.nonce || 0, "nonce"),
        formatNumber(transaction.gasPrice || 0, "gasPrice"),
        formatNumber(transaction.gasLimit || 0, "gasLimit"),
        transaction.to != null ? getAddress(transaction.to) : "0x",
        formatNumber(transaction.value || 0, "value"),
        transaction.data || "0x",
        formatAccessList(transaction.accessList || []),
    ];
    if (signature) {
        const sig = splitSignature(signature);
        fields.push(formatNumber(sig.recoveryParam, "recoveryParam"));
        fields.push(stripZeros(sig.r));
        fields.push(stripZeros(sig.s));
    }
    return hexConcat(["0x01", encode(fields)]);
}
function _serialize(transaction, signature) {
    checkProperties(transaction, allowedTransactionKeys$1);
    const raw = [];
    transactionFields.forEach(function (fieldInfo) {
        let value = transaction[fieldInfo.name] || [];
        const options = {};
        if (fieldInfo.numeric) {
            options.hexPad = "left";
        }
        value = arrayify(hexlify(value, options));
        if (
            fieldInfo.length &&
            value.length !== fieldInfo.length &&
            value.length > 0
        ) {
            logger$h.throwArgumentError(
                "invalid length for " + fieldInfo.name,
                "transaction:" + fieldInfo.name,
                value
            );
        }
        if (fieldInfo.maxLength) {
            value = stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                logger$h.throwArgumentError(
                    "invalid length for " + fieldInfo.name,
                    "transaction:" + fieldInfo.name,
                    value
                );
            }
        }
        raw.push(hexlify(value));
    });
    let chainId = 0;
    if (transaction.chainId != null) {
        chainId = transaction.chainId;
        if (typeof chainId !== "number") {
            logger$h.throwArgumentError(
                "invalid transaction.chainId",
                "transaction",
                transaction
            );
        }
    } else if (signature && !isBytesLike(signature) && signature.v > 28) {
        chainId = Math.floor((signature.v - 35) / 2);
    }
    if (chainId !== 0) {
        raw.push(hexlify(chainId));
        raw.push("0x");
        raw.push("0x");
    }
    if (!signature) {
        return encode(raw);
    }
    const sig = splitSignature(signature);
    let v = 27 + sig.recoveryParam;
    if (chainId !== 0) {
        raw.pop();
        raw.pop();
        raw.pop();
        v += chainId * 2 + 8;
        if (sig.v > 28 && sig.v !== v) {
            logger$h.throwArgumentError(
                "transaction.chainId/signature.v mismatch",
                "signature",
                signature
            );
        }
    } else if (sig.v !== v) {
        logger$h.throwArgumentError(
            "transaction.chainId/signature.v mismatch",
            "signature",
            signature
        );
    }
    raw.push(hexlify(v));
    raw.push(stripZeros(arrayify(sig.r)));
    raw.push(stripZeros(arrayify(sig.s)));
    return encode(raw);
}
function serialize(transaction, signature) {
    if (transaction.type == null) {
        if (transaction.accessList != null) {
            logger$h.throwArgumentError(
                "untyped transactions do not support accessList; include type: 1",
                "transaction",
                transaction
            );
        }
        return _serialize(transaction, signature);
    }
    switch (transaction.type) {
        case 1:
            return _serializeEip2930(transaction, signature);
        default:
            break;
    }
    return logger$h.throwError(
        `unsupported transaction type: ${transaction.type}`,
        Logger.errors.UNSUPPORTED_OPERATION,
        { operation: "serializeTransaction", transactionType: transaction.type }
    );
}
function _parseEip2930(payload) {
    const transaction = decode(payload.slice(1));
    if (transaction.length !== 8 && transaction.length !== 11) {
        logger$h.throwArgumentError(
            "invalid component count for transaction type: 1",
            "payload",
            hexlify(payload)
        );
    }
    const tx = {
        type: 1,
        chainId: handleNumber(transaction[0]).toNumber(),
        nonce: handleNumber(transaction[1]).toNumber(),
        gasPrice: handleNumber(transaction[2]),
        gasLimit: handleNumber(transaction[3]),
        to: handleAddress(transaction[4]),
        value: handleNumber(transaction[5]),
        data: transaction[6],
        accessList: accessListify(transaction[7]),
    };
    if (transaction.length === 8) {
        return tx;
    }
    try {
        const recid = handleNumber(transaction[8]).toNumber();
        if (recid !== 0 && recid !== 1) {
            throw new Error("bad recid");
        }
        tx.v = recid;
    } catch (error) {
        logger$h.throwArgumentError(
            "invalid v for transaction type: 1",
            "v",
            transaction[8]
        );
    }
    tx.r = hexZeroPad(transaction[9], 32);
    tx.s = hexZeroPad(transaction[10], 32);
    try {
        const digest = keccak256(_serializeEip2930(tx));
        tx.from = recoverAddress(digest, { r: tx.r, s: tx.s, recoveryParam: tx.v });
    } catch (error) {
        console.log(error);
    }
    tx.hash = keccak256(payload);
    return tx;
}
function _parse(rawTransaction) {
    const transaction = decode(rawTransaction);
    if (transaction.length !== 9 && transaction.length !== 6) {
        logger$h.throwArgumentError(
            "invalid raw transaction",
            "rawTransaction",
            rawTransaction
        );
    }
    const tx = {
        nonce: handleNumber(transaction[0]).toNumber(),
        gasPrice: handleNumber(transaction[1]),
        gasLimit: handleNumber(transaction[2]),
        to: handleAddress(transaction[3]),
        value: handleNumber(transaction[4]),
        data: transaction[5],
        chainId: 0,
    };
    if (transaction.length === 6) {
        return tx;
    }
    try {
        tx.v = BigNumber.from(transaction[6]).toNumber();
    } catch (error) {
        console.log(error);
        return tx;
    }
    tx.r = hexZeroPad(transaction[7], 32);
    tx.s = hexZeroPad(transaction[8], 32);
    if (BigNumber.from(tx.r).isZero() && BigNumber.from(tx.s).isZero()) {
        tx.chainId = tx.v;
        tx.v = 0;
    } else {
        tx.chainId = Math.floor((tx.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }
        let recoveryParam = tx.v - 27;
        const raw = transaction.slice(0, 6);
        if (tx.chainId !== 0) {
            raw.push(hexlify(tx.chainId));
            raw.push("0x");
            raw.push("0x");
            recoveryParam -= tx.chainId * 2 + 8;
        }
        const digest = keccak256(encode(raw));
        try {
            tx.from = recoverAddress(digest, {
                r: hexlify(tx.r),
                s: hexlify(tx.s),
                recoveryParam: recoveryParam,
            });
        } catch (error) {
            console.log(error);
        }
        tx.hash = keccak256(rawTransaction);
    }
    tx.type = null;
    return tx;
}
function parse(rawTransaction) {
    const payload = arrayify(rawTransaction);
    if (payload[0] > 127) {
        return _parse(payload);
    }
    switch (payload[0]) {
        case 1:
            return _parseEip2930(payload);
        default:
            break;
    }
    return logger$h.throwError(
        `unsupported transaction type: ${payload[0]}`,
        Logger.errors.UNSUPPORTED_OPERATION,
        { operation: "parseTransaction", transactionType: payload[0] }
    );
}
const version$d = "contracts/5.1.1";
("use strict");
var __awaiter$3 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$i = new Logger(version$d);
const allowedTransactionKeys$2 = {
    chainId: true,
    data: true,
    from: true,
    gasLimit: true,
    gasPrice: true,
    nonce: true,
    to: true,
    value: true,
    type: true,
    accessList: true,
};
function resolveName(resolver, nameOrPromise) {
    return __awaiter$3(this, void 0, void 0, function* () {
        const name = yield nameOrPromise;
        try {
            return getAddress(name);
        } catch (error) { }
        if (!resolver) {
            logger$i.throwError(
                "a provider or signer is needed to resolve ENS names",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "resolveName" }
            );
        }
        const address = yield resolver.resolveName(name);
        if (address == null) {
            logger$i.throwArgumentError(
                "resolver or addr is not configured for ENS name",
                "name",
                name
            );
        }
        return address;
    });
}
function resolveAddresses(resolver, value, paramType) {
    return __awaiter$3(this, void 0, void 0, function* () {
        if (Array.isArray(paramType)) {
            return yield Promise.all(
                paramType.map((paramType, index) => {
                    return resolveAddresses(
                        resolver,
                        Array.isArray(value) ? value[index] : value[paramType.name],
                        paramType
                    );
                })
            );
        }
        if (paramType.type === "address") {
            return yield resolveName(resolver, value);
        }
        if (paramType.type === "tuple") {
            return yield resolveAddresses(resolver, value, paramType.components);
        }
        if (paramType.baseType === "array") {
            if (!Array.isArray(value)) {
                return Promise.reject(new Error("invalid value for array"));
            }
            return yield Promise.all(
                value.map((v) => resolveAddresses(resolver, v, paramType.arrayChildren))
            );
        }
        return value;
    });
}
function populateTransaction(contract, fragment, args) {
    return __awaiter$3(this, void 0, void 0, function* () {
        let overrides = {};
        if (
            args.length === fragment.inputs.length + 1 &&
            typeof args[args.length - 1] === "object"
        ) {
            overrides = shallowCopy(args.pop());
        }
        logger$i.checkArgumentCount(
            args.length,
            fragment.inputs.length,
            "passed to contract"
        );
        if (contract.signer) {
            if (overrides.from) {
                overrides.from = resolveProperties({
                    override: resolveName(contract.signer, overrides.from),
                    signer: contract.signer.getAddress(),
                }).then((check) =>
                    __awaiter$3(this, void 0, void 0, function* () {
                        if (getAddress(check.signer) !== check.override) {
                            logger$i.throwError(
                                "Contract with a Signer cannot override from",
                                Logger.errors.UNSUPPORTED_OPERATION,
                                { operation: "overrides.from" }
                            );
                        }
                        return check.override;
                    })
                );
            } else {
                overrides.from = contract.signer.getAddress();
            }
        } else if (overrides.from) {
            overrides.from = resolveName(contract.provider, overrides.from);
        }
        const resolved = yield resolveProperties({
            args: resolveAddresses(
                contract.signer || contract.provider,
                args,
                fragment.inputs
            ),
            address: contract.resolvedAddress,
            overrides: resolveProperties(overrides) || {},
        });
        const data = contract.interface.encodeFunctionData(fragment, resolved.args);
        const tx = { data: data, to: resolved.address };
        const ro = resolved.overrides;
        if (ro.nonce != null) {
            tx.nonce = BigNumber.from(ro.nonce).toNumber();
        }
        if (ro.gasLimit != null) {
            tx.gasLimit = BigNumber.from(ro.gasLimit);
        }
        if (ro.gasPrice != null) {
            tx.gasPrice = BigNumber.from(ro.gasPrice);
        }
        if (ro.from != null) {
            tx.from = ro.from;
        }
        if (ro.type != null) {
            tx.type = ro.type;
        }
        if (ro.accessList != null) {
            tx.accessList = accessListify(ro.accessList);
        }
        if (tx.gasLimit == null && fragment.gas != null) {
            let intrinsic = 21e3;
            const bytes = arrayify(data);
            for (let i = 0; i < bytes.length; i++) {
                intrinsic += 4;
                if (bytes[i]) {
                    intrinsic += 64;
                }
            }
            tx.gasLimit = BigNumber.from(fragment.gas).add(intrinsic);
        }
        if (ro.value) {
            const roValue = BigNumber.from(ro.value);
            if (!roValue.isZero() && !fragment.payable) {
                logger$i.throwError(
                    "non-payable method cannot override value",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "overrides.value", value: overrides.value }
                );
            }
            tx.value = roValue;
        }
        delete overrides.nonce;
        delete overrides.gasLimit;
        delete overrides.gasPrice;
        delete overrides.from;
        delete overrides.value;
        delete overrides.type;
        delete overrides.accessList;
        const leftovers = Object.keys(overrides).filter(
            (key) => overrides[key] != null
        );
        if (leftovers.length) {
            logger$i.throwError(
                `cannot override ${leftovers.map((l) => JSON.stringify(l)).join(",")}`,
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "overrides", overrides: leftovers }
            );
        }
        return tx;
    });
}
function buildPopulate(contract, fragment) {
    return function (...args) {
        return populateTransaction(contract, fragment, args);
    };
}
function buildEstimate(contract, fragment) {
    const signerOrProvider = contract.signer || contract.provider;
    return function (...args) {
        return __awaiter$3(this, void 0, void 0, function* () {
            if (!signerOrProvider) {
                logger$i.throwError(
                    "estimate require a provider or signer",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "estimateGas" }
                );
            }
            const tx = yield populateTransaction(contract, fragment, args);
            return yield signerOrProvider.estimateGas(tx);
        });
    };
}
function buildCall(contract, fragment, collapseSimple) {
    const signerOrProvider = contract.signer || contract.provider;
    return function (...args) {
        return __awaiter$3(this, void 0, void 0, function* () {
            let blockTag = undefined;
            if (
                args.length === fragment.inputs.length + 1 &&
                typeof args[args.length - 1] === "object"
            ) {
                const overrides = shallowCopy(args.pop());
                if (overrides.blockTag != null) {
                    blockTag = yield overrides.blockTag;
                }
                delete overrides.blockTag;
                args.push(overrides);
            }
            if (contract.deployTransaction != null) {
                yield contract._deployed(blockTag);
            }
            const tx = yield populateTransaction(contract, fragment, args);
            const result = yield signerOrProvider.call(tx, blockTag);
            try {
                let value = contract.interface.decodeFunctionResult(fragment, result);
                if (collapseSimple && fragment.outputs.length === 1) {
                    value = value[0];
                }
                return value;
            } catch (error) {
                if (error.code === Logger.errors.CALL_EXCEPTION) {
                    error.address = contract.address;
                    error.args = args;
                    error.transaction = tx;
                }
                throw error;
            }
        });
    };
}
function buildSend(contract, fragment) {
    return function (...args) {
        return __awaiter$3(this, void 0, void 0, function* () {
            if (!contract.signer) {
                logger$i.throwError(
                    "sending a transaction requires a signer",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "sendTransaction" }
                );
            }
            if (contract.deployTransaction != null) {
                yield contract._deployed();
            }
            const txRequest = yield populateTransaction(contract, fragment, args);
            const tx = yield contract.signer.sendTransaction(txRequest);
            const wait = tx.wait.bind(tx);
            tx.wait = (confirmations) => {
                return wait(confirmations).then((receipt) => {
                    receipt.events = receipt.logs.map((log) => {
                        let event = deepCopy(log);
                        let parsed = null;
                        try {
                            parsed = contract.interface.parseLog(log);
                        } catch (e) { }
                        if (parsed) {
                            event.args = parsed.args;
                            event.decode = (data, topics) => {
                                return contract.interface.decodeEventLog(
                                    parsed.eventFragment,
                                    data,
                                    topics
                                );
                            };
                            event.event = parsed.name;
                            event.eventSignature = parsed.signature;
                        }
                        event.removeListener = () => {
                            return contract.provider;
                        };
                        event.getBlock = () => {
                            return contract.provider.getBlock(receipt.blockHash);
                        };
                        event.getTransaction = () => {
                            return contract.provider.getTransaction(receipt.transactionHash);
                        };
                        event.getTransactionReceipt = () => {
                            return Promise.resolve(receipt);
                        };
                        return event;
                    });
                    return receipt;
                });
            };
            return tx;
        });
    };
}
function buildDefault(contract, fragment, collapseSimple) {
    if (fragment.constant) {
        return buildCall(contract, fragment, collapseSimple);
    }
    return buildSend(contract, fragment);
}
function getEventTag(filter) {
    if (filter.address && (filter.topics == null || filter.topics.length === 0)) {
        return "*";
    }
    return (
        (filter.address || "*") +
        "@" +
        (filter.topics
            ? filter.topics
                .map((topic) => {
                    if (Array.isArray(topic)) {
                        return topic.join("|");
                    }
                    return topic;
                })
                .join(":")
            : "")
    );
}
class RunningEvent {
    constructor(tag, filter) {
        defineReadOnly(this, "tag", tag);
        defineReadOnly(this, "filter", filter);
        this._listeners = [];
    }
    addListener(listener, once) {
        this._listeners.push({ listener: listener, once: once });
    }
    removeListener(listener) {
        let done = false;
        this._listeners = this._listeners.filter((item) => {
            if (done || item.listener !== listener) {
                return true;
            }
            done = true;
            return false;
        });
    }
    removeAllListeners() {
        this._listeners = [];
    }
    listeners() {
        return this._listeners.map((i) => i.listener);
    }
    listenerCount() {
        return this._listeners.length;
    }
    run(args) {
        const listenerCount = this.listenerCount();
        this._listeners = this._listeners.filter((item) => {
            const argsCopy = args.slice();
            setTimeout(() => {
                item.listener.apply(this, argsCopy);
            }, 0);
            return !item.once;
        });
        return listenerCount;
    }
    prepareEvent(event) { }
    getEmit(event) {
        return [event];
    }
}
class ErrorRunningEvent extends RunningEvent {
    constructor() {
        super("error", null);
    }
}
class FragmentRunningEvent extends RunningEvent {
    constructor(address, contractInterface, fragment, topics) {
        const filter = { address: address };
        let topic = contractInterface.getEventTopic(fragment);
        if (topics) {
            if (topic !== topics[0]) {
                logger$i.throwArgumentError("topic mismatch", "topics", topics);
            }
            filter.topics = topics.slice();
        } else {
            filter.topics = [topic];
        }
        super(getEventTag(filter), filter);
        defineReadOnly(this, "address", address);
        defineReadOnly(this, "interface", contractInterface);
        defineReadOnly(this, "fragment", fragment);
    }
    prepareEvent(event) {
        super.prepareEvent(event);
        event.event = this.fragment.name;
        event.eventSignature = this.fragment.format();
        event.decode = (data, topics) => {
            return this.interface.decodeEventLog(this.fragment, data, topics);
        };
        try {
            event.args = this.interface.decodeEventLog(
                this.fragment,
                event.data,
                event.topics
            );
        } catch (error) {
            event.args = null;
            event.decodeError = error;
        }
    }
    getEmit(event) {
        const errors = checkResultErrors(event.args);
        if (errors.length) {
            throw errors[0].error;
        }
        const args = (event.args || []).slice();
        args.push(event);
        return args;
    }
}
class WildcardRunningEvent extends RunningEvent {
    constructor(address, contractInterface) {
        super("*", { address: address });
        defineReadOnly(this, "address", address);
        defineReadOnly(this, "interface", contractInterface);
    }
    prepareEvent(event) {
        super.prepareEvent(event);
        try {
            const parsed = this.interface.parseLog(event);
            event.event = parsed.name;
            event.eventSignature = parsed.signature;
            event.decode = (data, topics) => {
                return this.interface.decodeEventLog(
                    parsed.eventFragment,
                    data,
                    topics
                );
            };
            event.args = parsed.args;
        } catch (error) { }
    }
}
class BaseContract {
    constructor(addressOrName, contractInterface, signerOrProvider) {
        logger$i.checkNew(new.target, Contract);
        defineReadOnly(
            this,
            "interface",
            getStatic(new.target, "getInterface")(contractInterface)
        );
        if (signerOrProvider == null) {
            defineReadOnly(this, "provider", null);
            defineReadOnly(this, "signer", null);
        } else if (Signer.isSigner(signerOrProvider)) {
            defineReadOnly(this, "provider", signerOrProvider.provider || null);
            defineReadOnly(this, "signer", signerOrProvider);
        } else if (Provider.isProvider(signerOrProvider)) {
            defineReadOnly(this, "provider", signerOrProvider);
            defineReadOnly(this, "signer", null);
        } else {
            logger$i.throwArgumentError(
                "invalid signer or provider",
                "signerOrProvider",
                signerOrProvider
            );
        }
        defineReadOnly(this, "callStatic", {});
        defineReadOnly(this, "estimateGas", {});
        defineReadOnly(this, "functions", {});
        defineReadOnly(this, "populateTransaction", {});
        defineReadOnly(this, "filters", {});
        {
            const uniqueFilters = {};
            Object.keys(this.interface.events).forEach((eventSignature) => {
                const event = this.interface.events[eventSignature];
                defineReadOnly(this.filters, eventSignature, (...args) => {
                    return {
                        address: this.address,
                        topics: this.interface.encodeFilterTopics(event, args),
                    };
                });
                if (!uniqueFilters[event.name]) {
                    uniqueFilters[event.name] = [];
                }
                uniqueFilters[event.name].push(eventSignature);
            });
            Object.keys(uniqueFilters).forEach((name) => {
                const filters = uniqueFilters[name];
                if (filters.length === 1) {
                    defineReadOnly(this.filters, name, this.filters[filters[0]]);
                } else {
                    logger$i.warn(
                        `Duplicate definition of ${name} (${filters.join(", ")})`
                    );
                }
            });
        }
        defineReadOnly(this, "_runningEvents", {});
        defineReadOnly(this, "_wrappedEmits", {});
        if (addressOrName == null) {
            logger$i.throwArgumentError(
                "invalid contract address or ENS name",
                "addressOrName",
                addressOrName
            );
        }
        defineReadOnly(this, "address", addressOrName);
        if (this.provider) {
            defineReadOnly(
                this,
                "resolvedAddress",
                resolveName(this.provider, addressOrName)
            );
        } else {
            try {
                defineReadOnly(
                    this,
                    "resolvedAddress",
                    Promise.resolve(getAddress(addressOrName))
                );
            } catch (error) {
                logger$i.throwError(
                    "provider is required to use ENS name as contract address",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "new Contract" }
                );
            }
        }
        const uniqueNames = {};
        const uniqueSignatures = {};
        Object.keys(this.interface.functions).forEach((signature) => {
            const fragment = this.interface.functions[signature];
            if (uniqueSignatures[signature]) {
                logger$i.warn(`Duplicate ABI entry for ${JSON.stringify(name)}`);
                return;
            }
            uniqueSignatures[signature] = true;
            {
                const name = fragment.name;
                if (!uniqueNames[name]) {
                    uniqueNames[name] = [];
                }
                uniqueNames[name].push(signature);
            }
            if (this[signature] == null) {
                defineReadOnly(this, signature, buildDefault(this, fragment, true));
            }
            if (this.functions[signature] == null) {
                defineReadOnly(
                    this.functions,
                    signature,
                    buildDefault(this, fragment, false)
                );
            }
            if (this.callStatic[signature] == null) {
                defineReadOnly(
                    this.callStatic,
                    signature,
                    buildCall(this, fragment, true)
                );
            }
            if (this.populateTransaction[signature] == null) {
                defineReadOnly(
                    this.populateTransaction,
                    signature,
                    buildPopulate(this, fragment)
                );
            }
            if (this.estimateGas[signature] == null) {
                defineReadOnly(
                    this.estimateGas,
                    signature,
                    buildEstimate(this, fragment)
                );
            }
        });
        Object.keys(uniqueNames).forEach((name) => {
            const signatures = uniqueNames[name];
            if (signatures.length > 1) {
                return;
            }
            const signature = signatures[0];
            try {
                if (this[name] == null) {
                    defineReadOnly(this, name, this[signature]);
                }
            } catch (e) { }
            if (this.functions[name] == null) {
                defineReadOnly(this.functions, name, this.functions[signature]);
            }
            if (this.callStatic[name] == null) {
                defineReadOnly(this.callStatic, name, this.callStatic[signature]);
            }
            if (this.populateTransaction[name] == null) {
                defineReadOnly(
                    this.populateTransaction,
                    name,
                    this.populateTransaction[signature]
                );
            }
            if (this.estimateGas[name] == null) {
                defineReadOnly(this.estimateGas, name, this.estimateGas[signature]);
            }
        });
    }
    static getContractAddress(transaction) {
        return getContractAddress(transaction);
    }
    static getInterface(contractInterface) {
        if (Interface.isInterface(contractInterface)) {
            return contractInterface;
        }
        return new Interface(contractInterface);
    }
    deployed() {
        return this._deployed();
    }
    _deployed(blockTag) {
        if (!this._deployedPromise) {
            if (this.deployTransaction) {
                this._deployedPromise = this.deployTransaction.wait().then(() => {
                    return this;
                });
            } else {
                this._deployedPromise = this.provider
                    .getCode(this.address, blockTag)
                    .then((code) => {
                        if (code === "0x") {
                            logger$i.throwError(
                                "contract not deployed",
                                Logger.errors.UNSUPPORTED_OPERATION,
                                { contractAddress: this.address, operation: "getDeployed" }
                            );
                        }
                        return this;
                    });
            }
        }
        return this._deployedPromise;
    }
    fallback(overrides) {
        if (!this.signer) {
            logger$i.throwError(
                "sending a transactions require a signer",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "sendTransaction(fallback)" }
            );
        }
        const tx = shallowCopy(overrides || {});
        ["from", "to"].forEach(function (key) {
            if (tx[key] == null) {
                return;
            }
            logger$i.throwError(
                "cannot override " + key,
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: key }
            );
        });
        tx.to = this.resolvedAddress;
        return this.deployed().then(() => {
            return this.signer.sendTransaction(tx);
        });
    }
    connect(signerOrProvider) {
        if (typeof signerOrProvider === "string") {
            signerOrProvider = new VoidSigner(signerOrProvider, this.provider);
        }
        const contract = new this.constructor(
            this.address,
            this.interface,
            signerOrProvider
        );
        if (this.deployTransaction) {
            defineReadOnly(contract, "deployTransaction", this.deployTransaction);
        }
        return contract;
    }
    attach(addressOrName) {
        return new this.constructor(
            addressOrName,
            this.interface,
            this.signer || this.provider
        );
    }
    static isIndexed(value) {
        return Indexed.isIndexed(value);
    }
    _normalizeRunningEvent(runningEvent) {
        if (this._runningEvents[runningEvent.tag]) {
            return this._runningEvents[runningEvent.tag];
        }
        return runningEvent;
    }
    _getRunningEvent(eventName) {
        if (typeof eventName === "string") {
            if (eventName === "error") {
                return this._normalizeRunningEvent(new ErrorRunningEvent());
            }
            if (eventName === "event") {
                return this._normalizeRunningEvent(new RunningEvent("event", null));
            }
            if (eventName === "*") {
                return this._normalizeRunningEvent(
                    new WildcardRunningEvent(this.address, this.interface)
                );
            }
            const fragment = this.interface.getEvent(eventName);
            return this._normalizeRunningEvent(
                new FragmentRunningEvent(this.address, this.interface, fragment)
            );
        }
        if (eventName.topics && eventName.topics.length > 0) {
            try {
                const topic = eventName.topics[0];
                if (typeof topic !== "string") {
                    throw new Error("invalid topic");
                }
                const fragment = this.interface.getEvent(topic);
                return this._normalizeRunningEvent(
                    new FragmentRunningEvent(
                        this.address,
                        this.interface,
                        fragment,
                        eventName.topics
                    )
                );
            } catch (error) { }
            const filter = { address: this.address, topics: eventName.topics };
            return this._normalizeRunningEvent(
                new RunningEvent(getEventTag(filter), filter)
            );
        }
        return this._normalizeRunningEvent(
            new WildcardRunningEvent(this.address, this.interface)
        );
    }
    _checkRunningEvents(runningEvent) {
        if (runningEvent.listenerCount() === 0) {
            delete this._runningEvents[runningEvent.tag];
            const emit = this._wrappedEmits[runningEvent.tag];
            if (emit && runningEvent.filter) {
                this.provider.off(runningEvent.filter, emit);
                delete this._wrappedEmits[runningEvent.tag];
            }
        }
    }
    _wrapEvent(runningEvent, log, listener) {
        const event = deepCopy(log);
        event.removeListener = () => {
            if (!listener) {
                return;
            }
            runningEvent.removeListener(listener);
            this._checkRunningEvents(runningEvent);
        };
        event.getBlock = () => {
            return this.provider.getBlock(log.blockHash);
        };
        event.getTransaction = () => {
            return this.provider.getTransaction(log.transactionHash);
        };
        event.getTransactionReceipt = () => {
            return this.provider.getTransactionReceipt(log.transactionHash);
        };
        runningEvent.prepareEvent(event);
        return event;
    }
    _addEventListener(runningEvent, listener, once) {
        if (!this.provider) {
            logger$i.throwError(
                "events require a provider or a signer with a provider",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "once" }
            );
        }
        runningEvent.addListener(listener, once);
        this._runningEvents[runningEvent.tag] = runningEvent;
        if (!this._wrappedEmits[runningEvent.tag]) {
            const wrappedEmit = (log) => {
                let event = this._wrapEvent(runningEvent, log, listener);
                if (event.decodeError == null) {
                    try {
                        const args = runningEvent.getEmit(event);
                        this.emit(runningEvent.filter, ...args);
                    } catch (error) {
                        event.decodeError = error.error;
                    }
                }
                if (runningEvent.filter != null) {
                    this.emit("event", event);
                }
                if (event.decodeError != null) {
                    this.emit("error", event.decodeError, event);
                }
            };
            this._wrappedEmits[runningEvent.tag] = wrappedEmit;
            if (runningEvent.filter != null) {
                this.provider.on(runningEvent.filter, wrappedEmit);
            }
        }
    }
    queryFilter(event, fromBlockOrBlockhash, toBlock) {
        const runningEvent = this._getRunningEvent(event);
        const filter = shallowCopy(runningEvent.filter);
        if (
            typeof fromBlockOrBlockhash === "string" &&
            isHexString(fromBlockOrBlockhash, 32)
        ) {
            if (toBlock != null) {
                logger$i.throwArgumentError(
                    "cannot specify toBlock with blockhash",
                    "toBlock",
                    toBlock
                );
            }
            filter.blockHash = fromBlockOrBlockhash;
        } else {
            filter.fromBlock =
                fromBlockOrBlockhash != null ? fromBlockOrBlockhash : 0;
            filter.toBlock = toBlock != null ? toBlock : "latest";
        }
        return this.provider.getLogs(filter).then((logs) => {
            return logs.map((log) => this._wrapEvent(runningEvent, log, null));
        });
    }
    on(event, listener) {
        this._addEventListener(this._getRunningEvent(event), listener, false);
        return this;
    }
    once(event, listener) {
        this._addEventListener(this._getRunningEvent(event), listener, true);
        return this;
    }
    emit(eventName, ...args) {
        if (!this.provider) {
            return false;
        }
        const runningEvent = this._getRunningEvent(eventName);
        const result = runningEvent.run(args) > 0;
        this._checkRunningEvents(runningEvent);
        return result;
    }
    listenerCount(eventName) {
        if (!this.provider) {
            return 0;
        }
        if (eventName == null) {
            return Object.keys(this._runningEvents).reduce((accum, key) => {
                return accum + this._runningEvents[key].listenerCount();
            }, 0);
        }
        return this._getRunningEvent(eventName).listenerCount();
    }
    listeners(eventName) {
        if (!this.provider) {
            return [];
        }
        if (eventName == null) {
            const result = [];
            for (let tag in this._runningEvents) {
                this._runningEvents[tag].listeners().forEach((listener) => {
                    result.push(listener);
                });
            }
            return result;
        }
        return this._getRunningEvent(eventName).listeners();
    }
    removeAllListeners(eventName) {
        if (!this.provider) {
            return this;
        }
        if (eventName == null) {
            for (const tag in this._runningEvents) {
                const runningEvent = this._runningEvents[tag];
                runningEvent.removeAllListeners();
                this._checkRunningEvents(runningEvent);
            }
            return this;
        }
        const runningEvent = this._getRunningEvent(eventName);
        runningEvent.removeAllListeners();
        this._checkRunningEvents(runningEvent);
        return this;
    }
    off(eventName, listener) {
        if (!this.provider) {
            return this;
        }
        const runningEvent = this._getRunningEvent(eventName);
        runningEvent.removeListener(listener);
        this._checkRunningEvents(runningEvent);
        return this;
    }
    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }
}
class Contract extends BaseContract { }
class ContractFactory {
    constructor(contractInterface, bytecode, signer) {
        let bytecodeHex = null;
        if (typeof bytecode === "string") {
            bytecodeHex = bytecode;
        } else if (isBytes(bytecode)) {
            bytecodeHex = hexlify(bytecode);
        } else if (bytecode && typeof bytecode.object === "string") {
            bytecodeHex = bytecode.object;
        } else {
            bytecodeHex = "!";
        }
        if (bytecodeHex.substring(0, 2) !== "0x") {
            bytecodeHex = "0x" + bytecodeHex;
        }
        if (!isHexString(bytecodeHex) || bytecodeHex.length % 2) {
            logger$i.throwArgumentError("invalid bytecode", "bytecode", bytecode);
        }
        if (signer && !Signer.isSigner(signer)) {
            logger$i.throwArgumentError("invalid signer", "signer", signer);
        }
        defineReadOnly(this, "bytecode", bytecodeHex);
        defineReadOnly(
            this,
            "interface",
            getStatic(new.target, "getInterface")(contractInterface)
        );
        defineReadOnly(this, "signer", signer || null);
    }
    getDeployTransaction(...args) {
        let tx = {};
        if (
            args.length === this.interface.deploy.inputs.length + 1 &&
            typeof args[args.length - 1] === "object"
        ) {
            tx = shallowCopy(args.pop());
            for (const key in tx) {
                if (!allowedTransactionKeys$2[key]) {
                    throw new Error("unknown transaction override " + key);
                }
            }
        }
        ["data", "from", "to"].forEach((key) => {
            if (tx[key] == null) {
                return;
            }
            logger$i.throwError(
                "cannot override " + key,
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: key }
            );
        });
        logger$i.checkArgumentCount(
            args.length,
            this.interface.deploy.inputs.length,
            " in Contract constructor"
        );
        tx.data = hexlify(
            concat([this.bytecode, this.interface.encodeDeploy(args)])
        );
        return tx;
    }
    deploy(...args) {
        return __awaiter$3(this, void 0, void 0, function* () {
            let overrides = {};
            if (args.length === this.interface.deploy.inputs.length + 1) {
                overrides = args.pop();
            }
            logger$i.checkArgumentCount(
                args.length,
                this.interface.deploy.inputs.length,
                " in Contract constructor"
            );
            const params = yield resolveAddresses(
                this.signer,
                args,
                this.interface.deploy.inputs
            );
            params.push(overrides);
            const unsignedTx = this.getDeployTransaction(...params);
            const tx = yield this.signer.sendTransaction(unsignedTx);
            const address = getStatic(this.constructor, "getContractAddress")(tx);
            const contract = getStatic(this.constructor, "getContract")(
                address,
                this.interface,
                this.signer
            );
            defineReadOnly(contract, "deployTransaction", tx);
            return contract;
        });
    }
    attach(address) {
        return this.constructor.getContract(address, this.interface, this.signer);
    }
    connect(signer) {
        return new this.constructor(this.interface, this.bytecode, signer);
    }
    static fromSolidity(compilerOutput, signer) {
        if (compilerOutput == null) {
            logger$i.throwError(
                "missing compiler output",
                Logger.errors.MISSING_ARGUMENT,
                { argument: "compilerOutput" }
            );
        }
        if (typeof compilerOutput === "string") {
            compilerOutput = JSON.parse(compilerOutput);
        }
        const abi = compilerOutput.abi;
        let bytecode = null;
        if (compilerOutput.bytecode) {
            bytecode = compilerOutput.bytecode;
        } else if (compilerOutput.evm && compilerOutput.evm.bytecode) {
            bytecode = compilerOutput.evm.bytecode;
        }
        return new this(abi, bytecode, signer);
    }
    static getInterface(contractInterface) {
        return Contract.getInterface(contractInterface);
    }
    static getContractAddress(tx) {
        return getContractAddress(tx);
    }
    static getContract(address, contractInterface, signer) {
        return new Contract(address, contractInterface, signer);
    }
}
class BaseX {
    constructor(alphabet) {
        defineReadOnly(this, "alphabet", alphabet);
        defineReadOnly(this, "base", alphabet.length);
        defineReadOnly(this, "_alphabetMap", {});
        defineReadOnly(this, "_leader", alphabet.charAt(0));
        for (let i = 0; i < alphabet.length; i++) {
            this._alphabetMap[alphabet.charAt(i)] = i;
        }
    }
    encode(value) {
        let source = arrayify(value);
        if (source.length === 0) {
            return "";
        }
        let digits = [0];
        for (let i = 0; i < source.length; ++i) {
            let carry = source[i];
            for (let j = 0; j < digits.length; ++j) {
                carry += digits[j] << 8;
                digits[j] = carry % this.base;
                carry = (carry / this.base) | 0;
            }
            while (carry > 0) {
                digits.push(carry % this.base);
                carry = (carry / this.base) | 0;
            }
        }
        let string = "";
        for (let k = 0; source[k] === 0 && k < source.length - 1; ++k) {
            string += this._leader;
        }
        for (let q = digits.length - 1; q >= 0; --q) {
            string += this.alphabet[digits[q]];
        }
        return string;
    }
    decode(value) {
        if (typeof value !== "string") {
            throw new TypeError("Expected String");
        }
        let bytes = [];
        if (value.length === 0) {
            return new Uint8Array(bytes);
        }
        bytes.push(0);
        for (let i = 0; i < value.length; i++) {
            let byte = this._alphabetMap[value[i]];
            if (byte === undefined) {
                throw new Error("Non-base" + this.base + " character");
            }
            let carry = byte;
            for (let j = 0; j < bytes.length; ++j) {
                carry += bytes[j] * this.base;
                bytes[j] = carry & 255;
                carry >>= 8;
            }
            while (carry > 0) {
                bytes.push(carry & 255);
                carry >>= 8;
            }
        }
        for (let k = 0; value[k] === this._leader && k < value.length - 1; ++k) {
            bytes.push(0);
        }
        return arrayify(new Uint8Array(bytes.reverse()));
    }
}
const Base32 = new BaseX("abcdefghijklmnopqrstuvwxyz234567");
const Base58 = new BaseX(
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);
var SupportedAlgorithm;
(function (SupportedAlgorithm) {
    SupportedAlgorithm["sha256"] = "sha256";
    SupportedAlgorithm["sha512"] = "sha512";
})(SupportedAlgorithm || (SupportedAlgorithm = {}));
const version$e = "sha2/5.1.0";
("use strict");
const logger$j = new Logger(version$e);
function ripemd160$1(data) {
    return "0x" + hash_1.ripemd160().update(arrayify(data)).digest("hex");
}
function sha256$1(data) {
    return "0x" + hash_1.sha256().update(arrayify(data)).digest("hex");
}
function sha512$1(data) {
    return "0x" + hash_1.sha512().update(arrayify(data)).digest("hex");
}
function computeHmac(algorithm, key, data) {
    if (!SupportedAlgorithm[algorithm]) {
        logger$j.throwError(
            "unsupported algorithm " + algorithm,
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "hmac", algorithm: algorithm }
        );
    }
    return (
        "0x" +
        hash_1
            .hmac(hash_1[algorithm], arrayify(key))
            .update(arrayify(data))
            .digest("hex")
    );
}
("use strict");
function pbkdf2(password, salt, iterations, keylen, hashAlgorithm) {
    password = arrayify(password);
    salt = arrayify(salt);
    let hLen;
    let l = 1;
    const DK = new Uint8Array(keylen);
    const block1 = new Uint8Array(salt.length + 4);
    block1.set(salt);
    let r;
    let T;
    for (let i = 1; i <= l; i++) {
        block1[salt.length] = (i >> 24) & 255;
        block1[salt.length + 1] = (i >> 16) & 255;
        block1[salt.length + 2] = (i >> 8) & 255;
        block1[salt.length + 3] = i & 255;
        let U = arrayify(computeHmac(hashAlgorithm, password, block1));
        if (!hLen) {
            hLen = U.length;
            T = new Uint8Array(hLen);
            l = Math.ceil(keylen / hLen);
            r = keylen - (l - 1) * hLen;
        }
        T.set(U);
        for (let j = 1; j < iterations; j++) {
            U = arrayify(computeHmac(hashAlgorithm, password, U));
            for (let k = 0; k < hLen; k++) T[k] ^= U[k];
        }
        const destPos = (i - 1) * hLen;
        const len = i === l ? r : hLen;
        DK.set(arrayify(T).slice(0, len), destPos);
    }
    return hexlify(DK);
}
const version$f = "wordlists/5.1.0";
("use strict");
const exportWordlist = false;
const logger$k = new Logger(version$f);
class Wordlist {
    constructor(locale) {
        logger$k.checkAbstract(new.target, Wordlist);
        defineReadOnly(this, "locale", locale);
    }
    split(mnemonic) {
        return mnemonic.toLowerCase().split(/ +/g);
    }
    join(words) {
        return words.join(" ");
    }
    static check(wordlist) {
        const words = [];
        for (let i = 0; i < 2048; i++) {
            const word = wordlist.getWord(i);
            if (i !== wordlist.getWordIndex(word)) {
                return "0x";
            }
            words.push(word);
        }
        return id(words.join("\n") + "\n");
    }
    static register(lang, name) {
        if (!name) {
            name = lang.locale;
        }
        if (exportWordlist) {
            try {
                const anyGlobal = window;
                if (anyGlobal._ethers && anyGlobal._ethers.wordlists) {
                    if (!anyGlobal._ethers.wordlists[name]) {
                        defineReadOnly(anyGlobal._ethers.wordlists, name, lang);
                    }
                }
            } catch (error) { }
        }
    }
}
("use strict");
const words =
    "AbdikaceAbecedaAdresaAgreseAkceAktovkaAlejAlkoholAmputaceAnanasAndulkaAnekdotaAnketaAntikaAnulovatArchaAroganceAsfaltAsistentAspiraceAstmaAstronomAtlasAtletikaAtolAutobusAzylBabkaBachorBacilBaculkaBadatelBagetaBagrBahnoBakterieBaladaBaletkaBalkonBalonekBalvanBalzaBambusBankomatBarbarBaretBarmanBarokoBarvaBaterkaBatohBavlnaBazalkaBazilikaBazukaBednaBeranBesedaBestieBetonBezinkaBezmocBeztakBicyklBidloBiftekBikinyBilanceBiografBiologBitvaBizonBlahobytBlatouchBlechaBleduleBleskBlikatBliznaBlokovatBlouditBludBobekBobrBodlinaBodnoutBohatostBojkotBojovatBokorysBolestBorecBoroviceBotaBoubelBouchatBoudaBouleBouratBoxerBradavkaBramboraBrankaBratrBreptaBriketaBrkoBrlohBronzBroskevBrunetkaBrusinkaBrzdaBrzyBublinaBubnovatBuchtaBuditelBudkaBudovaBufetBujarostBukviceBuldokBulvaBundaBunkrBurzaButikBuvolBuzolaBydletBylinaBytovkaBzukotCapartCarevnaCedrCeduleCejchCejnCelaCelerCelkemCelniceCeninaCennostCenovkaCentrumCenzorCestopisCetkaChalupaChapadloCharitaChataChechtatChemieChichotChirurgChladChlebaChlubitChmelChmuraChobotChocholChodbaCholeraChomoutChopitChorobaChovChrapotChrlitChrtChrupChtivostChudinaChutnatChvatChvilkaChvostChybaChystatChytitCibuleCigaretaCihelnaCihlaCinkotCirkusCisternaCitaceCitrusCizinecCizostClonaCokolivCouvatCtitelCtnostCudnostCuketaCukrCupotCvaknoutCvalCvikCvrkotCyklistaDalekoDarebaDatelDatumDceraDebataDechovkaDecibelDeficitDeflaceDeklDekretDemokratDepreseDerbyDeskaDetektivDikobrazDiktovatDiodaDiplomDiskDisplejDivadloDivochDlahaDlouhoDluhopisDnesDobroDobytekDocentDochutitDodnesDohledDohodaDohraDojemDojniceDokladDokolaDoktorDokumentDolarDolevaDolinaDomaDominantDomluvitDomovDonutitDopadDopisDoplnitDoposudDoprovodDopustitDorazitDorostDortDosahDoslovDostatekDosudDosytaDotazDotekDotknoutDoufatDoutnatDovozceDozaduDoznatDozorceDrahotaDrakDramatikDravecDrazeDrdolDrobnostDrogerieDrozdDrsnostDrtitDrzostDubenDuchovnoDudekDuhaDuhovkaDusitDusnoDutostDvojiceDvorecDynamitEkologEkonomieElektronElipsaEmailEmiseEmoceEmpatieEpizodaEpochaEpopejEposEsejEsenceEskortaEskymoEtiketaEuforieEvoluceExekuceExkurzeExpediceExplozeExportExtraktFackaFajfkaFakultaFanatikFantazieFarmacieFavoritFazoleFederaceFejetonFenkaFialkaFigurantFilozofFiltrFinanceFintaFixaceFjordFlanelFlirtFlotilaFondFosforFotbalFotkaFotonFrakceFreskaFrontaFukarFunkceFyzikaGalejeGarantGenetikaGeologGilotinaGlazuraGlejtGolemGolfistaGotikaGrafGramofonGranuleGrepGrilGrogGroteskaGumaHadiceHadrHalaHalenkaHanbaHanopisHarfaHarpunaHavranHebkostHejkalHejnoHejtmanHektarHelmaHematomHerecHernaHesloHezkyHistorikHladovkaHlasivkyHlavaHledatHlenHlodavecHlohHloupostHltatHlubinaHluchotaHmatHmotaHmyzHnisHnojivoHnoutHoblinaHobojHochHodinyHodlatHodnotaHodovatHojnostHokejHolinkaHolkaHolubHomoleHonitbaHonoraceHoralHordaHorizontHorkoHorlivecHormonHorninaHoroskopHorstvoHospodaHostinaHotovostHoubaHoufHoupatHouskaHovorHradbaHraniceHravostHrazdaHrbolekHrdinaHrdloHrdostHrnekHrobkaHromadaHrotHroudaHrozenHrstkaHrubostHryzatHubenostHubnoutHudbaHukotHumrHusitaHustotaHvozdHybnostHydrantHygienaHymnaHysterikIdylkaIhnedIkonaIluzeImunitaInfekceInflaceInkasoInovaceInspekceInternetInvalidaInvestorInzerceIronieJablkoJachtaJahodaJakmileJakostJalovecJantarJarmarkJaroJasanJasnoJatkaJavorJazykJedinecJedleJednatelJehlanJekotJelenJelitoJemnostJenomJepiceJeseterJevitJezdecJezeroJinakJindyJinochJiskraJistotaJitrniceJizvaJmenovatJogurtJurtaKabaretKabelKabinetKachnaKadetKadidloKahanKajakKajutaKakaoKaktusKalamitaKalhotyKalibrKalnostKameraKamkolivKamnaKanibalKanoeKantorKapalinaKapelaKapitolaKapkaKapleKapotaKaprKapustaKapybaraKaramelKarotkaKartonKasaKatalogKatedraKauceKauzaKavalecKazajkaKazetaKazivostKdekolivKdesiKedlubenKempKeramikaKinoKlacekKladivoKlamKlapotKlasikaKlaunKlecKlenbaKlepatKlesnoutKlidKlimaKlisnaKloboukKlokanKlopaKloubKlubovnaKlusatKluzkostKmenKmitatKmotrKnihaKnotKoaliceKoberecKobkaKoblihaKobylaKocourKohoutKojenecKokosKoktejlKolapsKoledaKolizeKoloKomandoKometaKomikKomnataKomoraKompasKomunitaKonatKonceptKondiceKonecKonfeseKongresKoninaKonkursKontaktKonzervaKopanecKopieKopnoutKoprovkaKorbelKorektorKormidloKoroptevKorpusKorunaKorytoKorzetKosatecKostkaKotelKotletaKotoulKoukatKoupelnaKousekKouzloKovbojKozaKozorohKrabiceKrachKrajinaKralovatKrasopisKravataKreditKrejcarKresbaKrevetaKriketKritikKrizeKrkavecKrmelecKrmivoKrocanKrokKronikaKropitKroupaKrovkaKrtekKruhadloKrupiceKrutostKrvinkaKrychleKryptaKrystalKrytKudlankaKufrKujnostKuklaKulajdaKulichKulkaKulometKulturaKunaKupodivuKurtKurzorKutilKvalitaKvasinkaKvestorKynologKyselinaKytaraKyticeKytkaKytovecKyvadloLabradorLachtanLadnostLaikLakomecLamelaLampaLanovkaLasiceLasoLasturaLatinkaLavinaLebkaLeckdyLedenLedniceLedovkaLedvinaLegendaLegieLegraceLehceLehkostLehnoutLektvarLenochodLentilkaLepenkaLepidloLetadloLetecLetmoLetokruhLevhartLevitaceLevobokLibraLichotkaLidojedLidskostLihovinaLijavecLilekLimetkaLinieLinkaLinoleumListopadLitinaLitovatLobistaLodivodLogikaLogopedLokalitaLoketLomcovatLopataLopuchLordLososLotrLoudalLouhLoukaLouskatLovecLstivostLucernaLuciferLumpLuskLustraceLviceLyraLyrikaLysinaMadamMadloMagistrMahagonMajetekMajitelMajoritaMakakMakoviceMakrelaMalbaMalinaMalovatMalviceMaminkaMandleMankoMarnostMasakrMaskotMasopustMaticeMatrikaMaturitaMazanecMazivoMazlitMazurkaMdlobaMechanikMeditaceMedovinaMelasaMelounMentolkaMetlaMetodaMetrMezeraMigraceMihnoutMihuleMikinaMikrofonMilenecMilimetrMilostMimikaMincovnaMinibarMinometMinulostMiskaMistrMixovatMladostMlhaMlhovinaMlokMlsatMluvitMnichMnohemMobilMocnostModelkaModlitbaMohylaMokroMolekulaMomentkaMonarchaMonoklMonstrumMontovatMonzunMosazMoskytMostMotivaceMotorkaMotykaMouchaMoudrostMozaikaMozekMozolMramorMravenecMrkevMrtvolaMrzetMrzutostMstitelMudrcMuflonMulatMumieMuniceMusetMutaceMuzeumMuzikantMyslivecMzdaNabouratNachytatNadaceNadbytekNadhozNadobroNadpisNahlasNahnatNahodileNahraditNaivitaNajednouNajistoNajmoutNaklonitNakonecNakrmitNalevoNamazatNamluvitNanometrNaokoNaopakNaostroNapadatNapevnoNaplnitNapnoutNaposledNaprostoNaroditNarubyNarychloNasaditNasekatNaslepoNastatNatolikNavenekNavrchNavzdoryNazvatNebeNechatNeckyNedalekoNedbatNeduhNegaceNehetNehodaNejenNejprveNeklidNelibostNemilostNemocNeochotaNeonkaNepokojNerostNervNesmyslNesouladNetvorNeuronNevinaNezvykleNicotaNijakNikamNikdyNiklNikterakNitroNoclehNohaviceNominaceNoraNorekNositelNosnostNouzeNovinyNovotaNozdraNudaNudleNugetNutitNutnostNutrieNymfaObalObarvitObavaObdivObecObehnatObejmoutObezitaObhajobaObilniceObjasnitObjektObklopitOblastOblekOblibaOblohaObludaObnosObohatitObojekOboutObrazecObrnaObrubaObrysObsahObsluhaObstaratObuvObvazObvinitObvodObvykleObyvatelObzorOcasOcelOcenitOchladitOchotaOchranaOcitnoutOdbojOdbytOdchodOdcizitOdebratOdeslatOdevzdatOdezvaOdhadceOdhoditOdjetOdjinudOdkazOdkoupitOdlivOdlukaOdmlkaOdolnostOdpadOdpisOdploutOdporOdpustitOdpykatOdrazkaOdsouditOdstupOdsunOdtokOdtudOdvahaOdvetaOdvolatOdvracetOdznakOfinaOfsajdOhlasOhniskoOhradaOhrozitOhryzekOkapOkeniceOklikaOknoOkouzlitOkovyOkrasaOkresOkrsekOkruhOkupantOkurkaOkusitOlejninaOlizovatOmakOmeletaOmezitOmladinaOmlouvatOmluvaOmylOnehdyOpakovatOpasekOperaceOpiceOpilostOpisovatOporaOpoziceOpravduOprotiOrbitalOrchestrOrgieOrliceOrlojOrtelOsadaOschnoutOsikaOsivoOslavaOslepitOslnitOslovitOsnovaOsobaOsolitOspalecOstenOstrahaOstudaOstychOsvojitOteplitOtiskOtopOtrhatOtrlostOtrokOtrubyOtvorOvanoutOvarOvesOvlivnitOvoceOxidOzdobaPachatelPacientPadouchPahorekPaktPalandaPalecPalivoPalubaPamfletPamlsekPanenkaPanikaPannaPanovatPanstvoPantoflePaprikaParketaParodiePartaParukaParybaPasekaPasivitaPastelkaPatentPatronaPavoukPaznehtPazourekPeckaPedagogPejsekPekloPelotonPenaltaPendrekPenzePeriskopPeroPestrostPetardaPeticePetrolejPevninaPexesoPianistaPihaPijavicePiklePiknikPilinaPilnostPilulkaPinzetaPipetaPisatelPistolePitevnaPivnicePivovarPlacentaPlakatPlamenPlanetaPlastikaPlatitPlavidloPlazPlechPlemenoPlentaPlesPletivoPlevelPlivatPlnitPlnoPlochaPlodinaPlombaPloutPlukPlynPobavitPobytPochodPocitPoctivecPodatPodcenitPodepsatPodhledPodivitPodkladPodmanitPodnikPodobaPodporaPodrazPodstataPodvodPodzimPoeziePohankaPohnutkaPohovorPohromaPohybPointaPojistkaPojmoutPokazitPoklesPokojPokrokPokutaPokynPolednePolibekPolknoutPolohaPolynomPomaluPominoutPomlkaPomocPomstaPomysletPonechatPonorkaPonurostPopadatPopelPopisekPoplachPoprositPopsatPopudPoradcePorcePorodPoruchaPoryvPosaditPosedPosilaPoskokPoslanecPosouditPospoluPostavaPosudekPosypPotahPotkanPotleskPotomekPotravaPotupaPotvoraPoukazPoutoPouzdroPovahaPovidlaPovlakPovozPovrchPovstatPovykPovzdechPozdravPozemekPoznatekPozorPozvatPracovatPrahoryPraktikaPralesPraotecPraporekPrasePravdaPrincipPrknoProbuditProcentoProdejProfeseProhraProjektProlomitPromilePronikatPropadProrokProsbaProtonProutekProvazPrskavkaPrstenPrudkostPrutPrvekPrvohoryPsanecPsovodPstruhPtactvoPubertaPuchPudlPukavecPuklinaPukrlePultPumpaPuncPupenPusaPusinkaPustinaPutovatPutykaPyramidaPyskPytelRacekRachotRadiaceRadniceRadonRaftRagbyRaketaRakovinaRamenoRampouchRandeRarachRaritaRasovnaRastrRatolestRazanceRazidloReagovatReakceReceptRedaktorReferentReflexRejnokReklamaRekordRekrutRektorReputaceRevizeRevmaRevolverRezervaRiskovatRizikoRobotikaRodokmenRohovkaRokleRokokoRomanetoRopovodRopuchaRorejsRosolRostlinaRotmistrRotopedRotundaRoubenkaRouchoRoupRouraRovinaRovniceRozborRozchodRozdatRozeznatRozhodceRozinkaRozjezdRozkazRozlohaRozmarRozpadRozruchRozsahRoztokRozumRozvodRubrikaRuchadloRukaviceRukopisRybaRybolovRychlostRydloRypadloRytinaRyzostSadistaSahatSakoSamecSamizdatSamotaSanitkaSardinkaSasankaSatelitSazbaSazeniceSborSchovatSebrankaSeceseSedadloSedimentSedloSehnatSejmoutSekeraSektaSekundaSekvojeSemenoSenoServisSesaditSeshoraSeskokSeslatSestraSesuvSesypatSetbaSetinaSetkatSetnoutSetrvatSeverSeznamShodaShrnoutSifonSilniceSirkaSirotekSirupSituaceSkafandrSkaliskoSkanzenSkautSkeptikSkicaSkladbaSkleniceSkloSkluzSkobaSkokanSkoroSkriptaSkrzSkupinaSkvostSkvrnaSlabikaSladidloSlaninaSlastSlavnostSledovatSlepecSlevaSlezinaSlibSlinaSlizniceSlonSloupekSlovoSluchSluhaSlunceSlupkaSlzaSmaragdSmetanaSmilstvoSmlouvaSmogSmradSmrkSmrtkaSmutekSmyslSnadSnahaSnobSobotaSochaSodovkaSokolSopkaSotvaSoubojSoucitSoudceSouhlasSouladSoumrakSoupravaSousedSoutokSouvisetSpalovnaSpasitelSpisSplavSpodekSpojenecSpoluSponzorSpornostSpoustaSprchaSpustitSrandaSrazSrdceSrnaSrnecSrovnatSrpenSrstSrubStaniceStarostaStatikaStavbaStehnoStezkaStodolaStolekStopaStornoStoupatStrachStresStrhnoutStromStrunaStudnaStupniceStvolStykSubjektSubtropySucharSudostSuknoSundatSunoutSurikataSurovinaSvahSvalstvoSvetrSvatbaSvazekSvisleSvitekSvobodaSvodidloSvorkaSvrabSykavkaSykotSynekSynovecSypatSypkostSyrovostSyselSytostTabletkaTabuleTahounTajemnoTajfunTajgaTajitTajnostTaktikaTamhleTamponTancovatTanecTankerTapetaTaveninaTazatelTechnikaTehdyTekutinaTelefonTemnotaTendenceTenistaTenorTeplotaTepnaTeprveTerapieTermoskaTextilTichoTiskopisTitulekTkadlecTkaninaTlapkaTleskatTlukotTlupaTmelToaletaTopinkaTopolTorzoTouhaToulecTradiceTraktorTrampTrasaTraverzaTrefitTrestTrezorTrhavinaTrhlinaTrochuTrojiceTroskaTroubaTrpceTrpitelTrpkostTrubecTruchlitTruhliceTrusTrvatTudyTuhnoutTuhostTundraTuristaTurnajTuzemskoTvarohTvorbaTvrdostTvrzTygrTykevUbohostUbozeUbratUbrousekUbrusUbytovnaUchoUctivostUdivitUhraditUjednatUjistitUjmoutUkazatelUklidnitUklonitUkotvitUkrojitUliceUlitaUlovitUmyvadloUnavitUniformaUniknoutUpadnoutUplatnitUplynoutUpoutatUpravitUranUrazitUsednoutUsilovatUsmrtitUsnadnitUsnoutUsouditUstlatUstrnoutUtahovatUtkatUtlumitUtonoutUtopenecUtrousitUvalitUvolnitUvozovkaUzdravitUzelUzeninaUzlinaUznatVagonValchaValounVanaVandalVanilkaVaranVarhanyVarovatVcelkuVchodVdovaVedroVegetaceVejceVelbloudVeletrhVelitelVelmocVelrybaVenkovVerandaVerzeVeselkaVeskrzeVesniceVespoduVestaVeterinaVeverkaVibraceVichrVideohraVidinaVidleVilaViniceVisetVitalitaVizeVizitkaVjezdVkladVkusVlajkaVlakVlasecVlevoVlhkostVlivVlnovkaVloupatVnucovatVnukVodaVodivostVodoznakVodstvoVojenskyVojnaVojskoVolantVolbaVolitVolnoVoskovkaVozidloVozovnaVpravoVrabecVracetVrahVrataVrbaVrcholekVrhatVrstvaVrtuleVsaditVstoupitVstupVtipVybavitVybratVychovatVydatVydraVyfotitVyhledatVyhnoutVyhoditVyhraditVyhubitVyjasnitVyjetVyjmoutVyklopitVykonatVylekatVymazatVymezitVymizetVymysletVynechatVynikatVynutitVypadatVyplatitVypravitVypustitVyrazitVyrovnatVyrvatVyslovitVysokoVystavitVysunoutVysypatVytasitVytesatVytratitVyvinoutVyvolatVyvrhelVyzdobitVyznatVzaduVzbuditVzchopitVzdorVzduchVzdychatVzestupVzhledemVzkazVzlykatVznikVzorekVzpouraVztahVztekXylofonZabratZabydletZachovatZadarmoZadusitZafoukatZahltitZahoditZahradaZahynoutZajatecZajetZajistitZaklepatZakoupitZalepitZamezitZamotatZamysletZanechatZanikatZaplatitZapojitZapsatZarazitZastavitZasunoutZatajitZatemnitZatknoutZaujmoutZavalitZaveletZavinitZavolatZavrtatZazvonitZbavitZbrusuZbudovatZbytekZdalekaZdarmaZdatnostZdivoZdobitZdrojZdvihZdymadloZeleninaZemanZeminaZeptatZezaduZezdolaZhatitZhltnoutZhlubokaZhotovitZhrubaZimaZimniceZjemnitZklamatZkoumatZkratkaZkumavkaZlatoZlehkaZlobaZlomZlostZlozvykZmapovatZmarZmatekZmijeZmizetZmocnitZmodratZmrzlinaZmutovatZnakZnalostZnamenatZnovuZobrazitZotavitZoubekZoufaleZploditZpomalitZpravaZprostitZprudkaZprvuZradaZranitZrcadloZrnitostZrnoZrovnaZrychlitZrzavostZtichaZtratitZubovinaZubrZvednoutZvenkuZveselaZvonZvratZvukovodZvyk";
let wordlist = null;
function loadWords(lang) {
    if (wordlist != null) {
        return;
    }
    wordlist = words
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .substring(1)
        .split(" ");
    if (
        Wordlist.check(lang) !==
        "0x25f44555f4af25b51a711136e1c7d6e50ce9f8917d39d6b1f076b2bb4d2fac1a"
    ) {
        wordlist = null;
        throw new Error("BIP39 Wordlist for en (English) FAILED");
    }
}
class LangCz extends Wordlist {
    constructor() {
        super("cz");
    }
    getWord(index) {
        loadWords(this);
        return wordlist[index];
    }
    getWordIndex(word) {
        loadWords(this);
        return wordlist.indexOf(word);
    }
}
const langCz = new LangCz();
Wordlist.register(langCz);
("use strict");
const words$1 =
    "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo";
let wordlist$1 = null;
function loadWords$1(lang) {
    if (wordlist$1 != null) {
        return;
    }
    wordlist$1 = words$1
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .substring(1)
        .split(" ");
    if (
        Wordlist.check(lang) !==
        "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60"
    ) {
        wordlist$1 = null;
        throw new Error("BIP39 Wordlist for en (English) FAILED");
    }
}
class LangEn extends Wordlist {
    constructor() {
        super("en");
    }
    getWord(index) {
        loadWords$1(this);
        return wordlist$1[index];
    }
    getWordIndex(word) {
        loadWords$1(this);
        return wordlist$1.indexOf(word);
    }
}
const langEn = new LangEn();
Wordlist.register(langEn);
("use strict");
const words$2 =
    "A/bacoAbdomenAbejaAbiertoAbogadoAbonoAbortoAbrazoAbrirAbueloAbusoAcabarAcademiaAccesoAccio/nAceiteAcelgaAcentoAceptarA/cidoAclararAcne/AcogerAcosoActivoActoActrizActuarAcudirAcuerdoAcusarAdictoAdmitirAdoptarAdornoAduanaAdultoAe/reoAfectarAficio/nAfinarAfirmarA/gilAgitarAgoni/aAgostoAgotarAgregarAgrioAguaAgudoA/guilaAgujaAhogoAhorroAireAislarAjedrezAjenoAjusteAlacra/nAlambreAlarmaAlbaA/lbumAlcaldeAldeaAlegreAlejarAlertaAletaAlfilerAlgaAlgodo/nAliadoAlientoAlivioAlmaAlmejaAlmi/barAltarAltezaAltivoAltoAlturaAlumnoAlzarAmableAmanteAmapolaAmargoAmasarA/mbarA/mbitoAmenoAmigoAmistadAmorAmparoAmplioAnchoAncianoAnclaAndarAnde/nAnemiaA/nguloAnilloA/nimoAni/sAnotarAntenaAntiguoAntojoAnualAnularAnuncioA~adirA~ejoA~oApagarAparatoApetitoApioAplicarApodoAporteApoyoAprenderAprobarApuestaApuroAradoAra~aArarA/rbitroA/rbolArbustoArchivoArcoArderArdillaArduoA/reaA/ridoAriesArmoni/aArne/sAromaArpaArpo/nArregloArrozArrugaArteArtistaAsaAsadoAsaltoAscensoAsegurarAseoAsesorAsientoAsiloAsistirAsnoAsombroA/speroAstillaAstroAstutoAsumirAsuntoAtajoAtaqueAtarAtentoAteoA/ticoAtletaA/tomoAtraerAtrozAtu/nAudazAudioAugeAulaAumentoAusenteAutorAvalAvanceAvaroAveAvellanaAvenaAvestruzAvio/nAvisoAyerAyudaAyunoAzafra/nAzarAzoteAzu/carAzufreAzulBabaBaborBacheBahi/aBaileBajarBalanzaBalco/nBaldeBambu/BancoBandaBa~oBarbaBarcoBarnizBarroBa/sculaBasto/nBasuraBatallaBateri/aBatirBatutaBau/lBazarBebe/BebidaBelloBesarBesoBestiaBichoBienBingoBlancoBloqueBlusaBoaBobinaBoboBocaBocinaBodaBodegaBoinaBolaBoleroBolsaBombaBondadBonitoBonoBonsa/iBordeBorrarBosqueBoteBoti/nBo/vedaBozalBravoBrazoBrechaBreveBrilloBrincoBrisaBrocaBromaBronceBroteBrujaBruscoBrutoBuceoBucleBuenoBueyBufandaBufo/nBu/hoBuitreBultoBurbujaBurlaBurroBuscarButacaBuzo/nCaballoCabezaCabinaCabraCacaoCada/verCadenaCaerCafe/Cai/daCaima/nCajaCajo/nCalCalamarCalcioCaldoCalidadCalleCalmaCalorCalvoCamaCambioCamelloCaminoCampoCa/ncerCandilCanelaCanguroCanicaCantoCa~aCa~o/nCaobaCaosCapazCapita/nCapoteCaptarCapuchaCaraCarbo/nCa/rcelCaretaCargaCari~oCarneCarpetaCarroCartaCasaCascoCaseroCaspaCastorCatorceCatreCaudalCausaCazoCebollaCederCedroCeldaCe/lebreCelosoCe/lulaCementoCenizaCentroCercaCerdoCerezaCeroCerrarCertezaCe/spedCetroChacalChalecoChampu/ChanclaChapaCharlaChicoChisteChivoChoqueChozaChuletaChuparCiclo/nCiegoCieloCienCiertoCifraCigarroCimaCincoCineCintaCipre/sCircoCiruelaCisneCitaCiudadClamorClanClaroClaseClaveClienteClimaCli/nicaCobreCoccio/nCochinoCocinaCocoCo/digoCodoCofreCogerCoheteCoji/nCojoColaColchaColegioColgarColinaCollarColmoColumnaCombateComerComidaCo/modoCompraCondeConejoCongaConocerConsejoContarCopaCopiaCorazo/nCorbataCorchoCordo/nCoronaCorrerCoserCosmosCostaCra/neoCra/terCrearCrecerCrei/doCremaCri/aCrimenCriptaCrisisCromoCro/nicaCroquetaCrudoCruzCuadroCuartoCuatroCuboCubrirCucharaCuelloCuentoCuerdaCuestaCuevaCuidarCulebraCulpaCultoCumbreCumplirCunaCunetaCuotaCupo/nCu/pulaCurarCuriosoCursoCurvaCutisDamaDanzaDarDardoDa/tilDeberDe/bilDe/cadaDecirDedoDefensaDefinirDejarDelfi/nDelgadoDelitoDemoraDensoDentalDeporteDerechoDerrotaDesayunoDeseoDesfileDesnudoDestinoDesvi/oDetalleDetenerDeudaDi/aDiabloDiademaDiamanteDianaDiarioDibujoDictarDienteDietaDiezDifi/cilDignoDilemaDiluirDineroDirectoDirigirDiscoDise~oDisfrazDivaDivinoDobleDoceDolorDomingoDonDonarDoradoDormirDorsoDosDosisDrago/nDrogaDuchaDudaDueloDue~oDulceDu/oDuqueDurarDurezaDuroE/banoEbrioEcharEcoEcuadorEdadEdicio/nEdificioEditorEducarEfectoEficazEjeEjemploElefanteElegirElementoElevarElipseE/liteElixirElogioEludirEmbudoEmitirEmocio/nEmpateEmpe~oEmpleoEmpresaEnanoEncargoEnchufeEnci/aEnemigoEneroEnfadoEnfermoEnga~oEnigmaEnlaceEnormeEnredoEnsayoEnse~arEnteroEntrarEnvaseEnvi/oE/pocaEquipoErizoEscalaEscenaEscolarEscribirEscudoEsenciaEsferaEsfuerzoEspadaEspejoEspi/aEsposaEspumaEsqui/EstarEsteEstiloEstufaEtapaEternoE/ticaEtniaEvadirEvaluarEventoEvitarExactoExamenExcesoExcusaExentoExigirExilioExistirE/xitoExpertoExplicarExponerExtremoFa/bricaFa/bulaFachadaFa/cilFactorFaenaFajaFaldaFalloFalsoFaltarFamaFamiliaFamosoFarao/nFarmaciaFarolFarsaFaseFatigaFaunaFavorFaxFebreroFechaFelizFeoFeriaFerozFe/rtilFervorFesti/nFiableFianzaFiarFibraFiccio/nFichaFideoFiebreFielFieraFiestaFiguraFijarFijoFilaFileteFilialFiltroFinFincaFingirFinitoFirmaFlacoFlautaFlechaFlorFlotaFluirFlujoFlu/orFobiaFocaFogataFogo/nFolioFolletoFondoFormaForroFortunaForzarFosaFotoFracasoFra/gilFranjaFraseFraudeFrei/rFrenoFresaFri/oFritoFrutaFuegoFuenteFuerzaFugaFumarFuncio/nFundaFurgo/nFuriaFusilFu/tbolFuturoGacelaGafasGaitaGajoGalaGaleri/aGalloGambaGanarGanchoGangaGansoGarajeGarzaGasolinaGastarGatoGavila/nGemeloGemirGenGe/neroGenioGenteGeranioGerenteGermenGestoGiganteGimnasioGirarGiroGlaciarGloboGloriaGolGolfoGolosoGolpeGomaGordoGorilaGorraGotaGoteoGozarGradaGra/ficoGranoGrasaGratisGraveGrietaGrilloGripeGrisGritoGrosorGru/aGruesoGrumoGrupoGuanteGuapoGuardiaGuerraGui/aGui~oGuionGuisoGuitarraGusanoGustarHaberHa/bilHablarHacerHachaHadaHallarHamacaHarinaHazHaza~aHebillaHebraHechoHeladoHelioHembraHerirHermanoHe/roeHervirHieloHierroHi/gadoHigieneHijoHimnoHistoriaHocicoHogarHogueraHojaHombreHongoHonorHonraHoraHormigaHornoHostilHoyoHuecoHuelgaHuertaHuesoHuevoHuidaHuirHumanoHu/medoHumildeHumoHundirHuraca/nHurtoIconoIdealIdiomaI/doloIglesiaIglu/IgualIlegalIlusio/nImagenIma/nImitarImparImperioImponerImpulsoIncapazI/ndiceInerteInfielInformeIngenioInicioInmensoInmuneInnatoInsectoInstanteIntere/sI/ntimoIntuirInu/tilInviernoIraIrisIroni/aIslaIsloteJabali/Jabo/nJamo/nJarabeJardi/nJarraJaulaJazmi/nJefeJeringaJineteJornadaJorobaJovenJoyaJuergaJuevesJuezJugadorJugoJugueteJuicioJuncoJunglaJunioJuntarJu/piterJurarJustoJuvenilJuzgarKiloKoalaLabioLacioLacraLadoLadro/nLagartoLa/grimaLagunaLaicoLamerLa/minaLa/mparaLanaLanchaLangostaLanzaLa/pizLargoLarvaLa/stimaLataLa/texLatirLaurelLavarLazoLealLeccio/nLecheLectorLeerLegio/nLegumbreLejanoLenguaLentoLe~aLeo/nLeopardoLesio/nLetalLetraLeveLeyendaLibertadLibroLicorLi/derLidiarLienzoLigaLigeroLimaLi/miteLimo/nLimpioLinceLindoLi/neaLingoteLinoLinternaLi/quidoLisoListaLiteraLitioLitroLlagaLlamaLlantoLlaveLlegarLlenarLlevarLlorarLloverLluviaLoboLocio/nLocoLocuraLo/gicaLogroLombrizLomoLonjaLoteLuchaLucirLugarLujoLunaLunesLupaLustroLutoLuzMacetaMachoMaderaMadreMaduroMaestroMafiaMagiaMagoMai/zMaldadMaletaMallaMaloMama/MamboMamutMancoMandoManejarMangaManiqui/ManjarManoMansoMantaMa~anaMapaMa/quinaMarMarcoMareaMarfilMargenMaridoMa/rmolMarro/nMartesMarzoMasaMa/scaraMasivoMatarMateriaMatizMatrizMa/ximoMayorMazorcaMechaMedallaMedioMe/dulaMejillaMejorMelenaMelo/nMemoriaMenorMensajeMenteMenu/MercadoMerengueMe/ritoMesMeso/nMetaMeterMe/todoMetroMezclaMiedoMielMiembroMigaMilMilagroMilitarMillo/nMimoMinaMineroMi/nimoMinutoMiopeMirarMisaMiseriaMisilMismoMitadMitoMochilaMocio/nModaModeloMohoMojarMoldeMolerMolinoMomentoMomiaMonarcaMonedaMonjaMontoMo~oMoradaMorderMorenoMorirMorroMorsaMortalMoscaMostrarMotivoMoverMo/vilMozoMuchoMudarMuebleMuelaMuerteMuestraMugreMujerMulaMuletaMultaMundoMu~ecaMuralMuroMu/sculoMuseoMusgoMu/sicaMusloNa/carNacio/nNadarNaipeNaranjaNarizNarrarNasalNatalNativoNaturalNa/useaNavalNaveNavidadNecioNe/ctarNegarNegocioNegroNeo/nNervioNetoNeutroNevarNeveraNichoNidoNieblaNietoNi~ezNi~oNi/tidoNivelNoblezaNocheNo/minaNoriaNormaNorteNotaNoticiaNovatoNovelaNovioNubeNucaNu/cleoNudilloNudoNueraNueveNuezNuloNu/meroNutriaOasisObesoObispoObjetoObraObreroObservarObtenerObvioOcaOcasoOce/anoOchentaOchoOcioOcreOctavoOctubreOcultoOcuparOcurrirOdiarOdioOdiseaOesteOfensaOfertaOficioOfrecerOgroOi/doOi/rOjoOlaOleadaOlfatoOlivoOllaOlmoOlorOlvidoOmbligoOndaOnzaOpacoOpcio/nO/peraOpinarOponerOptarO/pticaOpuestoOracio/nOradorOralO/rbitaOrcaOrdenOrejaO/rganoOrgi/aOrgulloOrienteOrigenOrillaOroOrquestaOrugaOsadi/aOscuroOseznoOsoOstraOto~oOtroOvejaO/vuloO/xidoOxi/genoOyenteOzonoPactoPadrePaellaPa/ginaPagoPai/sPa/jaroPalabraPalcoPaletaPa/lidoPalmaPalomaPalparPanPanalPa/nicoPanteraPa~ueloPapa/PapelPapillaPaquetePararParcelaParedParirParoPa/rpadoParquePa/rrafoPartePasarPaseoPasio/nPasoPastaPataPatioPatriaPausaPautaPavoPayasoPeato/nPecadoPeceraPechoPedalPedirPegarPeinePelarPelda~oPeleaPeligroPellejoPeloPelucaPenaPensarPe~o/nPeo/nPeorPepinoPeque~oPeraPerchaPerderPerezaPerfilPericoPerlaPermisoPerroPersonaPesaPescaPe/simoPesta~aPe/taloPetro/leoPezPezu~aPicarPicho/nPiePiedraPiernaPiezaPijamaPilarPilotoPimientaPinoPintorPinzaPi~aPiojoPipaPirataPisarPiscinaPisoPistaPito/nPizcaPlacaPlanPlataPlayaPlazaPleitoPlenoPlomoPlumaPluralPobrePocoPoderPodioPoemaPoesi/aPoetaPolenPolici/aPolloPolvoPomadaPomeloPomoPompaPonerPorcio/nPortalPosadaPoseerPosiblePostePotenciaPotroPozoPradoPrecozPreguntaPremioPrensaPresoPrevioPrimoPri/ncipePrisio/nPrivarProaProbarProcesoProductoProezaProfesorProgramaProlePromesaProntoPropioPro/ximoPruebaPu/blicoPucheroPudorPuebloPuertaPuestoPulgaPulirPulmo/nPulpoPulsoPumaPuntoPu~alPu~oPupaPupilaPure/QuedarQuejaQuemarQuererQuesoQuietoQui/micaQuinceQuitarRa/banoRabiaRaboRacio/nRadicalRai/zRamaRampaRanchoRangoRapazRa/pidoRaptoRasgoRaspaRatoRayoRazaRazo/nReaccio/nRealidadReba~oReboteRecaerRecetaRechazoRecogerRecreoRectoRecursoRedRedondoReducirReflejoReformaRefra/nRefugioRegaloRegirReglaRegresoRehe/nReinoRei/rRejaRelatoRelevoRelieveRellenoRelojRemarRemedioRemoRencorRendirRentaRepartoRepetirReposoReptilResRescateResinaRespetoRestoResumenRetiroRetornoRetratoReunirReve/sRevistaReyRezarRicoRiegoRiendaRiesgoRifaRi/gidoRigorRinco/nRi~o/nRi/oRiquezaRisaRitmoRitoRizoRobleRoceRociarRodarRodeoRodillaRoerRojizoRojoRomeroRomperRonRoncoRondaRopaRoperoRosaRoscaRostroRotarRubi/RuborRudoRuedaRugirRuidoRuinaRuletaRuloRumboRumorRupturaRutaRutinaSa/badoSaberSabioSableSacarSagazSagradoSalaSaldoSaleroSalirSalmo/nSalo/nSalsaSaltoSaludSalvarSambaSancio/nSandi/aSanearSangreSanidadSanoSantoSapoSaqueSardinaSarte/nSastreSata/nSaunaSaxofo/nSeccio/nSecoSecretoSectaSedSeguirSeisSelloSelvaSemanaSemillaSendaSensorSe~alSe~orSepararSepiaSequi/aSerSerieSermo/nServirSesentaSesio/nSetaSetentaSeveroSexoSextoSidraSiestaSieteSigloSignoSi/labaSilbarSilencioSillaSi/mboloSimioSirenaSistemaSitioSituarSobreSocioSodioSolSolapaSoldadoSoledadSo/lidoSoltarSolucio/nSombraSondeoSonidoSonoroSonrisaSopaSoplarSoporteSordoSorpresaSorteoSoste/nSo/tanoSuaveSubirSucesoSudorSuegraSueloSue~oSuerteSufrirSujetoSulta/nSumarSuperarSuplirSuponerSupremoSurSurcoSure~oSurgirSustoSutilTabacoTabiqueTablaTabu/TacoTactoTajoTalarTalcoTalentoTallaTalo/nTama~oTamborTangoTanqueTapaTapeteTapiaTapo/nTaquillaTardeTareaTarifaTarjetaTarotTarroTartaTatuajeTauroTazaTazo/nTeatroTechoTeclaTe/cnicaTejadoTejerTejidoTelaTele/fonoTemaTemorTemploTenazTenderTenerTenisTensoTeori/aTerapiaTercoTe/rminoTernuraTerrorTesisTesoroTestigoTeteraTextoTezTibioTiburo/nTiempoTiendaTierraTiesoTigreTijeraTildeTimbreTi/midoTimoTintaTi/oTi/picoTipoTiraTiro/nTita/nTi/tereTi/tuloTizaToallaTobilloTocarTocinoTodoTogaToldoTomarTonoTontoToparTopeToqueTo/raxToreroTormentaTorneoToroTorpedoTorreTorsoTortugaTosToscoToserTo/xicoTrabajoTractorTraerTra/ficoTragoTrajeTramoTranceTratoTraumaTrazarTre/bolTreguaTreintaTrenTreparTresTribuTrigoTripaTristeTriunfoTrofeoTrompaTroncoTropaTroteTrozoTrucoTruenoTrufaTuberi/aTuboTuertoTumbaTumorTu/nelTu/nicaTurbinaTurismoTurnoTutorUbicarU/lceraUmbralUnidadUnirUniversoUnoUntarU~aUrbanoUrbeUrgenteUrnaUsarUsuarioU/tilUtopi/aUvaVacaVaci/oVacunaVagarVagoVainaVajillaValeVa/lidoValleValorVa/lvulaVampiroVaraVariarVaro/nVasoVecinoVectorVehi/culoVeinteVejezVelaVeleroVelozVenaVencerVendaVenenoVengarVenirVentaVenusVerVeranoVerboVerdeVeredaVerjaVersoVerterVi/aViajeVibrarVicioVi/ctimaVidaVi/deoVidrioViejoViernesVigorVilVillaVinagreVinoVi~edoVioli/nViralVirgoVirtudVisorVi/speraVistaVitaminaViudoVivazViveroVivirVivoVolca/nVolumenVolverVorazVotarVotoVozVueloVulgarYacerYateYeguaYemaYernoYesoYodoYogaYogurZafiroZanjaZapatoZarzaZonaZorroZumoZurdo";
const lookup = {};
let wordlist$2 = null;
function dropDiacritic(word) {
    logger$k.checkNormalize();
    return toUtf8String(
        Array.prototype.filter.call(
            toUtf8Bytes(word.normalize("NFD").toLowerCase()),
            (c) => {
                return (c >= 65 && c <= 90) || (c >= 97 && c <= 123);
            }
        )
    );
}
function expand(word) {
    const output = [];
    Array.prototype.forEach.call(toUtf8Bytes(word), (c) => {
        if (c === 47) {
            output.push(204);
            output.push(129);
        } else if (c === 126) {
            output.push(110);
            output.push(204);
            output.push(131);
        } else {
            output.push(c);
        }
    });
    return toUtf8String(output);
}
function loadWords$2(lang) {
    if (wordlist$2 != null) {
        return;
    }
    wordlist$2 = words$2
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .substring(1)
        .split(" ")
        .map((w) => expand(w));
    wordlist$2.forEach((word, index) => {
        lookup[dropDiacritic(word)] = index;
    });
    if (
        Wordlist.check(lang) !==
        "0xf74fb7092aeacdfbf8959557de22098da512207fb9f109cb526994938cf40300"
    ) {
        wordlist$2 = null;
        throw new Error("BIP39 Wordlist for es (Spanish) FAILED");
    }
}
class LangEs extends Wordlist {
    constructor() {
        super("es");
    }
    getWord(index) {
        loadWords$2(this);
        return wordlist$2[index];
    }
    getWordIndex(word) {
        loadWords$2(this);
        return lookup[dropDiacritic(word)];
    }
}
const langEs = new LangEs();
Wordlist.register(langEs);
("use strict");
const words$3 =
    "AbaisserAbandonAbdiquerAbeilleAbolirAborderAboutirAboyerAbrasifAbreuverAbriterAbrogerAbruptAbsenceAbsoluAbsurdeAbusifAbyssalAcade/mieAcajouAcarienAccablerAccepterAcclamerAccoladeAccrocheAccuserAcerbeAchatAcheterAcidulerAcierAcompteAcque/rirAcronymeActeurActifActuelAdepteAde/quatAdhe/sifAdjectifAdjugerAdmettreAdmirerAdopterAdorerAdoucirAdresseAdroitAdulteAdverbeAe/rerAe/ronefAffaireAffecterAfficheAffreuxAffublerAgacerAgencerAgileAgiterAgraferAgre/ableAgrumeAiderAiguilleAilierAimableAisanceAjouterAjusterAlarmerAlchimieAlerteAlge-breAlgueAlie/nerAlimentAlle/gerAlliageAllouerAllumerAlourdirAlpagaAltesseAlve/oleAmateurAmbiguAmbreAme/nagerAmertumeAmidonAmiralAmorcerAmourAmovibleAmphibieAmpleurAmusantAnalyseAnaphoreAnarchieAnatomieAncienAne/antirAngleAngoisseAnguleuxAnimalAnnexerAnnonceAnnuelAnodinAnomalieAnonymeAnormalAntenneAntidoteAnxieuxApaiserApe/ritifAplanirApologieAppareilAppelerApporterAppuyerAquariumAqueducArbitreArbusteArdeurArdoiseArgentArlequinArmatureArmementArmoireArmureArpenterArracherArriverArroserArsenicArte/rielArticleAspectAsphalteAspirerAssautAsservirAssietteAssocierAssurerAsticotAstreAstuceAtelierAtomeAtriumAtroceAttaqueAttentifAttirerAttraperAubaineAubergeAudaceAudibleAugurerAuroreAutomneAutrucheAvalerAvancerAvariceAvenirAverseAveugleAviateurAvideAvionAviserAvoineAvouerAvrilAxialAxiomeBadgeBafouerBagageBaguetteBaignadeBalancerBalconBaleineBalisageBambinBancaireBandageBanlieueBannie-reBanquierBarbierBarilBaronBarqueBarrageBassinBastionBatailleBateauBatterieBaudrierBavarderBeletteBe/lierBeloteBe/ne/ficeBerceauBergerBerlineBermudaBesaceBesogneBe/tailBeurreBiberonBicycleBiduleBijouBilanBilingueBillardBinaireBiologieBiopsieBiotypeBiscuitBisonBistouriBitumeBizarreBlafardBlagueBlanchirBlessantBlinderBlondBloquerBlousonBobardBobineBoireBoiserBolideBonbonBondirBonheurBonifierBonusBordureBorneBotteBoucleBoueuxBougieBoulonBouquinBourseBoussoleBoutiqueBoxeurBrancheBrasierBraveBrebisBre-cheBreuvageBricolerBrigadeBrillantBriocheBriqueBrochureBroderBronzerBrousseBroyeurBrumeBrusqueBrutalBruyantBuffleBuissonBulletinBureauBurinBustierButinerButoirBuvableBuvetteCabanonCabineCachetteCadeauCadreCafe/ineCaillouCaissonCalculerCalepinCalibreCalmerCalomnieCalvaireCamaradeCame/raCamionCampagneCanalCanetonCanonCantineCanularCapableCaporalCapriceCapsuleCapterCapucheCarabineCarboneCaresserCaribouCarnageCarotteCarreauCartonCascadeCasierCasqueCassureCauserCautionCavalierCaverneCaviarCe/dilleCeintureCe/lesteCelluleCendrierCensurerCentralCercleCe/re/bralCeriseCernerCerveauCesserChagrinChaiseChaleurChambreChanceChapitreCharbonChasseurChatonChaussonChavirerChemiseChenilleChe/quierChercherChevalChienChiffreChignonChime-reChiotChlorureChocolatChoisirChoseChouetteChromeChuteCigareCigogneCimenterCine/maCintrerCirculerCirerCirqueCiterneCitoyenCitronCivilClaironClameurClaquerClasseClavierClientClignerClimatClivageClocheClonageCloporteCobaltCobraCocasseCocotierCoderCodifierCoffreCognerCohe/sionCoifferCoincerCole-reColibriCollineColmaterColonelCombatCome/dieCommandeCompactConcertConduireConfierCongelerConnoterConsonneContactConvexeCopainCopieCorailCorbeauCordageCornicheCorpusCorrectCorte-geCosmiqueCostumeCotonCoudeCoupureCourageCouteauCouvrirCoyoteCrabeCrainteCravateCrayonCre/atureCre/diterCre/meuxCreuserCrevetteCriblerCrierCristalCrite-reCroireCroquerCrotaleCrucialCruelCrypterCubiqueCueillirCuille-reCuisineCuivreCulminerCultiverCumulerCupideCuratifCurseurCyanureCycleCylindreCyniqueDaignerDamierDangerDanseurDauphinDe/battreDe/biterDe/borderDe/briderDe/butantDe/calerDe/cembreDe/chirerDe/ciderDe/clarerDe/corerDe/crireDe/cuplerDe/daleDe/ductifDe/esseDe/fensifDe/filerDe/frayerDe/gagerDe/givrerDe/glutirDe/graferDe/jeunerDe/liceDe/logerDemanderDemeurerDe/molirDe/nicherDe/nouerDentelleDe/nuderDe/partDe/penserDe/phaserDe/placerDe/poserDe/rangerDe/roberDe/sastreDescenteDe/sertDe/signerDe/sobe/irDessinerDestrierDe/tacherDe/testerDe/tourerDe/tresseDevancerDevenirDevinerDevoirDiableDialogueDiamantDicterDiffe/rerDige/rerDigitalDigneDiluerDimancheDiminuerDioxydeDirectifDirigerDiscuterDisposerDissiperDistanceDivertirDiviserDocileDocteurDogmeDoigtDomaineDomicileDompterDonateurDonjonDonnerDopamineDortoirDorureDosageDoseurDossierDotationDouanierDoubleDouceurDouterDoyenDragonDraperDresserDribblerDroitureDuperieDuplexeDurableDurcirDynastieE/blouirE/carterE/charpeE/chelleE/clairerE/clipseE/cloreE/cluseE/coleE/conomieE/corceE/couterE/craserE/cre/merE/crivainE/crouE/cumeE/cureuilE/difierE/duquerEffacerEffectifEffigieEffortEffrayerEffusionE/galiserE/garerE/jecterE/laborerE/largirE/lectronE/le/gantE/le/phantE/le-veE/ligibleE/litismeE/logeE/luciderE/luderEmballerEmbellirEmbryonE/meraudeE/missionEmmenerE/motionE/mouvoirEmpereurEmployerEmporterEmpriseE/mulsionEncadrerEnche-reEnclaveEncocheEndiguerEndosserEndroitEnduireE/nergieEnfanceEnfermerEnfouirEngagerEnginEngloberE/nigmeEnjamberEnjeuEnleverEnnemiEnnuyeuxEnrichirEnrobageEnseigneEntasserEntendreEntierEntourerEntraverE/nume/rerEnvahirEnviableEnvoyerEnzymeE/olienE/paissirE/pargneE/patantE/pauleE/picerieE/pide/mieE/pierE/pilogueE/pineE/pisodeE/pitapheE/poqueE/preuveE/prouverE/puisantE/querreE/quipeE/rigerE/rosionErreurE/ruptionEscalierEspadonEspe-ceEspie-gleEspoirEspritEsquiverEssayerEssenceEssieuEssorerEstimeEstomacEstradeE/tage-reE/talerE/tancheE/tatiqueE/teindreE/tendoirE/ternelE/thanolE/thiqueEthnieE/tirerE/tofferE/toileE/tonnantE/tourdirE/trangeE/troitE/tudeEuphorieE/valuerE/vasionE/ventailE/videnceE/viterE/volutifE/voquerExactExage/rerExaucerExcellerExcitantExclusifExcuseExe/cuterExempleExercerExhalerExhorterExigenceExilerExisterExotiqueExpe/dierExplorerExposerExprimerExquisExtensifExtraireExulterFableFabuleuxFacetteFacileFactureFaiblirFalaiseFameuxFamilleFarceurFarfeluFarineFaroucheFascinerFatalFatigueFauconFautifFaveurFavoriFe/brileFe/conderFe/de/rerFe/linFemmeFe/murFendoirFe/odalFermerFe/roceFerveurFestivalFeuilleFeutreFe/vrierFiascoFicelerFictifFide-leFigureFilatureFiletageFilie-reFilleulFilmerFilouFiltrerFinancerFinirFioleFirmeFissureFixerFlairerFlammeFlasqueFlatteurFle/auFle-cheFleurFlexionFloconFloreFluctuerFluideFluvialFolieFonderieFongibleFontaineForcerForgeronFormulerFortuneFossileFoudreFouge-reFouillerFoulureFourmiFragileFraiseFranchirFrapperFrayeurFre/gateFreinerFrelonFre/mirFre/ne/sieFre-reFriableFrictionFrissonFrivoleFroidFromageFrontalFrotterFruitFugitifFuiteFureurFurieuxFurtifFusionFuturGagnerGalaxieGalerieGambaderGarantirGardienGarnirGarrigueGazelleGazonGe/antGe/latineGe/luleGendarmeGe/ne/ralGe/nieGenouGentilGe/ologieGe/ome-treGe/raniumGermeGestuelGeyserGibierGiclerGirafeGivreGlaceGlaiveGlisserGlobeGloireGlorieuxGolfeurGommeGonflerGorgeGorilleGoudronGouffreGoulotGoupilleGourmandGoutteGraduelGraffitiGraineGrandGrappinGratuitGravirGrenatGriffureGrillerGrimperGrognerGronderGrotteGroupeGrugerGrutierGruye-reGue/pardGuerrierGuideGuimauveGuitareGustatifGymnasteGyrostatHabitudeHachoirHalteHameauHangarHannetonHaricotHarmonieHarponHasardHe/liumHe/matomeHerbeHe/rissonHermineHe/ronHe/siterHeureuxHibernerHibouHilarantHistoireHiverHomardHommageHomoge-neHonneurHonorerHonteuxHordeHorizonHorlogeHormoneHorribleHouleuxHousseHublotHuileuxHumainHumbleHumideHumourHurlerHydromelHygie-neHymneHypnoseIdylleIgnorerIguaneIlliciteIllusionImageImbiberImiterImmenseImmobileImmuableImpactImpe/rialImplorerImposerImprimerImputerIncarnerIncendieIncidentInclinerIncoloreIndexerIndiceInductifIne/ditIneptieInexactInfiniInfligerInformerInfusionInge/rerInhalerInhiberInjecterInjureInnocentInoculerInonderInscrireInsecteInsigneInsoliteInspirerInstinctInsulterIntactIntenseIntimeIntrigueIntuitifInutileInvasionInventerInviterInvoquerIroniqueIrradierIrre/elIrriterIsolerIvoireIvresseJaguarJaillirJambeJanvierJardinJaugerJauneJavelotJetableJetonJeudiJeunesseJoindreJoncherJonglerJoueurJouissifJournalJovialJoyauJoyeuxJubilerJugementJuniorJuponJuristeJusticeJuteuxJuve/nileKayakKimonoKiosqueLabelLabialLabourerLace/rerLactoseLaguneLaineLaisserLaitierLambeauLamelleLampeLanceurLangageLanterneLapinLargeurLarmeLaurierLavaboLavoirLectureLe/galLe/gerLe/gumeLessiveLettreLevierLexiqueLe/zardLiasseLibe/rerLibreLicenceLicorneLie-geLie-vreLigatureLigoterLigueLimerLimiteLimonadeLimpideLine/aireLingotLionceauLiquideLisie-reListerLithiumLitigeLittoralLivreurLogiqueLointainLoisirLombricLoterieLouerLourdLoutreLouveLoyalLubieLucideLucratifLueurLugubreLuisantLumie-reLunaireLundiLuronLutterLuxueuxMachineMagasinMagentaMagiqueMaigreMaillonMaintienMairieMaisonMajorerMalaxerMale/ficeMalheurMaliceMalletteMammouthMandaterManiableManquantManteauManuelMarathonMarbreMarchandMardiMaritimeMarqueurMarronMartelerMascotteMassifMate/rielMatie-reMatraqueMaudireMaussadeMauveMaximalMe/chantMe/connuMe/dailleMe/decinMe/diterMe/duseMeilleurMe/langeMe/lodieMembreMe/moireMenacerMenerMenhirMensongeMentorMercrediMe/riteMerleMessagerMesureMe/talMe/te/oreMe/thodeMe/tierMeubleMiaulerMicrobeMietteMignonMigrerMilieuMillionMimiqueMinceMine/ralMinimalMinorerMinuteMiracleMiroiterMissileMixteMobileModerneMoelleuxMondialMoniteurMonnaieMonotoneMonstreMontagneMonumentMoqueurMorceauMorsureMortierMoteurMotifMoucheMoufleMoulinMoussonMoutonMouvantMultipleMunitionMurailleMure-neMurmureMuscleMuse/umMusicienMutationMuterMutuelMyriadeMyrtilleMyste-reMythiqueNageurNappeNarquoisNarrerNatationNationNatureNaufrageNautiqueNavireNe/buleuxNectarNe/fasteNe/gationNe/gligerNe/gocierNeigeNerveuxNettoyerNeuroneNeutronNeveuNicheNickelNitrateNiveauNobleNocifNocturneNoirceurNoisetteNomadeNombreuxNommerNormatifNotableNotifierNotoireNourrirNouveauNovateurNovembreNoviceNuageNuancerNuireNuisibleNume/roNuptialNuqueNutritifObe/irObjectifObligerObscurObserverObstacleObtenirObturerOccasionOccuperOce/anOctobreOctroyerOctuplerOculaireOdeurOdorantOffenserOfficierOffrirOgiveOiseauOisillonOlfactifOlivierOmbrageOmettreOnctueuxOndulerOne/reuxOniriqueOpaleOpaqueOpe/rerOpinionOpportunOpprimerOpterOptiqueOrageuxOrangeOrbiteOrdonnerOreilleOrganeOrgueilOrificeOrnementOrqueOrtieOscillerOsmoseOssatureOtarieOuraganOursonOutilOutragerOuvrageOvationOxydeOxyge-neOzonePaisiblePalacePalmare-sPalourdePalperPanachePandaPangolinPaniquerPanneauPanoramaPantalonPapayePapierPapoterPapyrusParadoxeParcelleParesseParfumerParlerParoleParrainParsemerPartagerParureParvenirPassionPaste-quePaternelPatiencePatronPavillonPavoiserPayerPaysagePeignePeintrePelagePe/licanPellePelousePeluchePendulePe/ne/trerPe/niblePensifPe/nuriePe/pitePe/plumPerdrixPerforerPe/riodePermuterPerplexePersilPertePeserPe/talePetitPe/trirPeuplePharaonPhobiePhoquePhotonPhrasePhysiquePianoPicturalPie-cePierrePieuvrePilotePinceauPipettePiquerPiroguePiscinePistonPivoterPixelPizzaPlacardPlafondPlaisirPlanerPlaquePlastronPlateauPleurerPlexusPliagePlombPlongerPluiePlumagePochettePoe/siePoe-tePointePoirierPoissonPoivrePolairePolicierPollenPolygonePommadePompierPonctuelPonde/rerPoneyPortiquePositionPosse/derPosturePotagerPoteauPotionPoucePoulainPoumonPourprePoussinPouvoirPrairiePratiquePre/cieuxPre/direPre/fixePre/ludePre/nomPre/sencePre/textePre/voirPrimitifPrincePrisonPriverProble-meProce/derProdigeProfondProgre-sProieProjeterProloguePromenerPropreProspe-reProte/gerProuesseProverbePrudencePruneauPsychosePublicPuceronPuiserPulpePulsarPunaisePunitifPupitrePurifierPuzzlePyramideQuasarQuerelleQuestionQuie/tudeQuitterQuotientRacineRaconterRadieuxRagondinRaideurRaisinRalentirRallongeRamasserRapideRasageRatisserRavagerRavinRayonnerRe/actifRe/agirRe/aliserRe/animerRecevoirRe/citerRe/clamerRe/colterRecruterReculerRecyclerRe/digerRedouterRefaireRe/flexeRe/formerRefrainRefugeRe/galienRe/gionRe/glageRe/gulierRe/ite/rerRejeterRejouerRelatifReleverReliefRemarqueReme-deRemiseRemonterRemplirRemuerRenardRenfortReniflerRenoncerRentrerRenvoiReplierReporterRepriseReptileRequinRe/serveRe/sineuxRe/soudreRespectResterRe/sultatRe/tablirRetenirRe/ticuleRetomberRetracerRe/unionRe/ussirRevancheRevivreRe/volteRe/vulsifRichesseRideauRieurRigideRigolerRincerRiposterRisibleRisqueRituelRivalRivie-reRocheuxRomanceRompreRonceRondinRoseauRosierRotatifRotorRotuleRougeRouilleRouleauRoutineRoyaumeRubanRubisRucheRuelleRugueuxRuinerRuisseauRuserRustiqueRythmeSablerSaboterSabreSacocheSafariSagesseSaisirSaladeSaliveSalonSaluerSamediSanctionSanglierSarcasmeSardineSaturerSaugrenuSaumonSauterSauvageSavantSavonnerScalpelScandaleSce/le/ratSce/narioSceptreSche/maScienceScinderScoreScrutinSculpterSe/anceSe/cableSe/cherSecouerSe/cre/terSe/datifSe/duireSeigneurSe/jourSe/lectifSemaineSemblerSemenceSe/minalSe/nateurSensibleSentenceSe/parerSe/quenceSereinSergentSe/rieuxSerrureSe/rumServiceSe/sameSe/virSevrageSextupleSide/ralSie-cleSie/gerSifflerSigleSignalSilenceSiliciumSimpleSince-reSinistreSiphonSiropSismiqueSituerSkierSocialSocleSodiumSoigneuxSoldatSoleilSolitudeSolubleSombreSommeilSomnolerSondeSongeurSonnetteSonoreSorcierSortirSosieSottiseSoucieuxSoudureSouffleSouleverSoupapeSourceSoutirerSouvenirSpacieuxSpatialSpe/cialSphe-reSpiralStableStationSternumStimulusStipulerStrictStudieuxStupeurStylisteSublimeSubstratSubtilSubvenirSucce-sSucreSuffixeSugge/rerSuiveurSulfateSuperbeSupplierSurfaceSuricateSurmenerSurpriseSursautSurvieSuspectSyllabeSymboleSyme/trieSynapseSyntaxeSyste-meTabacTablierTactileTaillerTalentTalismanTalonnerTambourTamiserTangibleTapisTaquinerTarderTarifTartineTasseTatamiTatouageTaupeTaureauTaxerTe/moinTemporelTenailleTendreTeneurTenirTensionTerminerTerneTerribleTe/tineTexteThe-meThe/orieThe/rapieThoraxTibiaTie-deTimideTirelireTiroirTissuTitaneTitreTituberTobogganTole/rantTomateToniqueTonneauToponymeTorcheTordreTornadeTorpilleTorrentTorseTortueTotemToucherTournageTousserToxineTractionTraficTragiqueTrahirTrainTrancherTravailTre-fleTremperTre/sorTreuilTriageTribunalTricoterTrilogieTriompheTriplerTriturerTrivialTromboneTroncTropicalTroupeauTuileTulipeTumulteTunnelTurbineTuteurTutoyerTuyauTympanTyphonTypiqueTyranUbuesqueUltimeUltrasonUnanimeUnifierUnionUniqueUnitaireUniversUraniumUrbainUrticantUsageUsineUsuelUsureUtileUtopieVacarmeVaccinVagabondVagueVaillantVaincreVaisseauValableValiseVallonValveVampireVanilleVapeurVarierVaseuxVassalVasteVecteurVedetteVe/ge/talVe/hiculeVeinardVe/loceVendrediVe/ne/rerVengerVenimeuxVentouseVerdureVe/rinVernirVerrouVerserVertuVestonVe/te/ranVe/tusteVexantVexerViaducViandeVictoireVidangeVide/oVignetteVigueurVilainVillageVinaigreViolonVipe-reVirementVirtuoseVirusVisageViseurVisionVisqueuxVisuelVitalVitesseViticoleVitrineVivaceVivipareVocationVoguerVoileVoisinVoitureVolailleVolcanVoltigerVolumeVoraceVortexVoterVouloirVoyageVoyelleWagonXe/nonYachtZe-breZe/nithZesteZoologie";
let wordlist$3 = null;
const lookup$1 = {};
function dropDiacritic$1(word) {
    logger$k.checkNormalize();
    return toUtf8String(
        Array.prototype.filter.call(
            toUtf8Bytes(word.normalize("NFD").toLowerCase()),
            (c) => {
                return (c >= 65 && c <= 90) || (c >= 97 && c <= 123);
            }
        )
    );
}
function expand$1(word) {
    const output = [];
    Array.prototype.forEach.call(toUtf8Bytes(word), (c) => {
        if (c === 47) {
            output.push(204);
            output.push(129);
        } else if (c === 45) {
            output.push(204);
            output.push(128);
        } else {
            output.push(c);
        }
    });
    return toUtf8String(output);
}
function loadWords$3(lang) {
    if (wordlist$3 != null) {
        return;
    }
    wordlist$3 = words$3
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .substring(1)
        .split(" ")
        .map((w) => expand$1(w));
    wordlist$3.forEach((word, index) => {
        lookup$1[dropDiacritic$1(word)] = index;
    });
    if (
        Wordlist.check(lang) !==
        "0x51deb7ae009149dc61a6bd18a918eb7ac78d2775726c68e598b92d002519b045"
    ) {
        wordlist$3 = null;
        throw new Error("BIP39 Wordlist for fr (French) FAILED");
    }
}
class LangFr extends Wordlist {
    constructor() {
        super("fr");
    }
    getWord(index) {
        loadWords$3(this);
        return wordlist$3[index];
    }
    getWordIndex(word) {
        loadWords$3(this);
        return lookup$1[dropDiacritic$1(word)];
    }
}
const langFr = new LangFr();
Wordlist.register(langFr);
("use strict");
const data = [
    "AQRASRAGBAGUAIRAHBAghAURAdBAdcAnoAMEAFBAFCBKFBQRBSFBCXBCDBCHBGFBEQBpBBpQBIkBHNBeOBgFBVCBhBBhNBmOBmRBiHBiFBUFBZDBvFBsXBkFBlcBjYBwDBMBBTBBTRBWBBWXXaQXaRXQWXSRXCFXYBXpHXOQXHRXhRXuRXmXXbRXlXXwDXTRXrCXWQXWGaBWaKcaYgasFadQalmaMBacAKaRKKBKKXKKjKQRKDRKCYKCRKIDKeVKHcKlXKjHKrYNAHNBWNaRNKcNIBNIONmXNsXNdXNnBNMBNRBNrXNWDNWMNFOQABQAHQBrQXBQXFQaRQKXQKDQKOQKFQNBQNDQQgQCXQCDQGBQGDQGdQYXQpBQpQQpHQLXQHuQgBQhBQhCQuFQmXQiDQUFQZDQsFQdRQkHQbRQlOQlmQPDQjDQwXQMBQMDQcFQTBQTHQrDDXQDNFDGBDGQDGRDpFDhFDmXDZXDbRDMYDRdDTRDrXSAhSBCSBrSGQSEQSHBSVRShYShkSyQSuFSiBSdcSoESocSlmSMBSFBSFKSFNSFdSFcCByCaRCKcCSBCSRCCrCGbCEHCYXCpBCpQCIBCIHCeNCgBCgFCVECVcCmkCmwCZXCZFCdRClOClmClFCjDCjdCnXCwBCwXCcRCFQCFjGXhGNhGDEGDMGCDGCHGIFGgBGVXGVEGVRGmXGsXGdYGoSGbRGnXGwXGwDGWRGFNGFLGFOGFdGFkEABEBDEBFEXOEaBEKSENBENDEYXEIgEIkEgBEgQEgHEhFEudEuFEiBEiHEiFEZDEvBEsXEsFEdXEdREkFEbBEbRElFEPCEfkEFNYAEYAhYBNYQdYDXYSRYCEYYoYgQYgRYuRYmCYZTYdBYbEYlXYjQYRbYWRpKXpQopQnpSFpCXpIBpISphNpdBpdRpbRpcZpFBpFNpFDpFopFrLADLBuLXQLXcLaFLCXLEhLpBLpFLHXLeVLhILdHLdRLoDLbRLrXIABIBQIBCIBsIBoIBMIBRIXaIaRIKYIKRINBINuICDIGBIIDIIkIgRIxFIyQIiHIdRIbYIbRIlHIwRIMYIcRIRVITRIFBIFNIFQOABOAFOBQOaFONBONMOQFOSFOCDOGBOEQOpBOLXOIBOIFOgQOgFOyQOycOmXOsXOdIOkHOMEOMkOWWHBNHXNHXWHNXHDuHDRHSuHSRHHoHhkHmRHdRHkQHlcHlRHwBHWcgAEgAggAkgBNgBQgBEgXOgYcgLXgHjgyQgiBgsFgdagMYgWSgFQgFEVBTVXEVKBVKNVKDVKYVKRVNBVNYVDBVDxVSBVSRVCjVGNVLXVIFVhBVhcVsXVdRVbRVlRhBYhKYhDYhGShxWhmNhdahdkhbRhjohMXhTRxAXxXSxKBxNBxEQxeNxeQxhXxsFxdbxlHxjcxFBxFNxFQxFOxFoyNYyYoybcyMYuBQuBRuBruDMuCouHBudQukkuoBulVuMXuFEmCYmCRmpRmeDmiMmjdmTFmFQiADiBOiaRiKRiNBiNRiSFiGkiGFiERipRiLFiIFihYibHijBijEiMXiWBiFBiFCUBQUXFUaRUNDUNcUNRUNFUDBUSHUCDUGBUGFUEqULNULoUIRUeEUeYUgBUhFUuRUiFUsXUdFUkHUbBUjSUjYUwXUMDUcHURdUTBUrBUrXUrQZAFZXZZaRZKFZNBZQFZCXZGBZYdZpBZLDZIFZHXZHNZeQZVRZVFZmXZiBZvFZdFZkFZbHZbFZwXZcCZcRZRBvBQvBGvBLvBWvCovMYsAFsBDsaRsKFsNFsDrsSHsSFsCXsCRsEBsEHsEfspBsLBsLDsIgsIRseGsbRsFBsFQsFSdNBdSRdCVdGHdYDdHcdVbdySduDdsXdlRdwXdWYdWcdWRkBMkXOkaRkNIkNFkSFkCFkYBkpRkeNkgBkhVkmXksFklVkMBkWDkFNoBNoaQoaFoNBoNXoNaoNEoSRoEroYXoYCoYbopRopFomXojkowXorFbBEbEIbdBbjYlaRlDElMXlFDjKjjSRjGBjYBjYkjpRjLXjIBjOFjeVjbRjwBnXQnSHnpFnLXnINnMBnTRwXBwXNwXYwNFwQFwSBwGFwLXwLDweNwgBwuHwjDwnXMBXMpFMIBMeNMTHcaQcNBcDHcSFcCXcpBcLXcLDcgFcuFcnXcwXccDcTQcrFTQErXNrCHrpFrgFrbFrTHrFcWNYWNbWEHWMXWTR",
    "ABGHABIJAEAVAYJQALZJAIaRAHNXAHdcAHbRAZJMAZJRAZTRAdVJAklmAbcNAjdRAMnRAMWYAWpRAWgRAFgBAFhBAFdcBNJBBNJDBQKBBQhcBQlmBDEJBYJkBYJTBpNBBpJFBIJBBIJDBIcABOKXBOEJBOVJBOiJBOZJBepBBeLXBeIFBegBBgGJBVJXBuocBiJRBUJQBlXVBlITBwNFBMYVBcqXBTlmBWNFBWiJBWnRBFGHBFwXXKGJXNJBXNZJXDTTXSHSXSVRXSlHXCJDXGQJXEhXXYQJXYbRXOfXXeNcXVJFXhQJXhEJXdTRXjdXXMhBXcQTXRGBXTEBXTnQXFCXXFOFXFgFaBaFaBNJaBCJaBpBaBwXaNJKaNJDaQIBaDpRaEPDaHMFamDJalEJaMZJaFaFaFNBaFQJaFLDaFVHKBCYKBEBKBHDKXaFKXGdKXEJKXpHKXIBKXZDKXwXKKwLKNacKNYJKNJoKNWcKDGdKDTRKChXKGaRKGhBKGbRKEBTKEaRKEPTKLMDKLWRKOHDKVJcKdBcKlIBKlOPKFSBKFEPKFpFNBNJNJBQNBGHNBEPNBHXNBgFNBVXNBZDNBsXNBwXNNaRNNJDNNJENNJkNDCJNDVDNGJRNJiDNZJNNsCJNJFNNFSBNFCXNFEPNFLXNFIFQJBFQCaRQJEQQLJDQLJFQIaRQOqXQHaFQHHQQVJXQVJDQhNJQmEIQZJFQsJXQJrFQWbRDJABDBYJDXNFDXCXDXLXDXZDDXsJDQqXDSJFDJCXDEPkDEqXDYmQDpSJDOCkDOGQDHEIDVJDDuDuDWEBDJFgSBNDSBSFSBGHSBIBSBTQSKVYSJQNSJQiSJCXSEqXSJYVSIiJSOMYSHAHSHaQSeCFSepQSegBSHdHSHrFShSJSJuHSJUFSkNRSrSrSWEBSFaHSJFQSFCXSFGDSFYXSFODSFgBSFVXSFhBSFxFSFkFSFbBSFMFCADdCJXBCXaFCXKFCXNFCXCXCXGBCXEJCXYBCXLDCXIBCXOPCXHXCXgBCXhBCXiBCXlDCXcHCJNBCJNFCDCJCDGBCDVXCDhBCDiDCDJdCCmNCpJFCIaRCOqXCHCHCHZJCViJCuCuCmddCJiFCdNBCdHhClEJCnUJCreSCWlgCWTRCFBFCFNBCFYBCFVFCFhFCFdSCFTBCFWDGBNBGBQFGJBCGBEqGBpBGBgQGNBEGNJYGNkOGNJRGDUFGJpQGHaBGJeNGJeEGVBlGVKjGiJDGvJHGsVJGkEBGMIJGWjNGFBFGFCXGFGBGFYXGFpBGFMFEASJEAWpEJNFECJVEIXSEIQJEOqXEOcFEeNcEHEJEHlFEJgFEhlmEmDJEmZJEiMBEUqXEoSREPBFEPXFEPKFEPSFEPEFEPpFEPLXEPIBEJPdEPcFEPTBEJnXEqlHEMpREFCXEFODEFcFYASJYJAFYBaBYBVXYXpFYDhBYCJBYJGFYYbRYeNcYJeVYiIJYZJcYvJgYvJRYJsXYsJFYMYMYreVpBNHpBEJpBwXpQxFpYEJpeNDpJeDpeSFpeCHpHUJpHbBpHcHpmUJpiiJpUJrpsJuplITpFaBpFQqpFGBpFEfpFYBpFpBpFLJpFIDpFgBpFVXpFyQpFuFpFlFpFjDpFnXpFwXpJFMpFTBLXCJLXEFLXhFLXUJLXbFLalmLNJBLSJQLCLCLGJBLLDJLHaFLeNFLeSHLeCXLepFLhaRLZsJLsJDLsJrLocaLlLlLMdbLFNBLFSBLFEHLFkFIBBFIBXFIBaQIBKXIBSFIBpHIBLXIBgBIBhBIBuHIBmXIBiFIBZXIBvFIBbFIBjQIBwXIBWFIKTRIQUJIDGFICjQIYSRIINXIJeCIVaRImEkIZJFIvJRIsJXIdCJIJoRIbBQIjYBIcqXITFVIreVIFKFIFSFIFCJIFGFIFLDIFIBIJFOIFgBIFVXIJFhIFxFIFmXIFdHIFbBIJFrIJFWOBGBOQfXOOKjOUqXOfXBOqXEOcqXORVJOFIBOFlDHBIOHXiFHNTRHCJXHIaRHHJDHHEJHVbRHZJYHbIBHRsJHRkDHWlmgBKFgBSBgBCDgBGHgBpBgBIBgBVJgBuBgBvFgKDTgQVXgDUJgGSJgOqXgmUMgZIJgTUJgWIEgFBFgFNBgFDJgFSFgFGBgFYXgJFOgFgQgFVXgFhBgFbHgJFWVJABVQKcVDgFVOfXVeDFVhaRVmGdViJYVMaRVFNHhBNDhBCXhBEqhBpFhBLXhNJBhSJRheVXhhKEhxlmhZIJhdBQhkIJhbMNhMUJhMZJxNJgxQUJxDEkxDdFxSJRxplmxeSBxeCXxeGFxeYXxepQxegBxWVcxFEQxFLXxFIBxFgBxFxDxFZtxFdcxFbBxFwXyDJXyDlcuASJuDJpuDIBuCpJuGSJuIJFueEFuZIJusJXudWEuoIBuWGJuFBcuFKEuFNFuFQFuFDJuFGJuFVJuFUtuFdHuFTBmBYJmNJYmQhkmLJDmLJomIdXmiJYmvJRmsJRmklmmMBymMuCmclmmcnQiJABiJBNiJBDiBSFiBCJiBEFiBYBiBpFiBLXiBTHiJNciDEfiCZJiECJiJEqiOkHiHKFieNDiHJQieQcieDHieSFieCXieGFieEFieIHiegFihUJixNoioNXiFaBiFKFiFNDiFEPiFYXitFOitFHiFgBiFVEiFmXiFitiFbBiFMFiFrFUCXQUIoQUIJcUHQJUeCEUHwXUUJDUUqXUdWcUcqXUrnQUFNDUFSHUFCFUFEfUFLXUtFOZBXOZXSBZXpFZXVXZEQJZEJkZpDJZOqXZeNHZeCDZUqXZFBQZFEHZFLXvBAFvBKFvBCXvBEPvBpHvBIDvBgFvBuHvQNJvFNFvFGBvFIBvJFcsXCDsXLXsXsXsXlFsXcHsQqXsJQFsEqXseIFsFEHsFjDdBxOdNpRdNJRdEJbdpJRdhZJdnSJdrjNdFNJdFQHdFhNkNJDkYaRkHNRkHSRkVbRkuMRkjSJkcqDoSJFoEiJoYZJoOfXohEBoMGQocqXbBAFbBXFbBaFbBNDbBGBbBLXbBTBbBWDbGJYbIJHbFQqbFpQlDgQlOrFlVJRjGEBjZJRnXvJnXbBnEfHnOPDngJRnxfXnUJWwXEJwNpJwDpBwEfXwrEBMDCJMDGHMDIJMLJDcQGDcQpHcqXccqNFcqCXcFCJRBSBRBGBRBEJRBpQTBNFTBQJTBpBTBVXTFABTFSBTFCFTFGBTFMDrXCJrXLDrDNJrEfHrFQJrFitWNjdWNTR",
    "AKLJMANOPFASNJIAEJWXAYJNRAIIbRAIcdaAeEfDAgidRAdjNYAMYEJAMIbRAFNJBAFpJFBBIJYBDZJFBSiJhBGdEBBEJfXBEJqXBEJWRBpaUJBLXrXBIYJMBOcfXBeEfFBestXBjNJRBcDJOBFEqXXNvJRXDMBhXCJNYXOAWpXONJWXHDEBXeIaRXhYJDXZJSJXMDJOXcASJXFVJXaBQqXaBZJFasXdQaFSJQaFEfXaFpJHaFOqXKBNSRKXvJBKQJhXKEJQJKEJGFKINJBKIJjNKgJNSKVElmKVhEBKiJGFKlBgJKjnUJKwsJYKMFIJKFNJDKFIJFKFOfXNJBSFNJBCXNBpJFNJBvQNJBMBNJLJXNJOqXNJeCXNJeGFNdsJCNbTKFNwXUJQNFEPQDiJcQDMSJQSFpBQGMQJQJeOcQyCJEQUJEBQJFBrQFEJqDXDJFDJXpBDJXIMDGiJhDIJGRDJeYcDHrDJDVXgFDkAWpDkIgRDjDEqDMvJRDJFNFDJFIBSKclmSJQOFSJQVHSJQjDSJGJBSJGJFSECJoSHEJqSJHTBSJVJDSViJYSZJNBSJsJDSFSJFSFEfXSJFLXCBUJVCJXSBCJXpBCXVJXCJXsXCJXdFCJNJHCLIJgCHiJFCVNJMChCJhCUHEJCsJTRCJdYcCoQJCCFEfXCFIJgCFUJxCFstFGJBaQGJBIDGQJqXGYJNRGJHKFGeQqDGHEJFGJeLXGHIiJGHdBlGUJEBGkIJTGFQPDGJFEqEAGegEJIJBEJVJXEhQJTEiJNcEJZJFEJoEqEjDEqEPDsXEPGJBEPOqXEPeQFEfDiDEJfEFEfepQEfMiJEqXNBEqDIDEqeSFEqVJXEMvJRYXNJDYXEJHYKVJcYYJEBYJeEcYJUqXYFpJFYFstXpAZJMpBSJFpNBNFpeQPDpHLJDpHIJFpHgJFpeitFpHZJFpJFADpFSJFpJFCJpFOqXpFitBpJFZJLXIJFLIJgRLVNJWLVHJMLwNpJLFGJBLFLJDLFOqXLJFUJIBDJXIBGJBIJBYQIJBIBIBOqXIBcqDIEGJFILNJTIIJEBIOiJhIJeNBIJeIBIhiJIIWoTRIJFAHIJFpBIJFuHIFUtFIJFTHOSBYJOEcqXOHEJqOvBpFOkVJrObBVJOncqDOcNJkHhNJRHuHJuHdMhBgBUqXgBsJXgONJBgHNJDgHHJQgJeitgHsJXgJyNagyDJBgZJDrgsVJQgkEJNgkjSJgJFAHgFCJDgFZtMVJXNFVXQfXVJXDJVXoQJVQVJQVDEfXVDvJHVEqNFVeQfXVHpJFVHxfXVVJSRVVmaRVlIJOhCXVJhHjYkhxCJVhWVUJhWiJcxBNJIxeEqDxfXBFxcFEPxFSJFxFYJXyBDQJydaUJyFOPDuYCJYuLvJRuHLJXuZJLDuFOPDuFZJHuFcqXmKHJdmCQJcmOsVJiJAGFitLCFieOfXiestXiZJMEikNJQirXzFiFQqXiFIJFiFZJFiFvtFUHpJFUteIcUteOcUVCJkUhdHcUbEJEUJqXQUMNJhURjYkUFitFZDGJHZJIxDZJVJXZJFDJZJFpQvBNJBvBSJFvJxBrseQqDsVFVJdFLJDkEJNBkmNJYkFLJDoQJOPoGsJRoEAHBoEJfFbBQqDbBZJHbFVJXlFIJBjYIrXjeitcjjCEBjWMNBwXQfXwXOaFwDsJXwCJTRwrCZJMDNJQcDDJFcqDOPRYiJFTBsJXTQIJBTFEfXTFLJDrXEJFrEJXMrFZJFWEJdEWYTlm",
    "ABCDEFACNJTRAMBDJdAcNJVXBLNJEBXSIdWRXErNJkXYDJMBXZJCJaXMNJaYKKVJKcKDEJqXKDcNJhKVJrNYKbgJVXKFVJSBNBYBwDNJeQfXNJeEqXNhGJWENJFiJRQlIJbEQJfXxDQqXcfXQFNDEJQFwXUJDYcnUJDJIBgQDIUJTRDJFEqDSJQSJFSJQIJFSOPeZtSJFZJHCJXQfXCTDEqFGJBSJFGJBOfXGJBcqXGJHNJDGJRLiJEJfXEqEJFEJPEFpBEJYJBZJFYBwXUJYiJMEBYJZJyTYTONJXpQMFXFpeGIDdpJFstXpJFcPDLBVSJRLHQJqXLJFZJFIJBNJDIJBUqXIBkFDJIJEJPTIYJGWRIJeQPDIJeEfHIJFsJXOqGDSFHXEJqXgJCsJCgGQJqXgdQYJEgFMFNBgJFcqDVJwXUJVJFZJchIgJCCxOEJqXxOwXUJyDJBVRuscisciJBiJBieUtqXiJFDJkiFsJXQUGEZJcUJFsJXZtXIrXZDZJDrZJFNJDZJFstXvJFQqXvJFCJEsJXQJqkhkNGBbDJdTRbYJMEBlDwXUJMEFiJFcfXNJDRcNJWMTBLJXC",
    "BraFUtHBFSJFdbNBLJXVJQoYJNEBSJBEJfHSJHwXUJCJdAZJMGjaFVJXEJPNJBlEJfFiJFpFbFEJqIJBVJCrIBdHiJhOPFChvJVJZJNJWxGFNIFLueIBQJqUHEJfUFstOZJDrlXEASJRlXVJXSFwVJNJWD",
    "QJEJNNJDQJEJIBSFQJEJxegBQJEJfHEPSJBmXEJFSJCDEJqXLXNJFQqXIcQsFNJFIFEJqXUJgFsJXIJBUJEJfHNFvJxEqXNJnXUJFQqD",
    "IJBEJqXZJ",
];
const mapping =
    "~~AzB~X~a~KN~Q~D~S~C~G~E~Y~p~L~I~O~eH~g~V~hxyumi~~U~~Z~~v~~s~~dkoblPjfnqwMcRTr~W~~~F~~~~~Jt";
let wordlist$4 = null;
function hex(word) {
    return hexlify(toUtf8Bytes(word));
}
const KiYoKu = "0xe3818de38284e3818f";
const KyoKu = "0xe3818de38283e3818f";
function loadWords$4(lang) {
    if (wordlist$4 !== null) {
        return;
    }
    wordlist$4 = [];
    const transform = {};
    transform[toUtf8String([227, 130, 154])] = false;
    transform[toUtf8String([227, 130, 153])] = false;
    transform[toUtf8String([227, 130, 133])] = toUtf8String([227, 130, 134]);
    transform[toUtf8String([227, 129, 163])] = toUtf8String([227, 129, 164]);
    transform[toUtf8String([227, 130, 131])] = toUtf8String([227, 130, 132]);
    transform[toUtf8String([227, 130, 135])] = toUtf8String([227, 130, 136]);
    function normalize(word) {
        let result = "";
        for (let i = 0; i < word.length; i++) {
            let kana = word[i];
            const target = transform[kana];
            if (target === false) {
                continue;
            }
            if (target) {
                kana = target;
            }
            result += kana;
        }
        return result;
    }
    function sortJapanese(a, b) {
        a = normalize(a);
        b = normalize(b);
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
    for (let length = 3; length <= 9; length++) {
        const d = data[length - 3];
        for (let offset = 0; offset < d.length; offset += length) {
            const word = [];
            for (let i = 0; i < length; i++) {
                const k = mapping.indexOf(d[offset + i]);
                word.push(227);
                word.push(k & 64 ? 130 : 129);
                word.push((k & 63) + 128);
            }
            wordlist$4.push(toUtf8String(word));
        }
    }
    wordlist$4.sort(sortJapanese);
    if (hex(wordlist$4[442]) === KiYoKu && hex(wordlist$4[443]) === KyoKu) {
        const tmp = wordlist$4[442];
        wordlist$4[442] = wordlist$4[443];
        wordlist$4[443] = tmp;
    }
    if (
        Wordlist.check(lang) !==
        "0xcb36b09e6baa935787fd762ce65e80b0c6a8dabdfbc3a7f86ac0e2c4fd111600"
    ) {
        wordlist$4 = null;
        throw new Error("BIP39 Wordlist for ja (Japanese) FAILED");
    }
}
class LangJa extends Wordlist {
    constructor() {
        super("ja");
    }
    getWord(index) {
        loadWords$4(this);
        return wordlist$4[index];
    }
    getWordIndex(word) {
        loadWords$4(this);
        return wordlist$4.indexOf(word);
    }
    split(mnemonic) {
        logger$k.checkNormalize();
        return mnemonic.split(/(?:\u3000| )+/g);
    }
    join(words) {
        return words.join("　");
    }
}
const langJa = new LangJa();
Wordlist.register(langJa);
("use strict");
const data$1 = [
    "OYAa",
    "ATAZoATBl3ATCTrATCl8ATDloATGg3ATHT8ATJT8ATJl3ATLlvATLn4ATMT8ATMX8ATMboATMgoAToLbAToMTATrHgATvHnAT3AnAT3JbAT3MTAT8DbAT8JTAT8LmAT8MYAT8MbAT#LnAUHT8AUHZvAUJXrAUJX8AULnrAXJnvAXLUoAXLgvAXMn6AXRg3AXrMbAX3JTAX3QbAYLn3AZLgvAZrSUAZvAcAZ8AaAZ8AbAZ8AnAZ8HnAZ8LgAZ8MYAZ8MgAZ8OnAaAboAaDTrAaFTrAaJTrAaJboAaLVoAaMXvAaOl8AaSeoAbAUoAbAg8AbAl4AbGnrAbMT8AbMXrAbMn4AbQb8AbSV8AbvRlAb8AUAb8AnAb8HgAb8JTAb8NTAb8RbAcGboAcLnvAcMT8AcMX8AcSToAcrAaAcrFnAc8AbAc8MgAfGgrAfHboAfJnvAfLV8AfLkoAfMT8AfMnoAfQb8AfScrAfSgrAgAZ8AgFl3AgGX8AgHZvAgHgrAgJXoAgJX8AgJboAgLZoAgLn4AgOX8AgoATAgoAnAgoCUAgoJgAgoLXAgoMYAgoSeAgrDUAgrJTAhrFnAhrLjAhrQgAjAgoAjJnrAkMX8AkOnoAlCTvAlCV8AlClvAlFg4AlFl6AlFn3AloSnAlrAXAlrAfAlrFUAlrFbAlrGgAlrOXAlvKnAlvMTAl3AbAl3MnAnATrAnAcrAnCZ3AnCl8AnDg8AnFboAnFl3AnHX4AnHbrAnHgrAnIl3AnJgvAnLXoAnLX4AnLbrAnLgrAnLhrAnMXoAnMgrAnOn3AnSbrAnSeoAnvLnAn3OnCTGgvCTSlvCTvAUCTvKnCTvNTCT3CZCT3GUCT3MTCT8HnCUCZrCULf8CULnvCU3HnCU3JUCY6NUCbDb8CbFZoCbLnrCboOTCboScCbrFnCbvLnCb8AgCb8HgCb$LnCkLfoClBn3CloDUDTHT8DTLl3DTSU8DTrAaDTrLXDTrLjDTrOYDTrOgDTvFXDTvFnDT3HUDT3LfDUCT9DUDT4DUFVoDUFV8DUFkoDUGgrDUJnrDULl8DUMT8DUMXrDUMX4DUMg8DUOUoDUOgvDUOg8DUSToDUSZ8DbDXoDbDgoDbGT8DbJn3DbLg3DbLn4DbMXrDbMg8DbOToDboJXGTClvGTDT8GTFZrGTLVoGTLlvGTLl3GTMg8GTOTvGTSlrGToCUGTrDgGTrJYGTrScGTtLnGTvAnGTvQgGUCZrGUDTvGUFZoGUHXrGULnvGUMT8GUoMgGXoLnGXrMXGXrMnGXvFnGYLnvGZOnvGZvOnGZ8LaGZ8LmGbAl3GbDYvGbDlrGbHX3GbJl4GbLV8GbLn3GbMn4GboJTGboRfGbvFUGb3GUGb4JnGgDX3GgFl$GgJlrGgLX6GgLZoGgLf8GgOXoGgrAgGgrJXGgrMYGgrScGgvATGgvOYGnAgoGnJgvGnLZoGnLg3GnLnrGnQn8GnSbrGnrMgHTClvHTDToHTFT3HTQT8HToJTHToJgHTrDUHTrMnHTvFYHTvRfHT8MnHT8SUHUAZ8HUBb4HUDTvHUoMYHXFl6HXJX6HXQlrHXrAUHXrMnHXrSbHXvFYHXvKXHX3LjHX3MeHYvQlHZrScHZvDbHbAcrHbFT3HbFl3HbJT8HbLTrHbMT8HbMXrHbMbrHbQb8HbSX3HboDbHboJTHbrFUHbrHgHbrJTHb8JTHb8MnHb8QgHgAlrHgDT3HgGgrHgHgrHgJTrHgJT8HgLX@HgLnrHgMT8HgMX8HgMboHgOnrHgQToHgRg3HgoHgHgrCbHgrFnHgrLVHgvAcHgvAfHnAloHnCTrHnCnvHnGTrHnGZ8HnGnvHnJT8HnLf8HnLkvHnMg8HnRTrITvFUITvFnJTAXrJTCV8JTFT3JTFT8JTFn4JTGgvJTHT8JTJT8JTJXvJTJl3JTJnvJTLX4JTLf8JTLhvJTMT8JTMXrJTMnrJTObrJTQT8JTSlvJT8DUJT8FkJT8MTJT8OXJT8OgJT8QUJT8RfJUHZoJXFT4JXFlrJXGZ8JXGnrJXLV8JXLgvJXMXoJXMX3JXNboJXPlvJXoJTJXoLkJXrAXJXrHUJXrJgJXvJTJXvOnJX4KnJYAl3JYJT8JYLhvJYQToJYrQXJY6NUJbAl3JbCZrJbDloJbGT8JbGgrJbJXvJbJboJbLf8JbLhrJbLl3JbMnvJbRg8JbSZ8JboDbJbrCZJbrSUJb3KnJb8LnJfRn8JgAXrJgCZrJgDTrJgGZrJgGZ8JgHToJgJT8JgJXoJgJgvJgLX4JgLZ3JgLZ8JgLn4JgMgrJgMn4JgOgvJgPX6JgRnvJgSToJgoCZJgoJbJgoMYJgrJXJgrJgJgrLjJg6MTJlCn3JlGgvJlJl8Jl4AnJl8FnJl8HgJnAToJnATrJnAbvJnDUoJnGnrJnJXrJnJXvJnLhvJnLnrJnLnvJnMToJnMT8JnMXvJnMX3JnMg8JnMlrJnMn4JnOX8JnST4JnSX3JnoAgJnoAnJnoJTJnoObJnrAbJnrAkJnrHnJnrJTJnrJYJnrOYJnrScJnvCUJnvFaJnvJgJnvJnJnvOYJnvQUJnvRUJn3FnJn3JTKnFl3KnLT6LTDlvLTMnoLTOn3LTRl3LTSb4LTSlrLToAnLToJgLTrAULTrAcLTrCULTrHgLTrMgLT3JnLULnrLUMX8LUoJgLVATrLVDTrLVLb8LVoJgLV8MgLV8RTLXDg3LXFlrLXrCnLXrLXLX3GTLX4GgLX4OYLZAXrLZAcrLZAgrLZAhrLZDXyLZDlrLZFbrLZFl3LZJX6LZJX8LZLc8LZLnrLZSU8LZoJTLZoJnLZrAgLZrAnLZrJYLZrLULZrMgLZrSkLZvAnLZvGULZvJeLZvOTLZ3FZLZ4JXLZ8STLZ8ScLaAT3LaAl3LaHT8LaJTrLaJT8LaJXrLaJgvLaJl4LaLVoLaMXrLaMXvLaMX8LbClvLbFToLbHlrLbJn4LbLZ3LbLhvLbMXrLbMnoLbvSULcLnrLc8HnLc8MTLdrMnLeAgoLeOgvLeOn3LfAl3LfLnvLfMl3LfOX8Lf8AnLf8JXLf8LXLgJTrLgJXrLgJl8LgMX8LgRZrLhCToLhrAbLhrFULhrJXLhvJYLjHTrLjHX4LjJX8LjLhrLjSX3LjSZ4LkFX4LkGZ8LkGgvLkJTrLkMXoLkSToLkSU8LkSZ8LkoOYLl3FfLl3MgLmAZrLmCbrLmGgrLmHboLmJnoLmJn3LmLfoLmLhrLmSToLnAX6LnAb6LnCZ3LnCb3LnDTvLnDb8LnFl3LnGnrLnHZvLnHgvLnITvLnJT8LnJX8LnJlvLnLf8LnLg6LnLhvLnLnoLnMXrLnMg8LnQlvLnSbrLnrAgLnrAnLnrDbLnrFkLnrJdLnrMULnrOYLnrSTLnvAnLnvDULnvHgLnvOYLnvOnLn3GgLn4DULn4JTLn4JnMTAZoMTAloMTDb8MTFT8MTJnoMTJnrMTLZrMTLhrMTLkvMTMX8MTRTrMToATMTrDnMTrOnMT3JnMT4MnMT8FUMT8FaMT8FlMT8GTMT8GbMT8GnMT8HnMT8JTMT8JbMT8OTMUCl8MUJTrMUJU8MUMX8MURTrMUSToMXAX6MXAb6MXCZoMXFXrMXHXrMXLgvMXOgoMXrAUMXrAnMXrHgMXrJYMXrJnMXrMTMXrMgMXrOYMXrSZMXrSgMXvDUMXvOTMX3JgMX3OTMX4JnMX8DbMX8FnMX8HbMX8HgMX8HnMX8LbMX8MnMX8OnMYAb8MYGboMYHTvMYHX4MYLTrMYLnvMYMToMYOgvMYRg3MYSTrMbAToMbAXrMbAl3MbAn8MbGZ8MbJT8MbJXrMbMXvMbMX8MbMnoMbrMUMb8AfMb8FbMb8FkMcJXoMeLnrMgFl3MgGTvMgGXoMgGgrMgGnrMgHT8MgHZrMgJnoMgLnrMgLnvMgMT8MgQUoMgrHnMgvAnMg8HgMg8JYMg8LfMloJnMl8ATMl8AXMl8JYMnAToMnAT4MnAZ8MnAl3MnAl4MnCl8MnHT8MnHg8MnJnoMnLZoMnLhrMnMXoMnMX3MnMnrMnOgvMnrFbMnrFfMnrFnMnrNTMnvJXNTMl8OTCT3OTFV8OTFn3OTHZvOTJXrOTOl3OT3ATOT3JUOT3LZOT3LeOT3MbOT8ATOT8AbOT8AgOT8MbOUCXvOUMX3OXHXvOXLl3OXrMUOXvDbOX6NUOX8JbOYFZoOYLbrOYLkoOYMg8OYSX3ObHTrObHT4ObJgrObLhrObMX3ObOX8Ob8FnOeAlrOeJT8OeJXrOeJnrOeLToOeMb8OgJXoOgLXoOgMnrOgOXrOgOloOgoAgOgoJbOgoMYOgoSTOg8AbOjLX4OjMnoOjSV8OnLVoOnrAgOn3DUPXQlrPXvFXPbvFTPdAT3PlFn3PnvFbQTLn4QToAgQToMTQULV8QURg8QUoJnQXCXvQbFbrQb8AaQb8AcQb8FbQb8MYQb8ScQeAlrQeLhrQjAn3QlFXoQloJgQloSnRTLnvRTrGURTrJTRUJZrRUoJlRUrQnRZrLmRZrMnRZrSnRZ8ATRZ8JbRZ8ScRbMT8RbST3RfGZrRfMX8RfMgrRfSZrRnAbrRnGT8RnvJgRnvLfRnvMTRn8AaSTClvSTJgrSTOXrSTRg3STRnvSToAcSToAfSToAnSToHnSToLjSToMTSTrAaSTrEUST3BYST8AgST8LmSUAZvSUAgrSUDT4SUDT8SUGgvSUJXoSUJXvSULTrSU8JTSU8LjSV8AnSV8JgSXFToSXLf8SYvAnSZrDUSZrMUSZrMnSZ8HgSZ8JTSZ8JgSZ8MYSZ8QUSaQUoSbCT3SbHToSbQYvSbSl4SboJnSbvFbSb8HbSb8JgSb8OTScGZrScHgrScJTvScMT8ScSToScoHbScrMTScvAnSeAZrSeAcrSeHboSeJUoSeLhrSeMT8SeMXrSe6JgSgHTrSkJnoSkLnvSk8CUSlFl3SlrSnSl8GnSmAboSmGT8SmJU8",
    "ATLnDlATrAZoATrJX4ATrMT8ATrMX4ATrRTrATvDl8ATvJUoATvMl8AT3AToAT3MX8AT8CT3AT8DT8AT8HZrAT8HgoAUAgFnAUCTFnAXoMX8AXrAT8AXrGgvAXrJXvAXrOgoAXvLl3AZvAgoAZvFbrAZvJXoAZvJl8AZvJn3AZvMX8AZvSbrAZ8FZoAZ8LZ8AZ8MU8AZ8OTvAZ8SV8AZ8SX3AbAgFZAboJnoAbvGboAb8ATrAb8AZoAb8AgrAb8Al4Ab8Db8Ab8JnoAb8LX4Ab8LZrAb8LhrAb8MT8Ab8OUoAb8Qb8Ab8ST8AcrAUoAcrAc8AcrCZ3AcrFT3AcrFZrAcrJl4AcrJn3AcrMX3AcrOTvAc8AZ8Ac8MT8AfAcJXAgoFn4AgoGgvAgoGnrAgoLc8AgoMXoAgrLnrAkrSZ8AlFXCTAloHboAlrHbrAlrLhrAlrLkoAl3CZrAl3LUoAl3LZrAnrAl4AnrMT8An3HT4BT3IToBX4MnvBb!Ln$CTGXMnCToLZ4CTrHT8CT3JTrCT3RZrCT#GTvCU6GgvCU8Db8CU8GZrCU8HT8CboLl3CbrGgrCbrMU8Cb8DT3Cb8GnrCb8LX4Cb8MT8Cb8ObrCgrGgvCgrKX4Cl8FZoDTrAbvDTrDboDTrGT6DTrJgrDTrMX3DTrRZrDTrRg8DTvAVvDTvFZoDT3DT8DT3Ln3DT4HZrDT4MT8DT8AlrDT8MT8DUAkGbDUDbJnDYLnQlDbDUOYDbMTAnDbMXSnDboAT3DboFn4DboLnvDj6JTrGTCgFTGTGgFnGTJTMnGTLnPlGToJT8GTrCT3GTrLVoGTrLnvGTrMX3GTrMboGTvKl3GZClFnGZrDT3GZ8DTrGZ8FZ8GZ8MXvGZ8On8GZ8ST3GbCnQXGbMbFnGboFboGboJg3GboMXoGb3JTvGb3JboGb3Mn6Gb3Qb8GgDXLjGgMnAUGgrDloGgrHX4GgrSToGgvAXrGgvAZvGgvFbrGgvLl3GgvMnvGnDnLXGnrATrGnrMboGnuLl3HTATMnHTAgCnHTCTCTHTrGTvHTrHTvHTrJX8HTrLl8HTrMT8HTrMgoHTrOTrHTuOn3HTvAZrHTvDTvHTvGboHTvJU8HTvLl3HTvMXrHTvQb4HT4GT6HT4JT8HT4Jb#HT8Al3HT8GZrHT8GgrHT8HX4HT8Jb8HT8JnoHT8LTrHT8LgvHT8SToHT8SV8HUoJUoHUoJX8HUoLnrHXrLZoHXvAl3HX3LnrHX4FkvHX4LhrHX4MXoHX4OnoHZrAZ8HZrDb8HZrGZ8HZrJnrHZvGZ8HZvLnvHZ8JnvHZ8LhrHbCXJlHbMTAnHboJl4HbpLl3HbrJX8HbrLnrHbrMnvHbvRYrHgoSTrHgrFV8HgrGZ8HgrJXoHgrRnvHgvBb!HgvGTrHgvHX4HgvHn!HgvLTrHgvSU8HnDnLbHnFbJbHnvDn8Hn6GgvHn!BTvJTCTLnJTQgFnJTrAnvJTrLX4JTrOUoJTvFn3JTvLnrJTvNToJT3AgoJT3Jn4JT3LhvJT3ObrJT8AcrJT8Al3JT8JT8JT8JnoJT8LX4JT8LnrJT8MX3JT8Rg3JT8Sc8JUoBTvJU8AToJU8GZ8JU8GgvJU8JTrJU8JXrJU8JnrJU8LnvJU8ScvJXHnJlJXrGgvJXrJU8JXrLhrJXrMT8JXrMXrJXrQUoJXvCTvJXvGZ8JXvGgrJXvQT8JX8Ab8JX8DT8JX8GZ8JX8HZvJX8LnrJX8MT8JX8MXoJX8MnvJX8ST3JYGnCTJbAkGbJbCTAnJbLTAcJboDT3JboLb6JbrAnvJbrCn3JbrDl8JbrGboJbrIZoJbrJnvJbrMnvJbrQb4Jb8RZrJeAbAnJgJnFbJgScAnJgrATrJgvHZ8JgvMn4JlJlFbJlLiQXJlLjOnJlRbOlJlvNXoJlvRl3Jl4AcrJl8AUoJl8MnrJnFnMlJnHgGbJnoDT8JnoFV8JnoGgvJnoIT8JnoQToJnoRg3JnrCZ3JnrGgrJnrHTvJnrLf8JnrOX8JnvAT3JnvFZoJnvGT8JnvJl4JnvMT8JnvMX8JnvOXrJnvPX6JnvSX3JnvSZrJn3MT8Jn3MX8Jn3RTrLTATKnLTJnLTLTMXKnLTRTQlLToGb8LTrAZ8LTrCZ8LTrDb8LTrHT8LT3PX6LT4FZoLT$CTvLT$GgrLUvHX3LVoATrLVoAgoLVoJboLVoMX3LVoRg3LV8CZ3LV8FZoLV8GTvLXrDXoLXrFbrLXvAgvLXvFlrLXvLl3LXvRn6LX4Mb8LX8GT8LYCXMnLYrMnrLZoSTvLZrAZvLZrAloLZrFToLZrJXvLZrJboLZrJl4LZrLnrLZrMT8LZrOgvLZrRnvLZrST4LZvMX8LZvSlvLZ8AgoLZ8CT3LZ8JT8LZ8LV8LZ8LZoLZ8Lg8LZ8SV8LZ8SbrLZ$HT8LZ$Mn4La6CTvLbFbMnLbRYFTLbSnFZLboJT8LbrAT9LbrGb3LbrQb8LcrJX8LcrMXrLerHTvLerJbrLerNboLgrDb8LgrGZ8LgrHTrLgrMXrLgrSU8LgvJTrLgvLl3Lg6Ll3LhrLnrLhrMT8LhvAl4LiLnQXLkoAgrLkoJT8LkoJn4LlrSU8Ll3FZoLl3HTrLl3JX8Ll3JnoLl3LToLmLeFbLnDUFbLnLVAnLnrATrLnrAZoLnrAb8LnrAlrLnrGgvLnrJU8LnrLZrLnrLhrLnrMb8LnrOXrLnrSZ8LnvAb4LnvDTrLnvDl8LnvHTrLnvHbrLnvJT8LnvJU8LnvJbrLnvLhvLnvMX8LnvMb8LnvNnoLnvSU8Ln3Al3Ln4FZoLn4GT6Ln4JgvLn4LhrLn4MT8Ln4SToMToCZrMToJX8MToLX4MToLf8MToRg3MTrEloMTvGb6MT3BTrMT3Lb6MT8AcrMT8AgrMT8GZrMT8JnoMT8LnrMT8MX3MUOUAnMXAbFnMXoAloMXoJX8MXoLf8MXoLl8MXrAb8MXrDTvMXrGT8MXrGgrMXrHTrMXrLf8MXrMU8MXrOXvMXrQb8MXvGT8MXvHTrMXvLVoMX3AX3MX3Jn3MX3LhrMX3MX3MX4AlrMX4OboMX8GTvMX8GZrMX8GgrMX8JT8MX8JX8MX8LhrMX8MT8MYDUFbMYMgDbMbGnFfMbvLX4MbvLl3Mb8Mb8Mb8ST4MgGXCnMg8ATrMg8AgoMg8CZrMg8DTrMg8DboMg8HTrMg8JgrMg8LT8MloJXoMl8AhrMl8JT8MnLgAUMnoJXrMnoLX4MnoLhrMnoMT8MnrAl4MnrDb8MnrOTvMnrOgvMnrQb8MnrSU8MnvGgrMnvHZ8Mn3MToMn4DTrMn4LTrMn4Mg8NnBXAnOTFTFnOToAToOTrGgvOTrJX8OT3JXoOT6MTrOT8GgrOT8HTpOT8MToOUoHT8OUoJT8OUoLn3OXrAgoOXrDg8OXrMT8OXvSToOX6CTvOX8CZrOX8OgrOb6HgvOb8AToOb8MT8OcvLZ8OgvAlrOgvHTvOgvJTrOgvJnrOgvLZrOgvLn4OgvMT8OgvRTrOg8AZoOg8DbvOnrOXoOnvJn4OnvLhvOnvRTrOn3GgoOn3JnvOn6JbvOn8OTrPTGYFTPbBnFnPbGnDnPgDYQTPlrAnvPlrETvPlrLnvPlrMXvPlvFX4QTMTAnQTrJU8QYCnJlQYJlQlQbGTQbQb8JnrQb8LZoQb8LnvQb8MT8Qb8Ml8Qb8ST4QloAl4QloHZvQloJX8QloMn8QnJZOlRTrAZvRTrDTrRTvJn4RTvLhvRT4Jb8RZrAZrRZ8AkrRZ8JU8RZ8LV8RZ8LnvRbJlQXRg3GboRg3MnvRg8AZ8Rg8JboRg8Jl4RnLTCbRnvFl3RnvQb8SToAl4SToCZrSToFZoSToHXrSToJU8SToJgvSToJl4SToLhrSToMX3STrAlvSTrCT9STrCgrSTrGgrSTrHXrSTrHboSTrJnoSTrNboSTvLnrST4AZoST8Ab8ST8JT8SUoJn3SU6HZ#SU6JTvSU8Db8SU8HboSU8LgrSV8JT8SZrAcrSZrAl3SZrJT8SZrJnvSZrMT8SZvLUoSZ4FZoSZ8JnoSZ8RZrScoLnrScoMT8ScoMX8ScrAT4ScrAZ8ScrLZ8ScrLkvScvDb8ScvLf8ScvNToSgrFZrShvKnrSloHUoSloLnrSlrMXoSl8HgrSmrJUoSn3BX6",
    "ATFlOn3ATLgrDYAT4MTAnAT8LTMnAYJnRTrAbGgJnrAbLV8LnAbvNTAnAeFbLg3AgOYMXoAlQbFboAnDboAfAnJgoJTBToDgAnBUJbAl3BboDUAnCTDlvLnCTFTrSnCYoQTLnDTwAbAnDUDTrSnDUHgHgrDX8LXFnDbJXAcrETvLTLnGTFTQbrGTMnGToGT3DUFbGUJlPX3GbQg8LnGboJbFnGb3GgAYGgAg8ScGgMbAXrGgvAbAnGnJTLnvGnvATFgHTDT6ATHTrDlJnHYLnMn8HZrSbJTHZ8LTFnHbFTJUoHgSeMT8HgrLjAnHgvAbAnHlFUrDlHnDgvAnHnHTFT3HnQTGnrJTAaMXvJTGbCn3JTOgrAnJXvAXMnJbMg8SnJbMnRg3Jb8LTMnJnAl3OnJnGYrQlJnJlQY3LTDlCn3LTJjLg3LTLgvFXLTMg3GTLV8HUOgLXFZLg3LXNXrMnLX8QXFnLX9AlMYLYLXPXrLZAbJU8LZDUJU8LZMXrSnLZ$AgFnLaPXrDULbFYrMnLbMn8LXLboJgJgLeFbLg3LgLZrSnLgOYAgoLhrRnJlLkCTrSnLkOnLhrLnFX%AYLnFZoJXLnHTvJbLnLloAbMTATLf8MTHgJn3MTMXrAXMT3MTFnMUITvFnMXFX%AYMXMXvFbMXrFTDbMYAcMX3MbLf8SnMb8JbFnMgMXrMTMgvAXFnMgvGgCmMnAloSnMnFnJTrOXvMXSnOX8HTMnObJT8ScObLZFl3ObMXCZoPTLgrQXPUFnoQXPU3RXJlPX3RkQXPbrJXQlPlrJbFnQUAhrDbQXGnCXvQYLnHlvQbLfLnvRTOgvJbRXJYrQlRYLnrQlRbLnrQlRlFT8JlRlFnrQXSTClCn3STHTrAnSTLZQlrSTMnGTrSToHgGbSTrGTDnSTvGXCnST3HgFbSU3HXAXSbAnJn3SbFT8LnScLfLnv",
    "AT3JgJX8AT8FZoSnAT8JgFV8AT8LhrDbAZ8JT8DbAb8GgLhrAb8SkLnvAe8MT8SnAlMYJXLVAl3GYDTvAl3LfLnvBUDTvLl3CTOn3HTrCT3DUGgrCU8MT8AbCbFTrJUoCgrDb8MTDTLV8JX8DTLnLXQlDT8LZrSnDUQb8FZ8DUST4JnvDb8ScOUoDj6GbJl4GTLfCYMlGToAXvFnGboAXvLnGgAcrJn3GgvFnSToGnLf8JnvGn#HTDToHTLnFXJlHTvATFToHTvHTDToHTvMTAgoHT3STClvHT4AlFl6HT8HTDToHUoDgJTrHUoScMX3HbRZrMXoHboJg8LTHgDb8JTrHgMToLf8HgvLnLnoHnHn3HT4Hn6MgvAnJTJU8ScvJT3AaQT8JT8HTrAnJXrRg8AnJbAloMXoJbrATFToJbvMnoSnJgDb6GgvJgDb8MXoJgSX3JU8JguATFToJlPYLnQlJlQkDnLbJlQlFYJlJl8Lf8OTJnCTFnLbJnLTHXMnJnLXGXCnJnoFfRg3JnrMYRg3Jn3HgFl3KT8Dg8LnLTRlFnPTLTvPbLbvLVoSbrCZLXMY6HT3LXNU7DlrLXNXDTATLX8DX8LnLZDb8JU8LZMnoLhrLZSToJU8LZrLaLnrLZvJn3SnLZ8LhrSnLaJnoMT8LbFlrHTvLbrFTLnrLbvATLlvLb6OTFn3LcLnJZOlLeAT6Mn4LeJT3ObrLg6LXFlrLhrJg8LnLhvDlPX4LhvLfLnvLj6JTFT3LnFbrMXoLnQluCTvLnrQXCY6LnvLfLnvLnvMgLnvLnvSeLf8MTMbrJn3MT3JgST3MT8AnATrMT8LULnrMUMToCZrMUScvLf8MXoDT8SnMX6ATFToMX8AXMT8MX8FkMT8MX8HTrDUMX8ScoSnMYJT6CTvMgAcrMXoMg8SToAfMlvAXLg3MnFl3AnvOT3AnFl3OUoATHT8OU3RnLXrOXrOXrSnObPbvFn6Og8HgrSnOg8OX8DbPTvAgoJgPU3RYLnrPXrDnJZrPb8CTGgvPlrLTDlvPlvFUJnoQUvFXrQlQeMnoAl3QlrQlrSnRTFTrJUoSTDlLiLXSTFg6HT3STJgoMn4STrFTJTrSTrLZFl3ST4FnMXoSUrDlHUoScvHTvSnSfLkvMXo",
    "AUoAcrMXoAZ8HboAg8AbOg6ATFgAg8AloMXoAl3AT8JTrAl8MX8MXoCT3SToJU8Cl8Db8MXoDT8HgrATrDboOT8MXoGTOTrATMnGT8LhrAZ8GnvFnGnQXHToGgvAcrHTvAXvLl3HbrAZoMXoHgBlFXLg3HgMnFXrSnHgrSb8JUoHn6HT8LgvITvATrJUoJUoLZrRnvJU8HT8Jb8JXvFX8QT8JXvLToJTrJYrQnGnQXJgrJnoATrJnoJU8ScvJnvMnvMXoLTCTLgrJXLTJlRTvQlLbRnJlQYvLbrMb8LnvLbvFn3RnoLdCVSTGZrLeSTvGXCnLg3MnoLn3MToLlrETvMT8SToAl3MbrDU6GTvMb8LX4LhrPlrLXGXCnSToLf8Rg3STrDb8LTrSTvLTHXMnSb3RYLnMnSgOg6ATFg",
    "HUDlGnrQXrJTrHgLnrAcJYMb8DULc8LTvFgGnCk3Mg8JbAnLX4QYvFYHnMXrRUoJnGnvFnRlvFTJlQnoSTrBXHXrLYSUJgLfoMT8Se8DTrHbDb",
    "AbDl8SToJU8An3RbAb8ST8DUSTrGnrAgoLbFU6Db8LTrMg8AaHT8Jb8ObDl8SToJU8Pb3RlvFYoJl",
];
const codes =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
function getHangul(code) {
    if (code >= 40) {
        code = code + 168 - 40;
    } else if (code >= 19) {
        code = code + 97 - 19;
    }
    return toUtf8String([225, (code >> 6) + 132, (code & 63) + 128]);
}
let wordlist$5 = null;
function loadWords$5(lang) {
    if (wordlist$5 != null) {
        return;
    }
    wordlist$5 = [];
    data$1.forEach((data, length) => {
        length += 4;
        for (let i = 0; i < data.length; i += length) {
            let word = "";
            for (let j = 0; j < length; j++) {
                word += getHangul(codes.indexOf(data[i + j]));
            }
            wordlist$5.push(word);
        }
    });
    wordlist$5.sort();
    if (
        Wordlist.check(lang) !==
        "0xf9eddeace9c5d3da9c93cf7d3cd38f6a13ed3affb933259ae865714e8a3ae71a"
    ) {
        wordlist$5 = null;
        throw new Error("BIP39 Wordlist for ko (Korean) FAILED");
    }
}
class LangKo extends Wordlist {
    constructor() {
        super("ko");
    }
    getWord(index) {
        loadWords$5(this);
        return wordlist$5[index];
    }
    getWordIndex(word) {
        loadWords$5(this);
        return wordlist$5.indexOf(word);
    }
}
const langKo = new LangKo();
Wordlist.register(langKo);
("use strict");
const words$4 =
    "AbacoAbbaglioAbbinatoAbeteAbissoAbolireAbrasivoAbrogatoAccadereAccennoAccusatoAcetoneAchilleAcidoAcquaAcreAcrilicoAcrobataAcutoAdagioAddebitoAddomeAdeguatoAderireAdipeAdottareAdulareAffabileAffettoAffissoAffrantoAforismaAfosoAfricanoAgaveAgenteAgevoleAggancioAgireAgitareAgonismoAgricoloAgrumetoAguzzoAlabardaAlatoAlbatroAlberatoAlboAlbumeAlceAlcolicoAlettoneAlfaAlgebraAlianteAlibiAlimentoAllagatoAllegroAllievoAllodolaAllusivoAlmenoAlogenoAlpacaAlpestreAltalenaAlternoAlticcioAltroveAlunnoAlveoloAlzareAmalgamaAmanitaAmarenaAmbitoAmbratoAmebaAmericaAmetistaAmicoAmmassoAmmendaAmmirareAmmonitoAmoreAmpioAmpliareAmuletoAnacardoAnagrafeAnalistaAnarchiaAnatraAncaAncellaAncoraAndareAndreaAnelloAngeloAngolareAngustoAnimaAnnegareAnnidatoAnnoAnnuncioAnonimoAnticipoAnziApaticoAperturaApodeApparireAppetitoAppoggioApprodoAppuntoAprileArabicaArachideAragostaAraldicaArancioAraturaArazzoArbitroArchivioArditoArenileArgentoArgineArgutoAriaArmoniaArneseArredatoArringaArrostoArsenicoArsoArteficeArzilloAsciuttoAscoltoAsepsiAsetticoAsfaltoAsinoAsolaAspiratoAsproAssaggioAsseAssolutoAssurdoAstaAstenutoAsticeAstrattoAtavicoAteismoAtomicoAtonoAttesaAttivareAttornoAttritoAttualeAusilioAustriaAutistaAutonomoAutunnoAvanzatoAvereAvvenireAvvisoAvvolgereAzioneAzotoAzzimoAzzurroBabeleBaccanoBacinoBacoBadessaBadilataBagnatoBaitaBalconeBaldoBalenaBallataBalzanoBambinoBandireBaraondaBarbaroBarcaBaritonoBarlumeBaroccoBasilicoBassoBatostaBattutoBauleBavaBavosaBeccoBeffaBelgioBelvaBendaBenevoleBenignoBenzinaBereBerlinaBetaBibitaBiciBidoneBifidoBigaBilanciaBimboBinocoloBiologoBipedeBipolareBirbanteBirraBiscottoBisestoBisnonnoBisonteBisturiBizzarroBlandoBlattaBollitoBonificoBordoBoscoBotanicoBottinoBozzoloBraccioBradipoBramaBrancaBravuraBretellaBrevettoBrezzaBrigliaBrillanteBrindareBroccoloBrodoBronzinaBrulloBrunoBubboneBucaBudinoBuffoneBuioBulboBuonoBurloneBurrascaBussolaBustaCadettoCaducoCalamaroCalcoloCalesseCalibroCalmoCaloriaCambusaCamerataCamiciaCamminoCamolaCampaleCanapaCandelaCaneCaninoCanottoCantinaCapaceCapelloCapitoloCapogiroCapperoCapraCapsulaCarapaceCarcassaCardoCarismaCarovanaCarrettoCartolinaCasaccioCascataCasermaCasoCassoneCastelloCasualeCatastaCatenaCatrameCautoCavilloCedibileCedrataCefaloCelebreCellulareCenaCenoneCentesimoCeramicaCercareCertoCerumeCervelloCesoiaCespoCetoChelaChiaroChiccaChiedereChimeraChinaChirurgoChitarraCiaoCiclismoCifrareCignoCilindroCiottoloCircaCirrosiCitricoCittadinoCiuffoCivettaCivileClassicoClinicaCloroCoccoCodardoCodiceCoerenteCognomeCollareColmatoColoreColposoColtivatoColzaComaCometaCommandoComodoComputerComuneConcisoCondurreConfermaCongelareConiugeConnessoConoscereConsumoContinuoConvegnoCopertoCopioneCoppiaCopricapoCorazzaCordataCoricatoCorniceCorollaCorpoCorredoCorsiaCorteseCosmicoCostanteCotturaCovatoCratereCravattaCreatoCredereCremosoCrescitaCretaCricetoCrinaleCrisiCriticoCroceCronacaCrostataCrucialeCruscaCucireCuculoCuginoCullatoCupolaCuratoreCursoreCurvoCuscinoCustodeDadoDainoDalmataDamerinoDanielaDannosoDanzareDatatoDavantiDavveroDebuttoDecennioDecisoDeclinoDecolloDecretoDedicatoDefinitoDeformeDegnoDelegareDelfinoDelirioDeltaDemenzaDenotatoDentroDepositoDerapataDerivareDerogaDescrittoDesertoDesiderioDesumereDetersivoDevotoDiametroDicembreDiedroDifesoDiffusoDigerireDigitaleDiluvioDinamicoDinnanziDipintoDiplomaDipoloDiradareDireDirottoDirupoDisagioDiscretoDisfareDisgeloDispostoDistanzaDisumanoDitoDivanoDiveltoDividereDivoratoDobloneDocenteDoganaleDogmaDolceDomatoDomenicaDominareDondoloDonoDormireDoteDottoreDovutoDozzinaDragoDruidoDubbioDubitareDucaleDunaDuomoDupliceDuraturoEbanoEccessoEccoEclissiEconomiaEderaEdicolaEdileEditoriaEducareEgemoniaEgliEgoismoEgregioElaboratoElargireEleganteElencatoElettoElevareElficoElicaElmoElsaElusoEmanatoEmblemaEmessoEmiroEmotivoEmozioneEmpiricoEmuloEndemicoEnduroEnergiaEnfasiEnotecaEntrareEnzimaEpatiteEpilogoEpisodioEpocaleEppureEquatoreErarioErbaErbosoEredeEremitaErigereErmeticoEroeErosivoErranteEsagonoEsameEsanimeEsaudireEscaEsempioEsercitoEsibitoEsigenteEsistereEsitoEsofagoEsortatoEsosoEspansoEspressoEssenzaEssoEstesoEstimareEstoniaEstrosoEsultareEtilicoEtnicoEtruscoEttoEuclideoEuropaEvasoEvidenzaEvitatoEvolutoEvvivaFabbricaFaccendaFachiroFalcoFamigliaFanaleFanfaraFangoFantasmaFareFarfallaFarinosoFarmacoFasciaFastosoFasulloFaticareFatoFavolosoFebbreFecolaFedeFegatoFelpaFeltroFemminaFendereFenomenoFermentoFerroFertileFessuraFestivoFettaFeudoFiabaFiduciaFifaFiguratoFiloFinanzaFinestraFinireFioreFiscaleFisicoFiumeFlaconeFlamencoFleboFlemmaFloridoFluenteFluoroFobicoFocacciaFocosoFoderatoFoglioFolataFolcloreFolgoreFondenteFoneticoFoniaFontanaForbitoForchettaForestaFormicaFornaioForoFortezzaForzareFosfatoFossoFracassoFranaFrassinoFratelloFreccettaFrenataFrescoFrigoFrollinoFrondeFrugaleFruttaFucilataFucsiaFuggenteFulmineFulvoFumanteFumettoFumosoFuneFunzioneFuocoFurboFurgoneFuroreFusoFutileGabbianoGaffeGalateoGallinaGaloppoGamberoGammaGaranziaGarboGarofanoGarzoneGasdottoGasolioGastricoGattoGaudioGazeboGazzellaGecoGelatinaGelsoGemelloGemmatoGeneGenitoreGennaioGenotipoGergoGhepardoGhiaccioGhisaGialloGildaGineproGiocareGioielloGiornoGioveGiratoGironeGittataGiudizioGiuratoGiustoGlobuloGlutineGnomoGobbaGolfGomitoGommoneGonfioGonnaGovernoGracileGradoGraficoGrammoGrandeGrattareGravosoGraziaGrecaGreggeGrifoneGrigioGrinzaGrottaGruppoGuadagnoGuaioGuantoGuardareGufoGuidareIbernatoIconaIdenticoIdillioIdoloIdraIdricoIdrogenoIgieneIgnaroIgnoratoIlareIllesoIllogicoIlludereImballoImbevutoImboccoImbutoImmaneImmersoImmolatoImpaccoImpetoImpiegoImportoImprontaInalareInarcareInattivoIncantoIncendioInchinoIncisivoInclusoIncontroIncrocioIncuboIndagineIndiaIndoleIneditoInfattiInfilareInflittoIngaggioIngegnoIngleseIngordoIngrossoInnescoInodoreInoltrareInondatoInsanoInsettoInsiemeInsonniaInsulinaIntasatoInteroIntonacoIntuitoInumidireInvalidoInveceInvitoIperboleIpnoticoIpotesiIppicaIrideIrlandaIronicoIrrigatoIrrorareIsolatoIsotopoIstericoIstitutoIstriceItaliaIterareLabbroLabirintoLaccaLaceratoLacrimaLacunaLaddoveLagoLampoLancettaLanternaLardosoLargaLaringeLastraLatenzaLatinoLattugaLavagnaLavoroLegaleLeggeroLemboLentezzaLenzaLeoneLepreLesivoLessatoLestoLetteraleLevaLevigatoLiberoLidoLievitoLillaLimaturaLimitareLimpidoLineareLinguaLiquidoLiraLiricaLiscaLiteLitigioLivreaLocandaLodeLogicaLombareLondraLongevoLoquaceLorenzoLotoLotteriaLuceLucidatoLumacaLuminosoLungoLupoLuppoloLusingaLussoLuttoMacabroMacchinaMaceroMacinatoMadamaMagicoMagliaMagneteMagroMaiolicaMalafedeMalgradoMalintesoMalsanoMaltoMalumoreManaManciaMandorlaMangiareManifestoMannaroManovraMansardaMantideManubrioMappaMaratonaMarcireMarettaMarmoMarsupioMascheraMassaiaMastinoMaterassoMatricolaMattoneMaturoMazurcaMeandroMeccanicoMecenateMedesimoMeditareMegaMelassaMelisMelodiaMeningeMenoMensolaMercurioMerendaMerloMeschinoMeseMessereMestoloMetalloMetodoMettereMiagolareMicaMicelioMicheleMicroboMidolloMieleMiglioreMilanoMiliteMimosaMineraleMiniMinoreMirinoMirtilloMiscelaMissivaMistoMisurareMitezzaMitigareMitraMittenteMnemonicoModelloModificaModuloMoganoMogioMoleMolossoMonasteroMoncoMondinaMonetarioMonileMonotonoMonsoneMontatoMonvisoMoraMordereMorsicatoMostroMotivatoMotosegaMottoMovenzaMovimentoMozzoMuccaMucosaMuffaMughettoMugnaioMulattoMulinelloMultiploMummiaMuntoMuovereMuraleMusaMuscoloMusicaMutevoleMutoNababboNaftaNanometroNarcisoNariceNarratoNascereNastrareNaturaleNauticaNaviglioNebulosaNecrosiNegativoNegozioNemmenoNeofitaNerettoNervoNessunoNettunoNeutraleNeveNevroticoNicchiaNinfaNitidoNobileNocivoNodoNomeNominaNordicoNormaleNorvegeseNostranoNotareNotiziaNotturnoNovellaNucleoNullaNumeroNuovoNutrireNuvolaNuzialeOasiObbedireObbligoObeliscoOblioOboloObsoletoOccasioneOcchioOccidenteOccorrereOccultareOcraOculatoOdiernoOdorareOffertaOffrireOffuscatoOggettoOggiOgnunoOlandeseOlfattoOliatoOlivaOlogrammaOltreOmaggioOmbelicoOmbraOmegaOmissioneOndosoOnereOniceOnnivoroOnorevoleOntaOperatoOpinioneOppostoOracoloOrafoOrdineOrecchinoOreficeOrfanoOrganicoOrigineOrizzonteOrmaOrmeggioOrnativoOrologioOrrendoOrribileOrtensiaOrticaOrzataOrzoOsareOscurareOsmosiOspedaleOspiteOssaOssidareOstacoloOsteOtiteOtreOttagonoOttimoOttobreOvaleOvestOvinoOviparoOvocitoOvunqueOvviareOzioPacchettoPacePacificoPadellaPadronePaesePagaPaginaPalazzinaPalesarePallidoPaloPaludePandoroPannelloPaoloPaonazzoPapricaParabolaParcellaParerePargoloPariParlatoParolaPartireParvenzaParzialePassivoPasticcaPataccaPatologiaPattumePavonePeccatoPedalarePedonalePeggioPelosoPenarePendicePenisolaPennutoPenombraPensarePentolaPepePepitaPerbenePercorsoPerdonatoPerforarePergamenaPeriodoPermessoPernoPerplessoPersuasoPertugioPervasoPesatorePesistaPesoPestiferoPetaloPettinePetulantePezzoPiacerePiantaPiattinoPiccinoPicozzaPiegaPietraPifferoPigiamaPigolioPigroPilaPiliferoPillolaPilotaPimpantePinetaPinnaPinoloPioggiaPiomboPiramidePireticoPiritePirolisiPitonePizzicoPlaceboPlanarePlasmaPlatanoPlenarioPochezzaPoderosoPodismoPoesiaPoggiarePolentaPoligonoPollicePolmonitePolpettaPolsoPoltronaPolverePomicePomodoroPontePopolosoPorfidoPorosoPorporaPorrePortataPosaPositivoPossessoPostulatoPotassioPoterePranzoPrassiPraticaPreclusoPredicaPrefissoPregiatoPrelievoPremerePrenotarePreparatoPresenzaPretestoPrevalsoPrimaPrincipePrivatoProblemaProcuraProdurreProfumoProgettoProlungaPromessaPronomePropostaProrogaProtesoProvaPrudentePrugnaPruritoPsichePubblicoPudicaPugilatoPugnoPulcePulitoPulsantePuntarePupazzoPupillaPuroQuadroQualcosaQuasiQuerelaQuotaRaccoltoRaddoppioRadicaleRadunatoRafficaRagazzoRagioneRagnoRamarroRamingoRamoRandagioRantolareRapatoRapinaRappresoRasaturaRaschiatoRasenteRassegnaRastrelloRataRavvedutoRealeRecepireRecintoReclutaReconditoRecuperoRedditoRedimereRegalatoRegistroRegolaRegressoRelazioneRemareRemotoRennaReplicaReprimereReputareResaResidenteResponsoRestauroReteRetinaRetoricaRettificaRevocatoRiassuntoRibadireRibelleRibrezzoRicaricaRiccoRicevereRiciclatoRicordoRicredutoRidicoloRidurreRifasareRiflessoRiformaRifugioRigareRigettatoRighelloRilassatoRilevatoRimanereRimbalzoRimedioRimorchioRinascitaRincaroRinforzoRinnovoRinomatoRinsavitoRintoccoRinunciaRinvenireRiparatoRipetutoRipienoRiportareRipresaRipulireRisataRischioRiservaRisibileRisoRispettoRistoroRisultatoRisvoltoRitardoRitegnoRitmicoRitrovoRiunioneRivaRiversoRivincitaRivoltoRizomaRobaRoboticoRobustoRocciaRocoRodaggioRodereRoditoreRogitoRollioRomanticoRompereRonzioRosolareRospoRotanteRotondoRotulaRovescioRubizzoRubricaRugaRullinoRumineRumorosoRuoloRupeRussareRusticoSabatoSabbiareSabotatoSagomaSalassoSaldaturaSalgemmaSalivareSalmoneSaloneSaltareSalutoSalvoSapereSapidoSaporitoSaracenoSarcasmoSartoSassosoSatelliteSatiraSatolloSaturnoSavanaSavioSaziatoSbadiglioSbalzoSbancatoSbarraSbattereSbavareSbendareSbirciareSbloccatoSbocciatoSbrinareSbruffoneSbuffareScabrosoScadenzaScalaScambiareScandaloScapolaScarsoScatenareScavatoSceltoScenicoScettroSchedaSchienaSciarpaScienzaScindereScippoSciroppoScivoloSclerareScodellaScolpitoScompartoSconfortoScoprireScortaScossoneScozzeseScribaScrollareScrutinioScuderiaScultoreScuolaScuroScusareSdebitareSdoganareSeccaturaSecondoSedanoSeggiolaSegnalatoSegregatoSeguitoSelciatoSelettivoSellaSelvaggioSemaforoSembrareSemeSeminatoSempreSensoSentireSepoltoSequenzaSerataSerbatoSerenoSerioSerpenteSerraglioServireSestinaSetolaSettimanaSfaceloSfaldareSfamatoSfarzosoSfaticatoSferaSfidaSfilatoSfingeSfocatoSfoderareSfogoSfoltireSforzatoSfrattoSfruttatoSfuggitoSfumareSfusoSgabelloSgarbatoSgonfiareSgorbioSgrassatoSguardoSibiloSiccomeSierraSiglaSignoreSilenzioSillabaSimboloSimpaticoSimulatoSinfoniaSingoloSinistroSinoSintesiSinusoideSiparioSismaSistoleSituatoSlittaSlogaturaSlovenoSmarritoSmemoratoSmentitoSmeraldoSmilzoSmontareSmottatoSmussatoSnellireSnervatoSnodoSobbalzoSobrioSoccorsoSocialeSodaleSoffittoSognoSoldatoSolenneSolidoSollazzoSoloSolubileSolventeSomaticoSommaSondaSonettoSonniferoSopireSoppesoSopraSorgereSorpassoSorrisoSorsoSorteggioSorvolatoSospiroSostaSottileSpadaSpallaSpargereSpatolaSpaventoSpazzolaSpecieSpedireSpegnereSpelaturaSperanzaSpessoreSpettraleSpezzatoSpiaSpigolosoSpillatoSpinosoSpiraleSplendidoSportivoSposoSprangaSprecareSpronatoSpruzzoSpuntinoSquilloSradicareSrotolatoStabileStaccoStaffaStagnareStampatoStantioStarnutoStaseraStatutoSteloSteppaSterzoStilettoStimaStirpeStivaleStizzosoStonatoStoricoStrappoStregatoStriduloStrozzareStruttoStuccareStufoStupendoSubentroSuccosoSudoreSuggeritoSugoSultanoSuonareSuperboSupportoSurgelatoSurrogatoSussurroSuturaSvagareSvedeseSveglioSvelareSvenutoSveziaSviluppoSvistaSvizzeraSvoltaSvuotareTabaccoTabulatoTacciareTaciturnoTaleTalismanoTamponeTanninoTaraTardivoTargatoTariffaTarpareTartarugaTastoTatticoTavernaTavolataTazzaTecaTecnicoTelefonoTemerarioTempoTemutoTendoneTeneroTensioneTentacoloTeoremaTermeTerrazzoTerzettoTesiTesseratoTestatoTetroTettoiaTifareTigellaTimbroTintoTipicoTipografoTiraggioTiroTitanioTitoloTitubanteTizioTizzoneToccareTollerareToltoTombolaTomoTonfoTonsillaTopazioTopologiaToppaTorbaTornareTorroneTortoraToscanoTossireTostaturaTotanoTraboccoTracheaTrafilaTragediaTralcioTramontoTransitoTrapanoTrarreTraslocoTrattatoTraveTrecciaTremolioTrespoloTributoTrichecoTrifoglioTrilloTrinceaTrioTristezzaTrituratoTrivellaTrombaTronoTroppoTrottolaTrovareTruccatoTubaturaTuffatoTulipanoTumultoTunisiaTurbareTurchinoTutaTutelaUbicatoUccelloUccisoreUdireUditivoUffaUfficioUgualeUlisseUltimatoUmanoUmileUmorismoUncinettoUngereUnghereseUnicornoUnificatoUnisonoUnitarioUnteUovoUpupaUraganoUrgenzaUrloUsanzaUsatoUscitoUsignoloUsuraioUtensileUtilizzoUtopiaVacanteVaccinatoVagabondoVagliatoValangaValgoValicoVallettaValorosoValutareValvolaVampataVangareVanitosoVanoVantaggioVanveraVaporeVaranoVarcatoVarianteVascaVedettaVedovaVedutoVegetaleVeicoloVelcroVelinaVellutoVeloceVenatoVendemmiaVentoVeraceVerbaleVergognaVerificaVeroVerrucaVerticaleVescicaVessilloVestaleVeteranoVetrinaVetustoViandanteVibranteVicendaVichingoVicinanzaVidimareVigiliaVignetoVigoreVileVillanoViminiVincitoreViolaViperaVirgolaVirologoVirulentoViscosoVisioneVispoVissutoVisuraVitaVitelloVittimaVivandaVividoViziareVoceVogaVolatileVolereVolpeVoragineVulcanoZampognaZannaZappatoZatteraZavorraZefiroZelanteZeloZenzeroZerbinoZibettoZincoZirconeZittoZollaZoticoZuccheroZufoloZuluZuppa";
let wordlist$6 = null;
function loadWords$6(lang) {
    if (wordlist$6 != null) {
        return;
    }
    wordlist$6 = words$4
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .substring(1)
        .split(" ");
    if (
        Wordlist.check(lang) !==
        "0x5c1362d88fd4cf614a96f3234941d29f7d37c08c5292fde03bf62c2db6ff7620"
    ) {
        wordlist$6 = null;
        throw new Error("BIP39 Wordlist for it (Italian) FAILED");
    }
}
class LangIt extends Wordlist {
    constructor() {
        super("it");
    }
    getWord(index) {
        loadWords$6(this);
        return wordlist$6[index];
    }
    getWordIndex(word) {
        loadWords$6(this);
        return wordlist$6.indexOf(word);
    }
}
const langIt = new LangIt();
Wordlist.register(langIt);
("use strict");
const data$2 =
    "}aE#4A=Yv&co#4N#6G=cJ&SM#66|/Z#4t&kn~46#4K~4q%b9=IR#7l,mB#7W_X2*dl}Uo~7s}Uf&Iw#9c&cw~6O&H6&wx&IG%v5=IQ~8a&Pv#47$PR&50%Ko&QM&3l#5f,D9#4L|/H&tQ;v0~6n]nN<di,AM=W5%QO&ka&ua,hM^tm=zV=JA=wR&+X]7P&NB#4J#5L|/b[dA}tJ<Do&6m&u2[U1&Kb.HM&mC=w0&MW<rY,Hq#6M}QG,13&wP}Jp]Ow%ue&Kg<HP<D9~4k~9T&I2_c6$9T#9/[C5~7O~4a=cs&O7=KK=An&l9$6U$8A&uD&QI|/Y&bg}Ux&F2#6b}E2&JN&kW&kp=U/&bb=Xl<Cj}k+~5J#6L&5z&9i}b4&Fo,ho(X0_g3~4O$Fz&QE<HN=Ww]6/%GF-Vw=tj&/D&PN#9g=YO}cL&Of&PI~5I&Ip=vU=IW#9G;0o-wU}ss&QR<BT&R9=tk$PY_dh&Pq-yh]7T,nj.Xu=EP&76=cI&Fs*Xg}z7$Gb&+I=DF,AF=cA}rL#7j=Dz&3y<Aa$52=PQ}b0(iY$Fa}oL&xV#6U=ec=WZ,xh%RY<dp#9N&Fl&44=WH*A7=sh&TB&8P=07;u+&PK}uh}J5#72)V/=xC,AB$k0&f6;1E|+5=1B,3v]6n&wR%b+&xx]7f=Ol}fl;+D^wG]7E;nB;uh^Ir&l5=JL,nS=cf=g5;u6|/Q$Gc=MH%Hg#5d%M6^86=U+$Gz,l/,ir^5y&Ba&/F-IY&FI&be%IZ#77&PW_Nu$kE(Yf&NX]7Z,Jy&FJ(Xo&Nz#/d=y7&MX<Ag}Z+;nE]Dt(iG#4D=13&Pj~4c%v8&Zo%OL&/X#4W<HR&ie~6J_1O(Y2=y5=Ad*cv_eB#6k&PX:BU#7A;uk&Ft&Fx_dD=U2;vB=U5=4F}+O&GN.HH:9s=b0%NV(jO&IH=JT}Z9=VZ<Af,Kx^4m&uJ%c6,6r;9m#+L}cf%Kh&F3~4H=vP}bu,Hz|++,1w]nv}k6;uu$jw*Kl*WX&uM[x7&Fr[m7$NO&QN]hu=JN}nR^8g#/h(ps|KC;vd}xz=V0}p6&FD$G1#7K<bG_4p~8g&cf;u4=tl}+k%5/}fz;uw<cA=u1}gU}VM=LJ=eX&+L&Pr#4U}p2:nC,2K]7H:jF&9x}uX#9O=MB<fz~8X~5m&4D&kN&u5%E/(h7(ZF&VG<de(qM|/e-Wt=3x(a+,/R]f/&ND$Ro&nU}0g=KA%kH&NK$Ke<dS}cB&IX~5g$TN]6m=Uv,Is&Py=Ef%Kz#+/%bi&+A<F4$OG&4C&FL#9V<Zk=2I_eE&6c]nw&kq$HG}y+&A8$P3}OH=XP]70%IS(AJ_gH%GZ&tY&AZ=vb~6y&/r=VI=Wv<Zi=fl=xf&eL}c8}OL=MJ=g8$F7=YT}9u=0+^xC}JH&nL^N0~4T]K2,Cy%OC#6s;vG(AC^xe^cG&MF}Br#9P;wD-7h$O/&xA}Fn^PC]6i]7G&8V$Qs;vl(TB~73~4l<mW&6V=2y&uY&+3)aP}XF;LP&kx$wU=t7;uy<FN&lz)7E=Oo*Y+;wI}9q}le;J6&Ri&4t&Qr#8B=cb&vG=J5|Ql(h5<Yy~4+}QD,Lx=wn%K/&RK=dO&Pw,Q9=co%4u;9u}g0@6a^4I%b0=zo|/c&tX=dQ=OS#+b=yz_AB&wB&Pm=W9$HP_gR=62=AO=ti=hI,oA&jr&dH=tm&b6$P2(x8=zi;nG~7F;05]0n[Ix&3m}rg=Xp=cd&uz]7t;97=cN;vV<jf&FF&F1=6Q&Ik*Kk&P4,2z=fQ]7D&3u,H0=d/}Uw<ZN<7R}Kv;0f$H7,MD]7n$F0#88~9Z%da=by;+T#/u=VF&fO&kr^kf<AB]sU,I5$Ng&Pz;0i&QD&vM=Yl:BM;nJ_xJ]U7&Kf&30,3f|Z9*dC)je_jA&Q4&Kp$NH(Yz#6S&Id%Ib=KX,AD=KV%dP}tW&Pk^+E_Ni=cq,3R}VZ(Si=b+}rv;0j}rZ]uA,/w(Sx&Jv$w9&4d&wE,NJ$Gy=J/]Ls#7k<ZQ<Y/&uj]Ov$PM;v3,2F&+u:up=On&3e,Jv;90=J+&Qm]6q}bK#+d~8Y(h2]hA;99&AS=I/}qB&dQ}yJ-VM}Vl&ui,iB&G3|Dc]7d=eQ%dX%JC_1L~4d^NP;vJ&/1)ZI#7N]9X[bQ&PL=0L(UZ,Lm&kc&IR}n7(iR<AQ<dg=33=vN}ft}au]7I,Ba=x9=dR~6R&Tq=Xi,3d$Nr&Bc}DI&ku&vf]Dn,/F&iD,Ll&Nw=0y&I7=Ls=/A&tU=Qe}Ua&uk&+F=g4=gh=Vj#+1&Qn}Uy*44#5F,Pc&Rz*Xn=oh=5W;0n_Nf(iE<Y7=vr=Zu]oz#5Z%mI=kN=Bv_Jp(T2;vt_Ml<FS&uI=L/&6P]64$M7}86<bo%QX(SI%IY&VK=Al&Ux;vv;ut*E/%uh<ZE|O3,M2(yc]yu=Wk&tp:Ex}hr,Cl&WE)+Z=8U}I2_4Q,hA_si=iw=OM=tM=yZ%Ia=U7;wT}b+;uo=Za}yS!5x}HD}fb#5O_dA;Nv%uB(yB;01(Sf}Fk;v7}Pt#8v<mZ#7L,/r&Pl~4w&f5=Ph$Fw_LF&8m,bL=yJ&BH}p/*Jn}tU~5Q;wB(h6]Df]8p^+B;E4&Wc=d+;Ea&bw$8C&FN,DM=Yf}mP~5w=fT#6V=mC=Fi=AV}jB&AN}lW}aH#/D)dZ;hl;vE}/7,CJ;31&w8,hj%u9_Js=jJ&4M~8k=TN&eC}nL&uc-wi&lX}dj=Mv=e2#6u=cr$uq$6G]8W}Jb:nm=Yg<b3(UA;vX&6n&xF=KT,jC,De&R8&oY=Zv&oB]7/=Z2&Oa}bf,hh(4h^tZ&72&Nx;D2&xL~5h~40)ZG)h+=OJ&RA]Bv$yB=Oq=df,AQ%Jn}OJ;11,3z&Tl&tj;v+^Hv,Dh(id=s+]7N&N3)9Q~8f,S4=uW=w4&uX,LX&3d]CJ&yp&8x<b2_do&lP=y/<cy_dG=Oi=7R(VH(lt_1T,Iq_AA;12^6T%k6#8K[B1{oO<AU[Bt;1b$9S&Ps<8T=St{bY,jB(Zp&63&Uv$9V,PM]6v&Af}zW[bW_oq}sm}nB&Kq&gC&ff_eq_2m&5F&TI}rf}Gf;Zr_z9;ER&jk}iz_sn<BN~+n&vo=Vi%97|ZR=Wc,WE&6t]6z%85(ly#84=KY)6m_5/=aX,N3}Tm&he&6K]tR_B2-I3;u/&hU&lH<AP=iB&IA=XL;/5&Nh=wv<BH#79=vS=zl<AA=0X_RG}Bw&9p$NW,AX&kP_Lp&/Z(Tc]Mu}hs#6I}5B&cI<bq&H9#6m=K9}vH(Y1(Y0#4B&w6,/9&gG<bE,/O=zb}I4_l8<B/;wL%Qo<HO[Mq=XX}0v&BP&F4(mG}0i}nm,EC=9u{I3,xG&/9=JY*DK&hR)BX=EI=cx=b/{6k}yX%A+&wa}Xb=la;wi^lL;0t}jo&Qb=xg=XB}iO<qo{bR=NV&8f=a0&Jy;0v=uK)HK;vN#6h&jB(h/%ud&NI%wY.X7=Pt}Cu-uL&Gs_hl%mH,tm]78=Lb^Q0#7Y=1u<Bt&+Q=Co_RH,w3;1e}ux<aU;ui}U3&Q5%bt]63&UQ|0l&uL}O7&3o,AV&dm|Nj(Xt*5+(Uu&Hh(p7(UF=VR=Bp^Jl&Hd[ix)9/=Iq]C8<67]66}mB%6f}bb}JI]8T$HA}db=YM&pa=2J}tS&Y0=PS&y4=cX$6E,hX,XP&nR;04,FQ&l0&Vm_Dv#5Y~8Z=Bi%MA]6x=JO:+p,Az&9q,Hj~6/}SD=K1:EJ}nA;Qo#/E]9R,Ie&6X%W3]61&v4=xX_MC=0q;06(Xq=fs}IG}Dv=0l}o7$iZ;9v&LH&DP-7a&OY,SZ,Kz,Cv&dh=fx|Nh,F/~7q=XF&w+;9n&Gw;0h}Z7<7O&JK(S7&LS<AD<ac=wo<Dt&zw%4B=4v#8P;9o~6p*vV=Tm,Or&I6=1q}nY=P0=gq&Bl&Uu,Ch%yb}UY=zh}dh}rl(T4_xk(YA#8R*xH,IN}Jn]7V}C4&Ty}j3]7p=cL=3h&wW%Qv<Z3=f0&RI&+S(ic_zq}oN&/Y=z1;Td=LW=0e=OI(Vc,+b^ju(UL;0r:Za%8v=Rp=zw&58&73&wK}qX]6y&8E)a2}WR=wP^ur&nQ<cH}Re=Aq&wk}Q0&+q=PP,Gc|/d^k5,Fw]8Y}Pg]p3=ju=ed}r5_yf&Cs]7z$/G<Cm&Jp&54_1G_gP_Ll}JZ;0u]k8_7k(Sg]65{9i=LN&Sx&WK,iW&fD&Lk{9a}Em-9c#8N&io=sy]8d&nT&IK(lx#7/$lW(Td<s8~49,3o<7Y=MW(T+_Jr&Wd,iL}Ct=xh&5V;v4&8n%Kx=iF&l2_0B{B+,If(J0,Lv;u8=Kx-vB=HC&vS=Z6&fU&vE^xK;3D=4h=MR#45:Jw;0d}iw=LU}I5=I0]gB*im,K9}GU,1k_4U&Tt=Vs(iX&lU(TF#7y,ZO}oA&m5#5P}PN}Uz=hM<B1&FB<aG,e6~7T<tP(UQ_ZT=wu&F8)aQ]iN,1r_Lo&/g:CD}84{J1_Ki&Na&3n$jz&FE=dc;uv;va}in}ll=fv(h1&3h}fp=Cy}BM(+E~8m}lo%v7=hC(T6$cj=BQ=Bw(DR,2j=Ks,NS|F+;00=fU=70}Mb(YU;+G&m7&hr=Sk%Co]t+(X5_Jw}0r}gC(AS-IP&QK<Z2#8Q$WC]WX}T2&pG_Ka,HC=R4&/N;Z+;ch(C7,D4$3p_Mk&B2$8D=n9%Ky#5z(CT&QJ#7B]DC]gW}nf~5M;Iw#80}Tc_1F#4Z-aC}Hl=ph=fz,/3=aW}JM}nn;DG;vm}wn,4P}T3;wx&RG$u+}zK=0b;+J_Ek{re<aZ=AS}yY#5D]7q,Cp}xN=VP*2C}GZ}aG~+m_Cs=OY#6r]6g<GS}LC(UB=3A=Bo}Jy<c4}Is;1P<AG}Op<Z1}ld}nS=1Z,yM&95&98=CJ(4t:2L$Hk=Zo}Vc;+I}np&N1}9y=iv}CO*7p=jL)px]tb^zh&GS&Vl%v/;vR=14=zJ&49|/f]hF}WG;03=8P}o/&Gg&rp;DB,Kv}Ji&Pb;aA^ll(4j%yt}+K$Ht#4y&hY]7Y<F1,eN}bG(Uh%6Z]t5%G7;+F_RE;it}tL=LS&Da=Xx(S+(4f=8G=yI}cJ}WP=37=jS}pX}hd)fp<A8=Jt~+o$HJ=M6}iX=g9}CS=dv=Cj(mP%Kd,xq|+9&LD(4/=Xm&QP=Lc}LX&fL;+K=Op(lu=Qs.qC:+e&L+=Jj#8w;SL]7S(b+#4I=c1&nG_Lf&uH;+R)ZV<bV%B/,TE&0H&Jq&Ah%OF&Ss(p2,Wv&I3=Wl}Vq;1L&lJ#9b_1H=8r=b8=JH(SZ=hD=J2#7U,/U#/X~6P,FU<eL=jx,mG=hG=CE&PU=Se(qX&LY=X6=y4&tk&QQ&tf=4g&xI}W+&mZ=Dc#7w}Lg;DA;wQ_Kb(cJ=hR%yX&Yb,hw{bX_4X;EP;1W_2M}Uc=b5(YF,CM&Tp^OJ{DD]6s=vF=Yo~8q}XH}Fu%P5(SJ=Qt;MO]s8<F3&B3&8T(Ul-BS*dw&dR<87}/8]62$PZ]Lx<Au}9Q]7c=ja=KR,Go,Us&v6(qk}pG&G2=ev^GM%w4&H4]7F&dv]J6}Ew:9w=sj-ZL}Ym$+h(Ut(Um~4n=Xs(U7%eE=Qc_JR<CA#6t<Fv|/I,IS,EG<F2(Xy$/n<Fa(h9}+9_2o&N4#7X<Zq|+f_Dp=dt&na,Ca=NJ)jY=8C=YG=s6&Q+<DO}D3=xB&R1(lw;Qn<bF(Cu|/B}HV=SS&n7,10&u0]Dm%A6^4Q=WR(TD=Xo<GH,Rj(l8)bP&n/=LM&CF,F5&ml=PJ;0k=LG=tq,Rh,D6@4i=1p&+9=YC%er_Mh;nI;0q=Fw]80=xq=FM$Gv;v6&nc;wK%H2&Kj;vs,AA=YP,66}bI(qR~5U=6q~4b$Ni=K5.X3$So&Iu(p+]8G=Cf=RY(TS_O3(iH&57=fE=Dg_Do#9z#7H;FK{qd_2k%JR}en&gh_z8;Rx}9p<cN_Ne,DO;LN_7o~/p=NF=5Y}gN<ce<C1,QE]Wv=3u<BC}GK]yq}DY&u/_hj=II(pz&rC,jV&+Z}ut=NQ;Cg-SR_ZS,+o=u/;Oy_RK_QF(Fx&xP}Wr&TA,Uh&g1=yr{ax[VF$Pg(YB;Ox=Vy;+W(Sp}XV%dd&33(l/]l4#4Y}OE=6c=bw(A7&9t%wd&N/&mo,JH&Qe)fm=Ao}fu=tH";
const deltaData =
    "FAZDC6BALcLZCA+GBARCW8wNCcDDZ8LVFBOqqDUiou+M42TFAyERXFb7EjhP+vmBFpFrUpfDV2F7eB+eCltCHJFWLFCED+pWTojEIHFXc3aFn4F68zqjEuKidS1QBVPDEhE7NA4mhMF7oThD49ot3FgtzHFCK0acW1x8DH1EmLoIlrWFBLE+y5+NA3Cx65wJHTaEZVaK1mWAmPGxgYCdxwOjTDIt/faOEhTl1vqNsKtJCOhJWuio2g07KLZEQsFBUpNtwEByBgxFslFheFbiEPvi61msDvApxCzB6rBCzox7joYA5UdDc+Cb4FSgIabpXFAj3bjkmFAxCZE+mD/SFf/0ELecYCt3nLoxC6WEZf2tKDB4oZvrEmqFkKk7BwILA7gtYBpsTq//D4jD0F0wEB9pyQ1BD5Ba0oYHDI+sbDFhvrHXdDHfgFEIJLi5r8qercNFBgFLC4bo5ERJtamWBDFy73KCEb6M8VpmEt330ygCTK58EIIFkYgF84gtGA9Uyh3m68iVrFbWFbcbqiCYHZ9J1jeRPbL8yswhMiDbhEhdNoSwFbZrLT740ABEqgCkO8J1BLd1VhKKR4sD1yUo0z+FF59Mvg71CFbyEhbHSFBKEIKyoQNgQppq9T0KAqePu0ZFGrXOHdKJqkoTFhYvpDNyuuznrN84thJbsCoO6Cu6Xlvntvy0QYuAExQEYtTUBf3CoCqwgGFZ4u1HJFzDVwEy3cjcpV4QvsPaBC3rCGyCF23o4K3pp2gberGgFEJEHo4nHICtyKH2ZqyxhN05KBBJIQlKh/Oujv/DH32VrlqFdIFC7Fz9Ct4kaqFME0UETLprnN9kfy+kFmtQBB0+5CFu0N9Ij8l/VvJDh2oq3hT6EzjTHKFN7ZjZwoTsAZ4Exsko6Fpa6WC+sduz8jyrLpegTv2h1EBeYpLpm2czQW0KoCcS0bCVXCmuWJDBjN1nQNLdF58SFJ0h7i3pC3oEOKy/FjBklL70XvBEEIWp2yZ04xObzAWDDJG7f+DbqBEA7LyiR95j7MDVdDViz2RE5vWlBMv5e4+VfhP3aXNPhvLSynb9O2x4uFBV+3jqu6d5pCG28/sETByvmu/+IJ0L3wb4rj9DNOLBF6XPIODr4L19U9RRofAG6Nxydi8Bki8BhGJbBAJKzbJxkZSlF9Q2Cu8oKqggB9hBArwLLqEBWEtFowy8XK8bEyw9snT+BeyFk1ZCSrdmgfEwFePTgCjELBEnIbjaDDPJm36rG9pztcEzT8dGk23SBhXBB1H4z+OWze0ooFzz8pDBYFvp9j9tvFByf9y4EFdVnz026CGR5qMr7fxMHN8UUdlyJAzlTBDRC28k+L4FB8078ljyD91tUj1ocnTs8vdEf7znbzm+GIjEZnoZE5rnLL700Xc7yHfz05nWxy03vBB9YGHYOWxgMQGBCR24CVYNE1hpfKxN0zKnfJDmmMgMmBWqNbjfSyFCBWSCGCgR8yFXiHyEj+VtD1FB3FpC1zI0kFbzifiKTLm9yq5zFmur+q8FHqjoOBWsBPiDbnCC2ErunV6cJ6TygXFYHYp7MKN9RUlSIS8/xBAGYLzeqUnBF4QbsTuUkUqGs6CaiDWKWjQK9EJkjpkTmNCPYXL";
const wordlist$7 = { zh_cn: null, zh_tw: null };
const Checks = {
    zh_cn: "0x17bcc4d8547e5a7135e365d1ab443aaae95e76d8230c2782c67305d4f21497a1",
    zh_tw: "0x51e720e90c7b87bec1d70eb6e74a21a449bd3ec9c020b01d3a40ed991b60ce5d",
};
const codes$1 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const style = "~!@#$%^&*_-=[]{}|;:,.()<>?";
function loadWords$7(lang) {
    if (wordlist$7[lang.locale] !== null) {
        return;
    }
    wordlist$7[lang.locale] = [];
    let deltaOffset = 0;
    for (let i = 0; i < 2048; i++) {
        const s = style.indexOf(data$2[i * 3]);
        const bytes = [
            228 + (s >> 2),
            128 + codes$1.indexOf(data$2[i * 3 + 1]),
            128 + codes$1.indexOf(data$2[i * 3 + 2]),
        ];
        if (lang.locale === "zh_tw") {
            const common = s % 4;
            for (let i = common; i < 3; i++) {
                bytes[i] =
                    codes$1.indexOf(deltaData[deltaOffset++]) + (i == 0 ? 228 : 128);
            }
        }
        wordlist$7[lang.locale].push(toUtf8String(bytes));
    }
    if (Wordlist.check(lang) !== Checks[lang.locale]) {
        wordlist$7[lang.locale] = null;
        throw new Error("BIP39 Wordlist for " + lang.locale + " (Chinese) FAILED");
    }
}
class LangZh extends Wordlist {
    constructor(country) {
        super("zh_" + country);
    }
    getWord(index) {
        loadWords$7(this);
        return wordlist$7[this.locale][index];
    }
    getWordIndex(word) {
        loadWords$7(this);
        return wordlist$7[this.locale].indexOf(word);
    }
    split(mnemonic) {
        mnemonic = mnemonic.replace(/(?:\u3000| )+/g, "");
        return mnemonic.split("");
    }
}
const langZhCn = new LangZh("cn");
Wordlist.register(langZhCn);
Wordlist.register(langZhCn, "zh");
const langZhTw = new LangZh("tw");
Wordlist.register(langZhTw);
const wordlists = {
    cz: langCz,
    en: langEn,
    es: langEs,
    fr: langFr,
    it: langIt,
    ja: langJa,
    ko: langKo,
    zh: langZhCn,
    zh_cn: langZhCn,
    zh_tw: langZhTw,
};
("use strict");
const version$g = "hdnode/5.1.0";
("use strict");
const logger$l = new Logger(version$g);
const N = BigNumber.from(
    "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"
);
const MasterSecret = toUtf8Bytes("Bitcoin seed");
const HardenedBit = 2147483648;
function getUpperMask(bits) {
    return ((1 << bits) - 1) << (8 - bits);
}
function getLowerMask(bits) {
    return (1 << bits) - 1;
}
function bytes32(value) {
    return hexZeroPad(hexlify(value), 32);
}
function base58check(data) {
    return Base58.encode(
        concat([data, hexDataSlice(sha256$1(sha256$1(data)), 0, 4)])
    );
}
function getWordlist(wordlist) {
    if (wordlist == null) {
        return wordlists["en"];
    }
    if (typeof wordlist === "string") {
        const words = wordlists[wordlist];
        if (words == null) {
            logger$l.throwArgumentError("unknown locale", "wordlist", wordlist);
        }
        return words;
    }
    return wordlist;
}
const _constructorGuard$3 = {};
const defaultPath = "m/44'/60'/0'/0/0";
class HDNode {
    constructor(
        constructorGuard,
        privateKey,
        publicKey,
        parentFingerprint,
        chainCode,
        index,
        depth,
        mnemonicOrPath
    ) {
        logger$l.checkNew(new.target, HDNode);
        if (constructorGuard !== _constructorGuard$3) {
            throw new Error("HDNode constructor cannot be called directly");
        }
        if (privateKey) {
            const signingKey = new SigningKey(privateKey);
            defineReadOnly(this, "privateKey", signingKey.privateKey);
            defineReadOnly(this, "publicKey", signingKey.compressedPublicKey);
        } else {
            defineReadOnly(this, "privateKey", null);
            defineReadOnly(this, "publicKey", hexlify(publicKey));
        }
        defineReadOnly(this, "parentFingerprint", parentFingerprint);
        defineReadOnly(
            this,
            "fingerprint",
            hexDataSlice(ripemd160$1(sha256$1(this.publicKey)), 0, 4)
        );
        defineReadOnly(this, "address", computeAddress(this.publicKey));
        defineReadOnly(this, "chainCode", chainCode);
        defineReadOnly(this, "index", index);
        defineReadOnly(this, "depth", depth);
        if (mnemonicOrPath == null) {
            defineReadOnly(this, "mnemonic", null);
            defineReadOnly(this, "path", null);
        } else if (typeof mnemonicOrPath === "string") {
            defineReadOnly(this, "mnemonic", null);
            defineReadOnly(this, "path", mnemonicOrPath);
        } else {
            defineReadOnly(this, "mnemonic", mnemonicOrPath);
            defineReadOnly(this, "path", mnemonicOrPath.path);
        }
    }
    get extendedKey() {
        if (this.depth >= 256) {
            throw new Error("Depth too large!");
        }
        return base58check(
            concat([
                this.privateKey != null ? "0x0488ADE4" : "0x0488B21E",
                hexlify(this.depth),
                this.parentFingerprint,
                hexZeroPad(hexlify(this.index), 4),
                this.chainCode,
                this.privateKey != null
                    ? concat(["0x00", this.privateKey])
                    : this.publicKey,
            ])
        );
    }
    neuter() {
        return new HDNode(
            _constructorGuard$3,
            null,
            this.publicKey,
            this.parentFingerprint,
            this.chainCode,
            this.index,
            this.depth,
            this.path
        );
    }
    _derive(index) {
        if (index > 4294967295) {
            throw new Error("invalid index - " + String(index));
        }
        let path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
        }
        const data = new Uint8Array(37);
        if (index & HardenedBit) {
            if (!this.privateKey) {
                throw new Error("cannot derive child of neutered node");
            }
            data.set(arrayify(this.privateKey), 1);
            if (path) {
                path += "'";
            }
        } else {
            data.set(arrayify(this.publicKey));
        }
        for (let i = 24; i >= 0; i -= 8) {
            data[33 + (i >> 3)] = (index >> (24 - i)) & 255;
        }
        const I = arrayify(
            computeHmac(SupportedAlgorithm.sha512, this.chainCode, data)
        );
        const IL = I.slice(0, 32);
        const IR = I.slice(32);
        let ki = null;
        let Ki = null;
        if (this.privateKey) {
            ki = bytes32(BigNumber.from(IL).add(this.privateKey).mod(N));
        } else {
            const ek = new SigningKey(hexlify(IL));
            Ki = ek._addPoint(this.publicKey);
        }
        let mnemonicOrPath = path;
        const srcMnemonic = this.mnemonic;
        if (srcMnemonic) {
            mnemonicOrPath = Object.freeze({
                phrase: srcMnemonic.phrase,
                path: path,
                locale: srcMnemonic.locale || "en",
            });
        }
        return new HDNode(
            _constructorGuard$3,
            ki,
            Ki,
            this.fingerprint,
            bytes32(IR),
            index,
            this.depth + 1,
            mnemonicOrPath
        );
    }
    derivePath(path) {
        const components = path.split("/");
        if (
            components.length === 0 ||
            (components[0] === "m" && this.depth !== 0)
        ) {
            throw new Error("invalid path - " + path);
        }
        if (components[0] === "m") {
            components.shift();
        }
        let result = this;
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component.match(/^[0-9]+'$/)) {
                const index = parseInt(component.substring(0, component.length - 1));
                if (index >= HardenedBit) {
                    throw new Error("invalid path index - " + component);
                }
                result = result._derive(HardenedBit + index);
            } else if (component.match(/^[0-9]+$/)) {
                const index = parseInt(component);
                if (index >= HardenedBit) {
                    throw new Error("invalid path index - " + component);
                }
                result = result._derive(index);
            } else {
                throw new Error("invalid path component - " + component);
            }
        }
        return result;
    }
    static _fromSeed(seed, mnemonic) {
        const seedArray = arrayify(seed);
        if (seedArray.length < 16 || seedArray.length > 64) {
            throw new Error("invalid seed");
        }
        const I = arrayify(
            computeHmac(SupportedAlgorithm.sha512, MasterSecret, seedArray)
        );
        return new HDNode(
            _constructorGuard$3,
            bytes32(I.slice(0, 32)),
            null,
            "0x00000000",
            bytes32(I.slice(32)),
            0,
            0,
            mnemonic
        );
    }
    static fromMnemonic(mnemonic, password, wordlist) {
        wordlist = getWordlist(wordlist);
        mnemonic = entropyToMnemonic(
            mnemonicToEntropy(mnemonic, wordlist),
            wordlist
        );
        return HDNode._fromSeed(mnemonicToSeed(mnemonic, password), {
            phrase: mnemonic,
            path: "m",
            locale: wordlist.locale,
        });
    }
    static fromSeed(seed) {
        return HDNode._fromSeed(seed, null);
    }
    static fromExtendedKey(extendedKey) {
        const bytes = Base58.decode(extendedKey);
        if (
            bytes.length !== 82 ||
            base58check(bytes.slice(0, 78)) !== extendedKey
        ) {
            logger$l.throwArgumentError(
                "invalid extended key",
                "extendedKey",
                "[REDACTED]"
            );
        }
        const depth = bytes[4];
        const parentFingerprint = hexlify(bytes.slice(5, 9));
        const index = parseInt(hexlify(bytes.slice(9, 13)).substring(2), 16);
        const chainCode = hexlify(bytes.slice(13, 45));
        const key = bytes.slice(45, 78);
        switch (hexlify(bytes.slice(0, 4))) {
            case "0x0488b21e":
            case "0x043587cf":
                return new HDNode(
                    _constructorGuard$3,
                    null,
                    hexlify(key),
                    parentFingerprint,
                    chainCode,
                    index,
                    depth,
                    null
                );
            case "0x0488ade4":
            case "0x04358394 ":
                if (key[0] !== 0) {
                    break;
                }
                return new HDNode(
                    _constructorGuard$3,
                    hexlify(key.slice(1)),
                    null,
                    parentFingerprint,
                    chainCode,
                    index,
                    depth,
                    null
                );
        }
        return logger$l.throwArgumentError(
            "invalid extended key",
            "extendedKey",
            "[REDACTED]"
        );
    }
}
function mnemonicToSeed(mnemonic, password) {
    if (!password) {
        password = "";
    }
    const salt = toUtf8Bytes(
        "mnemonic" + password,
        UnicodeNormalizationForm.NFKD
    );
    return pbkdf2(
        toUtf8Bytes(mnemonic, UnicodeNormalizationForm.NFKD),
        salt,
        2048,
        64,
        "sha512"
    );
}
function mnemonicToEntropy(mnemonic, wordlist) {
    wordlist = getWordlist(wordlist);
    logger$l.checkNormalize();
    const words = wordlist.split(mnemonic);
    if (words.length % 3 !== 0) {
        throw new Error("invalid mnemonic");
    }
    const entropy = arrayify(new Uint8Array(Math.ceil((11 * words.length) / 8)));
    let offset = 0;
    for (let i = 0; i < words.length; i++) {
        let index = wordlist.getWordIndex(words[i].normalize("NFKD"));
        if (index === -1) {
            throw new Error("invalid mnemonic");
        }
        for (let bit = 0; bit < 11; bit++) {
            if (index & (1 << (10 - bit))) {
                entropy[offset >> 3] |= 1 << (7 - (offset % 8));
            }
            offset++;
        }
    }
    const entropyBits = (32 * words.length) / 3;
    const checksumBits = words.length / 3;
    const checksumMask = getUpperMask(checksumBits);
    const checksum =
        arrayify(sha256$1(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
    if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
        throw new Error("invalid checksum");
    }
    return hexlify(entropy.slice(0, entropyBits / 8));
}
function entropyToMnemonic(entropy, wordlist) {
    wordlist = getWordlist(wordlist);
    entropy = arrayify(entropy);
    if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
        throw new Error("invalid entropy");
    }
    const indices = [0];
    let remainingBits = 11;
    for (let i = 0; i < entropy.length; i++) {
        if (remainingBits > 8) {
            indices[indices.length - 1] <<= 8;
            indices[indices.length - 1] |= entropy[i];
            remainingBits -= 8;
        } else {
            indices[indices.length - 1] <<= remainingBits;
            indices[indices.length - 1] |= entropy[i] >> (8 - remainingBits);
            indices.push(entropy[i] & getLowerMask(8 - remainingBits));
            remainingBits += 3;
        }
    }
    const checksumBits = entropy.length / 4;
    const checksum = arrayify(sha256$1(entropy))[0] & getUpperMask(checksumBits);
    indices[indices.length - 1] <<= checksumBits;
    indices[indices.length - 1] |= checksum >> (8 - checksumBits);
    return wordlist.join(indices.map((index) => wordlist.getWord(index)));
}
function isValidMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
        return true;
    } catch (error) { }
    return false;
}
const version$h = "random/5.1.0";
("use strict");
const logger$m = new Logger(version$h);
let anyGlobal = null;
try {
    anyGlobal = window;
    if (anyGlobal == null) {
        throw new Error("try next");
    }
} catch (error) {
    try {
        anyGlobal = global;
        if (anyGlobal == null) {
            throw new Error("try next");
        }
    } catch (error) {
        anyGlobal = {};
    }
}
let crypto = anyGlobal.crypto || anyGlobal.msCrypto;
if (!crypto || !crypto.getRandomValues) {
    logger$m.warn("WARNING: Missing strong random number source");
    crypto = {
        getRandomValues: function (buffer) {
            return logger$m.throwError(
                "no secure random source avaialble",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "crypto.getRandomValues" }
            );
        },
    };
}
function randomBytes(length) {
    if (length <= 0 || length > 1024 || length % 1) {
        logger$m.throwArgumentError("invalid length", "length", length);
    }
    const result = new Uint8Array(length);
    crypto.getRandomValues(result);
    return arrayify(result);
}
("use strict");
function shuffled(array) {
    array = array.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
("use strict");
var aesJs = createCommonjsModule(function (module, exports) {
    "use strict";
    (function (root) {
        function checkInt(value) {
            return parseInt(value) === value;
        }
        function checkInts(arrayish) {
            if (!checkInt(arrayish.length)) {
                return false;
            }
            for (var i = 0; i < arrayish.length; i++) {
                if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                    return false;
                }
            }
            return true;
        }
        function coerceArray(arg, copy) {
            if (arg.buffer && ArrayBuffer.isView(arg) && arg.name === "Uint8Array") {
                if (copy) {
                    if (arg.slice) {
                        arg = arg.slice();
                    } else {
                        arg = Array.prototype.slice.call(arg);
                    }
                }
                return arg;
            }
            if (Array.isArray(arg)) {
                if (!checkInts(arg)) {
                    throw new Error("Array contains invalid value: " + arg);
                }
                return new Uint8Array(arg);
            }
            if (checkInt(arg.length) && checkInts(arg)) {
                return new Uint8Array(arg);
            }
            throw new Error("unsupported array-like object");
        }
        function createArray(length) {
            return new Uint8Array(length);
        }
        function copyArray(
            sourceArray,
            targetArray,
            targetStart,
            sourceStart,
            sourceEnd
        ) {
            if (sourceStart != null || sourceEnd != null) {
                if (sourceArray.slice) {
                    sourceArray = sourceArray.slice(sourceStart, sourceEnd);
                } else {
                    sourceArray = Array.prototype.slice.call(
                        sourceArray,
                        sourceStart,
                        sourceEnd
                    );
                }
            }
            targetArray.set(sourceArray, targetStart);
        }
        var convertUtf8 = (function () {
            function toBytes(text) {
                var result = [],
                    i = 0;
                text = encodeURI(text);
                while (i < text.length) {
                    var c = text.charCodeAt(i++);
                    if (c === 37) {
                        result.push(parseInt(text.substr(i, 2), 16));
                        i += 2;
                    } else {
                        result.push(c);
                    }
                }
                return coerceArray(result);
            }
            function fromBytes(bytes) {
                var result = [],
                    i = 0;
                while (i < bytes.length) {
                    var c = bytes[i];
                    if (c < 128) {
                        result.push(String.fromCharCode(c));
                        i++;
                    } else if (c > 191 && c < 224) {
                        result.push(
                            String.fromCharCode(((c & 31) << 6) | (bytes[i + 1] & 63))
                        );
                        i += 2;
                    } else {
                        result.push(
                            String.fromCharCode(
                                ((c & 15) << 12) |
                                ((bytes[i + 1] & 63) << 6) |
                                (bytes[i + 2] & 63)
                            )
                        );
                        i += 3;
                    }
                }
                return result.join("");
            }
            return { toBytes: toBytes, fromBytes: fromBytes };
        })();
        var convertHex = (function () {
            function toBytes(text) {
                var result = [];
                for (var i = 0; i < text.length; i += 2) {
                    result.push(parseInt(text.substr(i, 2), 16));
                }
                return result;
            }
            var Hex = "0123456789abcdef";
            function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 240) >> 4] + Hex[v & 15]);
                }
                return result.join("");
            }
            return { toBytes: toBytes, fromBytes: fromBytes };
        })();
        var numberOfRounds = { 16: 10, 24: 12, 32: 14 };
        var rcon = [
            1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188,
            99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
        ];
        var S = [
            99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
            202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
            192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
            21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117,
            9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83,
            209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
            239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81,
            163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210,
            205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
            96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219,
            224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121,
            231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
            186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
            112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158,
            225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40,
            223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187,
            22,
        ];
        var Si = [
            82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
            124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203,
            84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8,
            46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114,
            248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146,
            108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132,
            144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6,
            208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58,
            145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115,
            150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223,
            110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190,
            27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90,
            244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95,
            96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239,
            160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97,
            23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
        ];
        var T1 = [
            3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157,
            3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757,
            3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813,
            2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307,
            1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063,
            3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618,
            1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420,
            3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767,
            134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841,
            168101135, 798661301, 235341577, 605164086, 461406363, 3756188221,
            3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174,
            1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627,
            2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582,
            1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264,
            3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945,
            1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235,
            3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509,
            293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160,
            2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528,
            93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503,
            2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118,
            3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505,
            899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354,
            2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664,
            427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963,
            193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017,
            3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070,
            336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085,
            3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207,
            4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028,
            2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743,
            3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501,
            4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599,
            2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021,
            1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956,
            3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891,
            1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535,
            664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707,
            2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602,
            3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671,
            1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982,
            3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163,
            2824099068, 1841019862, 739644986,
        ];
        var T2 = [
            2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027,
            2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147,
            434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938,
            1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592,
            3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988,
            2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398,
            1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525,
            886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517,
            201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806,
            252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786,
            651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339,
            1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112,
            4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187,
            1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264,
            535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910,
            1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800,
            717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139,
            2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160,
            1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528,
            2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548,
            3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083,
            1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855,
            2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534,
            1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144,
            2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568,
            2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702,
            3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930,
            504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170,
            1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572,
            2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013,
            1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468,
            634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306,
            2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884,
            1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411,
            3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421,
            2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121,
            1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965,
            3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937,
            1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487,
            550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476,
            4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482,
            3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008,
            4238890068, 3597515707, 975967766,
        ];
        var T3 = [
            1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307,
            1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347,
            4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298,
            3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232,
            2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228,
            1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518,
            911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325,
            3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077,
            67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926,
            84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826,
            3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539,
            745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552,
            1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067,
            795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784,
            4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910,
            961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360,
            4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739,
            2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960,
            1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568,
            2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668,
            3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003,
            3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855,
            2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534,
            1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744,
            2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008,
            2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782,
            1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090,
            169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650,
            3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972,
            2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893,
            3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908,
            3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946,
            2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164,
            3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131,
            3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261,
            1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081,
            895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045,
            2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777,
            3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927,
            3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796,
            2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242,
            1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488,
            1425844308, 3151392187, 372911126,
        ];
        var T4 = [
            1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062,
            1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422,
            4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983,
            3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547,
            2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643,
            1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788,
            909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625,
            3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962,
            67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071,
            84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791,
            3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989,
            741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667,
            1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797,
            791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704,
            4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535,
            960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995,
            4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214,
            2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760,
            1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408,
            2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563,
            3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573,
            3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230,
            2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284,
            1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344,
            2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123,
            2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087,
            1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700,
            168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855,
            3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747,
            2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873,
            3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523,
            3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511,
            2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419,
            3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126,
            3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401,
            1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866,
            892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850,
            2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042,
            3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917,
            3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891,
            2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452,
            1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443,
            1414855848, 3149649517, 370555436,
        ];
        var T5 = [
            1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753,
            2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485,
            1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703,
            1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150,
            59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843,
            1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733,
            3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074,
            2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228,
            1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562,
            3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269,
            807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154,
            4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474,
            875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634,
            1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366,
            2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327,
            2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483,
            2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436,
            1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852,
            1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058,
            463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234,
            3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465,
            337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775,
            1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960,
            3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733,
            3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860,
            2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396,
            2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238,
            2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012,
            1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814,
            2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619,
            270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369,
            2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889,
            1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144,
            899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186,
            1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980,
            3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204,
            25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971,
            1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302,
            3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761,
            1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769,
            3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627,
            4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265,
            3576870512, 1215061108, 3501741890,
        ];
        var T6 = [
            1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933,
            2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900,
            4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723,
            2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385,
            3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473,
            692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113,
            3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529,
            1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523,
            1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122,
            1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824,
            4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204,
            4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614,
            2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839,
            106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461,
            3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937,
            3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598,
            1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696,
            1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017,
            560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918,
            2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114,
            3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840,
            3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030,
            3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940,
            1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268,
            4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330,
            3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036,
            446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778,
            915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837,
            223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799,
            4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129,
            2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319,
            2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859,
            3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884,
            3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336,
            4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085,
            3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314,
            1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086,
            325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127,
            901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326,
            3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179,
            1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897,
            1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980,
            1893020342, 1950903388, 1120974935,
        ];
        var T7 = [
            2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173,
            1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970,
            3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698,
            244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515,
            1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868,
            1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033,
            1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914,
            861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368,
            1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827,
            2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239,
            2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009,
            4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174,
            1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224,
            2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286,
            2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237,
            1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968,
            172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081,
            1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047,
            2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278,
            2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539,
            719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150,
            2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665,
            4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005,
            4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898,
            1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670,
            3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556,
            1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178,
            188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442,
            2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569,
            2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044,
            2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634,
            2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639,
            919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549,
            1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196,
            3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050,
            81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974,
            895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576,
            1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897,
            3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516,
            935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519,
            3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572,
            2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195,
            3060847922, 1551124588, 1463996600,
        ];
        var T8 = [
            4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623,
            4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885,
            3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053,
            3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835,
            2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848,
            3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143,
            3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389,
            1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913,
            1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242,
            529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619,
            679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159,
            133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524,
            777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424,
            1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981,
            1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582,
            1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953,
            2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766,
            1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162,
            1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748,
            2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234,
            2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765,
            514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535,
            1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070,
            3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413,
            3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325,
            3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816,
            4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628,
            3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092,
            2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814,
            3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464,
            410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844,
            1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714,
            1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454,
            2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521,
            3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700,
            2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909,
            2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841,
            3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542,
            1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736,
            3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274,
            1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712,
            227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555,
            850817237, 1817998408, 3092726480,
        ];
        var U1 = [
            0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554,
            708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108,
            1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990,
            4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216,
            2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058,
            3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343,
            3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029,
            3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995,
            899835584, 666464733, 699432150, 59727847, 226906860, 530400753,
            294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775,
            2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520,
            3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422,
            3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228,
            4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434,
            2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896,
            800440835, 92987698, 193195065, 429456164, 395441711, 1984812685,
            2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311,
            1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657,
            807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971,
            2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805,
            3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751,
            3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483,
            2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465,
            599762354, 159417987, 126454664, 361929877, 463180190, 2709260871,
            2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733,
            2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971,
            3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178,
            2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284,
            3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302,
            3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384,
            1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330,
            404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369,
            3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619,
            3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557,
            2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487,
            504459436, 875451293, 975658646, 675039627, 641025152, 2084704233,
            1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843,
            1451044056, 933301370, 967311729, 733156972, 632953703, 260388950,
            25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500,
            1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226,
            3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432,
            4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150,
            2438237621, 2203032232, 2370213795,
        ];
        var U2 = [
            0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694,
            824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388,
            2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410,
            2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776,
            3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918,
            3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543,
            1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569,
            1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355,
            3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933,
            4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895,
            3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975,
            3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917,
            2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523,
            2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409,
            1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751,
            53458370, 839224033, 957055980, 605657339, 790073846, 2373340630,
            2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216,
            3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602,
            4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276,
            545572369, 296679730, 446754879, 129166120, 213705253, 1709610350,
            1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296,
            1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598,
            3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840,
            2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386,
            1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268,
            1988838185, 533804130, 350174575, 164439672, 46346101, 870912086,
            954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643,
            2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929,
            3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127,
            3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309,
            457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035,
            2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319,
            182621114, 401639597, 486441376, 768917123, 651868046, 1003007129,
            818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387,
            2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917,
            2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703,
            3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473,
            3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720,
            1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390,
            1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636,
            3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122,
            4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200,
            3046200461, 2827177882, 2743944855,
        ];
        var U3 = [
            0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294,
            590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588,
            1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250,
            3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176,
            3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278,
            2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663,
            2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769,
            3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195,
            1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173,
            1224348052, 59984867, 244860394, 428169201, 344873464, 935293895,
            984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180,
            2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982,
            145085239, 532201772, 313773861, 830661914, 1015671571, 731183368,
            648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554,
            2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636,
            3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085,
            3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771,
            4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177,
            2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631,
            287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925,
            1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571,
            1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968,
            3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150,
            2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556,
            122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898,
            695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576,
            1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613,
            1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639,
            81781910, 331544205, 516552836, 1039717051, 821288114, 669961897,
            719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299,
            2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885,
            3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634,
            3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044,
            2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702,
            3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632,
            1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938,
            48394827, 369057872, 418672217, 1002783846, 919489135, 567498868,
            752375421, 209336225, 24197544, 376187827, 459744698, 945164165,
            895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635,
            1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881,
            3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127,
            4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285,
            2377486676, 2594734927, 2544078150,
        ];
        var U4 = [
            0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204,
            1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408,
            1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100,
            2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816,
            3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748,
            3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843,
            377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439,
            1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315,
            2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623,
            2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475,
            3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905,
            1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837,
            923313619, 740276417, 621982671, 439452389, 322734571, 137073913,
            19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589,
            3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641,
            3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550,
            1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426,
            1928707164, 96392454, 213114376, 396673818, 514443284, 562755902,
            679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866,
            3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230,
            2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026,
            2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953,
            3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765,
            3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481,
            1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413,
            1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841,
            425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038,
            3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674,
            2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542,
            2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834,
            1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990,
            349075736, 736970802, 585122620, 972512814, 821712160, 2595684844,
            2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464,
            2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212,
            4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952,
            292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068,
            1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848,
            2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775,
            2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155,
            4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431,
            953270745, 600235211, 718002117, 367585007, 484830689, 133361907,
            251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495,
            1418573201, 1335535747, 1184342925,
        ];
        function convertToInt32(bytes) {
            var result = [];
            for (var i = 0; i < bytes.length; i += 4) {
                result.push(
                    (bytes[i] << 24) |
                    (bytes[i + 1] << 16) |
                    (bytes[i + 2] << 8) |
                    bytes[i + 3]
                );
            }
            return result;
        }
        var AES = function (key) {
            if (!(this instanceof AES)) {
                throw Error("AES must be instanitated with `new`");
            }
            Object.defineProperty(this, "key", { value: coerceArray(key, true) });
            this._prepare();
        };
        AES.prototype._prepare = function () {
            var rounds = numberOfRounds[this.key.length];
            if (rounds == null) {
                throw new Error("invalid key size (must be 16, 24 or 32 bytes)");
            }
            this._Ke = [];
            this._Kd = [];
            for (var i = 0; i <= rounds; i++) {
                this._Ke.push([0, 0, 0, 0]);
                this._Kd.push([0, 0, 0, 0]);
            }
            var roundKeyCount = (rounds + 1) * 4;
            var KC = this.key.length / 4;
            var tk = convertToInt32(this.key);
            var index;
            for (var i = 0; i < KC; i++) {
                index = i >> 2;
                this._Ke[index][i % 4] = tk[i];
                this._Kd[rounds - index][i % 4] = tk[i];
            }
            var rconpointer = 0;
            var t = KC,
                tt;
            while (t < roundKeyCount) {
                tt = tk[KC - 1];
                tk[0] ^=
                    (S[(tt >> 16) & 255] << 24) ^
                    (S[(tt >> 8) & 255] << 16) ^
                    (S[tt & 255] << 8) ^
                    S[(tt >> 24) & 255] ^
                    (rcon[rconpointer] << 24);
                rconpointer += 1;
                if (KC != 8) {
                    for (var i = 1; i < KC; i++) {
                        tk[i] ^= tk[i - 1];
                    }
                } else {
                    for (var i = 1; i < KC / 2; i++) {
                        tk[i] ^= tk[i - 1];
                    }
                    tt = tk[KC / 2 - 1];
                    tk[KC / 2] ^=
                        S[tt & 255] ^
                        (S[(tt >> 8) & 255] << 8) ^
                        (S[(tt >> 16) & 255] << 16) ^
                        (S[(tt >> 24) & 255] << 24);
                    for (var i = KC / 2 + 1; i < KC; i++) {
                        tk[i] ^= tk[i - 1];
                    }
                }
                var i = 0,
                    r,
                    c;
                while (i < KC && t < roundKeyCount) {
                    r = t >> 2;
                    c = t % 4;
                    this._Ke[r][c] = tk[i];
                    this._Kd[rounds - r][c] = tk[i++];
                    t++;
                }
            }
            for (var r = 1; r < rounds; r++) {
                for (var c = 0; c < 4; c++) {
                    tt = this._Kd[r][c];
                    this._Kd[r][c] =
                        U1[(tt >> 24) & 255] ^
                        U2[(tt >> 16) & 255] ^
                        U3[(tt >> 8) & 255] ^
                        U4[tt & 255];
                }
            }
        };
        AES.prototype.encrypt = function (plaintext) {
            if (plaintext.length != 16) {
                throw new Error("invalid plaintext size (must be 16 bytes)");
            }
            var rounds = this._Ke.length - 1;
            var a = [0, 0, 0, 0];
            var t = convertToInt32(plaintext);
            for (var i = 0; i < 4; i++) {
                t[i] ^= this._Ke[0][i];
            }
            for (var r = 1; r < rounds; r++) {
                for (var i = 0; i < 4; i++) {
                    a[i] =
                        T1[(t[i] >> 24) & 255] ^
                        T2[(t[(i + 1) % 4] >> 16) & 255] ^
                        T3[(t[(i + 2) % 4] >> 8) & 255] ^
                        T4[t[(i + 3) % 4] & 255] ^
                        this._Ke[r][i];
                }
                t = a.slice();
            }
            var result = createArray(16),
                tt;
            for (var i = 0; i < 4; i++) {
                tt = this._Ke[rounds][i];
                result[4 * i] = (S[(t[i] >> 24) & 255] ^ (tt >> 24)) & 255;
                result[4 * i + 1] =
                    (S[(t[(i + 1) % 4] >> 16) & 255] ^ (tt >> 16)) & 255;
                result[4 * i + 2] = (S[(t[(i + 2) % 4] >> 8) & 255] ^ (tt >> 8)) & 255;
                result[4 * i + 3] = (S[t[(i + 3) % 4] & 255] ^ tt) & 255;
            }
            return result;
        };
        AES.prototype.decrypt = function (ciphertext) {
            if (ciphertext.length != 16) {
                throw new Error("invalid ciphertext size (must be 16 bytes)");
            }
            var rounds = this._Kd.length - 1;
            var a = [0, 0, 0, 0];
            var t = convertToInt32(ciphertext);
            for (var i = 0; i < 4; i++) {
                t[i] ^= this._Kd[0][i];
            }
            for (var r = 1; r < rounds; r++) {
                for (var i = 0; i < 4; i++) {
                    a[i] =
                        T5[(t[i] >> 24) & 255] ^
                        T6[(t[(i + 3) % 4] >> 16) & 255] ^
                        T7[(t[(i + 2) % 4] >> 8) & 255] ^
                        T8[t[(i + 1) % 4] & 255] ^
                        this._Kd[r][i];
                }
                t = a.slice();
            }
            var result = createArray(16),
                tt;
            for (var i = 0; i < 4; i++) {
                tt = this._Kd[rounds][i];
                result[4 * i] = (Si[(t[i] >> 24) & 255] ^ (tt >> 24)) & 255;
                result[4 * i + 1] =
                    (Si[(t[(i + 3) % 4] >> 16) & 255] ^ (tt >> 16)) & 255;
                result[4 * i + 2] = (Si[(t[(i + 2) % 4] >> 8) & 255] ^ (tt >> 8)) & 255;
                result[4 * i + 3] = (Si[t[(i + 1) % 4] & 255] ^ tt) & 255;
            }
            return result;
        };
        var ModeOfOperationECB = function (key) {
            if (!(this instanceof ModeOfOperationECB)) {
                throw Error("AES must be instanitated with `new`");
            }
            this.description = "Electronic Code Block";
            this.name = "ecb";
            this._aes = new AES(key);
        };
        ModeOfOperationECB.prototype.encrypt = function (plaintext) {
            plaintext = coerceArray(plaintext);
            if (plaintext.length % 16 !== 0) {
                throw new Error(
                    "invalid plaintext size (must be multiple of 16 bytes)"
                );
            }
            var ciphertext = createArray(plaintext.length);
            var block = createArray(16);
            for (var i = 0; i < plaintext.length; i += 16) {
                copyArray(plaintext, block, 0, i, i + 16);
                block = this._aes.encrypt(block);
                copyArray(block, ciphertext, i);
            }
            return ciphertext;
        };
        ModeOfOperationECB.prototype.decrypt = function (ciphertext) {
            ciphertext = coerceArray(ciphertext);
            if (ciphertext.length % 16 !== 0) {
                throw new Error(
                    "invalid ciphertext size (must be multiple of 16 bytes)"
                );
            }
            var plaintext = createArray(ciphertext.length);
            var block = createArray(16);
            for (var i = 0; i < ciphertext.length; i += 16) {
                copyArray(ciphertext, block, 0, i, i + 16);
                block = this._aes.decrypt(block);
                copyArray(block, plaintext, i);
            }
            return plaintext;
        };
        var ModeOfOperationCBC = function (key, iv) {
            if (!(this instanceof ModeOfOperationCBC)) {
                throw Error("AES must be instanitated with `new`");
            }
            this.description = "Cipher Block Chaining";
            this.name = "cbc";
            if (!iv) {
                iv = createArray(16);
            } else if (iv.length != 16) {
                throw new Error("invalid initialation vector size (must be 16 bytes)");
            }
            this._lastCipherblock = coerceArray(iv, true);
            this._aes = new AES(key);
        };
        ModeOfOperationCBC.prototype.encrypt = function (plaintext) {
            plaintext = coerceArray(plaintext);
            if (plaintext.length % 16 !== 0) {
                throw new Error(
                    "invalid plaintext size (must be multiple of 16 bytes)"
                );
            }
            var ciphertext = createArray(plaintext.length);
            var block = createArray(16);
            for (var i = 0; i < plaintext.length; i += 16) {
                copyArray(plaintext, block, 0, i, i + 16);
                for (var j = 0; j < 16; j++) {
                    block[j] ^= this._lastCipherblock[j];
                }
                this._lastCipherblock = this._aes.encrypt(block);
                copyArray(this._lastCipherblock, ciphertext, i);
            }
            return ciphertext;
        };
        ModeOfOperationCBC.prototype.decrypt = function (ciphertext) {
            ciphertext = coerceArray(ciphertext);
            if (ciphertext.length % 16 !== 0) {
                throw new Error(
                    "invalid ciphertext size (must be multiple of 16 bytes)"
                );
            }
            var plaintext = createArray(ciphertext.length);
            var block = createArray(16);
            for (var i = 0; i < ciphertext.length; i += 16) {
                copyArray(ciphertext, block, 0, i, i + 16);
                block = this._aes.decrypt(block);
                for (var j = 0; j < 16; j++) {
                    plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
                }
                copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
            }
            return plaintext;
        };
        var ModeOfOperationCFB = function (key, iv, segmentSize) {
            if (!(this instanceof ModeOfOperationCFB)) {
                throw Error("AES must be instanitated with `new`");
            }
            this.description = "Cipher Feedback";
            this.name = "cfb";
            if (!iv) {
                iv = createArray(16);
            } else if (iv.length != 16) {
                throw new Error("invalid initialation vector size (must be 16 size)");
            }
            if (!segmentSize) {
                segmentSize = 1;
            }
            this.segmentSize = segmentSize;
            this._shiftRegister = coerceArray(iv, true);
            this._aes = new AES(key);
        };
        ModeOfOperationCFB.prototype.encrypt = function (plaintext) {
            if (plaintext.length % this.segmentSize != 0) {
                throw new Error("invalid plaintext size (must be segmentSize bytes)");
            }
            var encrypted = coerceArray(plaintext, true);
            var xorSegment;
            for (var i = 0; i < encrypted.length; i += this.segmentSize) {
                xorSegment = this._aes.encrypt(this._shiftRegister);
                for (var j = 0; j < this.segmentSize; j++) {
                    encrypted[i + j] ^= xorSegment[j];
                }
                copyArray(
                    this._shiftRegister,
                    this._shiftRegister,
                    0,
                    this.segmentSize
                );
                copyArray(
                    encrypted,
                    this._shiftRegister,
                    16 - this.segmentSize,
                    i,
                    i + this.segmentSize
                );
            }
            return encrypted;
        };
        ModeOfOperationCFB.prototype.decrypt = function (ciphertext) {
            if (ciphertext.length % this.segmentSize != 0) {
                throw new Error("invalid ciphertext size (must be segmentSize bytes)");
            }
            var plaintext = coerceArray(ciphertext, true);
            var xorSegment;
            for (var i = 0; i < plaintext.length; i += this.segmentSize) {
                xorSegment = this._aes.encrypt(this._shiftRegister);
                for (var j = 0; j < this.segmentSize; j++) {
                    plaintext[i + j] ^= xorSegment[j];
                }
                copyArray(
                    this._shiftRegister,
                    this._shiftRegister,
                    0,
                    this.segmentSize
                );
                copyArray(
                    ciphertext,
                    this._shiftRegister,
                    16 - this.segmentSize,
                    i,
                    i + this.segmentSize
                );
            }
            return plaintext;
        };
        var ModeOfOperationOFB = function (key, iv) {
            if (!(this instanceof ModeOfOperationOFB)) {
                throw Error("AES must be instanitated with `new`");
            }
            this.description = "Output Feedback";
            this.name = "ofb";
            if (!iv) {
                iv = createArray(16);
            } else if (iv.length != 16) {
                throw new Error("invalid initialation vector size (must be 16 bytes)");
            }
            this._lastPrecipher = coerceArray(iv, true);
            this._lastPrecipherIndex = 16;
            this._aes = new AES(key);
        };
        ModeOfOperationOFB.prototype.encrypt = function (plaintext) {
            var encrypted = coerceArray(plaintext, true);
            for (var i = 0; i < encrypted.length; i++) {
                if (this._lastPrecipherIndex === 16) {
                    this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                    this._lastPrecipherIndex = 0;
                }
                encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
            }
            return encrypted;
        };
        ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;
        var Counter = function (initialValue) {
            if (!(this instanceof Counter)) {
                throw Error("Counter must be instanitated with `new`");
            }
            if (initialValue !== 0 && !initialValue) {
                initialValue = 1;
            }
            if (typeof initialValue === "number") {
                this._counter = createArray(16);
                this.setValue(initialValue);
            } else {
                this.setBytes(initialValue);
            }
        };
        Counter.prototype.setValue = function (value) {
            if (typeof value !== "number" || parseInt(value) != value) {
                throw new Error("invalid counter value (must be an integer)");
            }
            for (var index = 15; index >= 0; --index) {
                this._counter[index] = value % 256;
                value = value >> 8;
            }
        };
        Counter.prototype.setBytes = function (bytes) {
            bytes = coerceArray(bytes, true);
            if (bytes.length != 16) {
                throw new Error("invalid counter bytes size (must be 16 bytes)");
            }
            this._counter = bytes;
        };
        Counter.prototype.increment = function () {
            for (var i = 15; i >= 0; i--) {
                if (this._counter[i] === 255) {
                    this._counter[i] = 0;
                } else {
                    this._counter[i]++;
                    break;
                }
            }
        };
        var ModeOfOperationCTR = function (key, counter) {
            if (!(this instanceof ModeOfOperationCTR)) {
                throw Error("AES must be instanitated with `new`");
            }
            this.description = "Counter";
            this.name = "ctr";
            if (!(counter instanceof Counter)) {
                counter = new Counter(counter);
            }
            this._counter = counter;
            this._remainingCounter = null;
            this._remainingCounterIndex = 16;
            this._aes = new AES(key);
        };
        ModeOfOperationCTR.prototype.encrypt = function (plaintext) {
            var encrypted = coerceArray(plaintext, true);
            for (var i = 0; i < encrypted.length; i++) {
                if (this._remainingCounterIndex === 16) {
                    this._remainingCounter = this._aes.encrypt(this._counter._counter);
                    this._remainingCounterIndex = 0;
                    this._counter.increment();
                }
                encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
            }
            return encrypted;
        };
        ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;
        function pkcs7pad(data) {
            data = coerceArray(data, true);
            var padder = 16 - (data.length % 16);
            var result = createArray(data.length + padder);
            copyArray(data, result);
            for (var i = data.length; i < result.length; i++) {
                result[i] = padder;
            }
            return result;
        }
        function pkcs7strip(data) {
            data = coerceArray(data, true);
            if (data.length < 16) {
                throw new Error("PKCS#7 invalid length");
            }
            var padder = data[data.length - 1];
            if (padder > 16) {
                throw new Error("PKCS#7 padding byte out of range");
            }
            var length = data.length - padder;
            for (var i = 0; i < padder; i++) {
                if (data[length + i] !== padder) {
                    throw new Error("PKCS#7 invalid padding byte");
                }
            }
            var result = createArray(length);
            copyArray(data, result, 0, 0, length);
            return result;
        }
        var aesjs = {
            AES: AES,
            Counter: Counter,
            ModeOfOperation: {
                ecb: ModeOfOperationECB,
                cbc: ModeOfOperationCBC,
                cfb: ModeOfOperationCFB,
                ofb: ModeOfOperationOFB,
                ctr: ModeOfOperationCTR,
            },
            utils: { hex: convertHex, utf8: convertUtf8 },
            padding: { pkcs7: { pad: pkcs7pad, strip: pkcs7strip } },
            _arrayTest: {
                coerceArray: coerceArray,
                createArray: createArray,
                copyArray: copyArray,
            },
        };
        if ("object" !== "undefined") {
            module.exports = aesjs;
        } else if (typeof undefined === "function" && undefined.amd) {
            undefined(aesjs);
        } else {
            if (root.aesjs) {
                aesjs._aesjs = root.aesjs;
            }
            root.aesjs = aesjs;
        }
    })(commonjsGlobal);
});
const version$i = "json-wallets/5.1.0";
("use strict");
function looseArrayify(hexString) {
    if (typeof hexString === "string" && hexString.substring(0, 2) !== "0x") {
        hexString = "0x" + hexString;
    }
    return arrayify(hexString);
}
function zpad(value, length) {
    value = String(value);
    while (value.length < length) {
        value = "0" + value;
    }
    return value;
}
function getPassword(password) {
    if (typeof password === "string") {
        return toUtf8Bytes(password, UnicodeNormalizationForm.NFKC);
    }
    return arrayify(password);
}
function searchPath(object, path) {
    let currentChild = object;
    const comps = path.toLowerCase().split("/");
    for (let i = 0; i < comps.length; i++) {
        let matchingChild = null;
        for (const key in currentChild) {
            if (key.toLowerCase() === comps[i]) {
                matchingChild = currentChild[key];
                break;
            }
        }
        if (matchingChild === null) {
            return null;
        }
        currentChild = matchingChild;
    }
    return currentChild;
}
function uuidV4(randomBytes) {
    const bytes = arrayify(randomBytes);
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const value = hexlify(bytes);
    return [
        value.substring(2, 10),
        value.substring(10, 14),
        value.substring(14, 18),
        value.substring(18, 22),
        value.substring(22, 34),
    ].join("-");
}
("use strict");
const logger$n = new Logger(version$i);
class CrowdsaleAccount extends Description {
    isCrowdsaleAccount(value) {
        return !!(value && value._isCrowdsaleAccount);
    }
}
function decrypt(json, password) {
    const data = JSON.parse(json);
    password = getPassword(password);
    const ethaddr = getAddress(searchPath(data, "ethaddr"));
    const encseed = looseArrayify(searchPath(data, "encseed"));
    if (!encseed || encseed.length % 16 !== 0) {
        logger$n.throwArgumentError("invalid encseed", "json", json);
    }
    const key = arrayify(pbkdf2(password, password, 2e3, 32, "sha256")).slice(
        0,
        16
    );
    const iv = encseed.slice(0, 16);
    const encryptedSeed = encseed.slice(16);
    const aesCbc = new aesJs.ModeOfOperation.cbc(key, iv);
    const seed = aesJs.padding.pkcs7.strip(
        arrayify(aesCbc.decrypt(encryptedSeed))
    );
    let seedHex = "";
    for (let i = 0; i < seed.length; i++) {
        seedHex += String.fromCharCode(seed[i]);
    }
    const seedHexBytes = toUtf8Bytes(seedHex);
    const privateKey = keccak256(seedHexBytes);
    return new CrowdsaleAccount({
        _isCrowdsaleAccount: true,
        address: ethaddr,
        privateKey: privateKey,
    });
}
("use strict");
function isCrowdsaleWallet(json) {
    let data = null;
    try {
        data = JSON.parse(json);
    } catch (error) {
        return false;
    }
    return data.encseed && data.ethaddr;
}
function isKeystoreWallet(json) {
    let data = null;
    try {
        data = JSON.parse(json);
    } catch (error) {
        return false;
    }
    if (
        !data.version ||
        parseInt(data.version) !== data.version ||
        parseInt(data.version) !== 3
    ) {
        return false;
    }
    return true;
}
function getJsonWalletAddress(json) {
    if (isCrowdsaleWallet(json)) {
        try {
            return getAddress(JSON.parse(json).ethaddr);
        } catch (error) {
            return null;
        }
    }
    if (isKeystoreWallet(json)) {
        try {
            return getAddress(JSON.parse(json).address);
        } catch (error) {
            return null;
        }
    }
    return null;
}
var scrypt = createCommonjsModule(function (module, exports) {
    "use strict";
    (function (root) {
        const MAX_VALUE = 2147483647;
        function SHA256(m) {
            const K = new Uint32Array([
                1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
                2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
                1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
                264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
                2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
                113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
                1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
                3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
                430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
                1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
                2428436474, 2756734187, 3204031479, 3329325298,
            ]);
            let h0 = 1779033703,
                h1 = 3144134277,
                h2 = 1013904242,
                h3 = 2773480762;
            let h4 = 1359893119,
                h5 = 2600822924,
                h6 = 528734635,
                h7 = 1541459225;
            const w = new Uint32Array(64);
            function blocks(p) {
                let off = 0,
                    len = p.length;
                while (len >= 64) {
                    let a = h0,
                        b = h1,
                        c = h2,
                        d = h3,
                        e = h4,
                        f = h5,
                        g = h6,
                        h = h7,
                        u,
                        i,
                        j,
                        t1,
                        t2;
                    for (i = 0; i < 16; i++) {
                        j = off + i * 4;
                        w[i] =
                            ((p[j] & 255) << 24) |
                            ((p[j + 1] & 255) << 16) |
                            ((p[j + 2] & 255) << 8) |
                            (p[j + 3] & 255);
                    }
                    for (i = 16; i < 64; i++) {
                        u = w[i - 2];
                        t1 =
                            ((u >>> 17) | (u << (32 - 17))) ^
                            ((u >>> 19) | (u << (32 - 19))) ^
                            (u >>> 10);
                        u = w[i - 15];
                        t2 =
                            ((u >>> 7) | (u << (32 - 7))) ^
                            ((u >>> 18) | (u << (32 - 18))) ^
                            (u >>> 3);
                        w[i] = (((t1 + w[i - 7]) | 0) + ((t2 + w[i - 16]) | 0)) | 0;
                    }
                    for (i = 0; i < 64; i++) {
                        t1 =
                            ((((((e >>> 6) | (e << (32 - 6))) ^
                                ((e >>> 11) | (e << (32 - 11))) ^
                                ((e >>> 25) | (e << (32 - 25)))) +
                                ((e & f) ^ (~e & g))) |
                                0) +
                                ((h + ((K[i] + w[i]) | 0)) | 0)) |
                            0;
                        t2 =
                            ((((a >>> 2) | (a << (32 - 2))) ^
                                ((a >>> 13) | (a << (32 - 13))) ^
                                ((a >>> 22) | (a << (32 - 22)))) +
                                ((a & b) ^ (a & c) ^ (b & c))) |
                            0;
                        h = g;
                        g = f;
                        f = e;
                        e = (d + t1) | 0;
                        d = c;
                        c = b;
                        b = a;
                        a = (t1 + t2) | 0;
                    }
                    h0 = (h0 + a) | 0;
                    h1 = (h1 + b) | 0;
                    h2 = (h2 + c) | 0;
                    h3 = (h3 + d) | 0;
                    h4 = (h4 + e) | 0;
                    h5 = (h5 + f) | 0;
                    h6 = (h6 + g) | 0;
                    h7 = (h7 + h) | 0;
                    off += 64;
                    len -= 64;
                }
            }
            blocks(m);
            let i,
                bytesLeft = m.length % 64,
                bitLenHi = (m.length / 536870912) | 0,
                bitLenLo = m.length << 3,
                numZeros = bytesLeft < 56 ? 56 : 120,
                p = m.slice(m.length - bytesLeft, m.length);
            p.push(128);
            for (i = bytesLeft + 1; i < numZeros; i++) {
                p.push(0);
            }
            p.push((bitLenHi >>> 24) & 255);
            p.push((bitLenHi >>> 16) & 255);
            p.push((bitLenHi >>> 8) & 255);
            p.push((bitLenHi >>> 0) & 255);
            p.push((bitLenLo >>> 24) & 255);
            p.push((bitLenLo >>> 16) & 255);
            p.push((bitLenLo >>> 8) & 255);
            p.push((bitLenLo >>> 0) & 255);
            blocks(p);
            return [
                (h0 >>> 24) & 255,
                (h0 >>> 16) & 255,
                (h0 >>> 8) & 255,
                (h0 >>> 0) & 255,
                (h1 >>> 24) & 255,
                (h1 >>> 16) & 255,
                (h1 >>> 8) & 255,
                (h1 >>> 0) & 255,
                (h2 >>> 24) & 255,
                (h2 >>> 16) & 255,
                (h2 >>> 8) & 255,
                (h2 >>> 0) & 255,
                (h3 >>> 24) & 255,
                (h3 >>> 16) & 255,
                (h3 >>> 8) & 255,
                (h3 >>> 0) & 255,
                (h4 >>> 24) & 255,
                (h4 >>> 16) & 255,
                (h4 >>> 8) & 255,
                (h4 >>> 0) & 255,
                (h5 >>> 24) & 255,
                (h5 >>> 16) & 255,
                (h5 >>> 8) & 255,
                (h5 >>> 0) & 255,
                (h6 >>> 24) & 255,
                (h6 >>> 16) & 255,
                (h6 >>> 8) & 255,
                (h6 >>> 0) & 255,
                (h7 >>> 24) & 255,
                (h7 >>> 16) & 255,
                (h7 >>> 8) & 255,
                (h7 >>> 0) & 255,
            ];
        }
        function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
            password = password.length <= 64 ? password : SHA256(password);
            const innerLen = 64 + salt.length + 4;
            const inner = new Array(innerLen);
            const outerKey = new Array(64);
            let i;
            let dk = [];
            for (i = 0; i < 64; i++) {
                inner[i] = 54;
            }
            for (i = 0; i < password.length; i++) {
                inner[i] ^= password[i];
            }
            for (i = 0; i < salt.length; i++) {
                inner[64 + i] = salt[i];
            }
            for (i = innerLen - 4; i < innerLen; i++) {
                inner[i] = 0;
            }
            for (i = 0; i < 64; i++) outerKey[i] = 92;
            for (i = 0; i < password.length; i++) outerKey[i] ^= password[i];
            function incrementCounter() {
                for (let i = innerLen - 1; i >= innerLen - 4; i--) {
                    inner[i]++;
                    if (inner[i] <= 255) return;
                    inner[i] = 0;
                }
            }
            while (dkLen >= 32) {
                incrementCounter();
                dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
                dkLen -= 32;
            }
            if (dkLen > 0) {
                incrementCounter();
                dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
            }
            return dk;
        }
        function blockmix_salsa8(BY, Yi, r, x, _X) {
            let i;
            arraycopy(BY, (2 * r - 1) * 16, _X, 0, 16);
            for (i = 0; i < 2 * r; i++) {
                blockxor(BY, i * 16, _X, 16);
                salsa20_8(_X, x);
                arraycopy(_X, 0, BY, Yi + i * 16, 16);
            }
            for (i = 0; i < r; i++) {
                arraycopy(BY, Yi + i * 2 * 16, BY, i * 16, 16);
            }
            for (i = 0; i < r; i++) {
                arraycopy(BY, Yi + (i * 2 + 1) * 16, BY, (i + r) * 16, 16);
            }
        }
        function R(a, b) {
            return (a << b) | (a >>> (32 - b));
        }
        function salsa20_8(B, x) {
            arraycopy(B, 0, x, 0, 16);
            for (let i = 8; i > 0; i -= 2) {
                x[4] ^= R(x[0] + x[12], 7);
                x[8] ^= R(x[4] + x[0], 9);
                x[12] ^= R(x[8] + x[4], 13);
                x[0] ^= R(x[12] + x[8], 18);
                x[9] ^= R(x[5] + x[1], 7);
                x[13] ^= R(x[9] + x[5], 9);
                x[1] ^= R(x[13] + x[9], 13);
                x[5] ^= R(x[1] + x[13], 18);
                x[14] ^= R(x[10] + x[6], 7);
                x[2] ^= R(x[14] + x[10], 9);
                x[6] ^= R(x[2] + x[14], 13);
                x[10] ^= R(x[6] + x[2], 18);
                x[3] ^= R(x[15] + x[11], 7);
                x[7] ^= R(x[3] + x[15], 9);
                x[11] ^= R(x[7] + x[3], 13);
                x[15] ^= R(x[11] + x[7], 18);
                x[1] ^= R(x[0] + x[3], 7);
                x[2] ^= R(x[1] + x[0], 9);
                x[3] ^= R(x[2] + x[1], 13);
                x[0] ^= R(x[3] + x[2], 18);
                x[6] ^= R(x[5] + x[4], 7);
                x[7] ^= R(x[6] + x[5], 9);
                x[4] ^= R(x[7] + x[6], 13);
                x[5] ^= R(x[4] + x[7], 18);
                x[11] ^= R(x[10] + x[9], 7);
                x[8] ^= R(x[11] + x[10], 9);
                x[9] ^= R(x[8] + x[11], 13);
                x[10] ^= R(x[9] + x[8], 18);
                x[12] ^= R(x[15] + x[14], 7);
                x[13] ^= R(x[12] + x[15], 9);
                x[14] ^= R(x[13] + x[12], 13);
                x[15] ^= R(x[14] + x[13], 18);
            }
            for (let i = 0; i < 16; ++i) {
                B[i] += x[i];
            }
        }
        function blockxor(S, Si, D, len) {
            for (let i = 0; i < len; i++) {
                D[i] ^= S[Si + i];
            }
        }
        function arraycopy(src, srcPos, dest, destPos, length) {
            while (length--) {
                dest[destPos++] = src[srcPos++];
            }
        }
        function checkBufferish(o) {
            if (!o || typeof o.length !== "number") {
                return false;
            }
            for (let i = 0; i < o.length; i++) {
                const v = o[i];
                if (typeof v !== "number" || v % 1 || v < 0 || v >= 256) {
                    return false;
                }
            }
            return true;
        }
        function ensureInteger(value, name) {
            if (typeof value !== "number" || value % 1) {
                throw new Error("invalid " + name);
            }
            return value;
        }
        function _scrypt(password, salt, N, r, p, dkLen, callback) {
            N = ensureInteger(N, "N");
            r = ensureInteger(r, "r");
            p = ensureInteger(p, "p");
            dkLen = ensureInteger(dkLen, "dkLen");
            if (N === 0 || (N & (N - 1)) !== 0) {
                throw new Error("N must be power of 2");
            }
            if (N > MAX_VALUE / 128 / r) {
                throw new Error("N too large");
            }
            if (r > MAX_VALUE / 128 / p) {
                throw new Error("r too large");
            }
            if (!checkBufferish(password)) {
                throw new Error("password must be an array or buffer");
            }
            password = Array.prototype.slice.call(password);
            if (!checkBufferish(salt)) {
                throw new Error("salt must be an array or buffer");
            }
            salt = Array.prototype.slice.call(salt);
            let b = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
            const B = new Uint32Array(p * 32 * r);
            for (let i = 0; i < B.length; i++) {
                const j = i * 4;
                B[i] =
                    ((b[j + 3] & 255) << 24) |
                    ((b[j + 2] & 255) << 16) |
                    ((b[j + 1] & 255) << 8) |
                    ((b[j + 0] & 255) << 0);
            }
            const XY = new Uint32Array(64 * r);
            const V = new Uint32Array(32 * r * N);
            const Yi = 32 * r;
            const x = new Uint32Array(16);
            const _X = new Uint32Array(16);
            const totalOps = p * N * 2;
            let currentOp = 0;
            let lastPercent10 = null;
            let stop = false;
            let state = 0;
            let i0 = 0,
                i1;
            let Bi;
            const limit = callback ? parseInt(1e3 / r) : 4294967295;
            const nextTick =
                typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
            const incrementalSMix = function () {
                if (stop) {
                    return callback(new Error("cancelled"), currentOp / totalOps);
                }
                let steps;
                switch (state) {
                    case 0:
                        Bi = i0 * 32 * r;
                        arraycopy(B, Bi, XY, 0, Yi);
                        state = 1;
                        i1 = 0;
                    case 1:
                        steps = N - i1;
                        if (steps > limit) {
                            steps = limit;
                        }
                        for (let i = 0; i < steps; i++) {
                            arraycopy(XY, 0, V, (i1 + i) * Yi, Yi);
                            blockmix_salsa8(XY, Yi, r, x, _X);
                        }
                        i1 += steps;
                        currentOp += steps;
                        if (callback) {
                            const percent10 = parseInt((1e3 * currentOp) / totalOps);
                            if (percent10 !== lastPercent10) {
                                stop = callback(null, currentOp / totalOps);
                                if (stop) {
                                    break;
                                }
                                lastPercent10 = percent10;
                            }
                        }
                        if (i1 < N) {
                            break;
                        }
                        i1 = 0;
                        state = 2;
                    case 2:
                        steps = N - i1;
                        if (steps > limit) {
                            steps = limit;
                        }
                        for (let i = 0; i < steps; i++) {
                            const offset = (2 * r - 1) * 16;
                            const j = XY[offset] & (N - 1);
                            blockxor(V, j * Yi, XY, Yi);
                            blockmix_salsa8(XY, Yi, r, x, _X);
                        }
                        i1 += steps;
                        currentOp += steps;
                        if (callback) {
                            const percent10 = parseInt((1e3 * currentOp) / totalOps);
                            if (percent10 !== lastPercent10) {
                                stop = callback(null, currentOp / totalOps);
                                if (stop) {
                                    break;
                                }
                                lastPercent10 = percent10;
                            }
                        }
                        if (i1 < N) {
                            break;
                        }
                        arraycopy(XY, 0, B, Bi, Yi);
                        i0++;
                        if (i0 < p) {
                            state = 0;
                            break;
                        }
                        b = [];
                        for (let i = 0; i < B.length; i++) {
                            b.push((B[i] >> 0) & 255);
                            b.push((B[i] >> 8) & 255);
                            b.push((B[i] >> 16) & 255);
                            b.push((B[i] >> 24) & 255);
                        }
                        const derivedKey = PBKDF2_HMAC_SHA256_OneIter(password, b, dkLen);
                        if (callback) {
                            callback(null, 1, derivedKey);
                        }
                        return derivedKey;
                }
                if (callback) {
                    nextTick(incrementalSMix);
                }
            };
            if (!callback) {
                while (true) {
                    const derivedKey = incrementalSMix();
                    if (derivedKey != undefined) {
                        return derivedKey;
                    }
                }
            }
            incrementalSMix();
        }
        const lib = {
            scrypt: function (password, salt, N, r, p, dkLen, progressCallback) {
                return new Promise(function (resolve, reject) {
                    let lastProgress = 0;
                    if (progressCallback) {
                        progressCallback(0);
                    }
                    _scrypt(
                        password,
                        salt,
                        N,
                        r,
                        p,
                        dkLen,
                        function (error, progress, key) {
                            if (error) {
                                reject(error);
                            } else if (key) {
                                if (progressCallback && lastProgress !== 1) {
                                    progressCallback(1);
                                }
                                resolve(new Uint8Array(key));
                            } else if (progressCallback && progress !== lastProgress) {
                                lastProgress = progress;
                                return progressCallback(progress);
                            }
                        }
                    );
                });
            },
            syncScrypt: function (password, salt, N, r, p, dkLen) {
                return new Uint8Array(_scrypt(password, salt, N, r, p, dkLen));
            },
        };
        if ("object" !== "undefined") {
            module.exports = lib;
        } else if (typeof undefined === "function" && undefined.amd) {
            undefined(lib);
        } else if (root) {
            if (root.scrypt) {
                root._scrypt = root.scrypt;
            }
            root.scrypt = lib;
        }
    })(commonjsGlobal);
});
("use strict");
var __awaiter$4 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$o = new Logger(version$i);
function hasMnemonic(value) {
    return value != null && value.mnemonic && value.mnemonic.phrase;
}
class KeystoreAccount extends Description {
    isKeystoreAccount(value) {
        return !!(value && value._isKeystoreAccount);
    }
}
function _decrypt(data, key, ciphertext) {
    const cipher = searchPath(data, "crypto/cipher");
    if (cipher === "aes-128-ctr") {
        const iv = looseArrayify(searchPath(data, "crypto/cipherparams/iv"));
        const counter = new aesJs.Counter(iv);
        const aesCtr = new aesJs.ModeOfOperation.ctr(key, counter);
        return arrayify(aesCtr.decrypt(ciphertext));
    }
    return null;
}
function _getAccount(data, key) {
    const ciphertext = looseArrayify(searchPath(data, "crypto/ciphertext"));
    const computedMAC = hexlify(
        keccak256(concat([key.slice(16, 32), ciphertext]))
    ).substring(2);
    if (computedMAC !== searchPath(data, "crypto/mac").toLowerCase()) {
        throw new Error("invalid password");
    }
    const privateKey = _decrypt(data, key.slice(0, 16), ciphertext);
    if (!privateKey) {
        logger$o.throwError(
            "unsupported cipher",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "decrypt" }
        );
    }
    const mnemonicKey = key.slice(32, 64);
    const address = computeAddress(privateKey);
    if (data.address) {
        let check = data.address.toLowerCase();
        if (check.substring(0, 2) !== "0x") {
            check = "0x" + check;
        }
        if (getAddress(check) !== address) {
            throw new Error("address mismatch");
        }
    }
    const account = {
        _isKeystoreAccount: true,
        address: address,
        privateKey: hexlify(privateKey),
    };
    if (searchPath(data, "x-ethers/version") === "0.1") {
        const mnemonicCiphertext = looseArrayify(
            searchPath(data, "x-ethers/mnemonicCiphertext")
        );
        const mnemonicIv = looseArrayify(
            searchPath(data, "x-ethers/mnemonicCounter")
        );
        const mnemonicCounter = new aesJs.Counter(mnemonicIv);
        const mnemonicAesCtr = new aesJs.ModeOfOperation.ctr(
            mnemonicKey,
            mnemonicCounter
        );
        const path = searchPath(data, "x-ethers/path") || defaultPath;
        const locale = searchPath(data, "x-ethers/locale") || "en";
        const entropy = arrayify(mnemonicAesCtr.decrypt(mnemonicCiphertext));
        try {
            const mnemonic = entropyToMnemonic(entropy, locale);
            const node = HDNode.fromMnemonic(mnemonic, null, locale).derivePath(path);
            if (node.privateKey != account.privateKey) {
                throw new Error("mnemonic mismatch");
            }
            account.mnemonic = node.mnemonic;
        } catch (error) {
            if (
                error.code !== Logger.errors.INVALID_ARGUMENT ||
                error.argument !== "wordlist"
            ) {
                throw error;
            }
        }
    }
    return new KeystoreAccount(account);
}
function pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc) {
    return arrayify(pbkdf2(passwordBytes, salt, count, dkLen, prfFunc));
}
function pbkdf2$1(passwordBytes, salt, count, dkLen, prfFunc) {
    return Promise.resolve(
        pbkdf2Sync(passwordBytes, salt, count, dkLen, prfFunc)
    );
}
function _computeKdfKey(
    data,
    password,
    pbkdf2Func,
    scryptFunc,
    progressCallback
) {
    const passwordBytes = getPassword(password);
    const kdf = searchPath(data, "crypto/kdf");
    if (kdf && typeof kdf === "string") {
        const throwError = function (name, value) {
            return logger$o.throwArgumentError(
                "invalid key-derivation function parameters",
                name,
                value
            );
        };
        if (kdf.toLowerCase() === "scrypt") {
            const salt = looseArrayify(searchPath(data, "crypto/kdfparams/salt"));
            const N = parseInt(searchPath(data, "crypto/kdfparams/n"));
            const r = parseInt(searchPath(data, "crypto/kdfparams/r"));
            const p = parseInt(searchPath(data, "crypto/kdfparams/p"));
            if (!N || !r || !p) {
                throwError("kdf", kdf);
            }
            if ((N & (N - 1)) !== 0) {
                throwError("N", N);
            }
            const dkLen = parseInt(searchPath(data, "crypto/kdfparams/dklen"));
            if (dkLen !== 32) {
                throwError("dklen", dkLen);
            }
            return scryptFunc(passwordBytes, salt, N, r, p, 64, progressCallback);
        } else if (kdf.toLowerCase() === "pbkdf2") {
            const salt = looseArrayify(searchPath(data, "crypto/kdfparams/salt"));
            let prfFunc = null;
            const prf = searchPath(data, "crypto/kdfparams/prf");
            if (prf === "hmac-sha256") {
                prfFunc = "sha256";
            } else if (prf === "hmac-sha512") {
                prfFunc = "sha512";
            } else {
                throwError("prf", prf);
            }
            const count = parseInt(searchPath(data, "crypto/kdfparams/c"));
            const dkLen = parseInt(searchPath(data, "crypto/kdfparams/dklen"));
            if (dkLen !== 32) {
                throwError("dklen", dkLen);
            }
            return pbkdf2Func(passwordBytes, salt, count, dkLen, prfFunc);
        }
    }
    return logger$o.throwArgumentError(
        "unsupported key-derivation function",
        "kdf",
        kdf
    );
}
function decryptSync(json, password) {
    const data = JSON.parse(json);
    const key = _computeKdfKey(data, password, pbkdf2Sync, scrypt.syncScrypt);
    return _getAccount(data, key);
}
function decrypt$1(json, password, progressCallback) {
    return __awaiter$4(this, void 0, void 0, function* () {
        const data = JSON.parse(json);
        const key = yield _computeKdfKey(
            data,
            password,
            pbkdf2$1,
            scrypt.scrypt,
            progressCallback
        );
        return _getAccount(data, key);
    });
}
function encrypt(account, password, options, progressCallback) {
    try {
        if (getAddress(account.address) !== computeAddress(account.privateKey)) {
            throw new Error("address/privateKey mismatch");
        }
        if (hasMnemonic(account)) {
            const mnemonic = account.mnemonic;
            const node = HDNode.fromMnemonic(
                mnemonic.phrase,
                null,
                mnemonic.locale
            ).derivePath(mnemonic.path || defaultPath);
            if (node.privateKey != account.privateKey) {
                throw new Error("mnemonic mismatch");
            }
        }
    } catch (e) {
        return Promise.reject(e);
    }
    if (typeof options === "function" && !progressCallback) {
        progressCallback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    const privateKey = arrayify(account.privateKey);
    const passwordBytes = getPassword(password);
    let entropy = null;
    let path = null;
    let locale = null;
    if (hasMnemonic(account)) {
        const srcMnemonic = account.mnemonic;
        entropy = arrayify(
            mnemonicToEntropy(srcMnemonic.phrase, srcMnemonic.locale || "en")
        );
        path = srcMnemonic.path || defaultPath;
        locale = srcMnemonic.locale || "en";
    }
    let client = options.client;
    if (!client) {
        client = "ethers.js";
    }
    let salt = null;
    if (options.salt) {
        salt = arrayify(options.salt);
    } else {
        salt = randomBytes(32);
    }
    let iv = null;
    if (options.iv) {
        iv = arrayify(options.iv);
        if (iv.length !== 16) {
            throw new Error("invalid iv");
        }
    } else {
        iv = randomBytes(16);
    }
    let uuidRandom = null;
    if (options.uuid) {
        uuidRandom = arrayify(options.uuid);
        if (uuidRandom.length !== 16) {
            throw new Error("invalid uuid");
        }
    } else {
        uuidRandom = randomBytes(16);
    }
    let N = 1 << 17,
        r = 8,
        p = 1;
    if (options.scrypt) {
        if (options.scrypt.N) {
            N = options.scrypt.N;
        }
        if (options.scrypt.r) {
            r = options.scrypt.r;
        }
        if (options.scrypt.p) {
            p = options.scrypt.p;
        }
    }
    return scrypt
        .scrypt(passwordBytes, salt, N, r, p, 64, progressCallback)
        .then((key) => {
            key = arrayify(key);
            const derivedKey = key.slice(0, 16);
            const macPrefix = key.slice(16, 32);
            const mnemonicKey = key.slice(32, 64);
            const counter = new aesJs.Counter(iv);
            const aesCtr = new aesJs.ModeOfOperation.ctr(derivedKey, counter);
            const ciphertext = arrayify(aesCtr.encrypt(privateKey));
            const mac = keccak256(concat([macPrefix, ciphertext]));
            const data = {
                address: account.address.substring(2).toLowerCase(),
                id: uuidV4(uuidRandom),
                version: 3,
                Crypto: {
                    cipher: "aes-128-ctr",
                    cipherparams: { iv: hexlify(iv).substring(2) },
                    ciphertext: hexlify(ciphertext).substring(2),
                    kdf: "scrypt",
                    kdfparams: {
                        salt: hexlify(salt).substring(2),
                        n: N,
                        dklen: 32,
                        p: p,
                        r: r,
                    },
                    mac: mac.substring(2),
                },
            };
            if (entropy) {
                const mnemonicIv = randomBytes(16);
                const mnemonicCounter = new aesJs.Counter(mnemonicIv);
                const mnemonicAesCtr = new aesJs.ModeOfOperation.ctr(
                    mnemonicKey,
                    mnemonicCounter
                );
                const mnemonicCiphertext = arrayify(mnemonicAesCtr.encrypt(entropy));
                const now = new Date();
                const timestamp =
                    now.getUTCFullYear() +
                    "-" +
                    zpad(now.getUTCMonth() + 1, 2) +
                    "-" +
                    zpad(now.getUTCDate(), 2) +
                    "T" +
                    zpad(now.getUTCHours(), 2) +
                    "-" +
                    zpad(now.getUTCMinutes(), 2) +
                    "-" +
                    zpad(now.getUTCSeconds(), 2) +
                    ".0Z";
                data["x-ethers"] = {
                    client: client,
                    gethFilename: "UTC--" + timestamp + "--" + data.address,
                    mnemonicCounter: hexlify(mnemonicIv).substring(2),
                    mnemonicCiphertext: hexlify(mnemonicCiphertext).substring(2),
                    path: path,
                    locale: locale,
                    version: "0.1",
                };
            }
            return JSON.stringify(data);
        });
}
("use strict");
function decryptJsonWallet(json, password, progressCallback) {
    if (isCrowdsaleWallet(json)) {
        if (progressCallback) {
            progressCallback(0);
        }
        const account = decrypt(json, password);
        if (progressCallback) {
            progressCallback(1);
        }
        return Promise.resolve(account);
    }
    if (isKeystoreWallet(json)) {
        return decrypt$1(json, password, progressCallback);
    }
    return Promise.reject(new Error("invalid JSON wallet"));
}
function decryptJsonWalletSync(json, password) {
    if (isCrowdsaleWallet(json)) {
        return decrypt(json, password);
    }
    if (isKeystoreWallet(json)) {
        return decryptSync(json, password);
    }
    throw new Error("invalid JSON wallet");
}
const version$j = "wallet/5.1.0";
("use strict");
var __awaiter$5 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$p = new Logger(version$j);
function isAccount(value) {
    return (
        value != null && isHexString(value.privateKey, 32) && value.address != null
    );
}
function hasMnemonic$1(value) {
    const mnemonic = value.mnemonic;
    return mnemonic && mnemonic.phrase;
}
class Wallet extends Signer {
    constructor(privateKey, provider) {
        logger$p.checkNew(new.target, Wallet);
        super();
        if (isAccount(privateKey)) {
            const signingKey = new SigningKey(privateKey.privateKey);
            defineReadOnly(this, "_signingKey", () => signingKey);
            defineReadOnly(this, "address", computeAddress(this.publicKey));
            if (this.address !== getAddress(privateKey.address)) {
                logger$p.throwArgumentError(
                    "privateKey/address mismatch",
                    "privateKey",
                    "[REDACTED]"
                );
            }
            if (hasMnemonic$1(privateKey)) {
                const srcMnemonic = privateKey.mnemonic;
                defineReadOnly(this, "_mnemonic", () => ({
                    phrase: srcMnemonic.phrase,
                    path: srcMnemonic.path || defaultPath,
                    locale: srcMnemonic.locale || "en",
                }));
                const mnemonic = this.mnemonic;
                const node = HDNode.fromMnemonic(
                    mnemonic.phrase,
                    null,
                    mnemonic.locale
                ).derivePath(mnemonic.path);
                if (computeAddress(node.privateKey) !== this.address) {
                    logger$p.throwArgumentError(
                        "mnemonic/address mismatch",
                        "privateKey",
                        "[REDACTED]"
                    );
                }
            } else {
                defineReadOnly(this, "_mnemonic", () => null);
            }
        } else {
            if (SigningKey.isSigningKey(privateKey)) {
                if (privateKey.curve !== "secp256k1") {
                    logger$p.throwArgumentError(
                        "unsupported curve; must be secp256k1",
                        "privateKey",
                        "[REDACTED]"
                    );
                }
                defineReadOnly(this, "_signingKey", () => privateKey);
            } else {
                if (typeof privateKey === "string") {
                    if (privateKey.match(/^[0-9a-f]*$/i) && privateKey.length === 64) {
                        privateKey = "0x" + privateKey;
                    }
                }
                const signingKey = new SigningKey(privateKey);
                defineReadOnly(this, "_signingKey", () => signingKey);
            }
            defineReadOnly(this, "_mnemonic", () => null);
            defineReadOnly(this, "address", computeAddress(this.publicKey));
        }
        if (provider && !Provider.isProvider(provider)) {
            logger$p.throwArgumentError("invalid provider", "provider", provider);
        }
        defineReadOnly(this, "provider", provider || null);
    }
    get mnemonic() {
        return this._mnemonic();
    }
    get privateKey() {
        return this._signingKey().privateKey;
    }
    get publicKey() {
        return this._signingKey().publicKey;
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    connect(provider) {
        return new Wallet(this, provider);
    }
    signTransaction(transaction) {
        return resolveProperties(transaction).then((tx) => {
            if (tx.from != null) {
                if (getAddress(tx.from) !== this.address) {
                    logger$p.throwArgumentError(
                        "transaction from address mismatch",
                        "transaction.from",
                        transaction.from
                    );
                }
                delete tx.from;
            }
            const signature = this._signingKey().signDigest(keccak256(serialize(tx)));
            return serialize(tx, signature);
        });
    }
    signMessage(message) {
        return __awaiter$5(this, void 0, void 0, function* () {
            return joinSignature(this._signingKey().signDigest(hashMessage(message)));
        });
    }
    _signTypedData(domain, types, value) {
        return __awaiter$5(this, void 0, void 0, function* () {
            const populated = yield TypedDataEncoder.resolveNames(
                domain,
                types,
                value,
                (name) => {
                    if (this.provider == null) {
                        logger$p.throwError(
                            "cannot resolve ENS names without a provider",
                            Logger.errors.UNSUPPORTED_OPERATION,
                            { operation: "resolveName", value: name }
                        );
                    }
                    return this.provider.resolveName(name);
                }
            );
            return joinSignature(
                this._signingKey().signDigest(
                    TypedDataEncoder.hash(populated.domain, types, populated.value)
                )
            );
        });
    }
    encrypt(password, options, progressCallback) {
        if (typeof options === "function" && !progressCallback) {
            progressCallback = options;
            options = {};
        }
        if (progressCallback && typeof progressCallback !== "function") {
            throw new Error("invalid callback");
        }
        if (!options) {
            options = {};
        }
        return encrypt(this, password, options, progressCallback);
    }
    static createRandom(options) {
        let entropy = randomBytes(16);
        if (!options) {
            options = {};
        }
        if (options.extraEntropy) {
            entropy = arrayify(
                hexDataSlice(keccak256(concat([entropy, options.extraEntropy])), 0, 16)
            );
        }
        const mnemonic = entropyToMnemonic(entropy, options.locale);
        return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
    }
    static fromEncryptedJson(json, password, progressCallback) {
        return decryptJsonWallet(json, password, progressCallback).then(
            (account) => {
                return new Wallet(account);
            }
        );
    }
    static fromEncryptedJsonSync(json, password) {
        return new Wallet(decryptJsonWalletSync(json, password));
    }
    static fromMnemonic(mnemonic, path, wordlist) {
        if (!path) {
            path = defaultPath;
        }
        return new Wallet(
            HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path)
        );
    }
}
function verifyMessage(message, signature) {
    return recoverAddress(hashMessage(message), signature);
}
function verifyTypedData(domain, types, value, signature) {
    return recoverAddress(TypedDataEncoder.hash(domain, types, value), signature);
}
const version$k = "networks/5.1.0";
("use strict");
const logger$q = new Logger(version$k);
function isRenetworkable(value) {
    return value && typeof value.renetwork === "function";
}
function ethDefaultProvider(network) {
    const func = function (providers, options) {
        if (options == null) {
            options = {};
        }
        const providerList = [];
        if (providers.InfuraProvider) {
            try {
                providerList.push(
                    new providers.InfuraProvider(network, options.infura)
                );
            } catch (error) { }
        }
        if (providers.EtherscanProvider) {
            try {
                providerList.push(
                    new providers.EtherscanProvider(network, options.etherscan)
                );
            } catch (error) { }
        }
        if (providers.AlchemyProvider) {
            const skip = ["goerli", "ropsten", "rinkeby"];
            try {
                const provider = new providers.AlchemyProvider(
                    network,
                    options.alchemy
                );
                if (provider.network && skip.indexOf(provider.network.name) === -1) {
                    providerList.push(provider);
                }
            } catch (error) { }
        }
        if (providers.PocketProvider) {
            const skip = ["goerli", "ropsten", "rinkeby"];
            try {
                const provider = new providers.PocketProvider(network);
                if (provider.network && skip.indexOf(provider.network.name) === -1) {
                    providerList.push(provider);
                }
            } catch (error) { }
        }
        if (providers.CloudflareProvider) {
            try {
                providerList.push(new providers.CloudflareProvider(network));
            } catch (error) { }
        }
        if (providerList.length === 0) {
            return null;
        }
        if (providers.FallbackProvider) {
            let quorum = 1;
            if (options.quorum != null) {
                quorum = options.quorum;
            } else if (network === "homestead") {
                quorum = 2;
            }
            return new providers.FallbackProvider(providerList, quorum);
        }
        return providerList[0];
    };
    func.renetwork = function (network) {
        return ethDefaultProvider(network);
    };
    return func;
}
function etcDefaultProvider(url, network) {
    const func = function (providers, options) {
        if (providers.JsonRpcProvider) {
            return new providers.JsonRpcProvider(url, network);
        }
        return null;
    };
    func.renetwork = function (network) {
        return etcDefaultProvider(url, network);
    };
    return func;
}
const homestead = {
    chainId: 1,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "homestead",
    _defaultProvider: ethDefaultProvider("homestead"),
};
const ropsten = {
    chainId: 3,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "ropsten",
    _defaultProvider: ethDefaultProvider("ropsten"),
};
const classicMordor = {
    chainId: 63,
    name: "classicMordor",
    _defaultProvider: etcDefaultProvider(
        "https://www.ethercluster.com/mordor",
        "classicMordor"
    ),
};
const networks = {
    unspecified: { chainId: 0, name: "unspecified" },
    homestead: homestead,
    mainnet: homestead,
    morden: { chainId: 2, name: "morden" },
    ropsten: ropsten,
    testnet: ropsten,
    rinkeby: {
        chainId: 4,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "rinkeby",
        _defaultProvider: ethDefaultProvider("rinkeby"),
    },
    kovan: {
        chainId: 42,
        name: "kovan",
        _defaultProvider: ethDefaultProvider("kovan"),
    },
    goerli: {
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "goerli",
        _defaultProvider: ethDefaultProvider("goerli"),
    },
    classic: {
        chainId: 61,
        name: "classic",
        _defaultProvider: etcDefaultProvider(
            "https://www.ethercluster.com/etc",
            "classic"
        ),
    },
    classicMorden: { chainId: 62, name: "classicMorden" },
    classicMordor: classicMordor,
    classicTestnet: classicMordor,
    classicKotti: {
        chainId: 6,
        name: "classicKotti",
        _defaultProvider: etcDefaultProvider(
            "https://www.ethercluster.com/kotti",
            "classicKotti"
        ),
    },
};
function getNetwork(network) {
    if (network == null) {
        return null;
    }
    if (typeof network === "number") {
        for (const name in networks) {
            const standard = networks[name];
            if (standard.chainId === network) {
                return {
                    name: standard.name,
                    chainId: standard.chainId,
                    ensAddress: standard.ensAddress || null,
                    _defaultProvider: standard._defaultProvider || null,
                };
            }
        }
        return { chainId: network, name: "unknown" };
    }
    if (typeof network === "string") {
        const standard = networks[network];
        if (standard == null) {
            return null;
        }
        return {
            name: standard.name,
            chainId: standard.chainId,
            ensAddress: standard.ensAddress,
            _defaultProvider: standard._defaultProvider || null,
        };
    }
    const standard = networks[network.name];
    if (!standard) {
        if (typeof network.chainId !== "number") {
            logger$q.throwArgumentError(
                "invalid network chainId",
                "network",
                network
            );
        }
        return network;
    }
    if (network.chainId !== 0 && network.chainId !== standard.chainId) {
        logger$q.throwArgumentError("network chainId mismatch", "network", network);
    }
    let defaultProvider = network._defaultProvider || null;
    if (defaultProvider == null && standard._defaultProvider) {
        if (isRenetworkable(standard._defaultProvider)) {
            defaultProvider = standard._defaultProvider.renetwork(network);
        } else {
            defaultProvider = standard._defaultProvider;
        }
    }
    return {
        name: network.name,
        chainId: standard.chainId,
        ensAddress: network.ensAddress || standard.ensAddress || null,
        _defaultProvider: defaultProvider,
    };
}
("use strict");
function decode$1(textData) {
    textData = atob(textData);
    const data = [];
    for (let i = 0; i < textData.length; i++) {
        data.push(textData.charCodeAt(i));
    }
    return arrayify(data);
}
function encode$1(data) {
    data = arrayify(data);
    let textData = "";
    for (let i = 0; i < data.length; i++) {
        textData += String.fromCharCode(data[i]);
    }
    return btoa(textData);
}
("use strict");
var index$2 = Object.freeze({
    __proto__: null,
    decode: decode$1,
    encode: encode$1,
});
const version$l = "web/5.1.0";
("use strict");
var __awaiter$6 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
function getUrl(href, options) {
    return __awaiter$6(this, void 0, void 0, function* () {
        if (options == null) {
            options = {};
        }
        const request = {
            method: options.method || "GET",
            headers: options.headers || {},
            body: options.body || undefined,
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrer: "client",
        };
        const response = yield fetch(href, request);
        const body = yield response.arrayBuffer();
        const headers = {};
        if (response.headers.forEach) {
            response.headers.forEach((value, key) => {
                headers[key.toLowerCase()] = value;
            });
        } else {
            response.headers.keys().forEach((key) => {
                headers[key.toLowerCase()] = response.headers.get(key);
            });
        }
        return {
            headers: headers,
            statusCode: response.status,
            statusMessage: response.statusText,
            body: arrayify(new Uint8Array(body)),
        };
    });
}
("use strict");
var __awaiter$7 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$r = new Logger(version$l);
function staller(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
function bodyify(value, type) {
    if (value == null) {
        return null;
    }
    if (typeof value === "string") {
        return value;
    }
    if (isBytesLike(value)) {
        if (
            type &&
            (type.split("/")[0] === "text" ||
                type.split(";")[0].trim() === "application/json")
        ) {
            try {
                return toUtf8String(value);
            } catch (error) { }
        }
        return hexlify(value);
    }
    return value;
}
function _fetchData(connection, body, processFunc) {
    const attemptLimit =
        typeof connection === "object" && connection.throttleLimit != null
            ? connection.throttleLimit
            : 12;
    logger$r.assertArgument(
        attemptLimit > 0 && attemptLimit % 1 === 0,
        "invalid connection throttle limit",
        "connection.throttleLimit",
        attemptLimit
    );
    const throttleCallback =
        typeof connection === "object" ? connection.throttleCallback : null;
    const throttleSlotInterval =
        typeof connection === "object" &&
            typeof connection.throttleSlotInterval === "number"
            ? connection.throttleSlotInterval
            : 100;
    logger$r.assertArgument(
        throttleSlotInterval > 0 && throttleSlotInterval % 1 === 0,
        "invalid connection throttle slot interval",
        "connection.throttleSlotInterval",
        throttleSlotInterval
    );
    const headers = {};
    let url = null;
    const options = { method: "GET" };
    let allow304 = false;
    let timeout = 2 * 60 * 1e3;
    if (typeof connection === "string") {
        url = connection;
    } else if (typeof connection === "object") {
        if (connection == null || connection.url == null) {
            logger$r.throwArgumentError("missing URL", "connection.url", connection);
        }
        url = connection.url;
        if (typeof connection.timeout === "number" && connection.timeout > 0) {
            timeout = connection.timeout;
        }
        if (connection.headers) {
            for (const key in connection.headers) {
                headers[key.toLowerCase()] = {
                    key: key,
                    value: String(connection.headers[key]),
                };
                if (
                    ["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0
                ) {
                    allow304 = true;
                }
            }
        }
        options.allowGzip = !!connection.allowGzip;
        if (connection.user != null && connection.password != null) {
            if (
                url.substring(0, 6) !== "https:" &&
                connection.allowInsecureAuthentication !== true
            ) {
                logger$r.throwError(
                    "basic authentication requires a secure https url",
                    Logger.errors.INVALID_ARGUMENT,
                    {
                        argument: "url",
                        url: url,
                        user: connection.user,
                        password: "[REDACTED]",
                    }
                );
            }
            const authorization = connection.user + ":" + connection.password;
            headers["authorization"] = {
                key: "Authorization",
                value: "Basic " + encode$1(toUtf8Bytes(authorization)),
            };
        }
    }
    if (body) {
        options.method = "POST";
        options.body = body;
        if (headers["content-type"] == null) {
            headers["content-type"] = {
                key: "Content-Type",
                value: "application/octet-stream",
            };
        }
        if (headers["content-length"] == null) {
            headers["content-length"] = {
                key: "Content-Length",
                value: String(body.length),
            };
        }
    }
    const flatHeaders = {};
    Object.keys(headers).forEach((key) => {
        const header = headers[key];
        flatHeaders[header.key] = header.value;
    });
    options.headers = flatHeaders;
    const runningTimeout = (function () {
        let timer = null;
        const promise = new Promise(function (resolve, reject) {
            if (timeout) {
                timer = setTimeout(() => {
                    if (timer == null) {
                        return;
                    }
                    timer = null;
                    reject(
                        logger$r.makeError("timeout", Logger.errors.TIMEOUT, {
                            requestBody: bodyify(options.body, flatHeaders["content-type"]),
                            requestMethod: options.method,
                            timeout: timeout,
                            url: url,
                        })
                    );
                }, timeout);
            }
        });
        const cancel = function () {
            if (timer == null) {
                return;
            }
            clearTimeout(timer);
            timer = null;
        };
        return { promise: promise, cancel: cancel };
    })();
    const runningFetch = (function () {
        return __awaiter$7(this, void 0, void 0, function* () {
            for (let attempt = 0; attempt < attemptLimit; attempt++) {
                let response = null;
                try {
                    response = yield getUrl(url, options);
                    if (response.statusCode === 429 && attempt < attemptLimit) {
                        let tryAgain = true;
                        if (throttleCallback) {
                            tryAgain = yield throttleCallback(attempt, url);
                        }
                        if (tryAgain) {
                            let stall = 0;
                            const retryAfter = response.headers["retry-after"];
                            if (
                                typeof retryAfter === "string" &&
                                retryAfter.match(/^[1-9][0-9]*$/)
                            ) {
                                stall = parseInt(retryAfter) * 1e3;
                            } else {
                                stall =
                                    throttleSlotInterval *
                                    parseInt(String(Math.random() * Math.pow(2, attempt)));
                            }
                            yield staller(stall);
                            continue;
                        }
                    }
                } catch (error) {
                    response = error.response;
                    if (response == null) {
                        runningTimeout.cancel();
                        logger$r.throwError(
                            "missing response",
                            Logger.errors.SERVER_ERROR,
                            {
                                requestBody: bodyify(options.body, flatHeaders["content-type"]),
                                requestMethod: options.method,
                                serverError: error,
                                url: url,
                            }
                        );
                    }
                }
                let body = response.body;
                if (allow304 && response.statusCode === 304) {
                    body = null;
                } else if (response.statusCode < 200 || response.statusCode >= 300) {
                    runningTimeout.cancel();
                    logger$r.throwError("bad response", Logger.errors.SERVER_ERROR, {
                        status: response.statusCode,
                        headers: response.headers,
                        body: bodyify(
                            body,
                            response.headers ? response.headers["content-type"] : null
                        ),
                        requestBody: bodyify(options.body, flatHeaders["content-type"]),
                        requestMethod: options.method,
                        url: url,
                    });
                }
                if (processFunc) {
                    try {
                        const result = yield processFunc(body, response);
                        runningTimeout.cancel();
                        return result;
                    } catch (error) {
                        if (error.throttleRetry && attempt < attemptLimit) {
                            let tryAgain = true;
                            if (throttleCallback) {
                                tryAgain = yield throttleCallback(attempt, url);
                            }
                            if (tryAgain) {
                                const timeout =
                                    throttleSlotInterval *
                                    parseInt(String(Math.random() * Math.pow(2, attempt)));
                                yield staller(timeout);
                                continue;
                            }
                        }
                        runningTimeout.cancel();
                        logger$r.throwError(
                            "processing response error",
                            Logger.errors.SERVER_ERROR,
                            {
                                body: bodyify(
                                    body,
                                    response.headers ? response.headers["content-type"] : null
                                ),
                                error: error,
                                requestBody: bodyify(options.body, flatHeaders["content-type"]),
                                requestMethod: options.method,
                                url: url,
                            }
                        );
                    }
                }
                runningTimeout.cancel();
                return body;
            }
            return logger$r.throwError(
                "failed response",
                Logger.errors.SERVER_ERROR,
                {
                    requestBody: bodyify(options.body, flatHeaders["content-type"]),
                    requestMethod: options.method,
                    url: url,
                }
            );
        });
    })();
    return Promise.race([runningTimeout.promise, runningFetch]);
}
function fetchJson(connection, json, processFunc) {
    let processJsonFunc = (value, response) => {
        let result = null;
        if (value != null) {
            try {
                result = JSON.parse(toUtf8String(value));
            } catch (error) {
                logger$r.throwError("invalid JSON", Logger.errors.SERVER_ERROR, {
                    body: value,
                    error: error,
                });
            }
        }
        if (processFunc) {
            result = processFunc(result, response);
        }
        return result;
    };
    let body = null;
    if (json != null) {
        body = toUtf8Bytes(json);
        const updated =
            typeof connection === "string"
                ? { url: connection }
                : shallowCopy(connection);
        if (updated.headers) {
            const hasContentType =
                Object.keys(updated.headers).filter(
                    (k) => k.toLowerCase() === "content-type"
                ).length !== 0;
            if (!hasContentType) {
                updated.headers = shallowCopy(updated.headers);
                updated.headers["content-type"] = "application/json";
            }
        } else {
            updated.headers = { "content-type": "application/json" };
        }
        connection = updated;
    }
    return _fetchData(connection, body, processJsonFunc);
}
function poll(func, options) {
    if (!options) {
        options = {};
    }
    options = shallowCopy(options);
    if (options.floor == null) {
        options.floor = 0;
    }
    if (options.ceiling == null) {
        options.ceiling = 1e4;
    }
    if (options.interval == null) {
        options.interval = 250;
    }
    return new Promise(function (resolve, reject) {
        let timer = null;
        let done = false;
        const cancel = () => {
            if (done) {
                return false;
            }
            done = true;
            if (timer) {
                clearTimeout(timer);
            }
            return true;
        };
        if (options.timeout) {
            timer = setTimeout(() => {
                if (cancel()) {
                    reject(new Error("timeout"));
                }
            }, options.timeout);
        }
        const retryLimit = options.retryLimit;
        let attempt = 0;
        function check() {
            return func().then(
                function (result) {
                    if (result !== undefined) {
                        if (cancel()) {
                            resolve(result);
                        }
                    } else if (options.oncePoll) {
                        options.oncePoll.once("poll", check);
                    } else if (options.onceBlock) {
                        options.onceBlock.once("block", check);
                    } else if (!done) {
                        attempt++;
                        if (attempt > retryLimit) {
                            if (cancel()) {
                                reject(new Error("retry limit reached"));
                            }
                            return;
                        }
                        let timeout =
                            options.interval *
                            parseInt(String(Math.random() * Math.pow(2, attempt)));
                        if (timeout < options.floor) {
                            timeout = options.floor;
                        }
                        if (timeout > options.ceiling) {
                            timeout = options.ceiling;
                        }
                        setTimeout(check, timeout);
                    }
                    return null;
                },
                function (error) {
                    if (cancel()) {
                        reject(error);
                    }
                }
            );
        }
        check();
    });
}
("use strict");
var ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
var ALPHABET_MAP = {};
for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z);
    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + " is ambiguous");
    ALPHABET_MAP[x] = z;
}
function polymodStep(pre) {
    var b = pre >> 25;
    return (
        ((pre & 33554431) << 5) ^
        (-((b >> 0) & 1) & 996825010) ^
        (-((b >> 1) & 1) & 642813549) ^
        (-((b >> 2) & 1) & 513874426) ^
        (-((b >> 3) & 1) & 1027748829) ^
        (-((b >> 4) & 1) & 705979059)
    );
}
function prefixChk(prefix) {
    var chk = 1;
    for (var i = 0; i < prefix.length; ++i) {
        var c = prefix.charCodeAt(i);
        if (c < 33 || c > 126) return "Invalid prefix (" + prefix + ")";
        chk = polymodStep(chk) ^ (c >> 5);
    }
    chk = polymodStep(chk);
    for (i = 0; i < prefix.length; ++i) {
        var v = prefix.charCodeAt(i);
        chk = polymodStep(chk) ^ (v & 31);
    }
    return chk;
}
function encode$2(prefix, words, LIMIT) {
    LIMIT = LIMIT || 90;
    if (prefix.length + 7 + words.length > LIMIT)
        throw new TypeError("Exceeds length limit");
    prefix = prefix.toLowerCase();
    var chk = prefixChk(prefix);
    if (typeof chk === "string") throw new Error(chk);
    var result = prefix + "1";
    for (var i = 0; i < words.length; ++i) {
        var x = words[i];
        if (x >> 5 !== 0) throw new Error("Non 5-bit word");
        chk = polymodStep(chk) ^ x;
        result += ALPHABET.charAt(x);
    }
    for (i = 0; i < 6; ++i) {
        chk = polymodStep(chk);
    }
    chk ^= 1;
    for (i = 0; i < 6; ++i) {
        var v = (chk >> ((5 - i) * 5)) & 31;
        result += ALPHABET.charAt(v);
    }
    return result;
}
function __decode(str, LIMIT) {
    LIMIT = LIMIT || 90;
    if (str.length < 8) return str + " too short";
    if (str.length > LIMIT) return "Exceeds length limit";
    var lowered = str.toLowerCase();
    var uppered = str.toUpperCase();
    if (str !== lowered && str !== uppered) return "Mixed-case string " + str;
    str = lowered;
    var split = str.lastIndexOf("1");
    if (split === -1) return "No separator character for " + str;
    if (split === 0) return "Missing prefix for " + str;
    var prefix = str.slice(0, split);
    var wordChars = str.slice(split + 1);
    if (wordChars.length < 6) return "Data too short";
    var chk = prefixChk(prefix);
    if (typeof chk === "string") return chk;
    var words = [];
    for (var i = 0; i < wordChars.length; ++i) {
        var c = wordChars.charAt(i);
        var v = ALPHABET_MAP[c];
        if (v === undefined) return "Unknown character " + c;
        chk = polymodStep(chk) ^ v;
        if (i + 6 >= wordChars.length) continue;
        words.push(v);
    }
    if (chk !== 1) return "Invalid checksum for " + str;
    return { prefix: prefix, words: words };
}
function decodeUnsafe() {
    var res = __decode.apply(null, arguments);
    if (typeof res === "object") return res;
}
function decode$2(str) {
    var res = __decode.apply(null, arguments);
    if (typeof res === "object") return res;
    throw new Error(res);
}
function convert(data, inBits, outBits, pad) {
    var value = 0;
    var bits = 0;
    var maxV = (1 << outBits) - 1;
    var result = [];
    for (var i = 0; i < data.length; ++i) {
        value = (value << inBits) | data[i];
        bits += inBits;
        while (bits >= outBits) {
            bits -= outBits;
            result.push((value >> bits) & maxV);
        }
    }
    if (pad) {
        if (bits > 0) {
            result.push((value << (outBits - bits)) & maxV);
        }
    } else {
        if (bits >= inBits) return "Excess padding";
        if ((value << (outBits - bits)) & maxV) return "Non-zero padding";
    }
    return result;
}
function toWordsUnsafe(bytes) {
    var res = convert(bytes, 8, 5, true);
    if (Array.isArray(res)) return res;
}
function toWords(bytes) {
    var res = convert(bytes, 8, 5, true);
    if (Array.isArray(res)) return res;
    throw new Error(res);
}
function fromWordsUnsafe(words) {
    var res = convert(words, 5, 8, false);
    if (Array.isArray(res)) return res;
}
function fromWords(words) {
    var res = convert(words, 5, 8, false);
    if (Array.isArray(res)) return res;
    throw new Error(res);
}
var bech32 = {
    decodeUnsafe: decodeUnsafe,
    decode: decode$2,
    encode: encode$2,
    toWordsUnsafe: toWordsUnsafe,
    toWords: toWords,
    fromWordsUnsafe: fromWordsUnsafe,
    fromWords: fromWords,
};
const version$m = "providers/5.1.2";
("use strict");
const logger$s = new Logger(version$m);
class Formatter {
    constructor() {
        logger$s.checkNew(new.target, Formatter);
        this.formats = this.getDefaultFormats();
    }
    getDefaultFormats() {
        const formats = {};
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const hex = this.hex.bind(this);
        const number = this.number.bind(this);
        const strictData = (v) => {
            return this.data(v, true);
        };
        formats.transaction = {
            hash: hash,
            type: Formatter.allowNull(number, null),
            accessList: Formatter.allowNull(this.accessList.bind(this), null),
            blockHash: Formatter.allowNull(hash, null),
            blockNumber: Formatter.allowNull(number, null),
            transactionIndex: Formatter.allowNull(number, null),
            confirmations: Formatter.allowNull(number, null),
            from: address,
            gasPrice: bigNumber,
            gasLimit: bigNumber,
            to: Formatter.allowNull(address, null),
            value: bigNumber,
            nonce: number,
            data: data,
            r: Formatter.allowNull(this.uint256),
            s: Formatter.allowNull(this.uint256),
            v: Formatter.allowNull(number),
            creates: Formatter.allowNull(address, null),
            raw: Formatter.allowNull(data),
        };
        formats.transactionRequest = {
            from: Formatter.allowNull(address),
            nonce: Formatter.allowNull(number),
            gasLimit: Formatter.allowNull(bigNumber),
            gasPrice: Formatter.allowNull(bigNumber),
            to: Formatter.allowNull(address),
            value: Formatter.allowNull(bigNumber),
            data: Formatter.allowNull(strictData),
            type: Formatter.allowNull(number),
            accessList: Formatter.allowNull(this.accessList.bind(this), null),
        };
        formats.receiptLog = {
            transactionIndex: number,
            blockNumber: number,
            transactionHash: hash,
            address: address,
            topics: Formatter.arrayOf(hash),
            data: data,
            logIndex: number,
            blockHash: hash,
        };
        formats.receipt = {
            to: Formatter.allowNull(this.address, null),
            from: Formatter.allowNull(this.address, null),
            contractAddress: Formatter.allowNull(address, null),
            transactionIndex: number,
            root: Formatter.allowNull(hex),
            gasUsed: bigNumber,
            logsBloom: Formatter.allowNull(data),
            blockHash: hash,
            transactionHash: hash,
            logs: Formatter.arrayOf(this.receiptLog.bind(this)),
            blockNumber: number,
            confirmations: Formatter.allowNull(number, null),
            cumulativeGasUsed: bigNumber,
            status: Formatter.allowNull(number),
        };
        formats.block = {
            hash: hash,
            parentHash: hash,
            number: number,
            timestamp: number,
            nonce: Formatter.allowNull(hex),
            difficulty: this.difficulty.bind(this),
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            miner: address,
            extraData: data,
            transactions: Formatter.allowNull(Formatter.arrayOf(hash)),
        };
        formats.blockWithTransactions = shallowCopy(formats.block);
        formats.blockWithTransactions.transactions = Formatter.allowNull(
            Formatter.arrayOf(this.transactionResponse.bind(this))
        );
        formats.filter = {
            fromBlock: Formatter.allowNull(blockTag, undefined),
            toBlock: Formatter.allowNull(blockTag, undefined),
            blockHash: Formatter.allowNull(hash, undefined),
            address: Formatter.allowNull(address, undefined),
            topics: Formatter.allowNull(this.topics.bind(this), undefined),
        };
        formats.filterLog = {
            blockNumber: Formatter.allowNull(number),
            blockHash: Formatter.allowNull(hash),
            transactionIndex: number,
            removed: Formatter.allowNull(this.boolean.bind(this)),
            address: address,
            data: Formatter.allowFalsish(data, "0x"),
            topics: Formatter.arrayOf(hash),
            transactionHash: hash,
            logIndex: number,
        };
        return formats;
    }
    accessList(accessList) {
        return accessListify(accessList || []);
    }
    number(number) {
        if (number === "0x") {
            return 0;
        }
        return BigNumber.from(number).toNumber();
    }
    bigNumber(value) {
        return BigNumber.from(value);
    }
    boolean(value) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            value = value.toLowerCase();
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        throw new Error("invalid boolean - " + value);
    }
    hex(value, strict) {
        if (typeof value === "string") {
            if (!strict && value.substring(0, 2) !== "0x") {
                value = "0x" + value;
            }
            if (isHexString(value)) {
                return value.toLowerCase();
            }
        }
        return logger$s.throwArgumentError("invalid hash", "value", value);
    }
    data(value, strict) {
        const result = this.hex(value, strict);
        if (result.length % 2 !== 0) {
            throw new Error("invalid data; odd-length - " + value);
        }
        return result;
    }
    address(value) {
        return getAddress(value);
    }
    callAddress(value) {
        if (!isHexString(value, 32)) {
            return null;
        }
        const address = getAddress(hexDataSlice(value, 12));
        return address === AddressZero ? null : address;
    }
    contractAddress(value) {
        return getContractAddress(value);
    }
    blockTag(blockTag) {
        if (blockTag == null) {
            return "latest";
        }
        if (blockTag === "earliest") {
            return "0x0";
        }
        if (blockTag === "latest" || blockTag === "pending") {
            return blockTag;
        }
        if (typeof blockTag === "number" || isHexString(blockTag)) {
            return hexValue(blockTag);
        }
        throw new Error("invalid blockTag");
    }
    hash(value, strict) {
        const result = this.hex(value, strict);
        if (hexDataLength(result) !== 32) {
            return logger$s.throwArgumentError("invalid hash", "value", value);
        }
        return result;
    }
    difficulty(value) {
        if (value == null) {
            return null;
        }
        const v = BigNumber.from(value);
        try {
            return v.toNumber();
        } catch (error) { }
        return null;
    }
    uint256(value) {
        if (!isHexString(value)) {
            throw new Error("invalid uint256");
        }
        return hexZeroPad(value, 32);
    }
    _block(value, format) {
        if (value.author != null && value.miner == null) {
            value.miner = value.author;
        }
        return Formatter.check(format, value);
    }
    block(value) {
        return this._block(value, this.formats.block);
    }
    blockWithTransactions(value) {
        return this._block(value, this.formats.blockWithTransactions);
    }
    transactionRequest(value) {
        return Formatter.check(this.formats.transactionRequest, value);
    }
    transactionResponse(transaction) {
        if (transaction.gas != null && transaction.gasLimit == null) {
            transaction.gasLimit = transaction.gas;
        }
        if (transaction.to && BigNumber.from(transaction.to).isZero()) {
            transaction.to = "0x0000000000000000000000000000000000000000";
        }
        if (transaction.input != null && transaction.data == null) {
            transaction.data = transaction.input;
        }
        if (transaction.to == null && transaction.creates == null) {
            transaction.creates = this.contractAddress(transaction);
        }
        if (transaction.type === 1 && transaction.accessList == null) {
            transaction.accessList = [];
        }
        const result = Formatter.check(this.formats.transaction, transaction);
        if (transaction.chainId != null) {
            let chainId = transaction.chainId;
            if (isHexString(chainId)) {
                chainId = BigNumber.from(chainId).toNumber();
            }
            result.chainId = chainId;
        } else {
            let chainId = transaction.networkId;
            if (chainId == null && result.v == null) {
                chainId = transaction.chainId;
            }
            if (isHexString(chainId)) {
                chainId = BigNumber.from(chainId).toNumber();
            }
            if (typeof chainId !== "number" && result.v != null) {
                chainId = (result.v - 35) / 2;
                if (chainId < 0) {
                    chainId = 0;
                }
                chainId = parseInt(chainId);
            }
            if (typeof chainId !== "number") {
                chainId = 0;
            }
            result.chainId = chainId;
        }
        if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
            result.blockHash = null;
        }
        return result;
    }
    transaction(value) {
        return parse(value);
    }
    receiptLog(value) {
        return Formatter.check(this.formats.receiptLog, value);
    }
    receipt(value) {
        const result = Formatter.check(this.formats.receipt, value);
        if (result.root != null) {
            if (result.root.length <= 4) {
                const value = BigNumber.from(result.root).toNumber();
                if (value === 0 || value === 1) {
                    if (result.status != null && result.status !== value) {
                        logger$s.throwArgumentError(
                            "alt-root-status/status mismatch",
                            "value",
                            { root: result.root, status: result.status }
                        );
                    }
                    result.status = value;
                    delete result.root;
                } else {
                    logger$s.throwArgumentError(
                        "invalid alt-root-status",
                        "value.root",
                        result.root
                    );
                }
            } else if (result.root.length !== 66) {
                logger$s.throwArgumentError(
                    "invalid root hash",
                    "value.root",
                    result.root
                );
            }
        }
        if (result.status != null) {
            result.byzantium = true;
        }
        return result;
    }
    topics(value) {
        if (Array.isArray(value)) {
            return value.map((v) => this.topics(v));
        } else if (value != null) {
            return this.hash(value, true);
        }
        return null;
    }
    filter(value) {
        return Formatter.check(this.formats.filter, value);
    }
    filterLog(value) {
        return Formatter.check(this.formats.filterLog, value);
    }
    static check(format, object) {
        const result = {};
        for (const key in format) {
            try {
                const value = format[key](object[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            } catch (error) {
                error.checkKey = key;
                error.checkValue = object[key];
                throw error;
            }
        }
        return result;
    }
    static allowNull(format, nullValue) {
        return function (value) {
            if (value == null) {
                return nullValue;
            }
            return format(value);
        };
    }
    static allowFalsish(format, replaceValue) {
        return function (value) {
            if (!value) {
                return replaceValue;
            }
            return format(value);
        };
    }
    static arrayOf(format) {
        return function (array) {
            if (!Array.isArray(array)) {
                throw new Error("not an array");
            }
            const result = [];
            array.forEach(function (value) {
                result.push(format(value));
            });
            return result;
        };
    }
}
function isCommunityResourcable(value) {
    return value && typeof value.isCommunityResource === "function";
}
function isCommunityResource(value) {
    return isCommunityResourcable(value) && value.isCommunityResource();
}
let throttleMessage = false;
function showThrottleMessage() {
    if (throttleMessage) {
        return;
    }
    throttleMessage = true;
    console.log("========= NOTICE =========");
    console.log("Request-Rate Exceeded  (this message will not be repeated)");
    console.log("");
    console.log(
        "The default API keys for each service are provided as a highly-throttled,"
    );
    console.log(
        "community resource for low-traffic projects and early prototyping."
    );
    console.log("");
    console.log(
        "While your application will continue to function, we highly recommended"
    );
    console.log(
        "signing up for your own API keys to improve performance, increase your"
    );
    console.log(
        "request rate/limit and enable other perks, such as metrics and advanced APIs."
    );
    console.log("");
    console.log("For more details: https://docs.ethers.io/api-keys/");
    console.log("==========================");
}
("use strict");
var __awaiter$8 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$t = new Logger(version$m);
function checkTopic(topic) {
    if (topic == null) {
        return "null";
    }
    if (hexDataLength(topic) !== 32) {
        logger$t.throwArgumentError("invalid topic", "topic", topic);
    }
    return topic.toLowerCase();
}
function serializeTopics(topics) {
    topics = topics.slice();
    while (topics.length > 0 && topics[topics.length - 1] == null) {
        topics.pop();
    }
    return topics
        .map((topic) => {
            if (Array.isArray(topic)) {
                const unique = {};
                topic.forEach((topic) => {
                    unique[checkTopic(topic)] = true;
                });
                const sorted = Object.keys(unique);
                sorted.sort();
                return sorted.join("|");
            } else {
                return checkTopic(topic);
            }
        })
        .join("&");
}
function deserializeTopics(data) {
    if (data === "") {
        return [];
    }
    return data.split(/&/g).map((topic) => {
        if (topic === "") {
            return [];
        }
        const comps = topic.split("|").map((topic) => {
            return topic === "null" ? null : topic;
        });
        return comps.length === 1 ? comps[0] : comps;
    });
}
function getEventTag$1(eventName) {
    if (typeof eventName === "string") {
        eventName = eventName.toLowerCase();
        if (hexDataLength(eventName) === 32) {
            return "tx:" + eventName;
        }
        if (eventName.indexOf(":") === -1) {
            return eventName;
        }
    } else if (Array.isArray(eventName)) {
        return "filter:*:" + serializeTopics(eventName);
    } else if (ForkEvent.isForkEvent(eventName)) {
        logger$t.warn("not implemented");
        throw new Error("not implemented");
    } else if (eventName && typeof eventName === "object") {
        return (
            "filter:" +
            (eventName.address || "*") +
            ":" +
            serializeTopics(eventName.topics || [])
        );
    }
    throw new Error("invalid event - " + eventName);
}
function getTime() {
    return new Date().getTime();
}
function stall(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
const PollableEvents = ["block", "network", "pending", "poll"];
class Event {
    constructor(tag, listener, once) {
        defineReadOnly(this, "tag", tag);
        defineReadOnly(this, "listener", listener);
        defineReadOnly(this, "once", once);
    }
    get event() {
        switch (this.type) {
            case "tx":
                return this.hash;
            case "filter":
                return this.filter;
        }
        return this.tag;
    }
    get type() {
        return this.tag.split(":")[0];
    }
    get hash() {
        const comps = this.tag.split(":");
        if (comps[0] !== "tx") {
            return null;
        }
        return comps[1];
    }
    get filter() {
        const comps = this.tag.split(":");
        if (comps[0] !== "filter") {
            return null;
        }
        const address = comps[1];
        const topics = deserializeTopics(comps[2]);
        const filter = {};
        if (topics.length > 0) {
            filter.topics = topics;
        }
        if (address && address !== "*") {
            filter.address = address;
        }
        return filter;
    }
    pollable() {
        return this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0;
    }
}
const coinInfos = {
    0: { symbol: "btc", p2pkh: 0, p2sh: 5, prefix: "bc" },
    2: { symbol: "ltc", p2pkh: 48, p2sh: 50, prefix: "ltc" },
    3: { symbol: "doge", p2pkh: 30, p2sh: 22 },
    60: { symbol: "eth", ilk: "eth" },
    61: { symbol: "etc", ilk: "eth" },
    700: { symbol: "xdai", ilk: "eth" },
};
function bytes32ify(value) {
    return hexZeroPad(BigNumber.from(value).toHexString(), 32);
}
function base58Encode(data) {
    return Base58.encode(
        concat([data, hexDataSlice(sha256$1(sha256$1(data)), 0, 4)])
    );
}
class Resolver {
    constructor(provider, address, name) {
        defineReadOnly(this, "provider", provider);
        defineReadOnly(this, "name", name);
        defineReadOnly(this, "address", provider.formatter.address(address));
    }
    _fetchBytes(selector, parameters) {
        return __awaiter$8(this, void 0, void 0, function* () {
            const transaction = {
                to: this.address,
                data: hexConcat([selector, namehash(this.name), parameters || "0x"]),
            };
            const result = yield this.provider.call(transaction);
            if (result === "0x") {
                return null;
            }
            const offset = BigNumber.from(hexDataSlice(result, 0, 32)).toNumber();
            const length = BigNumber.from(
                hexDataSlice(result, offset, offset + 32)
            ).toNumber();
            return hexDataSlice(result, offset + 32, offset + 32 + length);
        });
    }
    _getAddress(coinType, hexBytes) {
        const coinInfo = coinInfos[String(coinType)];
        if (coinInfo == null) {
            logger$t.throwError(
                `unsupported coin type: ${coinType}`,
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: `getAddress(${coinType})` }
            );
        }
        if (coinInfo.ilk === "eth") {
            return this.provider.formatter.address(hexBytes);
        }
        const bytes = arrayify(hexBytes);
        if (coinInfo.p2pkh != null) {
            const p2pkh = hexBytes.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
            if (p2pkh) {
                const length = parseInt(p2pkh[1], 16);
                if (p2pkh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode(concat([[coinInfo.p2pkh], "0x" + p2pkh[2]]));
                }
            }
        }
        if (coinInfo.p2sh != null) {
            const p2sh = hexBytes.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
            if (p2sh) {
                const length = parseInt(p2sh[1], 16);
                if (p2sh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode(concat([[coinInfo.p2sh], "0x" + p2sh[2]]));
                }
            }
        }
        if (coinInfo.prefix != null) {
            const length = bytes[1];
            let version = bytes[0];
            if (version === 0) {
                if (length !== 20 && length !== 32) {
                    version = -1;
                }
            } else {
                version = -1;
            }
            if (
                version >= 0 &&
                bytes.length === 2 + length &&
                length >= 1 &&
                length <= 75
            ) {
                const words = bech32.toWords(bytes.slice(2));
                words.unshift(version);
                return bech32.encode(coinInfo.prefix, words);
            }
        }
        return null;
    }
    getAddress(coinType) {
        return __awaiter$8(this, void 0, void 0, function* () {
            if (coinType == null) {
                coinType = 60;
            }
            if (coinType === 60) {
                const transaction = {
                    to: this.address,
                    data: "0x3b3b57de" + namehash(this.name).substring(2),
                };
                const hexBytes = yield this.provider.call(transaction);
                if (hexBytes === "0x" || hexBytes === HashZero) {
                    return null;
                }
                return this.provider.formatter.callAddress(hexBytes);
            }
            const hexBytes = yield this._fetchBytes(
                "0xf1cb7e06",
                bytes32ify(coinType)
            );
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            const address = this._getAddress(coinType, hexBytes);
            if (address == null) {
                logger$t.throwError(
                    `invalid or unsupported coin data`,
                    Logger.errors.UNSUPPORTED_OPERATION,
                    {
                        operation: `getAddress(${coinType})`,
                        coinType: coinType,
                        data: hexBytes,
                    }
                );
            }
            return address;
        });
    }
    getContentHash() {
        return __awaiter$8(this, void 0, void 0, function* () {
            const hexBytes = yield this._fetchBytes("0xbc1c58d1");
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            const ipfs = hexBytes.match(
                /^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/
            );
            if (ipfs) {
                const length = parseInt(ipfs[3], 16);
                if (ipfs[4].length === length * 2) {
                    return "ipfs://" + Base58.encode("0x" + ipfs[1]);
                }
            }
            const swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
            if (swarm) {
                if (swarm[1].length === 32 * 2) {
                    return "bzz://" + swarm[1];
                }
            }
            return logger$t.throwError(
                `invalid or unsupported content hash data`,
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "getContentHash()", data: hexBytes }
            );
        });
    }
    getText(key) {
        return __awaiter$8(this, void 0, void 0, function* () {
            let keyBytes = toUtf8Bytes(key);
            keyBytes = concat([
                bytes32ify(64),
                bytes32ify(keyBytes.length),
                keyBytes,
            ]);
            if (keyBytes.length % 32 !== 0) {
                keyBytes = concat([keyBytes, hexZeroPad("0x", 32 - (key.length % 32))]);
            }
            const hexBytes = yield this._fetchBytes("0x59d1d43c", hexlify(keyBytes));
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            return toUtf8String(hexBytes);
        });
    }
}
let defaultFormatter = null;
let nextPollId = 1;
class BaseProvider extends Provider {
    constructor(network) {
        logger$t.checkNew(new.target, Provider);
        super();
        this._events = [];
        this._emitted = { block: -2 };
        this.formatter = new.target.getFormatter();
        defineReadOnly(this, "anyNetwork", network === "any");
        if (this.anyNetwork) {
            network = this.detectNetwork();
        }
        if (network instanceof Promise) {
            this._networkPromise = network;
            network.catch((error) => { });
            this._ready().catch((error) => { });
        } else {
            const knownNetwork = getStatic(new.target, "getNetwork")(network);
            if (knownNetwork) {
                defineReadOnly(this, "_network", knownNetwork);
                this.emit("network", knownNetwork, null);
            } else {
                logger$t.throwArgumentError("invalid network", "network", network);
            }
        }
        this._maxInternalBlockNumber = -1024;
        this._lastBlockNumber = -2;
        this._pollingInterval = 4e3;
        this._fastQueryDate = 0;
    }
    _ready() {
        return __awaiter$8(this, void 0, void 0, function* () {
            if (this._network == null) {
                let network = null;
                if (this._networkPromise) {
                    try {
                        network = yield this._networkPromise;
                    } catch (error) { }
                }
                if (network == null) {
                    network = yield this.detectNetwork();
                }
                if (!network) {
                    logger$t.throwError(
                        "no network detected",
                        Logger.errors.UNKNOWN_ERROR,
                        {}
                    );
                }
                if (this._network == null) {
                    if (this.anyNetwork) {
                        this._network = network;
                    } else {
                        defineReadOnly(this, "_network", network);
                    }
                    this.emit("network", network, null);
                }
            }
            return this._network;
        });
    }
    get ready() {
        return poll(() => {
            return this._ready().then(
                (network) => {
                    return network;
                },
                (error) => {
                    if (
                        error.code === Logger.errors.NETWORK_ERROR &&
                        error.event === "noNetwork"
                    ) {
                        return undefined;
                    }
                    throw error;
                }
            );
        });
    }
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }
    static getNetwork(network) {
        return getNetwork(network == null ? "homestead" : network);
    }
    _getInternalBlockNumber(maxAge) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this._ready();
            if (maxAge > 0) {
                while (this._internalBlockNumber) {
                    const internalBlockNumber = this._internalBlockNumber;
                    try {
                        const result = yield internalBlockNumber;
                        if (getTime() - result.respTime <= maxAge) {
                            return result.blockNumber;
                        }
                        break;
                    } catch (error) {
                        if (this._internalBlockNumber === internalBlockNumber) {
                            break;
                        }
                    }
                }
            }
            const reqTime = getTime();
            const checkInternalBlockNumber = resolveProperties({
                blockNumber: this.perform("getBlockNumber", {}),
                networkError: this.getNetwork().then(
                    (network) => null,
                    (error) => error
                ),
            }).then(({ blockNumber: blockNumber, networkError: networkError }) => {
                if (networkError) {
                    if (this._internalBlockNumber === checkInternalBlockNumber) {
                        this._internalBlockNumber = null;
                    }
                    throw networkError;
                }
                const respTime = getTime();
                blockNumber = BigNumber.from(blockNumber).toNumber();
                if (blockNumber < this._maxInternalBlockNumber) {
                    blockNumber = this._maxInternalBlockNumber;
                }
                this._maxInternalBlockNumber = blockNumber;
                this._setFastBlockNumber(blockNumber);
                return {
                    blockNumber: blockNumber,
                    reqTime: reqTime,
                    respTime: respTime,
                };
            });
            this._internalBlockNumber = checkInternalBlockNumber;
            checkInternalBlockNumber.catch((error) => {
                if (this._internalBlockNumber === checkInternalBlockNumber) {
                    this._internalBlockNumber = null;
                }
            });
            return (yield checkInternalBlockNumber).blockNumber;
        });
    }
    poll() {
        return __awaiter$8(this, void 0, void 0, function* () {
            const pollId = nextPollId++;
            const runners = [];
            let blockNumber = null;
            try {
                blockNumber = yield this._getInternalBlockNumber(
                    100 + this.pollingInterval / 2
                );
            } catch (error) {
                this.emit("error", error);
                return;
            }
            this._setFastBlockNumber(blockNumber);
            this.emit("poll", pollId, blockNumber);
            if (blockNumber === this._lastBlockNumber) {
                this.emit("didPoll", pollId);
                return;
            }
            if (this._emitted.block === -2) {
                this._emitted.block = blockNumber - 1;
            }
            if (Math.abs(this._emitted.block - blockNumber) > 1e3) {
                logger$t.warn("network block skew detected; skipping block events");
                this.emit(
                    "error",
                    logger$t.makeError(
                        "network block skew detected",
                        Logger.errors.NETWORK_ERROR,
                        {
                            blockNumber: blockNumber,
                            event: "blockSkew",
                            previousBlockNumber: this._emitted.block,
                        }
                    )
                );
                this.emit("block", blockNumber);
            } else {
                for (let i = this._emitted.block + 1; i <= blockNumber; i++) {
                    this.emit("block", i);
                }
            }
            if (this._emitted.block !== blockNumber) {
                this._emitted.block = blockNumber;
                Object.keys(this._emitted).forEach((key) => {
                    if (key === "block") {
                        return;
                    }
                    const eventBlockNumber = this._emitted[key];
                    if (eventBlockNumber === "pending") {
                        return;
                    }
                    if (blockNumber - eventBlockNumber > 12) {
                        delete this._emitted[key];
                    }
                });
            }
            if (this._lastBlockNumber === -2) {
                this._lastBlockNumber = blockNumber - 1;
            }
            this._events.forEach((event) => {
                switch (event.type) {
                    case "tx": {
                        const hash = event.hash;
                        let runner = this.getTransactionReceipt(hash)
                            .then((receipt) => {
                                if (!receipt || receipt.blockNumber == null) {
                                    return null;
                                }
                                this._emitted["t:" + hash] = receipt.blockNumber;
                                this.emit(hash, receipt);
                                return null;
                            })
                            .catch((error) => {
                                this.emit("error", error);
                            });
                        runners.push(runner);
                        break;
                    }
                    case "filter": {
                        const filter = event.filter;
                        filter.fromBlock = this._lastBlockNumber + 1;
                        filter.toBlock = blockNumber;
                        const runner = this.getLogs(filter)
                            .then((logs) => {
                                if (logs.length === 0) {
                                    return;
                                }
                                logs.forEach((log) => {
                                    this._emitted["b:" + log.blockHash] = log.blockNumber;
                                    this._emitted["t:" + log.transactionHash] = log.blockNumber;
                                    this.emit(filter, log);
                                });
                            })
                            .catch((error) => {
                                this.emit("error", error);
                            });
                        runners.push(runner);
                        break;
                    }
                }
            });
            this._lastBlockNumber = blockNumber;
            Promise.all(runners)
                .then(() => {
                    this.emit("didPoll", pollId);
                })
                .catch((error) => {
                    this.emit("error", error);
                });
            return;
        });
    }
    resetEventsBlock(blockNumber) {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) {
            this.poll();
        }
    }
    get network() {
        return this._network;
    }
    detectNetwork() {
        return __awaiter$8(this, void 0, void 0, function* () {
            return logger$t.throwError(
                "provider does not support network detection",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "provider.detectNetwork" }
            );
        });
    }
    getNetwork() {
        return __awaiter$8(this, void 0, void 0, function* () {
            const network = yield this._ready();
            const currentNetwork = yield this.detectNetwork();
            if (network.chainId !== currentNetwork.chainId) {
                if (this.anyNetwork) {
                    this._network = currentNetwork;
                    this._lastBlockNumber = -2;
                    this._fastBlockNumber = null;
                    this._fastBlockNumberPromise = null;
                    this._fastQueryDate = 0;
                    this._emitted.block = -2;
                    this._maxInternalBlockNumber = -1024;
                    this._internalBlockNumber = null;
                    this.emit("network", currentNetwork, network);
                    yield stall(0);
                    return this._network;
                }
                const error = logger$t.makeError(
                    "underlying network changed",
                    Logger.errors.NETWORK_ERROR,
                    {
                        event: "changed",
                        network: network,
                        detectedNetwork: currentNetwork,
                    }
                );
                this.emit("error", error);
                throw error;
            }
            return network;
        });
    }
    get blockNumber() {
        this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(
            (blockNumber) => {
                this._setFastBlockNumber(blockNumber);
            },
            (error) => { }
        );
        return this._fastBlockNumber != null ? this._fastBlockNumber : -1;
    }
    get polling() {
        return this._poller != null;
    }
    set polling(value) {
        if (value && !this._poller) {
            this._poller = setInterval(() => {
                this.poll();
            }, this.pollingInterval);
            if (!this._bootstrapPoll) {
                this._bootstrapPoll = setTimeout(() => {
                    this.poll();
                    this._bootstrapPoll = setTimeout(() => {
                        if (!this._poller) {
                            this.poll();
                        }
                        this._bootstrapPoll = null;
                    }, this.pollingInterval);
                }, 0);
            }
        } else if (!value && this._poller) {
            clearInterval(this._poller);
            this._poller = null;
        }
    }
    get pollingInterval() {
        return this._pollingInterval;
    }
    set pollingInterval(value) {
        if (
            typeof value !== "number" ||
            value <= 0 ||
            parseInt(String(value)) != value
        ) {
            throw new Error("invalid polling interval");
        }
        this._pollingInterval = value;
        if (this._poller) {
            clearInterval(this._poller);
            this._poller = setInterval(() => {
                this.poll();
            }, this._pollingInterval);
        }
    }
    _getFastBlockNumber() {
        const now = getTime();
        if (now - this._fastQueryDate > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then(
                (blockNumber) => {
                    if (
                        this._fastBlockNumber == null ||
                        blockNumber > this._fastBlockNumber
                    ) {
                        this._fastBlockNumber = blockNumber;
                    }
                    return this._fastBlockNumber;
                }
            );
        }
        return this._fastBlockNumberPromise;
    }
    _setFastBlockNumber(blockNumber) {
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
            return;
        }
        this._fastQueryDate = getTime();
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
    }
    waitForTransaction(transactionHash, confirmations, timeout) {
        return __awaiter$8(this, void 0, void 0, function* () {
            if (confirmations == null) {
                confirmations = 1;
            }
            const receipt = yield this.getTransactionReceipt(transactionHash);
            if ((receipt ? receipt.confirmations : 0) >= confirmations) {
                return receipt;
            }
            return new Promise((resolve, reject) => {
                let timer = null;
                let done = false;
                const handler = (receipt) => {
                    if (receipt.confirmations < confirmations) {
                        return;
                    }
                    if (timer) {
                        clearTimeout(timer);
                    }
                    if (done) {
                        return;
                    }
                    done = true;
                    this.removeListener(transactionHash, handler);
                    resolve(receipt);
                };
                this.on(transactionHash, handler);
                if (typeof timeout === "number" && timeout > 0) {
                    timer = setTimeout(() => {
                        if (done) {
                            return;
                        }
                        timer = null;
                        done = true;
                        this.removeListener(transactionHash, handler);
                        reject(
                            logger$t.makeError("timeout exceeded", Logger.errors.TIMEOUT, {
                                timeout: timeout,
                            })
                        );
                    }, timeout);
                    if (timer.unref) {
                        timer.unref();
                    }
                }
            });
        });
    }
    getBlockNumber() {
        return __awaiter$8(this, void 0, void 0, function* () {
            return this._getInternalBlockNumber(0);
        });
    }
    getGasPrice() {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const result = yield this.perform("getGasPrice", {});
            try {
                return BigNumber.from(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    { method: "getGasPrice", result: result, error: error }
                );
            }
        });
    }
    getBalance(addressOrName, blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
            });
            const result = yield this.perform("getBalance", params);
            try {
                return BigNumber.from(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    { method: "getBalance", params: params, result: result, error: error }
                );
            }
        });
    }
    getTransactionCount(addressOrName, blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
            });
            const result = yield this.perform("getTransactionCount", params);
            try {
                return BigNumber.from(result).toNumber();
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    {
                        method: "getTransactionCount",
                        params: params,
                        result: result,
                        error: error,
                    }
                );
            }
        });
    }
    getCode(addressOrName, blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
            });
            const result = yield this.perform("getCode", params);
            try {
                return hexlify(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    { method: "getCode", params: params, result: result, error: error }
                );
            }
        });
    }
    getStorageAt(addressOrName, position, blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
                position: Promise.resolve(position).then((p) => hexValue(p)),
            });
            const result = yield this.perform("getStorageAt", params);
            try {
                return hexlify(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    {
                        method: "getStorageAt",
                        params: params,
                        result: result,
                        error: error,
                    }
                );
            }
        });
    }
    _wrapTransaction(tx, hash) {
        if (hash != null && hexDataLength(hash) !== 32) {
            throw new Error("invalid response - sendTransaction");
        }
        const result = tx;
        if (hash != null && tx.hash !== hash) {
            logger$t.throwError(
                "Transaction hash mismatch from Provider.sendTransaction.",
                Logger.errors.UNKNOWN_ERROR,
                { expectedHash: tx.hash, returnedHash: hash }
            );
        }
        result.wait = (confirmations) =>
            __awaiter$8(this, void 0, void 0, function* () {
                if (confirmations !== 0) {
                    this._emitted["t:" + tx.hash] = "pending";
                }
                const receipt = yield this.waitForTransaction(tx.hash, confirmations);
                if (receipt == null && confirmations === 0) {
                    return null;
                }
                this._emitted["t:" + tx.hash] = receipt.blockNumber;
                if (receipt.status === 0) {
                    logger$t.throwError(
                        "transaction failed",
                        Logger.errors.CALL_EXCEPTION,
                        { transactionHash: tx.hash, transaction: tx, receipt: receipt }
                    );
                }
                return receipt;
            });
        return result;
    }
    sendTransaction(signedTransaction) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const hexTx = yield Promise.resolve(signedTransaction).then((t) =>
                hexlify(t)
            );
            const tx = this.formatter.transaction(signedTransaction);
            try {
                const hash = yield this.perform("sendTransaction", {
                    signedTransaction: hexTx,
                });
                return this._wrapTransaction(tx, hash);
            } catch (error) {
                error.transaction = tx;
                error.transactionHash = tx.hash;
                throw error;
            }
        });
    }
    _getTransactionRequest(transaction) {
        return __awaiter$8(this, void 0, void 0, function* () {
            const values = yield transaction;
            const tx = {};
            ["from", "to"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) =>
                    v ? this._getAddress(v) : null
                );
            });
            ["gasLimit", "gasPrice", "value"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) =>
                    v ? BigNumber.from(v) : null
                );
            });
            ["type"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) =>
                    v != null ? v : null
                );
            });
            if (values.accessList) {
                tx.accessList = this.formatter.accessList(values.accessList);
            }
            ["data"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) =>
                    v ? hexlify(v) : null
                );
            });
            return this.formatter.transactionRequest(yield resolveProperties(tx));
        });
    }
    _getFilter(filter) {
        return __awaiter$8(this, void 0, void 0, function* () {
            filter = yield filter;
            const result = {};
            if (filter.address != null) {
                result.address = this._getAddress(filter.address);
            }
            ["blockHash", "topics"].forEach((key) => {
                if (filter[key] == null) {
                    return;
                }
                result[key] = filter[key];
            });
            ["fromBlock", "toBlock"].forEach((key) => {
                if (filter[key] == null) {
                    return;
                }
                result[key] = this._getBlockTag(filter[key]);
            });
            return this.formatter.filter(yield resolveProperties(result));
        });
    }
    call(transaction, blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                transaction: this._getTransactionRequest(transaction),
                blockTag: this._getBlockTag(blockTag),
            });
            const result = yield this.perform("call", params);
            try {
                return hexlify(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    { method: "call", params: params, result: result, error: error }
                );
            }
        });
    }
    estimateGas(transaction) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                transaction: this._getTransactionRequest(transaction),
            });
            const result = yield this.perform("estimateGas", params);
            try {
                return BigNumber.from(result);
            } catch (error) {
                return logger$t.throwError(
                    "bad result from backend",
                    Logger.errors.SERVER_ERROR,
                    {
                        method: "estimateGas",
                        params: params,
                        result: result,
                        error: error,
                    }
                );
            }
        });
    }
    _getAddress(addressOrName) {
        return __awaiter$8(this, void 0, void 0, function* () {
            const address = yield this.resolveName(addressOrName);
            if (address == null) {
                logger$t.throwError(
                    "ENS name not configured",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: `resolveName(${JSON.stringify(addressOrName)})` }
                );
            }
            return address;
        });
    }
    _getBlock(blockHashOrBlockTag, includeTransactions) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            blockHashOrBlockTag = yield blockHashOrBlockTag;
            let blockNumber = -128;
            const params = { includeTransactions: !!includeTransactions };
            if (isHexString(blockHashOrBlockTag, 32)) {
                params.blockHash = blockHashOrBlockTag;
            } else {
                try {
                    params.blockTag = this.formatter.blockTag(
                        yield this._getBlockTag(blockHashOrBlockTag)
                    );
                    if (isHexString(params.blockTag)) {
                        blockNumber = parseInt(params.blockTag.substring(2), 16);
                    }
                } catch (error) {
                    logger$t.throwArgumentError(
                        "invalid block hash or block tag",
                        "blockHashOrBlockTag",
                        blockHashOrBlockTag
                    );
                }
            }
            return poll(
                () =>
                    __awaiter$8(this, void 0, void 0, function* () {
                        const block = yield this.perform("getBlock", params);
                        if (block == null) {
                            if (params.blockHash != null) {
                                if (this._emitted["b:" + params.blockHash] == null) {
                                    return null;
                                }
                            }
                            if (params.blockTag != null) {
                                if (blockNumber > this._emitted.block) {
                                    return null;
                                }
                            }
                            return undefined;
                        }
                        if (includeTransactions) {
                            let blockNumber = null;
                            for (let i = 0; i < block.transactions.length; i++) {
                                const tx = block.transactions[i];
                                if (tx.blockNumber == null) {
                                    tx.confirmations = 0;
                                } else if (tx.confirmations == null) {
                                    if (blockNumber == null) {
                                        blockNumber = yield this._getInternalBlockNumber(
                                            100 + 2 * this.pollingInterval
                                        );
                                    }
                                    let confirmations = blockNumber - tx.blockNumber + 1;
                                    if (confirmations <= 0) {
                                        confirmations = 1;
                                    }
                                    tx.confirmations = confirmations;
                                }
                            }
                            return this.formatter.blockWithTransactions(block);
                        }
                        return this.formatter.block(block);
                    }),
                { oncePoll: this }
            );
        });
    }
    getBlock(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, false);
    }
    getBlockWithTransactions(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, true);
    }
    getTransaction(transactionHash) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = {
                transactionHash: this.formatter.hash(transactionHash, true),
            };
            return poll(
                () =>
                    __awaiter$8(this, void 0, void 0, function* () {
                        const result = yield this.perform("getTransaction", params);
                        if (result == null) {
                            if (this._emitted["t:" + transactionHash] == null) {
                                return null;
                            }
                            return undefined;
                        }
                        const tx = this.formatter.transactionResponse(result);
                        if (tx.blockNumber == null) {
                            tx.confirmations = 0;
                        } else if (tx.confirmations == null) {
                            const blockNumber = yield this._getInternalBlockNumber(
                                100 + 2 * this.pollingInterval
                            );
                            let confirmations = blockNumber - tx.blockNumber + 1;
                            if (confirmations <= 0) {
                                confirmations = 1;
                            }
                            tx.confirmations = confirmations;
                        }
                        return this._wrapTransaction(tx);
                    }),
                { oncePoll: this }
            );
        });
    }
    getTransactionReceipt(transactionHash) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = {
                transactionHash: this.formatter.hash(transactionHash, true),
            };
            return poll(
                () =>
                    __awaiter$8(this, void 0, void 0, function* () {
                        const result = yield this.perform("getTransactionReceipt", params);
                        if (result == null) {
                            if (this._emitted["t:" + transactionHash] == null) {
                                return null;
                            }
                            return undefined;
                        }
                        if (result.blockHash == null) {
                            return undefined;
                        }
                        const receipt = this.formatter.receipt(result);
                        if (receipt.blockNumber == null) {
                            receipt.confirmations = 0;
                        } else if (receipt.confirmations == null) {
                            const blockNumber = yield this._getInternalBlockNumber(
                                100 + 2 * this.pollingInterval
                            );
                            let confirmations = blockNumber - receipt.blockNumber + 1;
                            if (confirmations <= 0) {
                                confirmations = 1;
                            }
                            receipt.confirmations = confirmations;
                        }
                        return receipt;
                    }),
                { oncePoll: this }
            );
        });
    }
    getLogs(filter) {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                filter: this._getFilter(filter),
            });
            const logs = yield this.perform("getLogs", params);
            logs.forEach((log) => {
                if (log.removed == null) {
                    log.removed = false;
                }
            });
            return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(
                logs
            );
        });
    }
    getEtherPrice() {
        return __awaiter$8(this, void 0, void 0, function* () {
            yield this.getNetwork();
            return this.perform("getEtherPrice", {});
        });
    }
    _getBlockTag(blockTag) {
        return __awaiter$8(this, void 0, void 0, function* () {
            blockTag = yield blockTag;
            if (typeof blockTag === "number" && blockTag < 0) {
                if (blockTag % 1) {
                    logger$t.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
                }
                let blockNumber = yield this._getInternalBlockNumber(
                    100 + 2 * this.pollingInterval
                );
                blockNumber += blockTag;
                if (blockNumber < 0) {
                    blockNumber = 0;
                }
                return this.formatter.blockTag(blockNumber);
            }
            return this.formatter.blockTag(blockTag);
        });
    }
    getResolver(name) {
        return __awaiter$8(this, void 0, void 0, function* () {
            const address = yield this._getResolver(name);
            if (address == null) {
                return null;
            }
            return new Resolver(this, address, name);
        });
    }
    _getResolver(name) {
        return __awaiter$8(this, void 0, void 0, function* () {
            const network = yield this.getNetwork();
            if (!network.ensAddress) {
                logger$t.throwError(
                    "network does not support ENS",
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "ENS", network: network.name }
                );
            }
            const transaction = {
                to: network.ensAddress,
                data: "0x0178b8bf" + namehash(name).substring(2),
            };
            return this.formatter.callAddress(yield this.call(transaction));
        });
    }
    resolveName(name) {
        return __awaiter$8(this, void 0, void 0, function* () {
            name = yield name;
            try {
                return Promise.resolve(this.formatter.address(name));
            } catch (error) {
                if (isHexString(name)) {
                    throw error;
                }
            }
            if (typeof name !== "string") {
                logger$t.throwArgumentError("invalid ENS name", "name", name);
            }
            const resolver = yield this.getResolver(name);
            if (!resolver) {
                return null;
            }
            return yield resolver.getAddress();
        });
    }
    lookupAddress(address) {
        return __awaiter$8(this, void 0, void 0, function* () {
            address = yield address;
            address = this.formatter.address(address);
            const reverseName = address.substring(2).toLowerCase() + ".addr.reverse";
            const resolverAddress = yield this._getResolver(reverseName);
            if (!resolverAddress) {
                return null;
            }
            let bytes = arrayify(
                yield this.call({
                    to: resolverAddress,
                    data: "0x691f3431" + namehash(reverseName).substring(2),
                })
            );
            if (bytes.length < 32 || !BigNumber.from(bytes.slice(0, 32)).eq(32)) {
                return null;
            }
            bytes = bytes.slice(32);
            if (bytes.length < 32) {
                return null;
            }
            const length = BigNumber.from(bytes.slice(0, 32)).toNumber();
            bytes = bytes.slice(32);
            if (length > bytes.length) {
                return null;
            }
            const name = toUtf8String(bytes.slice(0, length));
            const addr = yield this.resolveName(name);
            if (addr != address) {
                return null;
            }
            return name;
        });
    }
    perform(method, params) {
        return logger$t.throwError(
            method + " not implemented",
            Logger.errors.NOT_IMPLEMENTED,
            { operation: method }
        );
    }
    _startEvent(event) {
        this.polling = this._events.filter((e) => e.pollable()).length > 0;
    }
    _stopEvent(event) {
        this.polling = this._events.filter((e) => e.pollable()).length > 0;
    }
    _addEventListener(eventName, listener, once) {
        const event = new Event(getEventTag$1(eventName), listener, once);
        this._events.push(event);
        this._startEvent(event);
        return this;
    }
    on(eventName, listener) {
        return this._addEventListener(eventName, listener, false);
    }
    once(eventName, listener) {
        return this._addEventListener(eventName, listener, true);
    }
    emit(eventName, ...args) {
        let result = false;
        let stopped = [];
        let eventTag = getEventTag$1(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag) {
                return true;
            }
            setTimeout(() => {
                event.listener.apply(this, args);
            }, 0);
            result = true;
            if (event.once) {
                stopped.push(event);
                return false;
            }
            return true;
        });
        stopped.forEach((event) => {
            this._stopEvent(event);
        });
        return result;
    }
    listenerCount(eventName) {
        if (!eventName) {
            return this._events.length;
        }
        let eventTag = getEventTag$1(eventName);
        return this._events.filter((event) => {
            return event.tag === eventTag;
        }).length;
    }
    listeners(eventName) {
        if (eventName == null) {
            return this._events.map((event) => event.listener);
        }
        let eventTag = getEventTag$1(eventName);
        return this._events
            .filter((event) => event.tag === eventTag)
            .map((event) => event.listener);
    }
    off(eventName, listener) {
        if (listener == null) {
            return this.removeAllListeners(eventName);
        }
        const stopped = [];
        let found = false;
        let eventTag = getEventTag$1(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag || event.listener != listener) {
                return true;
            }
            if (found) {
                return true;
            }
            found = true;
            stopped.push(event);
            return false;
        });
        stopped.forEach((event) => {
            this._stopEvent(event);
        });
        return this;
    }
    removeAllListeners(eventName) {
        let stopped = [];
        if (eventName == null) {
            stopped = this._events;
            this._events = [];
        } else {
            const eventTag = getEventTag$1(eventName);
            this._events = this._events.filter((event) => {
                if (event.tag !== eventTag) {
                    return true;
                }
                stopped.push(event);
                return false;
            });
        }
        stopped.forEach((event) => {
            this._stopEvent(event);
        });
        return this;
    }
}
("use strict");
var __awaiter$9 =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$u = new Logger(version$m);
const errorGas = ["call", "estimateGas"];
function checkError(method, error, params) {
    if (method === "call" && error.code === Logger.errors.SERVER_ERROR) {
        const e = error.error;
        if (e && e.message.match("reverted") && isHexString(e.data)) {
            return e.data;
        }
    }
    let message = error.message;
    if (
        error.code === Logger.errors.SERVER_ERROR &&
        error.error &&
        typeof error.error.message === "string"
    ) {
        message = error.error.message;
    } else if (typeof error.body === "string") {
        message = error.body;
    } else if (typeof error.responseText === "string") {
        message = error.responseText;
    }
    message = (message || "").toLowerCase();
    const transaction = params.transaction || params.signedTransaction;
    if (message.match(/insufficient funds/)) {
        logger$u.throwError(
            "insufficient funds for intrinsic transaction cost",
            Logger.errors.INSUFFICIENT_FUNDS,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (message.match(/nonce too low/)) {
        logger$u.throwError(
            "nonce has already been used",
            Logger.errors.NONCE_EXPIRED,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (message.match(/replacement transaction underpriced/)) {
        logger$u.throwError(
            "replacement fee too low",
            Logger.errors.REPLACEMENT_UNDERPRICED,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (message.match(/only replay-protected/)) {
        logger$u.throwError(
            "legacy pre-eip-155 transactions not supported",
            Logger.errors.UNSUPPORTED_OPERATION,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (
        errorGas.indexOf(method) >= 0 &&
        message.match(
            /gas required exceeds allowance|always failing transaction|execution reverted/
        )
    ) {
        logger$u.throwError(
            "cannot estimate gas; transaction may fail or may require manual gas limit",
            Logger.errors.UNPREDICTABLE_GAS_LIMIT,
            { error: error, method: method, transaction: transaction }
        );
    }
    throw error;
}
function timer(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
function getResult(payload) {
    if (payload.error) {
        const error = new Error(payload.error.message);
        error.code = payload.error.code;
        error.data = payload.error.data;
        throw error;
    }
    return payload.result;
}
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
const _constructorGuard$4 = {};
class JsonRpcSigner extends Signer {
    constructor(constructorGuard, provider, addressOrIndex) {
        logger$u.checkNew(new.target, JsonRpcSigner);
        super();
        if (constructorGuard !== _constructorGuard$4) {
            throw new Error(
                "do not call the JsonRpcSigner constructor directly; use provider.getSigner"
            );
        }
        defineReadOnly(this, "provider", provider);
        if (addressOrIndex == null) {
            addressOrIndex = 0;
        }
        if (typeof addressOrIndex === "string") {
            defineReadOnly(
                this,
                "_address",
                this.provider.formatter.address(addressOrIndex)
            );
            defineReadOnly(this, "_index", null);
        } else if (typeof addressOrIndex === "number") {
            defineReadOnly(this, "_index", addressOrIndex);
            defineReadOnly(this, "_address", null);
        } else {
            logger$u.throwArgumentError(
                "invalid address or index",
                "addressOrIndex",
                addressOrIndex
            );
        }
    }
    connect(provider) {
        return logger$u.throwError(
            "cannot alter JSON-RPC Signer connection",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "connect" }
        );
    }
    connectUnchecked() {
        return new UncheckedJsonRpcSigner(
            _constructorGuard$4,
            this.provider,
            this._address || this._index
        );
    }
    getAddress() {
        if (this._address) {
            return Promise.resolve(this._address);
        }
        return this.provider.send("eth_accounts", []).then((accounts) => {
            if (accounts.length <= this._index) {
                logger$u.throwError(
                    "unknown account #" + this._index,
                    Logger.errors.UNSUPPORTED_OPERATION,
                    { operation: "getAddress" }
                );
            }
            return this.provider.formatter.address(accounts[this._index]);
        });
    }
    sendUncheckedTransaction(transaction) {
        transaction = shallowCopy(transaction);
        const fromAddress = this.getAddress().then((address) => {
            if (address) {
                address = address.toLowerCase();
            }
            return address;
        });
        if (transaction.gasLimit == null) {
            const estimate = shallowCopy(transaction);
            estimate.from = fromAddress;
            transaction.gasLimit = this.provider.estimateGas(estimate);
        }
        return resolveProperties({
            tx: resolveProperties(transaction),
            sender: fromAddress,
        }).then(({ tx: tx, sender: sender }) => {
            if (tx.from != null) {
                if (tx.from.toLowerCase() !== sender) {
                    logger$u.throwArgumentError(
                        "from address mismatch",
                        "transaction",
                        transaction
                    );
                }
            } else {
                tx.from = sender;
            }
            const hexTx = this.provider.constructor.hexlifyTransaction(tx, {
                from: true,
            });
            return this.provider.send("eth_sendTransaction", [hexTx]).then(
                (hash) => {
                    return hash;
                },
                (error) => {
                    return checkError("sendTransaction", error, hexTx);
                }
            );
        });
    }
    signTransaction(transaction) {
        return logger$u.throwError(
            "signing transactions is unsupported",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "signTransaction" }
        );
    }
    sendTransaction(transaction) {
        return this.sendUncheckedTransaction(transaction).then((hash) => {
            return poll(
                () => {
                    return this.provider.getTransaction(hash).then((tx) => {
                        if (tx === null) {
                            return undefined;
                        }
                        return this.provider._wrapTransaction(tx, hash);
                    });
                },
                { onceBlock: this.provider }
            ).catch((error) => {
                error.transactionHash = hash;
                throw error;
            });
        });
    }
    signMessage(message) {
        return __awaiter$9(this, void 0, void 0, function* () {
            const data = typeof message === "string" ? toUtf8Bytes(message) : message;
            const address = yield this.getAddress();
            return yield this.provider.send("eth_sign", [
                address.toLowerCase(),
                hexlify(data),
            ]);
        });
    }
    _signTypedData(domain, types, value) {
        return __awaiter$9(this, void 0, void 0, function* () {
            const populated = yield TypedDataEncoder.resolveNames(
                domain,
                types,
                value,
                (name) => {
                    return this.provider.resolveName(name);
                }
            );
            const address = yield this.getAddress();
            return yield this.provider.send("eth_signTypedData_v4", [
                address.toLowerCase(),
                JSON.stringify(
                    TypedDataEncoder.getPayload(populated.domain, types, populated.value)
                ),
            ]);
        });
    }
    unlock(password) {
        return __awaiter$9(this, void 0, void 0, function* () {
            const provider = this.provider;
            const address = yield this.getAddress();
            return provider.send("personal_unlockAccount", [
                address.toLowerCase(),
                password,
                null,
            ]);
        });
    }
}
class UncheckedJsonRpcSigner extends JsonRpcSigner {
    sendTransaction(transaction) {
        return this.sendUncheckedTransaction(transaction).then((hash) => {
            return {
                hash: hash,
                nonce: null,
                gasLimit: null,
                gasPrice: null,
                data: null,
                value: null,
                chainId: null,
                confirmations: 0,
                from: null,
                wait: (confirmations) => {
                    return this.provider.waitForTransaction(hash, confirmations);
                },
            };
        });
    }
}
const allowedTransactionKeys$3 = {
    chainId: true,
    data: true,
    gasLimit: true,
    gasPrice: true,
    nonce: true,
    to: true,
    value: true,
    type: true,
    accessList: true,
};
class JsonRpcProvider extends BaseProvider {
    constructor(url, network) {
        logger$u.checkNew(new.target, JsonRpcProvider);
        let networkOrReady = network;
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.detectNetwork().then(
                        (network) => {
                            resolve(network);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                }, 0);
            });
        }
        super(networkOrReady);
        if (!url) {
            url = getStatic(this.constructor, "defaultUrl")();
        }
        if (typeof url === "string") {
            defineReadOnly(this, "connection", Object.freeze({ url: url }));
        } else {
            defineReadOnly(this, "connection", Object.freeze(shallowCopy(url)));
        }
        this._nextId = 42;
    }
    get _cache() {
        if (this._eventLoopCache == null) {
            this._eventLoopCache = {};
        }
        return this._eventLoopCache;
    }
    static defaultUrl() {
        return "http://localhost:8545";
    }
    detectNetwork() {
        if (!this._cache["detectNetwork"]) {
            this._cache["detectNetwork"] = this._uncachedDetectNetwork();
            setTimeout(() => {
                this._cache["detectNetwork"] = null;
            }, 0);
        }
        return this._cache["detectNetwork"];
    }
    _uncachedDetectNetwork() {
        return __awaiter$9(this, void 0, void 0, function* () {
            yield timer(0);
            let chainId = null;
            try {
                chainId = yield this.send("eth_chainId", []);
            } catch (error) {
                try {
                    chainId = yield this.send("net_version", []);
                } catch (error) { }
            }
            if (chainId != null) {
                const getNetwork = getStatic(this.constructor, "getNetwork");
                try {
                    return getNetwork(BigNumber.from(chainId).toNumber());
                } catch (error) {
                    return logger$u.throwError(
                        "could not detect network",
                        Logger.errors.NETWORK_ERROR,
                        { chainId: chainId, event: "invalidNetwork", serverError: error }
                    );
                }
            }
            return logger$u.throwError(
                "could not detect network",
                Logger.errors.NETWORK_ERROR,
                { event: "noNetwork" }
            );
        });
    }
    getSigner(addressOrIndex) {
        return new JsonRpcSigner(_constructorGuard$4, this, addressOrIndex);
    }
    getUncheckedSigner(addressOrIndex) {
        return this.getSigner(addressOrIndex).connectUnchecked();
    }
    listAccounts() {
        return this.send("eth_accounts", []).then((accounts) => {
            return accounts.map((a) => this.formatter.address(a));
        });
    }
    send(method, params) {
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: "2.0",
        };
        this.emit("debug", {
            action: "request",
            request: deepCopy(request),
            provider: this,
        });
        const cache = ["eth_chainId", "eth_blockNumber"].indexOf(method) >= 0;
        if (cache && this._cache[method]) {
            return this._cache[method];
        }
        const result = fetchJson(
            this.connection,
            JSON.stringify(request),
            getResult
        ).then(
            (result) => {
                this.emit("debug", {
                    action: "response",
                    request: request,
                    response: result,
                    provider: this,
                });
                return result;
            },
            (error) => {
                this.emit("debug", {
                    action: "response",
                    error: error,
                    request: request,
                    provider: this,
                });
                throw error;
            }
        );
        if (cache) {
            this._cache[method] = result;
            setTimeout(() => {
                this._cache[method] = null;
            }, 0);
        }
        return result;
    }
    prepareRequest(method, params) {
        switch (method) {
            case "getBlockNumber":
                return ["eth_blockNumber", []];
            case "getGasPrice":
                return ["eth_gasPrice", []];
            case "getBalance":
                return [
                    "eth_getBalance",
                    [getLowerCase(params.address), params.blockTag],
                ];
            case "getTransactionCount":
                return [
                    "eth_getTransactionCount",
                    [getLowerCase(params.address), params.blockTag],
                ];
            case "getCode":
                return ["eth_getCode", [getLowerCase(params.address), params.blockTag]];
            case "getStorageAt":
                return [
                    "eth_getStorageAt",
                    [getLowerCase(params.address), params.position, params.blockTag],
                ];
            case "sendTransaction":
                return ["eth_sendRawTransaction", [params.signedTransaction]];
            case "getBlock":
                if (params.blockTag) {
                    return [
                        "eth_getBlockByNumber",
                        [params.blockTag, !!params.includeTransactions],
                    ];
                } else if (params.blockHash) {
                    return [
                        "eth_getBlockByHash",
                        [params.blockHash, !!params.includeTransactions],
                    ];
                }
                return null;
            case "getTransaction":
                return ["eth_getTransactionByHash", [params.transactionHash]];
            case "getTransactionReceipt":
                return ["eth_getTransactionReceipt", [params.transactionHash]];
            case "call": {
                const hexlifyTransaction = getStatic(
                    this.constructor,
                    "hexlifyTransaction"
                );
                return [
                    "eth_call",
                    [
                        hexlifyTransaction(params.transaction, { from: true }),
                        params.blockTag,
                    ],
                ];
            }
            case "estimateGas": {
                const hexlifyTransaction = getStatic(
                    this.constructor,
                    "hexlifyTransaction"
                );
                return [
                    "eth_estimateGas",
                    [hexlifyTransaction(params.transaction, { from: true })],
                ];
            }
            case "getLogs":
                if (params.filter && params.filter.address != null) {
                    params.filter.address = getLowerCase(params.filter.address);
                }
                return ["eth_getLogs", [params.filter]];
            default:
                break;
        }
        return null;
    }
    perform(method, params) {
        return __awaiter$9(this, void 0, void 0, function* () {
            const args = this.prepareRequest(method, params);
            if (args == null) {
                logger$u.throwError(
                    method + " not implemented",
                    Logger.errors.NOT_IMPLEMENTED,
                    { operation: method }
                );
            }
            try {
                return yield this.send(args[0], args[1]);
            } catch (error) {
                return checkError(method, error, params);
            }
        });
    }
    _startEvent(event) {
        if (event.tag === "pending") {
            this._startPending();
        }
        super._startEvent(event);
    }
    _startPending() {
        if (this._pendingFilter != null) {
            return;
        }
        const self = this;
        const pendingFilter = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;
        pendingFilter
            .then(function (filterId) {
                function poll() {
                    self
                        .send("eth_getFilterChanges", [filterId])
                        .then(function (hashes) {
                            if (self._pendingFilter != pendingFilter) {
                                return null;
                            }
                            let seq = Promise.resolve();
                            hashes.forEach(function (hash) {
                                self._emitted["t:" + hash.toLowerCase()] = "pending";
                                seq = seq.then(function () {
                                    return self.getTransaction(hash).then(function (tx) {
                                        self.emit("pending", tx);
                                        return null;
                                    });
                                });
                            });
                            return seq.then(function () {
                                return timer(1e3);
                            });
                        })
                        .then(function () {
                            if (self._pendingFilter != pendingFilter) {
                                self.send("eth_uninstallFilter", [filterId]);
                                return;
                            }
                            setTimeout(function () {
                                poll();
                            }, 0);
                            return null;
                        })
                        .catch((error) => { });
                }
                poll();
                return filterId;
            })
            .catch((error) => { });
    }
    _stopEvent(event) {
        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
            this._pendingFilter = null;
        }
        super._stopEvent(event);
    }
    static hexlifyTransaction(transaction, allowExtra) {
        const allowed = shallowCopy(allowedTransactionKeys$3);
        if (allowExtra) {
            for (const key in allowExtra) {
                if (allowExtra[key]) {
                    allowed[key] = true;
                }
            }
        }
        checkProperties(transaction, allowed);
        const result = {};
        ["gasLimit", "gasPrice", "type", "nonce", "value"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            const value = hexValue(transaction[key]);
            if (key === "gasLimit") {
                key = "gas";
            }
            result[key] = value;
        });
        ["from", "to", "data"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            result[key] = hexlify(transaction[key]);
        });
        if (transaction.accessList) {
            result["accessList"] = accessListify(transaction.accessList);
        }
        return result;
    }
}
("use strict");
let WS = null;
try {
    WS = WebSocket;
    if (WS == null) {
        throw new Error("inject please");
    }
} catch (error) {
    const logger = new Logger(version$m);
    WS = function () {
        logger.throwError(
            "WebSockets not supported in this environment",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "new WebSocket()" }
        );
    };
}
("use strict");
var __awaiter$a =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$v = new Logger(version$m);
let NextId = 1;
class WebSocketProvider extends JsonRpcProvider {
    constructor(url, network) {
        if (network === "any") {
            logger$v.throwError(
                "WebSocketProvider does not support 'any' network yet",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "network:any" }
            );
        }
        super(url, network);
        this._pollingInterval = -1;
        this._wsReady = false;
        defineReadOnly(this, "_websocket", new WS(this.connection.url));
        defineReadOnly(this, "_requests", {});
        defineReadOnly(this, "_subs", {});
        defineReadOnly(this, "_subIds", {});
        defineReadOnly(this, "_detectNetwork", super.detectNetwork());
        this._websocket.onopen = () => {
            this._wsReady = true;
            Object.keys(this._requests).forEach((id) => {
                this._websocket.send(this._requests[id].payload);
            });
        };
        this._websocket.onmessage = (messageEvent) => {
            const data = messageEvent.data;
            const result = JSON.parse(data);
            if (result.id != null) {
                const id = String(result.id);
                const request = this._requests[id];
                delete this._requests[id];
                if (result.result !== undefined) {
                    request.callback(null, result.result);
                    this.emit("debug", {
                        action: "response",
                        request: JSON.parse(request.payload),
                        response: result.result,
                        provider: this,
                    });
                } else {
                    let error = null;
                    if (result.error) {
                        error = new Error(result.error.message || "unknown error");
                        defineReadOnly(error, "code", result.error.code || null);
                        defineReadOnly(error, "response", data);
                    } else {
                        error = new Error("unknown error");
                    }
                    request.callback(error, undefined);
                    this.emit("debug", {
                        action: "response",
                        error: error,
                        request: JSON.parse(request.payload),
                        provider: this,
                    });
                }
            } else if (result.method === "eth_subscription") {
                const sub = this._subs[result.params.subscription];
                if (sub) {
                    sub.processFunc(result.params.result);
                }
            } else {
                console.warn("this should not happen");
            }
        };
        const fauxPoll = setInterval(() => {
            this.emit("poll");
        }, 1e3);
        if (fauxPoll.unref) {
            fauxPoll.unref();
        }
    }
    detectNetwork() {
        return this._detectNetwork;
    }
    get pollingInterval() {
        return 0;
    }
    resetEventsBlock(blockNumber) {
        logger$v.throwError(
            "cannot reset events block on WebSocketProvider",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "resetEventBlock" }
        );
    }
    set pollingInterval(value) {
        logger$v.throwError(
            "cannot set polling interval on WebSocketProvider",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "setPollingInterval" }
        );
    }
    poll() {
        return __awaiter$a(this, void 0, void 0, function* () {
            return null;
        });
    }
    set polling(value) {
        if (!value) {
            return;
        }
        logger$v.throwError(
            "cannot set polling on WebSocketProvider",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "setPolling" }
        );
    }
    send(method, params) {
        const rid = NextId++;
        return new Promise((resolve, reject) => {
            function callback(error, result) {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            }
            const payload = JSON.stringify({
                method: method,
                params: params,
                id: rid,
                jsonrpc: "2.0",
            });
            this.emit("debug", {
                action: "request",
                request: JSON.parse(payload),
                provider: this,
            });
            this._requests[String(rid)] = { callback: callback, payload: payload };
            if (this._wsReady) {
                this._websocket.send(payload);
            }
        });
    }
    static defaultUrl() {
        return "ws://localhost:8546";
    }
    _subscribe(tag, param, processFunc) {
        return __awaiter$a(this, void 0, void 0, function* () {
            let subIdPromise = this._subIds[tag];
            if (subIdPromise == null) {
                subIdPromise = Promise.all(param).then((param) => {
                    return this.send("eth_subscribe", param);
                });
                this._subIds[tag] = subIdPromise;
            }
            const subId = yield subIdPromise;
            this._subs[subId] = { tag: tag, processFunc: processFunc };
        });
    }
    _startEvent(event) {
        switch (event.type) {
            case "block":
                this._subscribe("block", ["newHeads"], (result) => {
                    const blockNumber = BigNumber.from(result.number).toNumber();
                    this._emitted.block = blockNumber;
                    this.emit("block", blockNumber);
                });
                break;
            case "pending":
                this._subscribe("pending", ["newPendingTransactions"], (result) => {
                    this.emit("pending", result);
                });
                break;
            case "filter":
                this._subscribe(
                    event.tag,
                    ["logs", this._getFilter(event.filter)],
                    (result) => {
                        if (result.removed == null) {
                            result.removed = false;
                        }
                        this.emit(event.filter, this.formatter.filterLog(result));
                    }
                );
                break;
            case "tx": {
                const emitReceipt = (event) => {
                    const hash = event.hash;
                    this.getTransactionReceipt(hash).then((receipt) => {
                        if (!receipt) {
                            return;
                        }
                        this.emit(hash, receipt);
                    });
                };
                emitReceipt(event);
                this._subscribe("tx", ["newHeads"], (result) => {
                    this._events.filter((e) => e.type === "tx").forEach(emitReceipt);
                });
                break;
            }
            case "debug":
            case "poll":
            case "willPoll":
            case "didPoll":
            case "error":
                break;
            default:
                console.log("unhandled:", event);
                break;
        }
    }
    _stopEvent(event) {
        let tag = event.tag;
        if (event.type === "tx") {
            if (this._events.filter((e) => e.type === "tx").length) {
                return;
            }
            tag = "tx";
        } else if (this.listenerCount(event.event)) {
            return;
        }
        const subId = this._subIds[tag];
        if (!subId) {
            return;
        }
        delete this._subIds[tag];
        subId.then((subId) => {
            if (!this._subs[subId]) {
                return;
            }
            delete this._subs[subId];
            this.send("eth_unsubscribe", [subId]);
        });
    }
    destroy() {
        return __awaiter$a(this, void 0, void 0, function* () {
            if (this._websocket.readyState === WS.CONNECTING) {
                yield new Promise((resolve) => {
                    this._websocket.onopen = function () {
                        resolve(true);
                    };
                    this._websocket.onerror = function () {
                        resolve(false);
                    };
                });
            }
            this._websocket.close(1e3);
        });
    }
}
("use strict");
var __awaiter$b =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$w = new Logger(version$m);
class StaticJsonRpcProvider extends JsonRpcProvider {
    detectNetwork() {
        const _super = Object.create(null, {
            detectNetwork: { get: () => super.detectNetwork },
        });
        return __awaiter$b(this, void 0, void 0, function* () {
            let network = this.network;
            if (network == null) {
                network = yield _super.detectNetwork.call(this);
                if (!network) {
                    logger$w.throwError(
                        "no network detected",
                        Logger.errors.UNKNOWN_ERROR,
                        {}
                    );
                }
                if (this._network == null) {
                    defineReadOnly(this, "_network", network);
                    this.emit("network", network, null);
                }
            }
            return network;
        });
    }
}
class UrlJsonRpcProvider extends StaticJsonRpcProvider {
    constructor(network, apiKey) {
        logger$w.checkAbstract(new.target, UrlJsonRpcProvider);
        network = getStatic(new.target, "getNetwork")(network);
        apiKey = getStatic(new.target, "getApiKey")(apiKey);
        const connection = getStatic(new.target, "getUrl")(network, apiKey);
        super(connection, network);
        if (typeof apiKey === "string") {
            defineReadOnly(this, "apiKey", apiKey);
        } else if (apiKey != null) {
            Object.keys(apiKey).forEach((key) => {
                defineReadOnly(this, key, apiKey[key]);
            });
        }
    }
    _startPending() {
        logger$w.warn("WARNING: API provider does not support pending filters");
    }
    isCommunityResource() {
        return false;
    }
    getSigner(address) {
        return logger$w.throwError(
            "API provider does not support signing",
            Logger.errors.UNSUPPORTED_OPERATION,
            { operation: "getSigner" }
        );
    }
    listAccounts() {
        return Promise.resolve([]);
    }
    static getApiKey(apiKey) {
        return apiKey;
    }
    static getUrl(network, apiKey) {
        return logger$w.throwError(
            "not implemented; sub-classes must override getUrl",
            Logger.errors.NOT_IMPLEMENTED,
            { operation: "getUrl" }
        );
    }
}
("use strict");
const logger$x = new Logger(version$m);
const defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
class AlchemyWebSocketProvider extends WebSocketProvider {
    constructor(network, apiKey) {
        const provider = new AlchemyProvider(network, apiKey);
        const url = provider.connection.url
            .replace(/^http/i, "ws")
            .replace(".alchemyapi.", ".ws.alchemyapi.");
        super(url, provider.network);
        defineReadOnly(this, "apiKey", provider.apiKey);
    }
    isCommunityResource() {
        return this.apiKey === defaultApiKey;
    }
}
class AlchemyProvider extends UrlJsonRpcProvider {
    static getWebSocketProvider(network, apiKey) {
        return new AlchemyWebSocketProvider(network, apiKey);
    }
    static getApiKey(apiKey) {
        if (apiKey == null) {
            return defaultApiKey;
        }
        if (apiKey && typeof apiKey !== "string") {
            logger$x.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch (network.name) {
            case "homestead":
                host = "eth-mainnet.alchemyapi.io/v2/";
                break;
            case "ropsten":
                host = "eth-ropsten.alchemyapi.io/v2/";
                break;
            case "rinkeby":
                host = "eth-rinkeby.alchemyapi.io/v2/";
                break;
            case "goerli":
                host = "eth-goerli.alchemyapi.io/v2/";
                break;
            case "kovan":
                host = "eth-kovan.alchemyapi.io/v2/";
                break;
            default:
                logger$x.throwArgumentError(
                    "unsupported network",
                    "network",
                    arguments[0]
                );
        }
        return {
            allowGzip: true,
            url: "https:/" + "/" + host + apiKey,
            throttleCallback: (attempt, url) => {
                if (apiKey === defaultApiKey) {
                    showThrottleMessage();
                }
                return Promise.resolve(true);
            },
        };
    }
    isCommunityResource() {
        return this.apiKey === defaultApiKey;
    }
}
("use strict");
var __awaiter$c =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$y = new Logger(version$m);
class CloudflareProvider extends UrlJsonRpcProvider {
    static getApiKey(apiKey) {
        if (apiKey != null) {
            logger$y.throwArgumentError(
                "apiKey not supported for cloudflare",
                "apiKey",
                apiKey
            );
        }
        return null;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch (network.name) {
            case "homestead":
                host = "https://cloudflare-eth.com/";
                break;
            default:
                logger$y.throwArgumentError(
                    "unsupported network",
                    "network",
                    arguments[0]
                );
        }
        return host;
    }
    perform(method, params) {
        const _super = Object.create(null, {
            perform: { get: () => super.perform },
        });
        return __awaiter$c(this, void 0, void 0, function* () {
            if (method === "getBlockNumber") {
                const block = yield _super.perform.call(this, "getBlock", {
                    blockTag: "latest",
                });
                return block.number;
            }
            return _super.perform.call(this, method, params);
        });
    }
}
("use strict");
var __awaiter$d =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$z = new Logger(version$m);
function getTransactionPostData(transaction) {
    const result = {};
    for (let key in transaction) {
        if (transaction[key] == null) {
            continue;
        }
        let value = transaction[key];
        if (
            { type: true, gasLimit: true, gasPrice: true, nonce: true, value: true }[
            key
            ]
        ) {
            value = hexValue(hexlify(value));
        } else if (key === "accessList") {
            const sets = accessListify(value);
            value =
                "[" +
                sets
                    .map((set) => {
                        return `{address:"${set.address
                            }",storageKeys:["${set.storageKeys.join('","')}"]}`;
                    })
                    .join(",") +
                "]";
        } else {
            value = hexlify(value);
        }
        result[key] = value;
    }
    return result;
}
function getResult$1(result) {
    if (
        result.status == 0 &&
        (result.message === "No records found" ||
            result.message === "No transactions found")
    ) {
        return result.result;
    }
    if (result.status != 1 || result.message != "OK") {
        const error = new Error("invalid response");
        error.result = JSON.stringify(result);
        if ((result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
            error.throttleRetry = true;
        }
        throw error;
    }
    return result.result;
}
function getJsonResult(result) {
    if (
        result &&
        result.status == 0 &&
        result.message == "NOTOK" &&
        (result.result || "").toLowerCase().indexOf("rate limit") >= 0
    ) {
        const error = new Error("throttled response");
        error.result = JSON.stringify(result);
        error.throttleRetry = true;
        throw error;
    }
    if (result.jsonrpc != "2.0") {
        const error = new Error("invalid response");
        error.result = JSON.stringify(result);
        throw error;
    }
    if (result.error) {
        const error = new Error(result.error.message || "unknown error");
        if (result.error.code) {
            error.code = result.error.code;
        }
        if (result.error.data) {
            error.data = result.error.data;
        }
        throw error;
    }
    return result.result;
}
function checkLogTag(blockTag) {
    if (blockTag === "pending") {
        throw new Error("pending not supported");
    }
    if (blockTag === "latest") {
        return blockTag;
    }
    return parseInt(blockTag.substring(2), 16);
}
const defaultApiKey$1 = "9D13ZE7XSBTJ94N9BNJ2MA33VMAY2YPIRB";
function checkError$1(method, error, transaction) {
    if (method === "call" && error.code === Logger.errors.SERVER_ERROR) {
        const e = error.error;
        if (e && e.message.match("reverted") && isHexString(e.data)) {
            return e.data;
        }
    }
    let message = error.message;
    if (error.code === Logger.errors.SERVER_ERROR) {
        if (error.error && typeof error.error.message === "string") {
            message = error.error.message;
        } else if (typeof error.body === "string") {
            message = error.body;
        } else if (typeof error.responseText === "string") {
            message = error.responseText;
        }
    }
    message = (message || "").toLowerCase();
    if (message.match(/insufficient funds/)) {
        logger$z.throwError(
            "insufficient funds for intrinsic transaction cost",
            Logger.errors.INSUFFICIENT_FUNDS,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (
        message.match(/same hash was already imported|transaction nonce is too low/)
    ) {
        logger$z.throwError(
            "nonce has already been used",
            Logger.errors.NONCE_EXPIRED,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (message.match(/another transaction with same nonce/)) {
        logger$z.throwError(
            "replacement fee too low",
            Logger.errors.REPLACEMENT_UNDERPRICED,
            { error: error, method: method, transaction: transaction }
        );
    }
    if (message.match(/execution failed due to an exception/)) {
        logger$z.throwError(
            "cannot estimate gas; transaction may fail or may require manual gas limit",
            Logger.errors.UNPREDICTABLE_GAS_LIMIT,
            { error: error, method: method, transaction: transaction }
        );
    }
    throw error;
}
class EtherscanProvider extends BaseProvider {
    constructor(network, apiKey) {
        logger$z.checkNew(new.target, EtherscanProvider);
        super(network);
        let name = "invalid";
        if (this.network) {
            name = this.network.name;
        }
        let baseUrl = null;
        switch (name) {
            case "homestead":
                baseUrl = "https://api.etherscan.io";
                break;
            case "ropsten":
                baseUrl = "https://api-ropsten.etherscan.io";
                break;
            case "rinkeby":
                baseUrl = "https://api-rinkeby.etherscan.io";
                break;
            case "kovan":
                baseUrl = "https://api-kovan.etherscan.io";
                break;
            case "goerli":
                baseUrl = "https://api-goerli.etherscan.io";
                break;
            default:
                throw new Error("unsupported network");
        }
        defineReadOnly(this, "baseUrl", baseUrl);
        defineReadOnly(this, "apiKey", apiKey || defaultApiKey$1);
    }
    detectNetwork() {
        return __awaiter$d(this, void 0, void 0, function* () {
            return this.network;
        });
    }
    perform(method, params) {
        const _super = Object.create(null, {
            perform: { get: () => super.perform },
        });
        return __awaiter$d(this, void 0, void 0, function* () {
            let url = this.baseUrl + "/api";
            let apiKey = "";
            if (this.apiKey) {
                apiKey += "&apikey=" + this.apiKey;
            }
            const get = (url, payload, procFunc) =>
                __awaiter$d(this, void 0, void 0, function* () {
                    this.emit("debug", {
                        action: "request",
                        request: url,
                        provider: this,
                    });
                    const connection = {
                        url: url,
                        throttleSlotInterval: 1e3,
                        throttleCallback: (attempt, url) => {
                            if (this.isCommunityResource()) {
                                showThrottleMessage();
                            }
                            return Promise.resolve(true);
                        },
                    };
                    let payloadStr = null;
                    if (payload) {
                        connection.headers = {
                            "content-type":
                                "application/x-www-form-urlencoded; charset=UTF-8",
                        };
                        payloadStr = Object.keys(payload)
                            .map((key) => {
                                return `${key}=${payload[key]}`;
                            })
                            .join("&");
                    }
                    const result = yield fetchJson(
                        connection,
                        payloadStr,
                        procFunc || getJsonResult
                    );
                    this.emit("debug", {
                        action: "response",
                        request: url,
                        response: deepCopy(result),
                        provider: this,
                    });
                    return result;
                });
            switch (method) {
                case "getBlockNumber":
                    url += "?module=proxy&action=eth_blockNumber" + apiKey;
                    return get(url, null);
                case "getGasPrice":
                    url += "?module=proxy&action=eth_gasPrice" + apiKey;
                    return get(url, null);
                case "getBalance":
                    url += "?module=account&action=balance&address=" + params.address;
                    url += "&tag=" + params.blockTag + apiKey;
                    return get(url, null, getResult$1);
                case "getTransactionCount":
                    url +=
                        "?module=proxy&action=eth_getTransactionCount&address=" +
                        params.address;
                    url += "&tag=" + params.blockTag + apiKey;
                    return get(url, null);
                case "getCode":
                    url += "?module=proxy&action=eth_getCode&address=" + params.address;
                    url += "&tag=" + params.blockTag + apiKey;
                    return get(url, null);
                case "getStorageAt":
                    url +=
                        "?module=proxy&action=eth_getStorageAt&address=" + params.address;
                    url += "&position=" + params.position;
                    url += "&tag=" + params.blockTag + apiKey;
                    return get(url, null);
                case "sendTransaction":
                    return get(url, {
                        module: "proxy",
                        action: "eth_sendRawTransaction",
                        hex: params.signedTransaction,
                        apikey: this.apiKey,
                    }).catch((error) => {
                        return checkError$1(
                            "sendTransaction",
                            error,
                            params.signedTransaction
                        );
                    });
                case "getBlock":
                    if (params.blockTag) {
                        url +=
                            "?module=proxy&action=eth_getBlockByNumber&tag=" +
                            params.blockTag;
                        if (params.includeTransactions) {
                            url += "&boolean=true";
                        } else {
                            url += "&boolean=false";
                        }
                        url += apiKey;
                        return get(url, null);
                    }
                    throw new Error("getBlock by blockHash not implemented");
                case "getTransaction":
                    url +=
                        "?module=proxy&action=eth_getTransactionByHash&txhash=" +
                        params.transactionHash;
                    url += apiKey;
                    return get(url, null);
                case "getTransactionReceipt":
                    url +=
                        "?module=proxy&action=eth_getTransactionReceipt&txhash=" +
                        params.transactionHash;
                    url += apiKey;
                    return get(url, null);
                case "call": {
                    if (params.blockTag !== "latest") {
                        throw new Error(
                            "EtherscanProvider does not support blockTag for call"
                        );
                    }
                    const postData = getTransactionPostData(params.transaction);
                    postData.module = "proxy";
                    postData.action = "eth_call";
                    postData.apikey = this.apiKey;
                    try {
                        return yield get(url, postData);
                    } catch (error) {
                        return checkError$1("call", error, params.transaction);
                    }
                }
                case "estimateGas": {
                    const postData = getTransactionPostData(params.transaction);
                    postData.module = "proxy";
                    postData.action = "eth_estimateGas";
                    postData.apikey = this.apiKey;
                    try {
                        return yield get(url, postData);
                    } catch (error) {
                        return checkError$1("estimateGas", error, params.transaction);
                    }
                }
                case "getLogs": {
                    url += "?module=logs&action=getLogs";
                    if (params.filter.fromBlock) {
                        url += "&fromBlock=" + checkLogTag(params.filter.fromBlock);
                    }
                    if (params.filter.toBlock) {
                        url += "&toBlock=" + checkLogTag(params.filter.toBlock);
                    }
                    if (params.filter.address) {
                        url += "&address=" + params.filter.address;
                    }
                    if (params.filter.topics && params.filter.topics.length > 0) {
                        if (params.filter.topics.length > 1) {
                            logger$z.throwError(
                                "unsupported topic count",
                                Logger.errors.UNSUPPORTED_OPERATION,
                                { topics: params.filter.topics }
                            );
                        }
                        if (params.filter.topics.length === 1) {
                            const topic0 = params.filter.topics[0];
                            if (typeof topic0 !== "string" || topic0.length !== 66) {
                                logger$z.throwError(
                                    "unsupported topic format",
                                    Logger.errors.UNSUPPORTED_OPERATION,
                                    { topic0: topic0 }
                                );
                            }
                            url += "&topic0=" + topic0;
                        }
                    }
                    url += apiKey;
                    const logs = yield get(url, null, getResult$1);
                    let blocks = {};
                    for (let i = 0; i < logs.length; i++) {
                        const log = logs[i];
                        if (log.blockHash != null) {
                            continue;
                        }
                        if (blocks[log.blockNumber] == null) {
                            const block = yield this.getBlock(log.blockNumber);
                            if (block) {
                                blocks[log.blockNumber] = block.hash;
                            }
                        }
                        log.blockHash = blocks[log.blockNumber];
                    }
                    return logs;
                }
                case "getEtherPrice":
                    if (this.network.name !== "homestead") {
                        return 0;
                    }
                    url += "?module=stats&action=ethprice";
                    url += apiKey;
                    return parseFloat((yield get(url, null, getResult$1)).ethusd);
                default:
                    break;
            }
            return _super.perform.call(this, method, params);
        });
    }
    getHistory(addressOrName, startBlock, endBlock) {
        let url = this.baseUrl;
        let apiKey = "";
        if (this.apiKey) {
            apiKey += "&apikey=" + this.apiKey;
        }
        if (startBlock == null) {
            startBlock = 0;
        }
        if (endBlock == null) {
            endBlock = 99999999;
        }
        return this.resolveName(addressOrName).then((address) => {
            url += "/api?module=account&action=txlist&address=" + address;
            url += "&startblock=" + startBlock;
            url += "&endblock=" + endBlock;
            url += "&sort=asc" + apiKey;
            this.emit("debug", { action: "request", request: url, provider: this });
            const connection = {
                url: url,
                throttleSlotInterval: 1e3,
                throttleCallback: (attempt, url) => {
                    if (this.apiKey === defaultApiKey$1) {
                        showThrottleMessage();
                    }
                    return Promise.resolve(true);
                },
            };
            return fetchJson(connection, null, getResult$1).then((result) => {
                this.emit("debug", {
                    action: "response",
                    request: url,
                    response: deepCopy(result),
                    provider: this,
                });
                let output = [];
                result.forEach((tx) => {
                    ["contractAddress", "to"].forEach(function (key) {
                        if (tx[key] == "") {
                            delete tx[key];
                        }
                    });
                    if (tx.creates == null && tx.contractAddress != null) {
                        tx.creates = tx.contractAddress;
                    }
                    let item = this.formatter.transactionResponse(tx);
                    if (tx.timeStamp) {
                        item.timestamp = parseInt(tx.timeStamp);
                    }
                    output.push(item);
                });
                return output;
            });
        });
    }
    isCommunityResource() {
        return this.apiKey === defaultApiKey$1;
    }
}
("use strict");
var __awaiter$e =
    (window && window.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const logger$A = new Logger(version$m);
function now() {
    return new Date().getTime();
}
function checkNetworks(networks) {
    let result = null;
    for (let i = 0; i < networks.length; i++) {
        const network = networks[i];
        if (network == null) {
            return null;
        }
        if (result) {
            if (
                !(
                    result.name === network.name &&
                    result.chainId === network.chainId &&
                    (result.ensAddress === network.ensAddress ||
                        (result.ensAddress == null && network.ensAddress == null))
                )
            ) {
                logger$A.throwArgumentError("provider mismatch", "networks", networks);
            }
        } else {
            result = network;
        }
    }
    return result;
}
function median(values, maxDelta) {
    values = values.slice().sort();
    const middle = Math.floor(values.length / 2);
    if (values.length % 2) {
        return values[middle];
    }
    const a = values[middle - 1],
        b = values[middle];
    if (maxDelta != null && Math.abs(a - b) > maxDelta) {
        return null;
    }
    return (a + b) / 2;
}
function serialize$1(value) {
    if (value === null) {
        return "null";
    } else if (typeof value === "number" || typeof value === "boolean") {
        return JSON.stringify(value);
    } else if (typeof value === "string") {
        return value;
    } else if (BigNumber.isBigNumber(value)) {
        return value.toString();
    } else if (Array.isArray(value)) {
        return JSON.stringify(value.map((i) => serialize$1(i)));
    } else if (typeof value === "object") {
        const keys = Object.keys(value);
        keys.sort();
        return (
            "{" +
            keys
                .map((key) => {
                    let v = value[key];
                    if (typeof v === "function") {
                        v = "[function]";
                    } else {
                        v = serialize$1(v);
                    }
                    return JSON.stringify(key) + ":" + v;
                })
                .join(",") +
            "}"
        );
    }
    throw new Error("unknown value type: " + typeof value);
}
let nextRid = 1;
function stall$1(duration) {
    let cancel = null;
    let timer = null;
    let promise = new Promise((resolve) => {
        cancel = function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            resolve();
        };
        timer = setTimeout(cancel, duration);
    });
    const wait = (func) => {
        promise = promise.then(func);
        return promise;
    };
    function getPromise() {
        return promise;
    }
    return { cancel: cancel, getPromise: getPromise, wait: wait };
}
const ForwardErrors = [
    Logger.errors.CALL_EXCEPTION,
    Logger.errors.INSUFFICIENT_FUNDS,
    Logger.errors.NONCE_EXPIRED,
    Logger.errors.REPLACEMENT_UNDERPRICED,
    Logger.errors.UNPREDICTABLE_GAS_LIMIT,
];
const ForwardProperties = [
    "address",
    "args",
    "errorArgs",
    "errorSignature",
    "method",
    "transaction",
];
function exposeDebugConfig(config, now) {
    const result = { weight: config.weight };
    Object.defineProperty(result, "provider", { get: () => config.provider });
    if (config.start) {
        result.start = config.start;
    }
    if (now) {
        result.duration = now - config.start;
    }
    if (config.done) {
        if (config.error) {
            result.error = config.error;
        } else {
            result.result = config.result || null;
        }
    }
    return result;
}
function normalizedTally(normalize, quorum) {
    return function (configs) {
        const tally = {};
        configs.forEach((c) => {
            const value = normalize(c.result);
            if (!tally[value]) {
                tally[value] = { count: 0, result: c.result };
            }
            tally[value].count++;
        });
        const keys = Object.keys(tally);
        for (let i = 0; i < keys.length; i++) {
            const check = tally[keys[i]];
            if (check.count >= quorum) {
                return check.result;
            }
        }
        return undefined;
    };
}
function getProcessFunc(provider, method, params) {
    let normalize = serialize$1;
    switch (method) {
        case "getBlockNumber":
            return function (configs) {
                const values = configs.map((c) => c.result);
                let blockNumber = median(
                    configs.map((c) => c.result),
                    2
                );
                if (blockNumber == null) {
                    return undefined;
                }
                blockNumber = Math.ceil(blockNumber);
                if (values.indexOf(blockNumber + 1) >= 0) {
                    blockNumber++;
                }
                if (blockNumber >= provider._highestBlockNumber) {
                    provider._highestBlockNumber = blockNumber;
                }
                return provider._highestBlockNumber;
            };
        case "getGasPrice":
            return function (configs) {
                const values = configs.map((c) => c.result);
                values.sort();
                return values[Math.floor(values.length / 2)];
            };
        case "getEtherPrice":
            return function (configs) {
                return median(configs.map((c) => c.result));
            };
        case "getBalance":
        case "getTransactionCount":
        case "getCode":
        case "getStorageAt":
        case "call":
        case "estimateGas":
        case "getLogs":
            break;
        case "getTransaction":
        case "getTransactionReceipt":
            normalize = function (tx) {
                if (tx == null) {
                    return null;
                }
                tx = shallowCopy(tx);
                tx.confirmations = -1;
                return serialize$1(tx);
            };
            break;
        case "getBlock":
            if (params.includeTransactions) {
                normalize = function (block) {
                    if (block == null) {
                        return null;
                    }
                    block = shallowCopy(block);
                    block.transactions = block.transactions.map((tx) => {
                        tx = shallowCopy(tx);
                        tx.confirmations = -1;
                        return tx;
                    });
                    return serialize$1(block);
                };
            } else {
                normalize = function (block) {
                    if (block == null) {
                        return null;
                    }
                    return serialize$1(block);
                };
            }
            break;
        default:
            throw new Error("unknown method: " + method);
    }
    return normalizedTally(normalize, provider.quorum);
}
function waitForSync(config, blockNumber) {
    return __awaiter$e(this, void 0, void 0, function* () {
        const provider = config.provider;
        if (
            (provider.blockNumber != null && provider.blockNumber >= blockNumber) ||
            blockNumber === -1
        ) {
            return provider;
        }
        return poll(
            () => {
                return new Promise((resolve, reject) => {
                    setTimeout(function () {
                        if (provider.blockNumber >= blockNumber) {
                            return resolve(provider);
                        }
                        if (config.cancelled) {
                            return resolve(null);
                        }
                        return resolve(undefined);
                    }, 0);
                });
            },
            { oncePoll: provider }
        );
    });
}
function getRunner(config, currentBlockNumber, method, params) {
    return __awaiter$e(this, void 0, void 0, function* () {
        let provider = config.provider;
        switch (method) {
            case "getBlockNumber":
            case "getGasPrice":
                return provider[method]();
            case "getEtherPrice":
                if (provider.getEtherPrice) {
                    return provider.getEtherPrice();
                }
                break;
            case "getBalance":
            case "getTransactionCount":
            case "getCode":
                if (params.blockTag && isHexString(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider[method](params.address, params.blockTag || "latest");
            case "getStorageAt":
                if (params.blockTag && isHexString(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider.getStorageAt(
                    params.address,
                    params.position,
                    params.blockTag || "latest"
                );
            case "getBlock":
                if (params.blockTag && isHexString(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider[
                    params.includeTransactions ? "getBlockWithTransactions" : "getBlock"
                ](params.blockTag || params.blockHash);
            case "call":
            case "estimateGas":
                if (params.blockTag && isHexString(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider[method](params.transaction);
            case "getTransaction":
            case "getTransactionReceipt":
                return provider[method](params.transactionHash);
            case "getLogs": {
                let filter = params.filter;
                if (
                    (filter.fromBlock && isHexString(filter.fromBlock)) ||
                    (filter.toBlock && isHexString(filter.toBlock))
                ) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider.getLogs(filter);
            }
        }
        return logger$A.throwError(
            "unknown method error",
            Logger.errors.UNKNOWN_ERROR,
            { method: method, params: params }
        );
    });
}
class FallbackProvider extends BaseProvider {
    constructor(providers, quorum) {
        logger$A.checkNew(new.target, FallbackProvider);
        if (providers.length === 0) {
            logger$A.throwArgumentError("missing providers", "providers", providers);
        }
        const providerConfigs = providers.map((configOrProvider, index) => {
            if (Provider.isProvider(configOrProvider)) {
                const stallTimeout = isCommunityResource(configOrProvider) ? 2e3 : 750;
                const priority = 1;
                return Object.freeze({
                    provider: configOrProvider,
                    weight: 1,
                    stallTimeout: stallTimeout,
                    priority: priority,
                });
            }
            const config = shallowCopy(configOrProvider);
            if (config.priority == null) {
                config.priority = 1;
            }
            if (config.stallTimeout == null) {
                config.stallTimeout = isCommunityResource(configOrProvider) ? 2e3 : 750;
            }
            if (config.weight == null) {
                config.weight = 1;
            }
            const weight = config.weight;
            if (weight % 1 || weight > 512 || weight < 1) {
                logger$A.throwArgumentError(
                    "invalid weight; must be integer in [1, 512]",
                    `providers[${index}].weight`,
                    weight
                );
            }
            return Object.freeze(config);
        });
        const total = providerConfigs.reduce((accum, c) => accum + c.weight, 0);
        if (quorum == null) {
            quorum = total / 2;
        } else if (quorum > total) {
            logger$A.throwArgumentError(
                "quorum will always fail; larger than total weight",
                "quorum",
                quorum
            );
        }
        let networkOrReady = checkNetworks(
            providerConfigs.map((c) => c.provider.network)
        );
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.detectNetwork().then(resolve, reject);
                }, 0);
            });
        }
        super(networkOrReady);
        defineReadOnly(this, "providerConfigs", Object.freeze(providerConfigs));
        defineReadOnly(this, "quorum", quorum);
        this._highestBlockNumber = -1;
    }
    detectNetwork() {
        return __awaiter$e(this, void 0, void 0, function* () {
            const networks = yield Promise.all(
                this.providerConfigs.map((c) => c.provider.getNetwork())
            );
            return checkNetworks(networks);
        });
    }
    perform(method, params) {
        return __awaiter$e(this, void 0, void 0, function* () {
            if (method === "sendTransaction") {
                const results = yield Promise.all(
                    this.providerConfigs.map((c) => {
                        return c.provider.sendTransaction(params.signedTransaction).then(
                            (result) => {
                                return result.hash;
                            },
                            (error) => {
                                return error;
                            }
                        );
                    })
                );
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    if (typeof result === "string") {
                        return result;
                    }
                }
                throw results[0];
            }
            if (this._highestBlockNumber === -1 && method !== "getBlockNumber") {
                yield this.getBlockNumber();
            }
            const processFunc = getProcessFunc(this, method, params);
            const configs = shuffled(this.providerConfigs.map(shallowCopy));
            configs.sort((a, b) => a.priority - b.priority);
            const currentBlockNumber = this._highestBlockNumber;
            let i = 0;
            let first = true;
            while (true) {
                const t0 = now();
                let inflightWeight = configs
                    .filter((c) => c.runner && t0 - c.start < c.stallTimeout)
                    .reduce((accum, c) => accum + c.weight, 0);
                while (inflightWeight < this.quorum && i < configs.length) {
                    const config = configs[i++];
                    const rid = nextRid++;
                    config.start = now();
                    config.staller = stall$1(config.stallTimeout);
                    config.staller.wait(() => {
                        config.staller = null;
                    });
                    config.runner = getRunner(
                        config,
                        currentBlockNumber,
                        method,
                        params
                    ).then(
                        (result) => {
                            config.done = true;
                            config.result = result;
                            if (this.listenerCount("debug")) {
                                this.emit("debug", {
                                    action: "request",
                                    rid: rid,
                                    backend: exposeDebugConfig(config, now()),
                                    request: { method: method, params: deepCopy(params) },
                                    provider: this,
                                });
                            }
                        },
                        (error) => {
                            config.done = true;
                            config.error = error;
                            if (this.listenerCount("debug")) {
                                this.emit("debug", {
                                    action: "request",
                                    rid: rid,
                                    backend: exposeDebugConfig(config, now()),
                                    request: { method: method, params: deepCopy(params) },
                                    provider: this,
                                });
                            }
                        }
                    );
                    if (this.listenerCount("debug")) {
                        this.emit("debug", {
                            action: "request",
                            rid: rid,
                            backend: exposeDebugConfig(config, null),
                            request: { method: method, params: deepCopy(params) },
                            provider: this,
                        });
                    }
                    inflightWeight += config.weight;
                }
                const waiting = [];
                configs.forEach((c) => {
                    if (c.done || !c.runner) {
                        return;
                    }
                    waiting.push(c.runner);
                    if (c.staller) {
                        waiting.push(c.staller.getPromise());
                    }
                });
                if (waiting.length) {
                    yield Promise.race(waiting);
                }
                const results = configs.filter((c) => c.done && c.error == null);
                if (results.length >= this.quorum) {
                    const result = processFunc(results);
                    if (result !== undefined) {
                        configs.forEach((c) => {
                            if (c.staller) {
                                c.staller.cancel();
                            }
                            c.cancelled = true;
                        });
                        return result;
                    }
                    if (!first) {
                        yield stall$1(100).getPromise();
                    }
                    first = false;
                }
                const errors = configs.reduce((accum, c) => {
                    if (!c.done || c.error == null) {
                        return accum;
                    }
                    const code = c.error.code;
                    if (ForwardErrors.indexOf(code) >= 0) {
                        if (!accum[code]) {
                            accum[code] = { error: c.error, weight: 0 };
                        }
                        accum[code].weight += c.weight;
                    }
                    return accum;
                }, {});
                Object.keys(errors).forEach((errorCode) => {
                    const tally = errors[errorCode];
                    if (tally.weight < this.quorum) {
                        return;
                    }
                    configs.forEach((c) => {
                        if (c.staller) {
                            c.staller.cancel();
                        }
                        c.cancelled = true;
                    });
                    const e = tally.error;
                    const props = {};
                    ForwardProperties.forEach((name) => {
                        if (e[name] == null) {
                            return;
                        }
                        props[name] = e[name];
                    });
                    logger$A.throwError(e.reason || e.message, errorCode, props);
                });
                if (configs.filter((c) => !c.done).length === 0) {
                    break;
                }
            }
            configs.forEach((c) => {
                if (c.staller) {
                    c.staller.cancel();
                }
                c.cancelled = true;
            });
            return logger$A.throwError(
                "failed to meet quorum",
                Logger.errors.SERVER_ERROR,
                {
                    method: method,
                    params: params,
                    results: configs.map((c) => exposeDebugConfig(c)),
                    provider: this,
                }
            );
        });
    }
}
("use strict");
const IpcProvider = null;
("use strict");
const logger$B = new Logger(version$m);
const defaultProjectId = "84842078b09946638c03157f83405213";
class InfuraWebSocketProvider extends WebSocketProvider {
    constructor(network, apiKey) {
        const provider = new InfuraProvider(network, apiKey);
        const connection = provider.connection;
        if (connection.password) {
            logger$B.throwError(
                "INFURA WebSocket project secrets unsupported",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation: "InfuraProvider.getWebSocketProvider()" }
            );
        }
        const url = connection.url
            .replace(/^http/i, "ws")
            .replace("/v3/", "/ws/v3/");
        super(url, network);
        defineReadOnly(this, "apiKey", provider.projectId);
        defineReadOnly(this, "projectId", provider.projectId);
        defineReadOnly(this, "projectSecret", provider.projectSecret);
    }
    isCommunityResource() {
        return this.projectId === defaultProjectId;
    }
}
class InfuraProvider extends UrlJsonRpcProvider {
    static getWebSocketProvider(network, apiKey) {
        return new InfuraWebSocketProvider(network, apiKey);
    }
    static getApiKey(apiKey) {
        const apiKeyObj = {
            apiKey: defaultProjectId,
            projectId: defaultProjectId,
            projectSecret: null,
        };
        if (apiKey == null) {
            return apiKeyObj;
        }
        if (typeof apiKey === "string") {
            apiKeyObj.projectId = apiKey;
        } else if (apiKey.projectSecret != null) {
            logger$B.assertArgument(
                typeof apiKey.projectId === "string",
                "projectSecret requires a projectId",
                "projectId",
                apiKey.projectId
            );
            logger$B.assertArgument(
                typeof apiKey.projectSecret === "string",
                "invalid projectSecret",
                "projectSecret",
                "[REDACTED]"
            );
            apiKeyObj.projectId = apiKey.projectId;
            apiKeyObj.projectSecret = apiKey.projectSecret;
        } else if (apiKey.projectId) {
            apiKeyObj.projectId = apiKey.projectId;
        }
        apiKeyObj.apiKey = apiKeyObj.projectId;
        return apiKeyObj;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch (network ? network.name : "unknown") {
            case "homestead":
                host = "mainnet.infura.io";
                break;
            case "ropsten":
                host = "ropsten.infura.io";
                break;
            case "rinkeby":
                host = "rinkeby.infura.io";
                break;
            case "kovan":
                host = "kovan.infura.io";
                break;
            case "goerli":
                host = "goerli.infura.io";
                break;
            default:
                logger$B.throwError(
                    "unsupported network",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "network", value: network }
                );
        }
        const connection = {
            allowGzip: true,
            url: "https:/" + "/" + host + "/v3/" + apiKey.projectId,
            throttleCallback: (attempt, url) => {
                if (apiKey.projectId === defaultProjectId) {
                    showThrottleMessage();
                }
                return Promise.resolve(true);
            },
        };
        if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
        }
        return connection;
    }
    isCommunityResource() {
        return this.projectId === defaultProjectId;
    }
}
class JsonRpcBatchProvider extends JsonRpcProvider {
    send(method, params) {
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: "2.0",
        };
        if (this._pendingBatch == null) {
            this._pendingBatch = [];
        }
        const inflightRequest = { request: request, resolve: null, reject: null };
        const promise = new Promise((resolve, reject) => {
            inflightRequest.resolve = resolve;
            inflightRequest.reject = reject;
        });
        this._pendingBatch.push(inflightRequest);
        if (!this._pendingBatchAggregator) {
            this._pendingBatchAggregator = setTimeout(() => {
                const batch = this._pendingBatch;
                this._pendingBatch = null;
                this._pendingBatchAggregator = null;
                const request = batch.map((inflight) => inflight.request);
                this.emit("debug", {
                    action: "requestBatch",
                    request: deepCopy(request),
                    provider: this,
                });
                return fetchJson(this.connection, JSON.stringify(request)).then(
                    (result) => {
                        this.emit("debug", {
                            action: "response",
                            request: request,
                            response: result,
                            provider: this,
                        });
                        batch.forEach((inflightRequest, index) => {
                            const payload = result[index];
                            if (payload.error) {
                                const error = new Error(payload.error.message);
                                error.code = payload.error.code;
                                error.data = payload.error.data;
                                inflightRequest.reject(error);
                            } else {
                                inflightRequest.resolve(payload.result);
                            }
                        });
                    },
                    (error) => {
                        this.emit("debug", {
                            action: "response",
                            error: error,
                            request: request,
                            provider: this,
                        });
                        batch.forEach((inflightRequest) => {
                            inflightRequest.reject(error);
                        });
                    }
                );
            }, 10);
        }
        return promise;
    }
}
("use strict");
const logger$C = new Logger(version$m);
const defaultApiKey$2 = "ETHERS_JS_SHARED";
class NodesmithProvider extends UrlJsonRpcProvider {
    static getApiKey(apiKey) {
        if (apiKey && typeof apiKey !== "string") {
            logger$C.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey || defaultApiKey$2;
    }
    static getUrl(network, apiKey) {
        logger$C.warn(
            "NodeSmith will be discontinued on 2019-12-20; please migrate to another platform."
        );
        let host = null;
        switch (network.name) {
            case "homestead":
                host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
                break;
            case "ropsten":
                host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
                break;
            case "rinkeby":
                host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
                break;
            case "goerli":
                host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
                break;
            case "kovan":
                host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
                break;
            default:
                logger$C.throwArgumentError(
                    "unsupported network",
                    "network",
                    arguments[0]
                );
        }
        return host + "?apiKey=" + apiKey;
    }
}
("use strict");
const logger$D = new Logger(version$m);
const defaultApplicationIds = {
    homestead: "6004bcd10040261633ade990",
    ropsten: "6004bd4d0040261633ade991",
    rinkeby: "6004bda20040261633ade994",
    goerli: "6004bd860040261633ade992",
};
class PocketProvider extends UrlJsonRpcProvider {
    constructor(network, apiKey) {
        if (apiKey == null) {
            const n = getStatic(new.target, "getNetwork")(network);
            if (n) {
                const applicationId = defaultApplicationIds[n.name];
                if (applicationId) {
                    apiKey = { applicationId: applicationId, loadBalancer: true };
                }
            }
            if (apiKey == null) {
                logger$D.throwError(
                    "unsupported network",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "network", value: network }
                );
            }
        }
        super(network, apiKey);
    }
    static getApiKey(apiKey) {
        if (apiKey == null) {
            logger$D.throwArgumentError(
                "PocketProvider.getApiKey does not support null apiKey",
                "apiKey",
                apiKey
            );
        }
        const apiKeyObj = {
            applicationId: null,
            loadBalancer: false,
            applicationSecretKey: null,
        };
        if (typeof apiKey === "string") {
            apiKeyObj.applicationId = apiKey;
        } else if (apiKey.applicationSecretKey != null) {
            logger$D.assertArgument(
                typeof apiKey.applicationId === "string",
                "applicationSecretKey requires an applicationId",
                "applicationId",
                apiKey.applicationId
            );
            logger$D.assertArgument(
                typeof apiKey.applicationSecretKey === "string",
                "invalid applicationSecretKey",
                "applicationSecretKey",
                "[REDACTED]"
            );
            apiKeyObj.applicationId = apiKey.applicationId;
            apiKeyObj.applicationSecretKey = apiKey.applicationSecretKey;
            apiKeyObj.loadBalancer = !!apiKey.loadBalancer;
        } else if (apiKey.applicationId) {
            logger$D.assertArgument(
                typeof apiKey.applicationId === "string",
                "apiKey.applicationId must be a string",
                "apiKey.applicationId",
                apiKey.applicationId
            );
            apiKeyObj.applicationId = apiKey.applicationId;
            apiKeyObj.loadBalancer = !!apiKey.loadBalancer;
        } else {
            logger$D.throwArgumentError(
                "unsupported PocketProvider apiKey",
                "apiKey",
                apiKey
            );
        }
        return apiKeyObj;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch (network ? network.name : "unknown") {
            case "homestead":
                host = "eth-mainnet.gateway.pokt.network";
                break;
            case "ropsten":
                host = "eth-ropsten.gateway.pokt.network";
                break;
            case "rinkeby":
                host = "eth-rinkeby.gateway.pokt.network";
                break;
            case "goerli":
                host = "eth-goerli.gateway.pokt.network";
                break;
            default:
                logger$D.throwError(
                    "unsupported network",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "network", value: network }
                );
        }
        let url = null;
        if (apiKey.loadBalancer) {
            url = `https://${host}/v1/lb/${apiKey.applicationId}`;
        } else {
            url = `https://${host}/v1/${apiKey.applicationId}`;
        }
        const connection = { url: url };
        connection.headers = {};
        if (apiKey.applicationSecretKey != null) {
            connection.user = "";
            connection.password = apiKey.applicationSecretKey;
        }
        return connection;
    }
    isCommunityResource() {
        return this.applicationId === defaultApplicationIds[this.network.name];
    }
}
("use strict");
const logger$E = new Logger(version$m);
let _nextId = 1;
function buildWeb3LegacyFetcher(provider, sendFunc) {
    return function (method, params) {
        if (method == "eth_sign" && (provider.isMetaMask || provider.isStatus)) {
            method = "personal_sign";
            params = [params[1], params[0]];
        }
        const request = {
            method: method,
            params: params,
            id: _nextId++,
            jsonrpc: "2.0",
        };
        return new Promise((resolve, reject) => {
            sendFunc(request, function (error, result) {
                if (error) {
                    return reject(error);
                }
                if (result.error) {
                    const error = new Error(result.error.message);
                    error.code = result.error.code;
                    error.data = result.error.data;
                    return reject(error);
                }
                resolve(result.result);
            });
        });
    };
}
function buildEip1193Fetcher(provider) {
    return function (method, params) {
        if (params == null) {
            params = [];
        }
        if (method == "eth_sign" && (provider.isMetaMask || provider.isStatus)) {
            method = "personal_sign";
            params = [params[1], params[0]];
        }
        return provider.request({ method: method, params: params });
    };
}
class Web3Provider extends JsonRpcProvider {
    constructor(provider, network) {
        logger$E.checkNew(new.target, Web3Provider);
        if (provider == null) {
            logger$E.throwArgumentError("missing provider", "provider", provider);
        }
        let path = null;
        let jsonRpcFetchFunc = null;
        let subprovider = null;
        if (typeof provider === "function") {
            path = "unknown:";
            jsonRpcFetchFunc = provider;
        } else {
            path = provider.host || provider.path || "";
            if (!path && provider.isMetaMask) {
                path = "metamask";
            }
            subprovider = provider;
            if (provider.request) {
                if (path === "") {
                    path = "eip-1193:";
                }
                jsonRpcFetchFunc = buildEip1193Fetcher(provider);
            } else if (provider.sendAsync) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(
                    provider,
                    provider.sendAsync.bind(provider)
                );
            } else if (provider.send) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(
                    provider,
                    provider.send.bind(provider)
                );
            } else {
                logger$E.throwArgumentError(
                    "unsupported provider",
                    "provider",
                    provider
                );
            }
            if (!path) {
                path = "unknown:";
            }
        }
        super(path, network);
        defineReadOnly(this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
        defineReadOnly(this, "provider", subprovider);
    }
    send(method, params) {
        return this.jsonRpcFetchFunc(method, params);
    }
}
("use strict");
const logger$F = new Logger(version$m);
function getDefaultProvider(network, options) {
    if (network == null) {
        network = "homestead";
    }
    if (typeof network === "string") {
        const match = network.match(/^(ws|http)s?:/i);
        if (match) {
            switch (match[1]) {
                case "http":
                    return new JsonRpcProvider(network);
                case "ws":
                    return new WebSocketProvider(network);
                default:
                    logger$F.throwArgumentError(
                        "unsupported URL scheme",
                        "network",
                        network
                    );
            }
        }
    }
    const n = getNetwork(network);
    if (!n || !n._defaultProvider) {
        logger$F.throwError(
            "unsupported getDefaultProvider network",
            Logger.errors.NETWORK_ERROR,
            { operation: "getDefaultProvider", network: network }
        );
    }
    return n._defaultProvider(
        {
            FallbackProvider: FallbackProvider,
            AlchemyProvider: AlchemyProvider,
            CloudflareProvider: CloudflareProvider,
            EtherscanProvider: EtherscanProvider,
            InfuraProvider: InfuraProvider,
            JsonRpcProvider: JsonRpcProvider,
            NodesmithProvider: NodesmithProvider,
            PocketProvider: PocketProvider,
            Web3Provider: Web3Provider,
            IpcProvider: IpcProvider,
        },
        options
    );
}
var index$3 = Object.freeze({
    __proto__: null,
    Provider: Provider,
    BaseProvider: BaseProvider,
    Resolver: Resolver,
    UrlJsonRpcProvider: UrlJsonRpcProvider,
    FallbackProvider: FallbackProvider,
    AlchemyProvider: AlchemyProvider,
    AlchemyWebSocketProvider: AlchemyWebSocketProvider,
    CloudflareProvider: CloudflareProvider,
    EtherscanProvider: EtherscanProvider,
    InfuraProvider: InfuraProvider,
    InfuraWebSocketProvider: InfuraWebSocketProvider,
    JsonRpcProvider: JsonRpcProvider,
    JsonRpcBatchProvider: JsonRpcBatchProvider,
    NodesmithProvider: NodesmithProvider,
    PocketProvider: PocketProvider,
    StaticJsonRpcProvider: StaticJsonRpcProvider,
    Web3Provider: Web3Provider,
    WebSocketProvider: WebSocketProvider,
    IpcProvider: IpcProvider,
    JsonRpcSigner: JsonRpcSigner,
    getDefaultProvider: getDefaultProvider,
    getNetwork: getNetwork,
    isCommunityResource: isCommunityResource,
    isCommunityResourcable: isCommunityResourcable,
    showThrottleMessage: showThrottleMessage,
    Formatter: Formatter,
});
("use strict");
const regexBytes = new RegExp("^bytes([0-9]+)$");
const regexNumber = new RegExp("^(u?int)([0-9]*)$");
const regexArray = new RegExp("^(.*)\\[([0-9]*)\\]$");
const Zeros$1 =
    "0000000000000000000000000000000000000000000000000000000000000000";
function _pack(type, value, isArray) {
    switch (type) {
        case "address":
            if (isArray) {
                return zeroPad(value, 32);
            }
            return arrayify(value);
        case "string":
            return toUtf8Bytes(value);
        case "bytes":
            return arrayify(value);
        case "bool":
            value = value ? "0x01" : "0x00";
            if (isArray) {
                return zeroPad(value, 32);
            }
            return arrayify(value);
    }
    let match = type.match(regexNumber);
    if (match) {
        let size = parseInt(match[2] || "256");
        if (
            (match[2] && String(size) !== match[2]) ||
            size % 8 !== 0 ||
            size === 0 ||
            size > 256
        ) {
            throw new Error("invalid number type - " + type);
        }
        if (isArray) {
            size = 256;
        }
        value = BigNumber.from(value).toTwos(size);
        return zeroPad(value, size / 8);
    }
    match = type.match(regexBytes);
    if (match) {
        const size = parseInt(match[1]);
        if (String(size) !== match[1] || size === 0 || size > 32) {
            throw new Error("invalid bytes type - " + type);
        }
        if (arrayify(value).byteLength !== size) {
            throw new Error("invalid value for " + type);
        }
        if (isArray) {
            return arrayify((value + Zeros$1).substring(0, 66));
        }
        return value;
    }
    match = type.match(regexArray);
    if (match && Array.isArray(value)) {
        const baseType = match[1];
        const count = parseInt(match[2] || String(value.length));
        if (count != value.length) {
            throw new Error("invalid value for " + type);
        }
        const result = [];
        value.forEach(function (value) {
            result.push(_pack(baseType, value, true));
        });
        return concat(result);
    }
    throw new Error("invalid type - " + type);
}
function pack$1(types, values) {
    if (types.length != values.length) {
        throw new Error("type/value count mismatch");
    }
    const tight = [];
    types.forEach(function (type, index) {
        tight.push(_pack(type, values[index]));
    });
    return hexlify(concat(tight));
}
function keccak256$1(types, values) {
    return keccak256(pack$1(types, values));
}
function sha256$2(types, values) {
    return sha256$1(pack$1(types, values));
}
const version$n = "units/5.1.0";
("use strict");
const logger$G = new Logger(version$n);
const names = ["wei", "kwei", "mwei", "gwei", "szabo", "finney", "ether"];
function commify(value) {
    const comps = String(value).split(".");
    if (
        comps.length > 2 ||
        !comps[0].match(/^-?[0-9]*$/) ||
        (comps[1] && !comps[1].match(/^[0-9]*$/)) ||
        value === "." ||
        value === "-."
    ) {
        logger$G.throwArgumentError("invalid value", "value", value);
    }
    let whole = comps[0];
    let negative = "";
    if (whole.substring(0, 1) === "-") {
        negative = "-";
        whole = whole.substring(1);
    }
    while (whole.substring(0, 1) === "0") {
        whole = whole.substring(1);
    }
    if (whole === "") {
        whole = "0";
    }
    let suffix = "";
    if (comps.length === 2) {
        suffix = "." + (comps[1] || "0");
    }
    while (suffix.length > 2 && suffix[suffix.length - 1] === "0") {
        suffix = suffix.substring(0, suffix.length - 1);
    }
    const formatted = [];
    while (whole.length) {
        if (whole.length <= 3) {
            formatted.unshift(whole);
            break;
        } else {
            const index = whole.length - 3;
            formatted.unshift(whole.substring(index));
            whole = whole.substring(0, index);
        }
    }
    return negative + formatted.join(",") + suffix;
}
function formatUnits(value, unitName) {
    if (typeof unitName === "string") {
        const index = names.indexOf(unitName);
        if (index !== -1) {
            unitName = 3 * index;
        }
    }
    return formatFixed(value, unitName != null ? unitName : 18);
}
function parseUnits(value, unitName) {
    if (typeof value !== "string") {
        logger$G.throwArgumentError("value must be a string", "value", value);
    }
    if (typeof unitName === "string") {
        const index = names.indexOf(unitName);
        if (index !== -1) {
            unitName = 3 * index;
        }
    }
    return parseFixed(value, unitName != null ? unitName : 18);
}
function formatEther(wei) {
    return formatUnits(wei, 18);
}
function parseEther(ether) {
    return parseUnits(ether, 18);
}
("use strict");
var utils$1 = Object.freeze({
    __proto__: null,
    AbiCoder: AbiCoder,
    defaultAbiCoder: defaultAbiCoder,
    Fragment: Fragment,
    EventFragment: EventFragment,
    FunctionFragment: FunctionFragment,
    ParamType: ParamType,
    FormatTypes: FormatTypes,
    checkResultErrors: checkResultErrors,
    Logger: Logger,
    RLP: index,
    _fetchData: _fetchData,
    fetchJson: fetchJson,
    poll: poll,
    checkProperties: checkProperties,
    deepCopy: deepCopy,
    defineReadOnly: defineReadOnly,
    getStatic: getStatic,
    resolveProperties: resolveProperties,
    shallowCopy: shallowCopy,
    arrayify: arrayify,
    concat: concat,
    stripZeros: stripZeros,
    zeroPad: zeroPad,
    isBytes: isBytes,
    isBytesLike: isBytesLike,
    defaultPath: defaultPath,
    HDNode: HDNode,
    SigningKey: SigningKey,
    Interface: Interface,
    LogDescription: LogDescription,
    TransactionDescription: TransactionDescription,
    base58: Base58,
    base64: index$2,
    hexlify: hexlify,
    isHexString: isHexString,
    hexConcat: hexConcat,
    hexStripZeros: hexStripZeros,
    hexValue: hexValue,
    hexZeroPad: hexZeroPad,
    hexDataLength: hexDataLength,
    hexDataSlice: hexDataSlice,
    nameprep: nameprep,
    _toEscapedUtf8String: _toEscapedUtf8String,
    toUtf8Bytes: toUtf8Bytes,
    toUtf8CodePoints: toUtf8CodePoints,
    toUtf8String: toUtf8String,
    Utf8ErrorFuncs: Utf8ErrorFuncs,
    formatBytes32String: formatBytes32String,
    parseBytes32String: parseBytes32String,
    hashMessage: hashMessage,
    namehash: namehash,
    isValidName: isValidName,
    id: id,
    _TypedDataEncoder: TypedDataEncoder,
    getAddress: getAddress,
    getIcapAddress: getIcapAddress,
    getContractAddress: getContractAddress,
    getCreate2Address: getCreate2Address,
    isAddress: isAddress,
    formatEther: formatEther,
    parseEther: parseEther,
    formatUnits: formatUnits,
    parseUnits: parseUnits,
    commify: commify,
    computeHmac: computeHmac,
    keccak256: keccak256,
    ripemd160: ripemd160$1,
    sha256: sha256$1,
    sha512: sha512$1,
    randomBytes: randomBytes,
    shuffled: shuffled,
    solidityPack: pack$1,
    solidityKeccak256: keccak256$1,
    soliditySha256: sha256$2,
    splitSignature: splitSignature,
    joinSignature: joinSignature,
    accessListify: accessListify,
    parseTransaction: parse,
    serializeTransaction: serialize,
    getJsonWalletAddress: getJsonWalletAddress,
    computeAddress: computeAddress,
    recoverAddress: recoverAddress,
    computePublicKey: computePublicKey,
    recoverPublicKey: recoverPublicKey,
    verifyMessage: verifyMessage,
    verifyTypedData: verifyTypedData,
    mnemonicToEntropy: mnemonicToEntropy,
    entropyToMnemonic: entropyToMnemonic,
    isValidMnemonic: isValidMnemonic,
    mnemonicToSeed: mnemonicToSeed,
    get SupportedAlgorithm() {
        return SupportedAlgorithm;
    },
    get UnicodeNormalizationForm() {
        return UnicodeNormalizationForm;
    },
    get Utf8ErrorReason() {
        return Utf8ErrorReason;
    },
    Indexed: Indexed,
});
const version$o = "ethers/5.1.4";
("use strict");
const logger$H = new Logger(version$o);
var ethers = Object.freeze({
    __proto__: null,
    Signer: Signer,
    Wallet: Wallet,
    VoidSigner: VoidSigner,
    getDefaultProvider: getDefaultProvider,
    providers: index$3,
    BaseContract: BaseContract,
    Contract: Contract,
    ContractFactory: ContractFactory,
    BigNumber: BigNumber,
    FixedNumber: FixedNumber,
    constants: index$1,
    get errors() {
        return ErrorCode;
    },
    logger: logger$H,
    utils: utils$1,
    wordlists: wordlists,
    version: version$o,
    Wordlist: Wordlist,
});
("use strict");
try {
    const anyGlobal = window;
    if (anyGlobal._ethers == null) {
        anyGlobal._ethers = ethers;
    }
} catch (error) { }


window.connectWallet = async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const accounts = await provider.listAccounts();
    console.log("account is ", accounts[0]);
    window.ftd.set_value(
        "admint-io.github.io/Templates/texts#wallet-state",
       `Connected`
    );
}

window.sendWallet = async function sendWallet() {
    const data= {"message":"address add failed"};    
    const walletConnectionStatus = await window.ftd.get_value(
        "main",
        "admint-io.github.io/Templates/texts#wallet-state"
      );    
    if(walletConnectionStatus=="Connected"){
        console.log("send wallet clicked");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        const accounts = await provider.listAccounts();
        console.log("account is ", accounts[0]);
    if(indexFile.campaignId != "undefined" && indexFile.inviteCode != "undefined"){
        fetch(`${config.DISTRIBUTION_BASE_BACKEND_URL}/open/dropWallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "walletAddress": `${accounts[0]}`,
                "campaignId": `${indexFile.campaignId}`,
                "inviteCode": `${indexFile.inviteCode}`
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if("success" in data){
                    if(data.success){
                        showSuccessPopup(data);
                    }
                    else{
                        showFailurePopup(data);
                    }
                    
                }
            })
            .catch(error => console.error(error))  
    }
    else{
        showWarningPopup("Invalid Link");
    }          
    }
    else{
        showWarningPopup("Connect your wallet to claim NFT")
    }    
}