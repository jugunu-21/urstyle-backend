"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const models_1 = require("../models");
exports.mediaService = {
    getById: (mediaId) => models_1.Media.findById(mediaId),
    findOneByRef: ({ refType, refId }) => models_1.Media.findOne({ refType, refId }),
    findManyByRef: ({ refType, refId }) => models_1.Media.find({ refType, refId }),
    create: ({ originalname, encoding, mimetype, destination, filename, path, size }, session) => new models_1.Media({
        originalname,
        encoding,
        mimetype,
        destination,
        filename,
        path,
        size
    }).save({ session }),
    updateById: (mediaId, { refType, refId }, session) => {
        const data = [{ _id: mediaId }, { refType, refId }];
        let params = null;
        if (session) {
            params = [...data, { session }];
        }
        else {
            params = data;
        }
        return models_1.Media.updateOne(...params);
    },
    deleteById: (mediaId, session) => models_1.Media.deleteOne({ _id: mediaId }, { session }),
    deleteManyByRef: ({ refType, refId }, session) => models_1.Media.deleteMany({ refType, refId }, { session })
};
