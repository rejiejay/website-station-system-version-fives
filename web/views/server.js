import fetch from './../components/async-fetch/fetch.js';

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

export default server