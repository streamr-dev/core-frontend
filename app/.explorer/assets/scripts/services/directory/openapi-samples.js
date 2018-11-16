export default {
  title: 'OpenAPI Samples',
  subTitle: 'Test suite',
  home: 'https://github.com/darosh/openapi-samples',
  // base: 'https://darosh.github.io/openapi-samples/index.json',
  base: 'https://github.com/streamr-dev/engine-and-editor/blob/8cc0e1b2ccd43e601d4af46e2bd08d39f2e3ae0e/web-app/misc/swagger.json',
  transform (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].key = (i + 1).toString() + (data[i].note ? ': ' + data[i].note : '')
    }

    return {apis: data}
  }
}
