import { Controller, Query, Get, Post } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { AppService } from './app.service';

import { getCredential } from 'src/sdk/tencent-oss';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    testHome(): object {
        return consequencer.success();
    }

    @Get('image/credential')
    async getImageCredential(@Query() query: any): Promise<Consequencer> {
        const { resource } = query

        if (!resource) return consequencer.error('参数有误');

        return await getCredential(resource).then(({
            credentials: {
                tmpSecretId, //  "AKIDEPMQB_Q9Jt2fJxXyIekOzKZzx-sdGQgBga4TzsUdTWL9xlvsjInOHhCYFqfoKOY4",
                tmpSecretKey, //  "W/3Lbl1YEW02mCoawIesl5kNehSskrSbp1cT1tgW70g=",
                sessionToken, //  "c6xnSYAxyFbX8Y50627y9AA79u6Qfucw6924760b61588b79fea4c277b01ba157UVdr_10Y30bdpYtO8CXedYZe3KKZ_DyzaPiSFfNAcbr2MTfAgwJe-dhYhfyLMkeCqWyTNF-rOdOb0rp4Gto7p4yQAKuIPhQhuDd77gcAyGakC2WXHVd6ZuVaYIXBizZxqIHAf4lPiLHa6SZejSQfa_p5Ip2U1cAdkEionKbrX97xTKTcA_5Pu525CFSzHZIQibc2uNMZ-IRdQp12MaXZB6bxM6nB4xXH45mDIlbIGjaAsrtRJJ3csmf82uBKaJrYQoguAjBepMH91WcH87LlW9Ya3emNfVX7NMRRf64riYd_vomGF0TLgan9smEKAOdtaL94IkLvVJdhLqpvjBjp_4JCdqwlFAixaTzGJHdJzpGWOh0mQ6jDegAWgRYTrJvc5caYTz7Vphl8XoX5wHKKESUn_vqyTAid32t0vNYE034FIelxYT6VXuetYD_mvPfbHVDIXaFt7e_O8hRLkFwrdAIVaUml1mRPvccv2qOWSXs"
            },
            expiration, // : "2019-08-07T08:54:35Z",
            startTime, //  1565166275, // UI需要的单位是秒
            expiredTime, //  1565168075
        }) => consequencer.success({
            tmpSecretId,
            tmpSecretKey,
            sessionToken,
            startTime,
            expiredTime,
        }), error => consequencer.error(error))
    }
}
