/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Regex-201.mdx'

export default {
  "id": 201,
  "name": "Regex",
  "path": "Text",
  "help": {
    "params": {
      "pattern": "Regex pattern"
    },
    "paramNames": [
      "pattern"
    ],
    "inputs": {
      "text": "Text to be analyzed."
    },
    "inputNames": [
      "text"
    ],
    "outputs": {
      "match?": "1 if in the text is something that matches with the pattern. Else 0.",
      "matchCount": "How many matches there are in the text.",
      "matchList": "A list of the matches. An empty list if there aren't any."
    },
    "outputNames": [
      "match?",
      "matchCount",
      "matchList"
    ],
    "helpText": moduleDescription
  }
}
