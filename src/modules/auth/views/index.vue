<template>
  <div class="index-auth-view">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 col-12">
          <div class="index-auth-view__auth-icon-space">
            <auth-icon-space />
          </div>
        </div>
        <div class="col-md-4 col-12">
          <aside>
            <div class="index-auth-view__auth-titles">
              <auth-titles />
            </div>
            <div class="index-auth-view__auth-form">
              <auth-form
                v-model="credentials"
                @submit="submit()"
              />
            </div>
            <div class="index-auth-view__auth-rights">
              <auth-rights />
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import authIconSpace from '../components/auth-icon-space.vue'
import authTitles from '../components/auth-titles.vue'
import authForm from '../components/auth-form.vue'
import authRights from '../components/auth-rights.vue'
import { reactive } from 'vue'

/* ============= TODO: move it to store ============= */
const credentials = reactive({
  username: '',
  password: ''
})

function submit() {}
/* ============= ENDTODO ============= */
</script>

<style lang="sass" scoped>
.index-auth-view
  &__auth-icon-space
    height: 100vh

  &__auth-rights
    position: absolute
    bottom: 1em
    width: 100%
    left: 50%
    transform: translateX(-50%)

  aside
    position: relative
    padding-top: 30px
    background-color: var(--primary)
    height: 100vh
    padding: 2rem
    margin-right: -15px
</style>
