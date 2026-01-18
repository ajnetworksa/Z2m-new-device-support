const tuya = require('zigbee-herdsman-converters/lib/tuya');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
    fingerprint: tuya.fingerprint("TS0726", ['_TZ3002_ghfdqnbx']),
    model: 'TS0726_2_gang_switch',
    vendor: 'Tuya',
    description: '2 gang switch with backlight',
    exposes: [e.action(["scene_1", "scene_2"])],
    extend: [
        tuya.modernExtend.tuyaOnOff({
            switchMode: true,
            powerOnBehavior2: true,
            backlightModeOffOn: true,
            indicatorModeNoneRelayPos: true,
            onOffCountdown: true,
            endpoints: ["l1", "l2"]
        }),
    ],
    endpoint: (device) => ({l1:1, l2:2}),
    meta: {
        multiEndpoint: true,
    },
    configure: async (device, coordinatorEndpoint) => {
        await tuya.configureMagicPacket(device, coordinatorEndpoint);
        for (const ep of [1,2]) {
            await reporting.bind(device.getEndpoint(ep), coordinatorEndpoint, ['genOnOff']);
        }
    },
};

module.exports = definition;
