export default class TemporaryStorage {
    constructor(reGetFun, expirationInterval = 18000) {
        this.expirationInterval = expirationInterval
        this.reGetFun = reGetFun
        this.storage = false
        this.expirationTimestamp = this.initNextExpirationTimestamp()
    }

    initNextExpirationTimestamp() {
        return new Date().getTime() + (+this.expirationInterval)
    }

    checkIsExpiration() {
        const { storage, expirationTimestamp } = this
        if (!storage) return true
        const nowTimestamp = new Date().getTime()
        if (nowTimestamp >= expirationTimestamp) return true
        return false
    }

    get() {
        const { reGetFun, checkIsExpiration, initNextExpirationTimestamp } = this
        const isExpiration = checkIsExpiration()
        if (isExpiration) {
            initNextExpirationTimestamp()
            this.storage = reGetFun()
        }

        return this.storage
    }
}