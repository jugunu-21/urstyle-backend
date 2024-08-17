"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRefType = exports.ImageSizeInMb = exports.Mimetype = exports.ExpiresInDays = void 0;
var ExpiresInDays;
(function (ExpiresInDays) {
    ExpiresInDays[ExpiresInDays["Verification"] = 7] = "Verification";
    ExpiresInDays[ExpiresInDays["ResetPassword"] = 7] = "ResetPassword";
})(ExpiresInDays = exports.ExpiresInDays || (exports.ExpiresInDays = {}));
var Mimetype;
(function (Mimetype) {
    Mimetype["Jpeg"] = "image/jpeg";
    Mimetype["Png"] = "image/png";
})(Mimetype = exports.Mimetype || (exports.Mimetype = {}));
var ImageSizeInMb;
(function (ImageSizeInMb) {
    ImageSizeInMb[ImageSizeInMb["Ten"] = 10] = "Ten";
})(ImageSizeInMb = exports.ImageSizeInMb || (exports.ImageSizeInMb = {}));
var MediaRefType;
(function (MediaRefType) {
    MediaRefType["User"] = "User";
})(MediaRefType = exports.MediaRefType || (exports.MediaRefType = {}));
