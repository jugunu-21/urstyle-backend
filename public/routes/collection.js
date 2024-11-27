"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collection = void 0;
const guards_1 = require("../guards");
const controllers_1 = require("../controllers");
const collection = (router) => {
    router.post('/collection/upload', guards_1.authGuard.isAuth, controllers_1.collectionController.collectionUpload);
    router.get('/collection/fetch', controllers_1.collectionController.collectionFetch, controllers_1.collectionController.LikedCollectionFetch);
    router.post('/collection/admincollectionfetch', guards_1.authGuard.isAuth, controllers_1.collectionController.collectionbyUserId);
    router.post('/collection/update/:collectionId', guards_1.authGuard.isAuth, controllers_1.collectionController.collectionUpdate);
    router.post('/collection/Like/:collectionId', guards_1.authGuard.isAuth, controllers_1.collectionController.collectionLikeUnlike);
    router.delete('/collection/delete/:collectionId', guards_1.authGuard.isAuth, controllers_1.collectionController.deletecollection);
    router.post('/collection/collectionByCollectionId/:collectionId', controllers_1.collectionController.collectionbyColletionId);
};
exports.collection = collection;
