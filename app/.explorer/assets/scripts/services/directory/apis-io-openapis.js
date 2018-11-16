import { configuration } from '../configuration'

export default {
  title: 'APIs.io OpenAPIs',
  subTitle: 'OpenAPI specifications from APIs.io',
  home: 'https://github.com/darosh/apis.io-openapis',
  // base: 'https://darosh.github.io/apis.io-openapis/index.json',
  base: 'https://github.com/streamr-dev/engine-and-editor/blob/8cc0e1b2ccd43e601d4af46e2bd08d39f2e3ae0e/web-app/misc/swagger.json',
  transform (data) {
    const keys = {}

    for (let i = 0; i < data.length; i++) {
      data[i].key = new URL(data[i].url).host

      keys[data[i].key] = keys[data[i].key] || 0
      keys[data[i].key]++

      if (keys[data[i].key] > 1) {
        data[i].key += ':' + keys[data[i].key]
      }

      data[i].url = configuration.proxy + data[i].url
    }

    return {apis: data}
  }
}
