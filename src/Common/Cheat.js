// relocate cheat.json at line 15

// sample cheat.json:
// {
//     "IsClearAllLocalFileBeforeLoadApp": 0
// }

// usage:
// if (!Cheat('IsClearAllLocalFileBeforeLoadApp'))


var dataObject = null;

export function Cheat(key, defaultValue) {
    if (!dataObject) {
        dataObject = require('../../assets/jsons/cheat.json'); // relocate here.
    }

    if (!dataObject)
        return defaultValue;

    if (dataObject.hasOwnProperty(key) && dataObject[key] != null)
        return dataObject[key];
    else
        return defaultValue;
}