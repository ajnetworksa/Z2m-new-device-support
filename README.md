# Zigbee2MQTT Custom Device Support

This repository contains custom external converters for Zigbee2MQTT to support devices that are not yet officially supported or require custom configurations.

## 📋 Table of Contents
- [Overview](#-overview)
- [Supported Devices](#-supported-devices)
- [Repository Structure](#-repository-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Resources](#-resources)

## 🎯 Overview

This repository provides external converters for Zigbee2MQTT, enabling support for:
- **Tuya TS0726** - 2-gang and 3-gang switches with backlight control
- **Tuya F3-Pro** - Advanced 4-gang smart panel with scene, dimmer, and curtain control

External converters allow you to add support for Zigbee devices without waiting for official integration into Zigbee2MQTT.

## 🔌 Supported Devices

| Device | Model | Description | Features |
|--------|-------|-------------|----------|
| **Tuya 2-Gang Switch** | TS0726 | 2-gang wall switch | On/Off, Backlight, Power-on behavior, Countdown |
| **Tuya 3-Gang Switch** | TS0726 | 3-gang wall switch | On/Off, Backlight, Power-on behavior, Countdown |
| **Tuya F3-Pro Panel** | TS0601 | Smart control panel | 4-gang switches, 8 scenes, 4 LED dimmers, 4 curtain controls |

### Device Details

#### TS0726 2-Gang Switch
- **Model ID**: `_TZ3002_ghfdqnbx`
- **Endpoints**: 2 (l1, l2)
- **Features**:
  - Individual switch control
  - Backlight mode control
  - Power-on behavior settings
  - Indicator mode configuration
  - On/Off countdown timer
  - Scene triggers

#### TS0726 3-Gang Switch
- **Model ID**: `_TZ3002_odygigth`
- **Endpoints**: 3 (l1, l2, l3)
- **Features**: Same as 2-gang with additional third switch

#### F3-Pro Smart Panel
- **Model IDs**: `_TZE284_7zazvlyn`, `_TZE284_idn2htgu`
- **Endpoints**: 8 (l1-l8)
- **Features**:
  - 4 independent relay switches
  - 8 programmable scene buttons
  - 4 LED dimmer controls (brightness + color temperature)
  - 4 curtain/cover controls (position + state)
  - Backlight display on/off
  - Custom naming for all controls
  - Multi-endpoint support

## 📂 Repository Structure

```
├── README.md                           # This file
├── z2m/
│   ├── README.md                       # Z2M configuration guide
│   ├── configuration.yaml              # Sample Zigbee2MQTT configuration
│   └── external_converters/
│       ├── README.md                   # Converter installation guide
│       ├── 2gang_TS0726.js            # 2-gang switch converter
│       ├── 3gang_TS0726.js            # 3-gang switch converter
│       └── f3_pro.js                  # F3-Pro panel converter
```

## 🚀 Installation

### Prerequisites

1. **Home Assistant** with Zigbee2MQTT installed
2. **Zigbee coordinator** (CC2652, ConBee, etc.)
3. **MQTT broker** (Mosquitto recommended)
4. **SSH or file access** to your Home Assistant instance

### Quick Installation

#### Option 1: Manual Installation

1. **Access your Zigbee2MQTT configuration directory**:
   ```bash
   cd /config/zigbee2mqtt
   ```

2. **Create external converters directory** (if it doesn't exist):
   ```bash
   mkdir -p external_converters
   ```

3. **Download the converter files**:
   ```bash
   cd external_converters
   wget https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/2gang_TS0726.js
   wget https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/3gang_TS0726.js
   wget https://raw.githubusercontent.com/ajnetworksa/Z2m-new-device-support/main/z2m/external_converters/f3_pro.js
   ```

4. **Update your Zigbee2MQTT configuration** (see Configuration section below)

5. **Restart Zigbee2MQTT**

#### Option 2: Using File Editor Add-on

1. Open **File Editor** in Home Assistant
2. Navigate to `/config/zigbee2mqtt/external_converters/`
3. Create new files and paste the contents from this repository
4. Save and restart Zigbee2MQTT

## ⚙️ Configuration

### 1. Enable External Converters

Edit your `/config/zigbee2mqtt/configuration.yaml` and add:

```yaml
external_converters:
  - 2gang_TS0726.js
  - 3gang_TS0726.js
  - f3_pro.js
```

### 2. Complete Configuration Example

```yaml
data_path: /config/zigbee2mqtt

# MQTT Settings
mqtt:
  server: mqtt://core-mosquitto
  user: YOUR_MQTT_USER          # Optional
  password: YOUR_MQTT_PASSWORD  # Optional

# Serial Port
serial:
  port: /dev/ttyUSB0            # Adjust to your coordinator

# Frontend (optional)
frontend:
  port: 8080

# Advanced Settings
advanced:
  log_level: info
  pan_id: GENERATE              # Will auto-generate
  network_key: GENERATE         # Will auto-generate
  channel: 11                   # Recommended: 11, 15, 20, 25

# External Converters
external_converters:
  - 2gang_TS0726.js
  - 3gang_TS0726.js
  - f3_pro.js

# Device Options (optional)
device_options:
  friendly_name: '%ENTITY_ID%'
  retain: false

# Homeassistant Integration
homeassistant: true
```

### 3. Restart Zigbee2MQTT

After configuration:
1. Go to **Settings** → **Add-ons** → **Zigbee2MQTT**
2. Click **Restart**
3. Check logs for any errors

## 📖 Usage

### Pairing Devices

1. **Enable pairing mode** in Zigbee2MQTT:
   - Via UI: Click "Permit join (All)" button
   - Via MQTT: Publish `true` to `zigbee2mqtt/bridge/request/permit_join`

2. **Put your device in pairing mode**:
   - **TS0726 Switches**: Press and hold any button for 5-10 seconds until LED blinks
   - **F3-Pro Panel**: Long press the settings button until pairing mode activates

3. **Wait for device to appear** in Zigbee2MQTT (usually 10-60 seconds)

4. **Verify device model** matches the converter (check Zigbee2MQTT logs)

### Device Control

#### TS0726 Switches (2-Gang/3-Gang)

**Via Home Assistant:**
- Switches appear as individual light/switch entities
- Control via Lovelace dashboard or automations

**Via MQTT:**
```bash
# Turn on switch 1
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/l1/set' -m '{"state":"ON"}'

# Turn off switch 2
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/l2/set' -m '{"state":"OFF"}'

# Set backlight mode
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"backlight_mode":"on"}'
```

#### F3-Pro Smart Panel

**Switch Control:**
```bash
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/l1/set' -m '{"state":"ON"}'
```

**LED Dimmer Control:**
```bash
# Turn on LED 1
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"led_switch_l1":"ON"}'

# Set brightness to 80%
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"led_bright_l1":80}'

# Set color temperature (1-100, warm to cool)
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"led_warm_l1":50}'
```

**Curtain Control:**
```bash
# Open curtain 1
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"cover_state_l1":"open"}'

# Set curtain position to 50%
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"cover_position_l1":50}'

# Stop curtain movement
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"cover_state_l1":"stop"}'
```

**Scene Triggers:**
- Scenes 1-8 trigger automatically when buttons are pressed on the panel
- Listen for scene actions in automations

**Custom Naming:**
```bash
# Set switch 1 name
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"switch_name_l1":"Living Room"}'

# Set scene 1 name
mosquitto_pub -t 'zigbee2mqtt/FRIENDLY_NAME/set' -m '{"scene_name_l1":"Movie Time"}'
```

## 🔧 Troubleshooting

### Device Not Pairing

**Solution:**
1. Ensure external converter is properly loaded (check Z2M logs)
2. Reset the device (usually hold button for 10+ seconds)
3. Move device closer to coordinator during pairing
4. Check if pairing mode is enabled in Zigbee2MQTT

### Device Paired But Not Working

**Solution:**
1. Check if correct converter is loaded:
   ```bash
   # Check Zigbee2MQTT logs for:
   # "Loaded external converter for 'MODEL_NAME'"
   ```
2. Verify device model ID matches fingerprint in converter
3. Remove device and re-pair
4. Check MQTT messages: `zigbee2mqtt/FRIENDLY_NAME/#`

### Converter Not Loading

**Symptoms:** Error in logs: "Failed to load external converter"

**Solution:**
1. Verify file permissions (should be readable)
2. Check JavaScript syntax (no errors in .js files)
3. Ensure file path is correct in `configuration.yaml`
4. Full path example:
   ```yaml
   external_converters:
     - /config/zigbee2mqtt/external_converters/2gang_TS0726.js
   ```

### F3-Pro Specific Issues

**Scene buttons not working:**
- Scenes are triggered as actions, not states
- Use Home Assistant automations to capture scene triggers
- Example automation trigger:
  ```yaml
  trigger:
    - platform: mqtt
      topic: zigbee2mqtt/FRIENDLY_NAME
      payload: 'scene_1'
      value_template: '{{ value_json.action }}'
  ```

**LED dimmer not responding:**
- Ensure LED switch is turned ON first
- Brightness and color temperature only work when LED is on
- Valid ranges: brightness (1-100), color temp (1-100)

**Curtain position not accurate:**
- Calibrate curtain motors through their native controls first
- Position is percentage: 0% = closed, 100% = fully open
- Use "stop" command if position overshoots

### Checking Logs

**Zigbee2MQTT logs:**
```bash
# Via Home Assistant
Settings → Add-ons → Zigbee2MQTT → Log

# Via command line
docker logs addon_core_zigbee2mqtt -f
```

**MQTT debugging:**
```bash
# Subscribe to all device messages
mosquitto_sub -t 'zigbee2mqtt/#' -v

# Subscribe to specific device
mosquitto_sub -t 'zigbee2mqtt/FRIENDLY_NAME/#' -v
```

## 🤝 Contributing

Contributions are welcome! If you have:
- Additional device support to add
- Improvements to existing converters
- Bug fixes
- Documentation enhancements

**Please:**
1. Fork this repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request with clear description

### Adding New Devices

When contributing new device converters:
1. Follow Zigbee2MQTT converter conventions
2. Include device model ID in fingerprint
3. Test all features (on/off, scenes, special functions)
4. Document supported features in README
5. Provide device purchase link if possible

## 📚 Resources

### Official Documentation
- [Zigbee2MQTT Documentation](https://www.zigbee2mqtt.io/)
- [External Converters Guide](https://www.zigbee2mqtt.io/advanced/support-new-devices/01_support_new_devices.html)
- [Home Assistant Zigbee2MQTT Integration](https://www.home-assistant.io/integrations/mqtt/)

### Converter Development
- [Zigbee Herdsman Converters](https://github.com/Koenkk/zigbee-herdsman-converters)
- [Converter Template](https://github.com/Koenkk/zigbee-herdsman-converters/blob/master/TEMPLATE.md)
- [Tuya Device Support](https://www.zigbee2mqtt.io/advanced/support-new-devices/03_find_tuya_data_points.html)

### Community Support
- [Zigbee2MQTT Discussions](https://github.com/Koenkk/zigbee2mqtt/discussions)
- [Home Assistant Community](https://community.home-assistant.io/c/configuration/zigbee2mqtt/)

### Device Purchase Links
- [Tuya TS0726 Switches on AliExpress](https://www.aliexpress.com/)
- [Tuya F3-Pro Panel](https://www.aliexpress.com/)

## ⚠️ Disclaimer

These external converters are provided as-is without warranty. While tested with specific device models, behavior may vary with different firmware versions or hardware revisions. Always test in a non-critical environment first.

## 📝 License

MIT License - Feel free to use and modify for your needs.

## 🙏 Acknowledgments

- **Zigbee2MQTT Team** - For the excellent Zigbee gateway software
- **Koenkk** - For zigbee-herdsman-converters library
- **Home Assistant Community** - For continuous support and testing
- **Tuya** - For manufacturing affordable Zigbee devices

---

**Maintained by:** [ajnetworksa](https://github.com/ajnetworksa)  
**Last Updated:** February 2026

If you find this helpful, please ⭐ star this repository!
