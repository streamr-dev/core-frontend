<template lang="pug">
  div
    v-text-field(spellcheck="false" v-model="value", :label="item.name + '' + textType", hint="!!item._.description" v-markdown.hint="item._", :required="item.required" persistent-hint v-if="!item.enum && (type === 'string')")
    v-text-field(spellcheck="false" v-model="value", :label="item.name + '' + textType", hint="!!item._.description" v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="!item.enum && (type === 'number')" type="number")
    v-text-field(class="requestbody" spellcheck="false" v-model="value", :label="item.name + '' + textType", hint="!!item._.description" v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="!type && item.schema" multi-line :rows="5")
    v-text-field(:id="uniqueId" @click="saveFileUploadId($event)" spellcheck="false" v-model="value", :label="item.name + '' + textType", hint="!!item._.description" v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="type === 'file'" type="file")
    <!--TODO: Switch to primary checkbox colors in multiple select-->
    v-select(spellcheck="false" v-model="value", :label="item.name + '' + textType", hint=" " v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="(type === 'array')", :items="item.items.enum" multiple)
    v-select(spellcheck="false" v-model="value", :label="item.name + '' + textType", hint=" " v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="(type === 'boolean')", :items="booleanOptions")
    v-select(spellcheck="false" v-model="value", :label="item.name + '' + textType", hint=" " v-markdown.hint="item._", :required="item.required" persistent-hint v-else-if="item.enum", :items="item.enum")
    div(v-else) {{item}}
</template>

<script>
  import { mapMutations } from 'vuex'
  import * as types from '../../../store/types'
  import { type } from '../../../assets/scripts/specification/methods/schema'
  import markdown from '../../directives/markdown'

  export default {
    props: ['item'],
    directives: {markdown},
    computed: {
      uniqueId () {
        return `file-upload-${Math.random().toString(36).substring(7)}`
      },
      booleanOptions () {
        return [
          'true',
          'false',
          ''
        ]
      },
      type () {
        return type(this.item)
      },
      textType () {
        return type(this.item) ? ' (' + type(this.item) + ')' : ''
      },
      value: {
        get () {
          return this.item._._value
        },
        set (value) {
          this.SPEC_SET_VALUE({item: this.item, value: value})
        }
      }
    },
    methods: {
      ...mapMutations([
        types.SPEC_SET_VALUE
      ]),
      saveFileUploadId (e) {
        window.streamrFileUploadId = e.currentTarget.id
      }
    }
  }
</script>

<style scoped lang="stylus">
  input[type="file"]
    opacity 0
</style>
