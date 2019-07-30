/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './MQTT-1034.mdx'

export default {
  "id": 1034,
  "name": "MQTT",
  "path": "Integrations",
  "help": {
    "params": {
      "URL": "URL of MQTT broker to listen to",
      "topic": "MQTT topic",
      "username": "MQTT username (optional)",
      "password": "MQTT password (optional)",
      "certType": "MQTT certificate type"
    },
    "paramNames": [
      "URL",
      "topic",
      "username",
      "password",
      "certType"
    ],
    "inputs": {},
    "inputNames": [],
    "outputs": {
      "message": "MQTT message string"
    },
    "outputNames": [
      "message"
    ],
    "helpText": moduleDescription
  }
}
