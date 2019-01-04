<template lang="pug">
  v-layout.ma-0.toolbar__content(row style="height: 100%")
    //v-btn(v-if="components.edit && !UI_LEFT_DRAWER" icon, @click.stop="UI_SET_LEFT_DRAWER()", :class="searching ? 'hidden-xs-only' : ''")
    //- v-btn(aria-label="Edit specification" v-if="!UI_LEFT_DRAWER" icon, @click.stop="UI_SET_LEFT_DRAWER()", :class="searching ? 'hidden-xs-only' : ''")
    //-   v-icon edit
    a(target="_blank" href='https://www.streamr.com')
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" class="navLogo_logo" data-reactid="11"><path fill="#ff5c00" fill-rule="evenodd" d="M25.0093 1.8487V.6955c0-.3953-.3296-.7135-.7246-.6947-7.7532.3682-13.9665 6.6158-14.279 14.3823.0166.4868.4106.6142.6423.6142h1.1714c.3707 0 .6745-.291.6938-.661.3327-6.3895 5.4596-11.5101 11.8521-11.8341.4876-.0626.644-.329.644-.6535m-10.544 13.1486h1.121c.364 0 .6607-.2836.6872-.6465.3168-4.341 3.798-7.8035 8.1473-8.092.1945-.013.5885-.1585.5885-.6625V4.455c0-.4033-.342-.72-.7446-.6937-5.6266.367-10.126 4.8659-10.4932 10.4917-.0262.4023.2905.7443.6939.7443m10.5439-6.7767v1.1466c0 .4691-.4073.6379-.606.6619-2.2755.2745-4.0807 2.0756-4.3614 4.3489-.0434.352-.3363.6193-.691.6193h-1.1194c-.4082 0-.7332-.3504-.6925-.7566.3545-3.5418 3.1713-6.3581 6.7136-6.7126.4062-.0406.7567.2844.7567.6925zM38.151 24.9738c-.3244 0-.5909-.1564-.6535-.6438-.3241-6.3917-5.4455-11.5178-11.8358-11.8505-.3702-.0192-.6612-.323-.6612-.6937v-1.1713c0-.2316.1274-.6255.6142-.6422 7.7678.3126 14.0161 6.525 14.3845 14.277.0188.395-.2995.7245-.6948.7245H38.151zM25.0005 14.4314c0-.4033.342-.72.7445-.6937 5.6266.3671 10.126 4.8659 10.4932 10.4917.0263.4024-.2905.7444-.6939.7444h-1.1415c-.504 0-.6496-.3939-.6625-.5884-.2885-4.3487-3.7516-7.8294-8.0932-8.1461-.363-.0265-.6466-.3232-.6466-.687v-1.1209zm6.7777 10.5424h-1.1468c-.4692 0-.638-.4073-.662-.6059-.2745-2.2751-2.076-4.0802-4.3495-4.3607-.352-.0435-.6194-.3363-.6194-.6909V18.197c0-.4081.3505-.733.7567-.6925 3.5423.3545 6.359 3.1709 6.7135 6.7127.0407.4061-.2843.7566-.6925.7566zM1.849 14.9943c.3244 0 .5909.1564.6535.6439.3241 6.3916 5.4455 11.5178 11.8358 11.8504.3702.0193.6612.3231.6612.6937v1.1713c0 .2317-.1274.6256-.6142.6422C6.6176 29.6833.3692 23.4709.0008 15.7188c-.0188-.395.2994-.7245.6949-.7245H1.849zm13.1505 10.5424c0 .4033-.342.72-.7445.6938-5.6266-.3673-10.126-4.866-10.4932-10.4917-.0263-.4025.2905-.7445.6939-.7445h1.1415c.504 0 .6496.394.6625.5884.2885 4.3487 3.7516 7.8294 8.0932 8.1462.363.0264.6466.3231.6466.687v1.1208zM8.2218 14.9943h1.1468c.4692 0 .638.4073.662.606.2746 2.275 2.076 4.08 4.3495 4.3607.352.0434.6194.3362.6194.6908v1.1193c0 .4081-.3505.733-.7567.6925-3.5423-.3546-6.359-3.1709-6.7136-6.7127-.0406-.4061.2844-.7566.6926-.7566zm6.7805 23.157c0-.3244.1564-.5909.644-.6535 6.3926-.324 11.5194-5.4446 11.852-11.834.0194-.3702.3232-.6612.6939-.6612h1.1714c.2317 0 .6256.1275.6423.6142-.3125 7.7666-6.5258 14.014-14.279 14.3824-.395.0188-.7246-.2994-.7246-.6948v-1.1531zm10.5439-13.1487c.4033 0 .7201.342.6938.7444-.3671 5.6258-4.8666 10.1246-10.4932 10.4917-.4025.0263-.7445-.2904-.7445-.6937v-1.1414c0-.504.394-.6495.5885-.6624 4.3493-.2885 7.8305-3.751 8.1473-8.092.0265-.363.3232-.6466.6871-.6466h1.121zm-10.544 6.7768v-1.1466c0-.4692.4075-.6379.606-.6619 2.2756-.2745 4.0809-2.0757 4.3614-4.349.0435-.3518.3364-.6193.691-.6193H21.78c.4082 0 .7332.3505.6926.7566-.3545 3.5419-3.1712 6.3582-6.7136 6.7126-.4062.0407-.7567-.2843-.7567-.6924z" data-reactid="12"></path></svg>
    v-menu.menu--api(bottom right :class="searching ? 'hidden-sm-and-down' : ''" style="height: 100%; display: flex")
      v-toolbar-items(slot="activator" style="height: 100%")
        v-btn(flat style="height: 100%; min-width: 0")
          v-toolbar-title(style="margin-left: 0") API
            span.secondary--text(v-if="VIEW_VIEW" style="text-transform: none")
              |  &ndash; {{{1:'Operations', 2: 'Table', 3: 'Schemas', 5: 'Paths'}[VIEW_VIEW]}}
          v-icon arrow_drop_down
      v-list(subheader)
        v-subheader API View

        v-list-tile(@click="VIEW_SET_VIEW(0)")
          v-list-tile-action
            v-icon view_column
          v-list-tile-content
            v-list-tile-title Tags
          v-list-tile-action
            v-icon(v-if="VIEW_VIEW === 0") check

        v-list-tile(@click="VIEW_SET_VIEW(1)")
          v-list-tile-action
            v-icon view_module
          v-list-tile-content
            v-list-tile-title Operations
          v-list-tile-action
            v-icon(v-if="VIEW_VIEW === 1") check

        v-list-tile(@click="VIEW_SET_VIEW(2)")
          v-list-tile-action
            v-icon view_stream
          v-list-tile-content
            v-list-tile-title Table
          v-list-tile-action
            v-icon(v-if="VIEW_VIEW === 2") check

        v-list-tile(@click="VIEW_SET_VIEW(3)")
          v-list-tile-action
            v-icon widgets
          v-list-tile-content
            v-list-tile-title Schemas
          v-list-tile-action
            v-icon(v-if="VIEW_VIEW === 3") check

        v-list-tile(@click="VIEW_SET_VIEW(5)")
          v-list-tile-action
            v-icon file_tree
          v-list-tile-content
            v-list-tile-title Paths
          v-list-tile-action
            v-icon(v-if="VIEW_VIEW === 5") check

    v-spacer(style="flex: 1 0 auto")

    template(v-if="SPEC")
      //- v-btn(aria-label="Search" icon @click.native.stop="searchBegin")
      //-   v-icon search
      div(class="searching", :class="{'searching--closed': !searching}")
        v-text-field(spellcheck="false" id="search" append-icon="close", :append-icon-cb="searchEnd" v-model="search", name="search", label="Search", single-line)
      v-tooltip(bottom)
        v-btn(aria-label="Expand/Collapse" slot="activator", :class="searching ? 'hidden-xs-only' : ''" v-if="VIEW_VIEW === 0" icon @click.native.stop="SPEC_RUN_RESOURCES(!SPEC_TAG_OPENED)")
          v-icon(v-if="SPEC_TAG_OPENED") keyboard_arrow_up
          v-icon(v-else) keyboard_arrow_down
        span Expand/Collapse
      v-menu.hidden-xs-only(bottom left)
        v-tooltip(bottom slot="activator")
          v-btn(aria-label="Switch view" icon slot="activator")
            v-icon visibility
          span Switch view
        app-toolbar-menu(view)

    v-tooltip(bottom)
      v-btn.hidden-xs-only(aria-label="Authorization" slot="activator" v-if="SPEC && SPEC.securityDefinitions && Object.keys(SPEC.securityDefinitions).length" icon @click.native.stop="UI_SET_DIALOG('security')")
        v-icon lock
      span Authorization

    v-menu(v-if="$vuetify.breakpoint.xsOnly || (components.pageStatuses || components.pageHeaders || components.pageMethods || components.github || components.pageAbout || components.pageStats)", :class="searching ? 'hidden-xs-only' : ''" bottom left)
      v-btn(aria-label="Menu" icon slot="activator")
        v-icon more_vert
      app-toolbar-menu(navigation view tools)
