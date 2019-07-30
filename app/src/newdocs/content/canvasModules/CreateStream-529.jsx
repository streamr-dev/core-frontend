/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './CreateStream-529.mdx'

export default {
  "id": 529,
  "name": "CreateStream",
  "path": "Streams",
  "help": {
    "params": {
      "fields": "the fields to be assigned to the stream"
    },
    "paramNames": [
      "fields"
    ],
    "inputs": {
      "name": "name of the stream",
      "description": "human-readable description"
    },
    "inputNames": [
      "name",
      "description"
    ],
    "outputs": {
      "created": "true if stream was created, false if failed to create stream",
      "stream": "the id of the created stream"
    },
    "outputNames": [
      "created",
      "stream"
    ],
    "helpText": moduleDescription
  }
}
