# Zigbee2MQTT External Converters

This directory contains external device converters for Zigbee2MQTT to support additional Tuya devices that are not yet included in the main zigbee-herdsman-converters repository.

## Description

External converters extend Zigbee2MQTT's device support by providing custom JavaScript modules that define how to communicate with specific Zigbee devices. These converters handle device fingerprinting, expose capabilities, and manage data conversion between Zigbee2MQTT and the physical devices.

## Supported Devices

### Tuya F3-Pro Smart Panel
**File:** `f3_pro.js`  
**Model:** F3-Pro  
**Fingerprints:** `_TZE284_7zazvlyn`, `_TZE284_idn2htgu`

A feature-rich smart panel with extensive control capabilities:
- 4-gang switch control
- 8 scene buttons (programmable scenes)
- 4 LED dimmers with color temperature control
- 4 curtain/cover controllers with position control
- Backlight on/off control
- Customizable names for switches, scenes, covers, and LED switches

**Features:**
- Multi-endpoint support (l1-l8)
- Switch state control for 4 switches
- LED brightness (1-100%) and color temperature (1-100%) control
- Cover position control (0-100%) with open/stop/close commands
- Scene activation (scene_1 through scene_8)
- Panel backlight control

### Tuya TS0726 2-Gang Switch
**File:** `2gang_TS0726.js`  
**Model:** TS0726_2_gang_switch  
**Fingerprint:** `_TZ3002_ghfdqnbx`

A 2-gang wall switch with enhanced features:
- 2 independent switch controls (l1, l2)
- 2 scene buttons
- Backlight control
- Power-on behavior configuration
- Indicator mode settings
- On/off countdown timer support

### Tuya TS0726 3-Gang Switch
**File:** `3gang_TS0726.js`  
**Model:** 3gang_scene_switch  
**Fingerprint:** `_TZ3002_yf83an2k`

A 3-gang wall switch with scene control:
- 3 independent switch controls (l1, l2, l3)
- 3 scene buttons
- Backlight control
- Power-on behavior configuration
- Indicator mode settings
- On/off countdown timer support

## Installation

### Method 1: Direct File Placement

1. Download the required converter file(s) from this directory
2. Create the `external_converters` directory in your Zigbee2MQTT data folder if it doesn't exist:
   ```bash
   mkdir -p /path/to/zigbee2mqtt/data/external_converters
   ```
3. Copy the converter file(s) to the directory:
   ```bash
   cp *.js /path/to/zigbee2mqtt/data/external_converters/
   ```

### Method 2: Direct URL Reference

You can reference the converter files directly in your Zigbee2MQTT configuration using the raw GitHub URLs.

### Configuration

Edit your `configuration.yaml` file to include the external converters:

```yaml
external_converters:
  - 2gang_TS0726.js
  - 3gang_TS0726.js
  - f3_pro.js
```

Or using direct URLs:

```yaml
external_converters:
  - https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/2gang_TS0726.js
  - https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/3gang_TS0726.js
  - https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/f3_pro.js
```

### Restart Zigbee2MQTT

After adding the external converters configuration, restart Zigbee2MQTT:

```bash
# Docker
docker restart zigbee2mqtt

# Systemd
sudo systemctl restart zigbee2mqtt

# Manually
# Stop and start the Zigbee2MQTT process
```

## Usage

### Pairing Devices

1. Enable pairing mode in Zigbee2MQTT
2. Put your device into pairing mode (usually by pressing and holding the reset button)
3. Wait for the device to be discovered
4. The external converter will automatically be applied based on the device fingerprint

### Device Control

#### 2-Gang and 3-Gang Switches

Control switches via MQTT topics:
```bash
# Turn on switch 1
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"state": "ON"}'

# Turn off switch 2
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l2/set" -m '{"state": "OFF"}'

# Trigger scene
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/set" -m '{"action": "scene_1"}'
```

#### F3-Pro Smart Panel

**Switch Control:**
```bash
# Control switches (l1-l4)
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"state": "ON"}'
```

**LED Dimmer Control:**
```bash
# Turn on LED and set brightness and color temperature
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{
  "led_switch": "ON",
  "led_bright": 80,
  "led_warm": 50
}'
```

**Cover/Curtain Control:**
```bash
# Open cover
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"cover_state": "open"}'

# Set cover position
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"cover_position": 50}'

# Stop cover
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"cover_state": "stop"}'
```

**Scene Activation:**
```bash
# Trigger scene (1-8)
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/set" -m '{"action": "scene_1"}'
```

**Customize Names:**
```bash
# Set custom switch name
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"switch_name": "Living Room"}'

# Set custom scene name
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/l1/set" -m '{"scene_name": "Movie Time"}'
```

**Backlight Control:**
```bash
# Turn panel backlight on/off
mosquitto_pub -t "zigbee2mqtt/[DEVICE_NAME]/set" -m '{"backlight_switch": "OFF"}'
```

### Home Assistant Integration

These devices will automatically appear in Home Assistant when using the Zigbee2MQTT integration. Each endpoint will be exposed as a separate entity.

**Example entities for F3-Pro:**
- `switch.device_name_l1` - Switch 1
- `light.device_name_l1_led` - LED Dimmer 1
- `cover.device_name_l1` - Cover 1
- `button.device_name_scene_1` - Scene 1

## Troubleshooting

### Device Not Recognized

1. Verify the converter file is in the correct directory
2. Check that `configuration.yaml` references the converter correctly
3. Restart Zigbee2MQTT after adding converters
4. Check Zigbee2MQTT logs for errors

### Device Paired but Not Working

1. Remove the device from Zigbee2MQTT
2. Restart Zigbee2MQTT
3. Re-pair the device
4. Check device fingerprint matches the converter

### Logs

Enable debug logging in `configuration.yaml`:
```yaml
advanced:
  log_level: debug
```

Check logs at `/path/to/zigbee2mqtt/data/log/[DATE]/log.txt`

## Technical Details

### Converter Structure

Each converter file exports a device definition object containing:
- **fingerprint**: Device identification (manufacturer, model IDs)
- **model**: Human-readable model name
- **vendor**: Manufacturer name
- **description**: Device description
- **exposes**: Capabilities exposed to Zigbee2MQTT
- **endpoint**: Endpoint mapping for multi-endpoint devices
- **fromZigbee/toZigbee**: Data converters
- **configure**: Device configuration function
- **meta**: Additional metadata (e.g., Tuya datapoints)

### Dependencies

These converters require:
- zigbee-herdsman-converters library
- Tuya extensions from zigbee-herdsman-converters

All dependencies are included with Zigbee2MQTT by default.

## Contributing

If you have improvements or additional device support:

1. Fork this repository
2. Add or modify converter files
3. Test thoroughly with physical devices
4. Submit a pull request with detailed description

## License

These converters are provided as-is for use with Zigbee2MQTT. Please refer to the main repository license for terms.

## Support

For issues or questions:
- Check the [Zigbee2MQTT documentation](https://www.zigbee2mqtt.io/)
- Review the [external converters guide](https://www.zigbee2mqtt.io/advanced/support-new-devices/01_support_new_devices.html)
- Open an issue in this repository

## References

- [Zigbee2MQTT Official Website](https://www.zigbee2mqtt.io/)
- [External Converters Documentation](https://www.zigbee2mqtt.io/advanced/support-new-devices/01_support_new_devices.html)
- [zigbee-herdsman-converters Repository](https://github.com/Koenkk/zigbee-herdsman-converters)