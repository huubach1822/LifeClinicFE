import _ from "lodash"

import { toast } from 'react-toastify';

const validateEmpty = (object, popertyList) => {
    if (_.isEmpty(popertyList)) {
        let value = Object.values(object);
        return !value.some(e => {
            if (!_.isEmpty(e) || _.isNumber(e)) {
                return false
            } else {

                return true
            }

        });
    } else {
        return !popertyList.some(e => {
            if (!_.isEmpty(object[e]) || _.isNumber(object[e])) {
                return false
            } else {

                return true
            }
        })
    }
}

const validateLength = (string, stringLength, name) => {
    if (string.length >= stringLength) {
        return true
    } else {
        toast.error(name + " must be at least " + stringLength + " characters!")
        return false
    }
}

const validateEmail = (email) => {
    let boolean = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    if (boolean) {
        return true
    } else {
        toast.error("Invalid email!")
        return false
    }
};

export {
    validateEmpty,
    validateLength,
    validateEmail
}