interface verifyJSONStringParameter { jsonString: string, isArray?: Boolean }

const jsonHandle = {
    verifyJSONString: (parameter: verifyJSONStringParameter) => {
        const result = {
            isCorrect: false,
            msg: '',
            data: null
        }

        if (!parameter.jsonString) {
            result.msg = 'json为空'
            return result
        }

        try {
            const obj = JSON.parse(parameter.jsonString)
            if (obj && typeof obj === 'object') {

                // 判断数组
                if (parameter.isArray) {
                    if (obj instanceof Array) {
                        result.isCorrect = true
                        result.data = obj
                    } else {
                        result.isCorrect = false
                        result.msg = 'JSON不是数组'
                    }
                } else {
                    result.isCorrect = true
                    result.data = obj
                }

            } else {
                result.isCorrect = false
                result.msg = 'JSON格式不正确'
            }
        } catch (e) {
            result.isCorrect = false
            result.msg = 'JSON格式不正确'
        }

        return result
    }
}

export default jsonHandle