</template>

<script>
  import { mapMutations, mapActions, mapGetters } from 'vuex'
  import * as types from '../../store/types'
  import { configuration } from '../../assets/scripts/services/configuration'

  export default {
    components: {
      appToolbarMenu: () => import('./ToolbarMenu')
    },
    data: function () {
      return {
        components: configuration.components,
        searching: false
      }
    },
    computed: {
      ...mapGetters([
        types.APP_HOME,
        types.SPEC_TAG_OPENED,
        types.APP_API_PAGE,
        types.VIEW_DARK,
        types.VIEW_SUMMARY,
        types.VIEW_VIEW,
        types.UI_LEFT_DRAWER,
        types.SETTINGS_URL,
        types.SPEC,
        types.VIEW_VIEW,
        types.APP_PAGE_NAME,
        types.SETTINGS_SEARCH,
        types.VIEW_WIDE,
        types.APP_ROUTED
      ]),
      search: {
        get () {
          return this.searching ? this.SETTINGS_SEARCH : null
        },
        set (value) {
          this.SETTINGS_SET_SEARCH(value)
          this.SPEC_SET_FILTER_RESOURCES(value)
        }
      }
    },
    methods: {
      ...mapMutations([
        types.VIEW_SET_DARK,
        types.VIEW_SET_VIEW,
        types.VIEW_SET_WIDE,
        types.VIEW_SET_SUMMARY,
        types.UI_SET_DIALOG,
        types.SETTINGS_SET_SEARCH,
        types.SPEC_SET_FILTER_RESOURCES,
        types.UI_SET_LEFT_DRAWER
      ]),
      ...mapActions([
        types.SPEC_SET_LOAD_URL,
        types.SPEC_RUN_RESOURCES
      ]),
      searchBegin () {
        this.searching = true

        setTimeout(() => {
          document.getElementById('search').focus()

          if (this.SETTINGS_SEARCH) {
            this.SPEC_SET_FILTER_RESOURCES(this.SETTINGS_SEARCH)
          }
        }, 50)
      },
      searchEnd () {
        this.searching = false

        document.getElementById('search').blur()

        if (this.SETTINGS_SEARCH) {
          this.SPEC_SET_FILTER_RESOURCES(null)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .upper
    text-transform uppercase

  @import '../../node_modules/vuetify/src/stylus/settings/_variables.styl'

  .searching
    overflow hidden
    width 208px
    padding-left 8px
    transition $primary-transition

  .searching--closed
    padding-left 0
    width 0

  .searching > *
    right 8px

  .searching--closed > *
    display none

  .hidden-searching
    @media $display-breakpoints.sm-and-down
      display: none !important

  .toolbar .input-group
    position relative
    top 12px

  .menu--api >>> .menu__activator .btn__content
    padding 0 2px 0 12px
</style>
