const initHeaders = () => {
    const token = localStorage.getItem('website-station-system-token')
    const headers = {
        "Content-Type": 'application/json; charset=utf-8'
    }

    token ? headers['website-station-system-token'] = token : null

    return headers
}

export default initHeaders