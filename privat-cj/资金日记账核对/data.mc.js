var tableDataL = [{
    "changeMoney": 0,
    "centerName": "",
    "dailyBookType": "b",
    "incomeChangeMoney": 0,
    "detailList": [{
        "serviceMoney": 342,
        "bankNo": "998763636334444",
        "balance": 341,
        "changeMoney": 41216,
        "currencyStr": "（¥）",
        "incomeChangeMoney": 41324,
        "expendChangeMoney": 234
    }, {
        "serviceMoney": 2.64,
        "bankNo": "134127857284458",
        "balance": 31,
        "changeMoney": 236,
        "currencyStr": "（¥）",
        "incomeChangeMoney": 29.52,
        "expendChangeMoney": 29.76
    }],
    "expendChangeMoney": 0,
    "dailyBookTypeStr": "银行日记账",
    "currency": "",
    "id": 0,
    "serviceMoney": 0,
    "balance": 0,
    "bankNo": "",
    "currencyStr": "",
    "centerId": 0
}, {
    "changeMoney": 3513,
    "centerName": "",
    "dailyBookType": "c",
    "incomeChangeMoney": 3423,
    "detailList": [],
    "expendChangeMoney": 232,
    "dailyBookTypeStr": "现金日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 142,
    "balance": 23324,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
}, {
    "changeMoney": 30,
    "centerName": "",
    "dailyBookType": "w",
    "incomeChangeMoney": 0,
    "detailList": [],
    "expendChangeMoney": 7.59,
    "dailyBookTypeStr": "微信日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 0.69,
    "balance": 12133,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
}, {
    "changeMoney": -36531,
    "centerName": "",
    "dailyBookType": "z",
    "incomeChangeMoney": 1044.48,
    "detailList": [],
    "expendChangeMoney": 57.84,
    "dailyBookTypeStr": "支付宝日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 9869.76,
    "balance": 345,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
}];

var tableDataR = [{
    "changeMoney": 0,
    "centerName": "",
    "dailyBookType": "b",
    "incomeChangeMoney": 0,
    "detailList": [{
        "serviceMoney": 0,
        "bankNo": "987465537344",
        "balance": 0,
        "changeMoney": -122,
        "currencyStr": "（¥）",
        "incomeChangeMoney": 0,
        "expendChangeMoney": -122
    }, {
        "serviceMoney": 293.52,
        "bankNo": "134127857284458",
        "balance": 0,
        "changeMoney": -1090.08,
        "currencyStr": "（¥）",
        "incomeChangeMoney": -793.92,
        "expendChangeMoney": -2.64
    }, {
        "serviceMoney": 511.29,
        "bankNo": "234134987845814",
        "balance": 0,
        "changeMoney": -503.7,
        "currencyStr": "（¥）",
        "incomeChangeMoney": 7.59,
        "expendChangeMoney": 0
    }, {
        "serviceMoney": 0,
        "bankNo": "354652636642346",
        "balance": 0,
        "changeMoney": -7590,
        "currencyStr": "（¥）",
        "incomeChangeMoney": -7590,
        "expendChangeMoney": 0
    }],
    "expendChangeMoney": 0,
    "dailyBookTypeStr": "银行日记账",
    "currency": "",
    "id": 0,
    "serviceMoney": 0,
    "balance": 0,
    "bankNo": "",
    "currencyStr": "",
    "centerId": 0
}, {
    "changeMoney": -76901,
    "centerName": "",
    "dailyBookType": "c",
    "incomeChangeMoney": -13541,
    "detailList": [],
    "expendChangeMoney": -63237,
    "dailyBookTypeStr": "现金日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 123,
    "balance": 0,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
}, {
    "changeMoney": -3312.45,
    "centerName": "",
    "dailyBookType": "w",
    "incomeChangeMoney": -3236.09,
    "detailList": [],
    "expendChangeMoney": 0,
    "dailyBookTypeStr": "微信日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 76.36,
    "balance": 0,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
}, {
    "changeMoney": -4.775730307E7,
    "centerName": "",
    "dailyBookType": "z",
    "incomeChangeMoney": -4.776007032E7,
    "detailList": [],
    "expendChangeMoney": 2825.09,
    "dailyBookTypeStr": "支付宝日记账",
    "currency": "1",
    "id": 0,
    "serviceMoney": 57.84,
    "balance": 0,
    "bankNo": "",
    "currencyStr": "（¥）",
    "centerId": 0
    }];

var t = {
    code: '',
    msg: '',
    data: {
        image_url: '',
        video_url: '',
        name: '',
    }
}

$(function () {
    $.mockjax({
        url: "/api/t1",
        dataType: "json",
        response: function (settings) {
            this.responseText = tableDataL;
        }
    });

    $.mockjax({
        url: "/api/t2",
        dataType: "json",
        response: function (settings) {
            this.responseText = tableDataR;
        }
    });
})