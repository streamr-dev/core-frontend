/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './UnivariateLinearRegression-51.mdx'

export default {
  "id": 51,
  "name": "UnivariateLinearRegression",
  "path": "Time Series: Statistics",
  "help": {
    "outputNames": [
      "slope",
      "intercept",
      "error",
      "R^2"
    ],
    "inputs": {
      "inX": "Input X values",
      "inY": "Input Y values"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "inX",
      "inY"
    ],
    "params": {
      "windowLength": "Length of the sliding window as number of samples"
    },
    "outputs": {
      "error": "Mean square error (MSE) of the fit",
      "intercept": "Intercept of the linear fit",
      "slope": "Slope of the linear fit",
      "R^2": "R-squared value of the fit"
    },
    "paramNames": [
      "windowLength"
    ]
  }
}
