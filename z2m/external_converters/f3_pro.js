const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');

const e = exposes.presets;
const ea = exposes.access;
const m = tuya.modernExtend;

const definition = {
    fingerprint: tuya.fingerprint('TS0601', ['_TZE284_7zazvlyn', '_TZE284_idn2htgu']),
    model: 'F3-Pro',
    vendor: 'Tuya',
    description: 'Smart panel, 4-gang switch with scene, dimmer, and curtain control',

    // Tuya TS0601 datapoint handler + time sync
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    onEvent: tuya.onEventSetTime,
    configure: tuya.configureMagicPacket,

    extend: [
        m.tuyaBase({dp: true, forceTimeUpdates: true, queryOnConfigure: true, timeStart: '2000'}),
    ],

    endpoint: (device) => {
        return {l1: 1, l2: 1, l3: 1, l4: 1, l5: 1, l6: 1, l7: 1, l8: 1};
    },

    exposes: [
        e.binary('backlight_switch', ea.STATE_SET, 'ON', 'OFF').withDescription('Panel screen on/off'),

        tuya.exposes.switch().withEndpoint('l1'),
        tuya.exposes.switch().withEndpoint('l2'),
        tuya.exposes.switch().withEndpoint('l3'),
        tuya.exposes.switch().withEndpoint('l4'),

        e.text('switch_name', ea.STATE_SET).withEndpoint('l1').withDescription('Name for Switch 1'),
        e.text('switch_name', ea.STATE_SET).withEndpoint('l2').withDescription('Name for Switch 2'),
        e.text('switch_name', ea.STATE_SET).withEndpoint('l3').withDescription('Name for Switch 3'),
        e.text('switch_name', ea.STATE_SET).withEndpoint('l4').withDescription('Name for Switch 4'),

        e.text('scene_name', ea.STATE_SET).withEndpoint('l1').withDescription('Name for Scene 1'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l2').withDescription('Name for Scene 2'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l3').withDescription('Name for Scene 3'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l4').withDescription('Name for Scene 4'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l5').withDescription('Name for Scene 5'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l6').withDescription('Name for Scene 6'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l7').withDescription('Name for Scene 7'),
        e.text('scene_name', ea.STATE_SET).withEndpoint('l8').withDescription('Name for Scene 8'),

        e.text('cover_name', ea.STATE_SET).withEndpoint('l1').withDescription('Name for Cover 1'),
        e.text('cover_name', ea.STATE_SET).withEndpoint('l2').withDescription('Name for Cover 2'),
        e.text('cover_name', ea.STATE_SET).withEndpoint('l3').withDescription('Name for Cover 3'),
        e.text('cover_name', ea.STATE_SET).withEndpoint('l4').withDescription('Name for Cover 4'),

        e.text('led_switch_name', ea.STATE_SET).withEndpoint('l1').withDescription('Name for LED Switch 1'),
        e.text('led_switch_name', ea.STATE_SET).withEndpoint('l2').withDescription('Name for LED Switch 2'),
        e.text('led_switch_name', ea.STATE_SET).withEndpoint('l3').withDescription('Name for LED Switch 3'),
        e.text('led_switch_name', ea.STATE_SET).withEndpoint('l4').withDescription('Name for LED Switch 4'),

        e.action(['scene_1', 'scene_2', 'scene_3', 'scene_4', 'scene_5', 'scene_6', 'scene_7', 'scene_8']),

        e.binary('led_switch', ea.ALL, 'ON', 'OFF').withEndpoint('l1').withDescription('Switch of LED 1'),
        e.numeric('led_warm', ea.STATE_SET).withEndpoint('l1').withDescription('Color temperature of LED 1').withValueMin(1).withValueMax(100),
        e.numeric('led_bright', ea.STATE_SET).withEndpoint('l1').withDescription('Brightness of LED 1').withValueMin(1).withValueMax(100),

        e.binary('led_switch', ea.ALL, 'ON', 'OFF').withEndpoint('l2').withDescription('Switch of LED 2'),
        e.numeric('led_warm', ea.STATE_SET).withEndpoint('l2').withDescription('Color temperature of LED 2').withValueMin(1).withValueMax(100),
        e.numeric('led_bright', ea.STATE_SET).withEndpoint('l2').withDescription('Brightness of LED 2').withValueMin(1).withValueMax(100),

        e.binary('led_switch', ea.ALL, 'ON', 'OFF').withEndpoint('l3').withDescription('Switch of LED 3'),
        e.numeric('led_warm', ea.STATE_SET).withEndpoint('l3').withDescription('Color temperature of LED 3').withValueMin(1).withValueMax(100),
        e.numeric('led_bright', ea.STATE_SET).withEndpoint('l3').withDescription('Brightness of LED 3').withValueMin(1).withValueMax(100),

        e.binary('led_switch', ea.ALL, 'ON', 'OFF').withEndpoint('l4').withDescription('Switch of LED 4'),
        e.numeric('led_warm', ea.STATE_SET).withEndpoint('l4').withDescription('Color temperature of LED 4').withValueMin(1).withValueMax(100),
        e.numeric('led_bright', ea.STATE_SET).withEndpoint('l4').withDescription('Brightness of LED 4').withValueMin(1).withValueMax(100),

        e.enum('cover_state', ea.STATE_SET, ['open', 'stop', 'close']).withEndpoint('l1').withDescription('State of Cover 1'),
        e.numeric('cover_position', ea.STATE_SET).withEndpoint('l1').withDescription('Position of Cover 1').withUnit('%').withValueMin(0).withValueMax(100),

        e.enum('cover_state', ea.STATE_SET, ['open', 'stop', 'close']).withEndpoint('l2').withDescription('State of Cover 2'),
        e.numeric('cover_position', ea.STATE_SET).withEndpoint('l2').withDescription('Position of Cover 2').withUnit('%').withValueMin(0).withValueMax(100),

        e.enum('cover_state', ea.STATE_SET, ['open', 'stop', 'close']).withEndpoint('l3').withDescription('State of Cover 3'),
        e.numeric('cover_position', ea.STATE_SET).withEndpoint('l3').withDescription('Position of Cover 3').withUnit('%').withValueMin(0).withValueMax(100),

        e.enum('cover_state', ea.STATE_SET, ['open', 'stop', 'close']).withEndpoint('l4').withDescription('State of Cover 4'),
        e.numeric('cover_position', ea.STATE_SET).withEndpoint('l4').withDescription('Position of Cover 4').withUnit('%').withValueMin(0).withValueMax(100),
    ],

    meta: {
        multiEndpoint: true,
        tuyaDatapoints: [
            [1, 'action', tuya.valueConverter.static('scene_1')],
            [2, 'action', tuya.valueConverter.static('scene_2')],
            [3, 'action', tuya.valueConverter.static('scene_3')],
            [4, 'action', tuya.valueConverter.static('scene_4')],
            [5, 'action', tuya.valueConverter.static('scene_5')],
            [6, 'action', tuya.valueConverter.static('scene_6')],
            [7, 'action', tuya.valueConverter.static('scene_7')],
            [8, 'action', tuya.valueConverter.static('scene_8')],

            [102, 'led_bright_l1', tuya.valueConverter.raw],
            [103, 'led_bright_l2', tuya.valueConverter.raw],
            [105, 'led_bright_l3', tuya.valueConverter.raw],
            [107, 'led_bright_l4', tuya.valueConverter.raw],

            [109, 'led_warm_l1', tuya.valueConverter.raw],
            [110, 'led_warm_l2', tuya.valueConverter.raw],
            [111, 'led_warm_l3', tuya.valueConverter.raw],
            [112, 'led_warm_l4', tuya.valueConverter.raw],

            [113, 'cover_position_l1', tuya.valueConverter.raw],
            [114, 'cover_position_l2', tuya.valueConverter.raw],
            [115, 'cover_position_l3', tuya.valueConverter.raw],
            [116, 'cover_position_l4', tuya.valueConverter.raw],

            [117, 'led_switch_l1', tuya.valueConverter.onOff],
            [118, 'led_switch_l2', tuya.valueConverter.onOff],
            [119, 'led_switch_l3', tuya.valueConverter.onOff],
            [120, 'led_switch_l4', tuya.valueConverter.onOff],

            [121, 'state_l1', tuya.valueConverter.onOff],
            [122, 'state_l2', tuya.valueConverter.onOff],
            [123, 'state_l3', tuya.valueConverter.onOff],
            [124, 'state_l4', tuya.valueConverter.onOff],

            [125, 'led_switch_name_l1', tuya.valueConverter.utf16BEHexString],
            [126, 'led_switch_name_l2', tuya.valueConverter.utf16BEHexString],
            [127, 'led_switch_name_l3', tuya.valueConverter.utf16BEHexString],
            [128, 'led_switch_name_l4', tuya.valueConverter.utf16BEHexString],

            [129, 'cover_name_l1', tuya.valueConverter.utf16BEHexString],
            [130, 'cover_name_l2', tuya.valueConverter.utf16BEHexString],
            [131, 'cover_name_l3', tuya.valueConverter.utf16BEHexString],
            [132, 'cover_name_l4', tuya.valueConverter.utf16BEHexString],

            [133, 'cover_state_l1', tuya.valueConverterBasic.lookup({open: tuya.enum(0), stop: tuya.enum(1), close: tuya.enum(2)})],
            [134, 'cover_state_l2', tuya.valueConverterBasic.lookup({open: tuya.enum(0), stop: tuya.enum(1), close: tuya.enum(2)})],
            [135, 'cover_state_l3', tuya.valueConverterBasic.lookup({open: tuya.enum(0), stop: tuya.enum(1), close: tuya.enum(2)})],
            [136, 'cover_state_l4', tuya.valueConverterBasic.lookup({open: tuya.enum(0), stop: tuya.enum(1), close: tuya.enum(2)})],

            [137, 'switch_name_l1', tuya.valueConverter.utf16BEHexString],
            [138, 'switch_name_l2', tuya.valueConverter.utf16BEHexString],
            [139, 'switch_name_l3', tuya.valueConverter.utf16BEHexString],
            [140, 'switch_name_l4', tuya.valueConverter.utf16BEHexString],

            [141, 'scene_name_l1', tuya.valueConverter.utf16BEHexString],
            [142, 'scene_name_l2', tuya.valueConverter.utf16BEHexString],
            [143, 'scene_name_l3', tuya.valueConverter.utf16BEHexString],
            [144, 'scene_name_l4', tuya.valueConverter.utf16BEHexString],
            [145, 'scene_name_l5', tuya.valueConverter.utf16BEHexString],
            [146, 'scene_name_l6', tuya.valueConverter.utf16BEHexString],
            [147, 'scene_name_l7', tuya.valueConverter.utf16BEHexString],
            [148, 'scene_name_l8', tuya.valueConverter.utf16BEHexString],

            [149, 'backlight_switch', tuya.valueConverter.onOff],
        ],
    },
};

module.exports = definition;
