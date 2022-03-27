export let data = {
    "chartBody": {
        "title": "温度值",
        "axisInfo": {
            "desc": "Tempertual",
            "unit": "℃",
            "rangeMax": 80,
            "rangeMin": -20,
            "mode":0
        },
        "trigger": [
            {
                "desc": "预警值",
                "value": 45,
                "color": "#FCAB53"
            },
            {
                "desc": "报警值",
                "value": 60,
                "color": "#ff0000"
            }
        ],
        "series": [
            {
                "color": "#008000",
                "dataList": 25.5
            }
        ]
    }
}