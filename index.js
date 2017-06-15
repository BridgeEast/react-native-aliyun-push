/**
 * Copyright (c) 2017-present, Wonday (@wonday.org)
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';
import React,{ Component, PropTypes } from 'react';
import {
    requireNativeComponent,
} from 'react-native';

const AliyunPushNative = require('react-native').NativeModules.AliyunPush;
const { NativeEventEmitter } = require('react-native');
const LocalEventEmitter =  new NativeEventEmitter(AliyunPushNative);

var listeners = {};

var id = 0;
var META = '__listener_id';

function getKey(listener,type){

    if (!listener.hasOwnProperty(META)){
        if (!Object.isExtensible(listener)) {
            return 'F';
        }
        Object.defineProperty(listener, META, {
            value: 'L' + type + ++id,
        });
    }
    return listener[META];

};


export default class AliyunPush {

    static getDeviceId = (callback) => {
        AliyunPushNative.getDeviceId(function(args) {
            callback(args);
        });
    }

    static getApplicationIconBadgeNumber = (callback) => {
        AliyunPushNative.getApplicationIconBadgeNumber(function(args) {
            callback(args);
        });
    }

    static setApplicationIconBadgeNumber = (num) => {
        AliyunPushNative.setApplicationIconBadgeNumber(num);
    }

    static bindAccount = (account) => {
        return AliyunPushNative.bindAccount(account);
    }

    static unbindAccount = () => {
        return AliyunPushNative.unbindAccount();
    }

    static bindTag = (target, tags, alias) => {
        return AliyunPushNative.bindTag(target, tags, alias);
    }

    static unbindTag = (target, tags, alias) => {
        return AliyunPushNative.unbindTag(target, tags, alias);
    }

    static listTags = (target) => {
        return AliyunPushNative.listTags(target);
    }

    static addAlias = (alias) => {
        return AliyunPushNative.addAlias(alias);
    }

    static removeAlias = (alias) => {
        return AliyunPushNative.removeAlias(alias);
    }

    static listAliases = () => {
        return AliyunPushNative.listAliases();
    }

    static addListener = (callback) => {

        AliyunPush._addListener(callback,"aliyunPushReceived");

    };

    static removListener = (callback) => {

        AliyunPush._removeListener(callback, "aliyunPushReceived");

    };

    static _addListener = (callback,type) => {

        var key = getKey(callback,type);
        listeners[key] = LocalEventEmitter.addListener(type,
            (e) => {

                // convert json string to obj
                if (e.extraStr) {
                    let extras = JSON.parse(e.extraStr);
                    if (extras) {
                        e.extras = extras;
                    }
                    delete e.extraStr;
                    callback(e);
                } else {
                    callback(e);
                }

            });

    };

    static _removeListener = (callback,type) => {

        var key = getKey(callback,type);
        if (!listeners[key]) {
            return;
        }
        listeners[key].remove();
        listeners[key] = null;

    };
}