<template>
  <v-app>
    <div class="view">
      <v-app-bar flat>
        <v-toolbar-title>JSDelivr - package search</v-toolbar-title>
        <v-spacer/>
        <div class="header-search">
          <v-form @submit.prevent="search">
            <v-text-field
              v-model="searchTextInput"
              outlined
              placeholder="Поиск"
            />
          </v-form>
        </div>
      </v-app-bar>

      <router-view/>

      <v-footer
        dark
        padless
      >
        <v-card
          flat
          tile
          class="indigo lighten-1 white--text text-center"
          width="100%"
        >
          <v-card-text>
            <v-btn
              v-for="icon in icons"
              :key="icon.icon"
              :href="icon.link"
              class="mx-4 white--text"
              icon
              target="_blank"
            >
              <v-icon size="24px">
                {{ icon.icon }}
              </v-icon>
            </v-btn>
          </v-card-text>

          <v-card-text class="white--text pt-0">
            Проект создан в рамках тестового задания
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class="white--text">
            <strong>Саитов Альберт</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    searchTextInput: '',
    searchOptions: [],
    searchPageOffset: 0,
    icons: [
      { icon: 'mdi-github', link: 'https://github.com/DiceMasters' },
      { icon: 'mdi-email', link: 'mailto:lidef@yandex.ru' }
    ]
  }),
  watch: {
    searchTextInput (newValue) {
      this.$store.commit('setSearchInput', newValue)

      this.search()
    }
  },
  methods: {
    search () {
      if (this.searchTextInput && this.searchTextInput.length > 1) {
        this.$store.dispatch('api/searchPackages', {
          text: this.searchTextInput,
          from: this.searchPageOffset,
          size: 10
        })
          .then(() => {
            this.$bus.$emit('reset-options')
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="less">
.header {
  &-search {
    width: 400px;
    height: 100%;
  }
}

.view {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
