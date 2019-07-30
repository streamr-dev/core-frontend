/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './GetOrCreateStream-1033.mdx'

export default {
  "id": 1033,
  "name": "GetOrCreateStream",
  "path": "Streams",
  "help": {
    "params": {
      "fields": "the fields to be assigned to the stream if a new stream is created"
    },
    "paramNames": [
      "fields"
    ],
    "inputs": {
      "name": "name of the stream",
      "description": "human-readable description if a new stream is created"
    },
    "inputNames": [
      "name",
      "description"
    ],
    "outputs": {
      "created": "true if stream was created, false if existing stream was found",
      "stream": "the id of the found or created stream"
    },
    "outputNames": [
      "created",
      "stream"
    ],
    "helpText": moduleDescription
  }
}
