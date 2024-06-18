// https://github.com/itinance/react-native-fs

// install:
// npm install react-native-fs
// npx pod-install ios

import RNFS, { DownloadProgressCallbackResult, StatResult } from "react-native-fs";
import { Platform } from "react-native";
import { CreateError, LoadJsonFromURLAsync, ShuffleArray, TempDirName } from "./UtilsTS";

/**
 * @returns null if success, otherwise error
 */
async function CheckAndMkDirOfFilepathAsync(fullFilepath: string): Promise<null | NonNullable<any>> {
  try {
    var idx = fullFilepath.lastIndexOf('/');
    var dirFullPath = fullFilepath.substring(0, idx);
    var dirIsExist = await RNFS.exists(dirFullPath);

    if (!dirIsExist)
      await RNFS.mkdir(dirFullPath);

    return null;
  } catch (e) {
    return e;
  }
}

/**
 * 
 * @returns Error {} if file not existed or something error
 */
export async function FileStat(path: string, isRLP: boolean = true): Promise<StatResult | Error> {
  path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path

  if (!await IsExistedAsync(path, false))
    return new Error('File not found: ' + path)

  try {
    return await RNFS.stat(path)
  }
  catch (e) {
    return CreateError(e)
  }
}

/**
 * 
 * @returns Error {} if file not existed or something error
 */
export async function FileSizeInMB(path: string, isRLP: boolean = true): Promise<number | Error> {
  path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path

  if (!await IsExistedAsync(path, false))
    return new Error('File not found: ' + path)

  try {
    const stat = await RNFS.stat(path)

    const sizeBytes = stat.size

    return sizeBytes / 1024 / 1024
  }
  catch (e) {
    return CreateError(e)
  }
}

/**
 * usage: const res = await WriteTextAsync('dataDir/file.txt', 'losemp text losemp text');
 * @returns null if success, otherwise error
 */
export async function WriteTextAsync(path: string, text: string | null, isRLP: boolean = true, encode?: string): Promise<null | any> {
  try {
    if (!path) {
      throw 'url or saveLocalPath is invalid to WriteTextAsync';
    }

    path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path;

    // check & create dir first

    var res = await CheckAndMkDirOfFilepathAsync(path);

    if (res)
      throw 'can not write file, error when CheckAndMkDirOfFilepathAsync: ' + res;

    // write

    await RNFS.writeFile(path, text ? text : '', encode);

    return null;
  }
  catch (e) {
    return e;
  }
}

export async function ReadJsonFileAsync<T>(path: string, isRLP: boolean = true): Promise<T | Error> {
  let readFileLocalRes = await ReadTextAsync(path, isRLP)

  if (readFileLocalRes.text) {
    try {
      return JSON.parse(readFileLocalRes.text) as T
    }
    catch (e) {
      return CreateError(e)
    }
  }
  else
    return CreateError(readFileLocalRes.error)
}

/**
 * usage: const res = await ReadTextAsync('dataDir/file.txt');
 * @success return {text: text, error: null}
 * @error return {text: null, error: error}
 */
export async function ReadTextAsync(path: string, isRLP: boolean = true): Promise<{ text: string | null, error: null | any }> {
  try {
    if (!path) {
      throw 'path is invalid to ReadTextAsync';
    }

    path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path;

    if (!await RNFS.exists(path)) {
      return {
        text: null,
        error: 'file not found'
      }
    }

    var text = await RNFS.readFile(path);

    return {
      text,
      error: null
    }
  }
  catch (e) {
    return {
      text: null,
      error: e
    }
  }
}

/**
 * usage: const res = await DeleteAsync('dataDir/file.txt');
 * @work both dir & file
 * @returns null if not existed or deleted success, otherwise error
 * @note: recursively deletes directories
 */
export async function DeleteFileAsync(path: string, isRLP: boolean = true): Promise<null | any> {
  try {
    if (!path) {
      throw 'path is null/underfined';
    }

    path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path;
    var isExist = await RNFS.exists(path);

    if (isExist)
      await RNFS.unlink(path);

    return null;
  }
  catch (e) {
    return e;
  }
}

/**
 * @returns null if not existed or deleted success, otherwise error
 */
export async function DeleteTempDirAsync() {
  return await DeleteFileAsync(TempDirName, true);
}

