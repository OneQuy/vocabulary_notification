// NUMBER OF [CHANGE HERE] 1

var dataObject = require('../../assets/cheat.json') // CHANGE HERE 1

export function Cheat(key, defaultValue) {
    if (!dataObject)
        return defaultValue;

    if (dataObject.hasOwnProperty(key) && dataObject[key] != null)
        return dataObject[key];
    else
        return defaultValue;
}