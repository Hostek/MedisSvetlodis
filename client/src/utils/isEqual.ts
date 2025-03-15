import { anyObj } from "../types"

export function areArraysEqual(arr1: any[], arr2: any[]) {
    if (!arr2) return false
    if (arr1.length != arr2.length) return false

    for (let i = 0, l = arr1.length; i < l; i++) {
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            if (!areArraysEqual(arr1[i], arr2[i])) return false
        } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
            if (!areObjectsEqual(arr1[i], arr2[i])) return false
        } else if (arr1[i] != arr2[i]) {
            return false
        }
    }
    return true
}

export function areObjectsEqual(object1: anyObj, object2: anyObj) {
    for (const propName in object1) {
        if (
            object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)
        ) {
            return false
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false
        }
    }
    for (const propName in object2) {
        if (
            object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)
        ) {
            return false
        } else if (typeof object1[propName] != typeof object2[propName]) {
            return false
        }
        if (!object1.hasOwnProperty(propName)) continue

        if (
            object1[propName] instanceof Array &&
            object2[propName] instanceof Array
        ) {
            if (!areArraysEqual(object1[propName], object2[propName]))
                return false
        } else if (
            object1[propName] instanceof Object &&
            object2[propName] instanceof Object
        ) {
            if (!areObjectsEqual(object1[propName], object2[propName]))
                return false
        } else if (object1[propName] != object2[propName]) {
            return false
        }
    }
    return true
}
