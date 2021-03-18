<template>
  <v-container fluid class="home">
    <v-row>
      <v-col>
        <v-data-table
          v-if="packages.length"
          :headers="headers"
          :items="packages"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          class="elevation-1"
          @click:row="getPackage"
        />
        <div
          v-else
          class="home-empty"
        >
          <div class="d-flex align-start">
            <v-icon class="home-empty-icon">
              mdi-cursor-text
            </v-icon>
            <div class="d-flex flex-column">
              <h3 class="text-h3 font-weight-light">Результатов нет</h3>
              <p class="text-subtitle-1 font-weight-light">
                Введите название искомого пакета<br>
                в поисковую строку
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="packageDialog"
      max-width="900"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
          dense
        >
          {{ getName }}
          <v-spacer/>
          <v-btn
            v-for="(v, i) in getHomeButtons"
            :key="getName + i"
            class="mr-2"
            small
            :href="v.link"
            target="_blank"
          >{{ v.name }}</v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <!-- Версии -->
            <v-col
              v-if="versions"
              cols="12"
              md="2"
            >
              <v-list dense>
                <v-subheader>Версии</v-subheader>
                <v-list-item-group
                  class="home-package-versions"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in versions"
                    :key="'ver' + getName + i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              class="home-package-info"
              cols="12"
              :md="versions.length ? 10 : 12"
            >
              <!-- Описание -->
              <p class="mb-2">{{ packageData ? packageData.description : '' }}</p>

              <!-- Maintainers -->
              <p class="mb-2">
                <strong>Maintainers:</strong><br>
                <code>
                  {{ getMaintainers }}
                </code>
              </p>
              <!-- Publisher -->
              <p class="mb-2">
                <strong>Publisher:</strong><br>
                <code>
                  {{ getPublisher }}
                </code>
              </p>

              <!-- Теги -->
              <div class="d-flex flex-wrap">
                <v-chip
                  v-for="(tag, i) in getTags"
                  :key="getName + tag + i"
                  class="mr-2 mb-2"
                  small
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="closeDialog"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      loading: false,
      options: {},
      headers: [
        { text: 'Название', align: 'start', sortable: false, value: 'package.name' },
        { text: 'Описание', align: 'start', sortable: false, value: 'package.description' },
        { text: 'Автор', align: 'end', sortable: false, value: 'package.author.name' }
      ],
      packageData: null,
      packageDialog: false,
      versions: []
    }
  },
  created () {
    this.$bus.$on('reset-options', this.resetOptions)
  },
  watch: {
    options: {
      handler () {
        this.getDataFromApi()
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      packages: 'packages',
      searchInput: 'searchInput',
      total: 'total'
    }),
    getHomeButtons () {
      let buttons = []

      if (this.packageData && this.packageData.links) {
        buttons = Object.keys(this.packageData.links).map(key => {
          return {
            name: key,
            link: this.packageData.links[key]
          }
        })
      }

      return buttons
    },
    getName () {
      return this.packageData ? this.packageData.name : ''
    },
    getTags () {
      return this.packageData ? this.packageData.keywords : []
    },
    getMaintainers () {
      return this.packageData ? this.packageData.maintainers : []
    },
    getPublisher () {
      return this.packageData ? this.packageData.publisher : ''
    }
  },
  methods: {
    getDataFromApi () {
      this.loading = true
      this.$store.dispatch('api/searchPackages', {
        text: this.searchInput,
        from: (this.options.page - 1) * this.options.itemsPerPage,
        size: this.options.itemsPerPage
      })
        .finally(() => {
          this.loading = false
        })
    },
    async getPackage (item) {
      this.loading = true
      this.packageData = item.package

      try {
        const versions = await this.$store.dispatch('api/fetchVersions', item.package.name)
        this.versions = versions.data.versions
      } catch (error) {
        console.log(error)
      }

      this.packageDialog = true
      this.loading = false
    },
    resetOptions () {
      this.options.itemsPerPage = 10
    },
    closeDialog () {
      this.packageData = null
      this.packageDialog = false
    }
  }
}
</script>

<style lang="less">
.home {
  display: flex;

  &-empty {
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;

    .v-icon { font-size: 100px; }

    .text-subtitle-1 {
      padding-left: 2px;
    }
  }

  &-package {
    &-badge {
      height: 100%;
      display: flex;
      align-items: center;
    }

    &-versions {
      max-height: 200px;
      overflow-y: auto;
    }

    &-info {
      padding-top: 28px;
    }
  }

  .v-data-table {
    tbody {
      tr {
        cursor: pointer;
      }
    }
  }
}
</style>