export async function IsExistedAsync(path: string, isRLP: boolean = true): Promise<boolean> {
  try {
    if (!path) {
      throw 'path is null/underfined';
    }

    path = isRLP ? RNFS.DocumentDirectoryPath + '/' + path : path;
    return await RNFS.exists(path);
  }
  catch (e) {
    throw 'check IsExisted failed at path: ' + path;
  }
}

/**
 ## Usage: 
 const res = await DownloadFileAsync('fileurl', 'dataDir/file.txt');
 * @param shuffleIfJsonIsArray will shuffle the array before saving file.
 * @returns null if success, otherwise error
 ## Note:
 If  shuffleIfJsonIsArray === true, 'progress' will not work.
 */
export async function DownloadFileAsync(
  url: string,
  saveLocalPath: string,
  isRLP: boolean = true,
  progress?: (p: DownloadProgressCallbackResult) => void,
  shuffleIfJsonIsArray?: boolean): Promise<null | NonNullable<any>> {
  try {
    if (!url || !saveLocalPath) {
      throw 'url or saveLocalPath is invalid to download';
    }

    // flp

    saveLocalPath = isRLP ? RNFS.DocumentDirectoryPath + '/' + saveLocalPath : saveLocalPath;

    // check & create dir first

    let res = await CheckAndMkDirOfFilepathAsync(saveLocalPath);

    if (res)
      throw 'can not download file, error when CheckAndMkDirOfFilepathAsync: ' + res;

    // download

    if (shuffleIfJsonIsArray === true) { // file is json & need to shuffle
      res = await DownloadFile_GetJsonAsync(
        url,
        saveLocalPath,
        false,
        true)

      if (!res.json) {
        throw '[' + url + ']' + ' downloaded failed, error: ' + res.error
      }
    }
    else { // other cases
      res = await RNFS.downloadFile({
        fromUrl: url,
        toFile: saveLocalPath,
        begin: () => { },
        progress
      }).promise;

      if (res.statusCode !== 200) {
        throw '[' + url + ']' + ' downloaded failed, code: ' + res.statusCode;
      }
    }

    // success

    return null;
  }
  catch (e) {
    return e;
  }
}

/**
 * 
 * @returns undefined if can not find last '/'.
 */
export async function GetFullDirPathOfFile(flpOrRlp: string): Promise<undefined | string> {
  const idx = flpOrRlp.lastIndexOf('/');

  if (idx < 0)
    return undefined

  return flpOrRlp.substring(0, idx);
}

/**
 * 
 * @param path suppports both rlp & flp
 * @returns undefined if can not find last '/'.
 */
export function GetFileNameAndExtension(path: string) {
  var idx = path.lastIndexOf('/')

  if (idx < 0)
    return undefined
  else
    return path.substring(idx + 1)
}

/**
 * @param shuffleIfJsonIsArray will shuffle the array before saving file.
 ```tsx
 return {
  json: json (object) if success. null if error.
  error: null if success. error if error.
 }
```
 */
export async function DownloadFile_GetJsonAsync<T>(
  url: string,
  saveLocalPath: string,
  isRLP = true,
  shuffleIfJsonIsArray?: boolean) {
  // get json from url

  var res = await LoadJsonFromURLAsync(url);

  if (res.json) // sucess
  {
    // shuffle

    if (Array.isArray(res.json) && shuffleIfJsonIsArray === true) {
      ShuffleArray(res.json)
    }

    // write to local

    var s = JSON.stringify(res.json);
    var writeFileResObj = await WriteTextAsync(saveLocalPath, s, isRLP);

    if (writeFileResObj === null) // success
    {
      return {
        json: res.json as T,
        error: null
      };
    }
    else // failed
    {
      return {
        json: res.json as T,
        error: writeFileResObj
      };
    }
  }
  else // failed
  {
    return {
      json: null,
      error: res.error
    };
  }
}

export function CheckAndAddFileWithSplashIfAndroid(flp: string) {
  if (Platform.OS !== 'android')
    return flp

  if (flp.startsWith('file://'))
    return flp

  return 'file://' + flp
}

export function GetFLPFromRLP(rlp: string, addFileWithSplashIfAndroid?: boolean): string {
  if (Platform.OS === 'android' && addFileWithSplashIfAndroid === true)
    return 'file://' + RNFS.DocumentDirectoryPath + '/' + rlp;
  else
    return RNFS.DocumentDirectoryPath + '/' + rlp;
}