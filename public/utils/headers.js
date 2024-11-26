"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessTokenFromHeaders = void 0;
const getAccessTokenFromHeaders = ({ authorization }) => ({ accessToken: authorization?.split(' ')[1] });
exports.getAccessTokenFromHeaders = getAccessTokenFromHeaders;
