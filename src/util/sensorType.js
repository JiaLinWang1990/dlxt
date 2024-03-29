export const sensorType = ['',
"dB",
"dBm",
"dBmV",
"dBμV",
"V",
"mV",
"μV",
"%",
"A",
"mA",
"μA",
"Ω",
"mΩ",
"μΩ",
"m/s²",
"mm",
"℃",
"℉",
"Pa",
"C",
"mC",
"μC",
"nC",
"pC",
"𝑢/m³",
]
export const sensorTypeOptions = [
    { type: 'UHF', label: '特高频局放' },
    { type: 'HFCT', label: '高频电流局放' },
    { type: 'TEV', label: '暂态地电压局放' },
    { type: 'AE', label: '超声波局放' },
    { type: 'MECH', label: '断路器机械特性' },
    { type: 'VIBRATION', label: '振动' },
    { type: 'OZONE', label: '臭氧' },
    { type: 'DEVTEMP', label: '设备温度' },
    { type: 'ENVTEMP', label: '环境温度' },
    { type: 'ENVTH', label: '环境湿度' },
    
]
export const alarmLevel = ['正常', '预警', '报警']  //报警等级
export const PDType = ['正常','尖端放电','悬浮放电','沿面放电','内部放电','颗粒放电','外部放电','其他']    //放电类型