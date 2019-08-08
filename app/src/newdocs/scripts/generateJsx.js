/* eslint-disable */

// generateJsx Script:
// Creates jsx files that contain a default export of a help object, 
// imbued with extra information from canvasModuleRawData, regarding inputs, outputs, params.
// imports moduleDescription from an expected md sister file with the same filename.
// Script should be run in a node env. with dependencies installed.

// Followon steps:
// "moduleDescription" needs to be replaced with moduledescription,
// httpRequest-1001 in canvasModuleHelpData is malformed, needs to be manually fixed.
// run -> npx eslint --fix src/newdocs/content/canvasModules/*.jsx to fix the linting issues after import.

var html2md = require('html-markdown')
var writeFile = require('write-file')

var jsonhelp = require('./canvasModuleHelpData.json')
var jsonhelpExtra = require('./canvasModuleRawData.json')

jsonhelp.forEach((m) => {
    jsonhelpExtra.forEach((mExtra) => {
        if (m.id === mExtra.id) {
            m.inputs = mExtra.inputs
            m.outputs = mExtra.outputs
            m.params = mExtra.params
        }
    })
    let name = m.name.replace(/\s/g,'').replace(/\(/g,"_").replace(/\)/g,"")

    m.help.helpText = `moduleDescription`

    return (writeFile(`./mdFiles/${name}-${m.id}.jsx`,
`/* eslint-disable max-len */
import moduleDescription from './${name}-${m.id}.md'

export default ${JSON.stringify(m || {}, null, 2)}
`, function (err) {
        if (err) return console.log(err)
    })
    )
})