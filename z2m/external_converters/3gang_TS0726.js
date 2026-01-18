const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
    fingerprint: tuya.fingerprint("TS0726", ['_TZ3002_yf83an2k']),
    model: '3gang_scene_switch',
    vendor: 'Tuya',
    description: '3 gang switch with scene and backlight',
    exposes: [e.action(["scene_1", "scene_2", "scene_3"])],
    extend: [
        tuya.modernExtend.tuyaOnOff({
            switchMode: true,
            powerOnBehavior2: true,
            backlightModeOffOn: true,
            indicatorModeNoneRelayPos: true,
            onOffCountdown: true,
            endpoints: ["l1", "l2", "l3",]
        }),
    ],
    endpoint: (device) => ({l1:1, l2:2, l3: 3}),
    meta: {
        multiEndpoint: true,
    },
    configure: async (device, coordinatorEndpoint) => {
        await tuya.configureMagicPacket(device, coordinatorEndpoint);
        for (const ep of [1, 2, 3]) {
            await reporting.bind(device.getEndpoint(ep), coordinatorEndpoint, ['genOnOff']);
        }
    },
};

module.exports = definition;
