// NUMBER OF [CHANGE HERE] 1

var dataObject = __DEV__ ?
    require('../../assets/cheat.json') : // CHANGE HERE 1
    undefined

export function Cheat(key, defaultValue) {
    if (!dataObject)
        return defaultValue;

    if (dataObject.hasOwnProperty(key) && dataObject[key] != null)
        return dataObject[key];
    else
        return defaultValue;
}