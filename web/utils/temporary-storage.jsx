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
        if (!this.storage) return true
        const nowTimestamp = new Date().getTime()
        if (nowTimestamp >= this.expirationTimestamp) return true
        return false
    }

    get() {
        const isExpiration = this.checkIsExpiration()
        if (isExpiration) {
            this.initNextExpirationTimestamp()
            this.storage = this.reGetFun()
        }

        return this.storage
    }
}