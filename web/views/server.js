import fetch from './../components/async-fetch/fetch.js';
import jsonHandle from './../utils/json-handle.js';

let server = {}

/**
 * 含义: 获取腾讯云COS凭证
 * 注意: 需要引入 lib/cos-js-sdk-v5/cos-js-sdk-v5.js
 */
server.getImageAuthorization = ({ resource }) => {
    return new COS({
        getAuthorization: (options, callback) => fetch.get({
            url: 'image/credential',
            query: { resource }
        }).then(
            ({ data: { tmpSecretId, tmpSecretKey, sessionToken, startTime, expiredTime } }) => callback({
                TmpSecretId: tmpSecretId,
                TmpSecretKey: tmpSecretKey,
                XCosSecurityToken: sessionToken,
                StartTime: startTime,
                ExpiredTime: expiredTime
            }),
            error => toast.show(error)
        )
    })
}

/**
 * 含义: 将base64转换为文件
 */
server.base64toFile = ({ base64, filename }) => {
    let strSplit = base64.split(',')
    let mime = strSplit[0].match(/:(.*?);/)[1]
    let atobString = atob(strSplit[1])
    let atobLength = atobString.length
    let atobUint8Array = new Uint8Array(atobLength)

    while (atobLength--) {
        atobUint8Array[atobLength] = atobString.charCodeAt(atobLength);
    }

    return new File([atobUint8Array], filename, { type: mime });
}

server.getServiceStorage = async({ key }) => {
    let storage = false
    await fetch.get({
        url: 'map/get',
        query: { key }
    }).then(
        ({ data: { key, value } }) => {
            const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: value })
            if (verifyJSONresult.isCorrect) storage = verifyJSONresult.data;
        },
        error => {}
    )

    return storage
}

server.setServiceStorage = async({ key, value }) => await fetch.post({
    url: 'map/set',
    body: { key, value }
}).then(
    () => {},
    error => toast.show(error)
)

server.clearServiceStorage = async({ key }) => await fetch.get({
    url: 'map/clear',
    query: { key }
}).then(
    () => {},
    error => toast.show(error)
)

export default server