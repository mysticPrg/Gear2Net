YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "G2NMobile.Audio",
        "G2NMobile.Audio.AdjustVolumeOption",
        "G2NMobile.Audio.AudioMode",
        "G2NMobile.Audio.VolumeType",
        "G2NMobile.Battery",
        "G2NMobile.Sensor",
        "G2NMobile.Sensor.Delay",
        "G2NMobile.Sensor.SensorManager",
        "G2NMobile.Sensor.SensorType",
        "G2NMobile.Vibrate",
        "G2NMobile.Wifi",
        "G2NMobile.Wifi.WifiInfo",
        "G2NMobile.Wifi.WifiList",
        "G2NMobile.Wifi.WifiState",
        "G2NNetwork.Http",
        "G2NNetwork.Http.HttpRequest",
        "G2NNetwork.Http.HttpRequestQueue",
        "G2NNetwork.Http.RequestMethod",
        "G2NNetwork.Socket",
        "G2NNetwork.Socket.Address",
        "G2NNetwork.Socket.Protocol",
        "G2NUtil.Keyboard",
        "G2NUtil.Log",
        "G2NUtil.WebViewer"
    ],
    "modules": [
        "G2NMobile",
        "G2NNetwork",
        "G2NUtil"
    ],
    "allModules": [
        {
            "displayName": "G2NMobile",
            "name": "G2NMobile",
            "description": "G2NMobile module have control of the Android-Phone conditions. \nBasically, Providing for this module is the Audio, Battery, Wifi, Vibrate."
        },
        {
            "displayName": "G2NNetwork",
            "name": "G2NNetwork",
            "description": "Gear2 use Bluetooth to communicate with Android for communication with external server.\n Using this module makes a Gear2 look like that it communicate with external server directly.\n Protocol provides with HTTP, TCP, UDP."
        },
        {
            "displayName": "G2NUtil",
            "name": "G2NUtil",
            "description": "Util module was made to improvement about inconvenient as you develop Gear2."
        }
    ]
} };
});