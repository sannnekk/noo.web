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
              <auth-titles :mode="authStore.mode" />
            </div>
            <div class="index-auth-view__auth-form">
              <auth-form
                v-model:auth-credentials="authStore.loginCredentials"
                v-model:register-credentials="authStore.registerCredentials"
                v-model:forgot-password-credentials="
                  authStore.forgotPasswordCredentials
                "
                v-model:mode="authStore.mode"
                :error="authStore.error"
                :is-loading="authStore.isLoading"
                @login="authStore.login()"
                @register="authStore.register()"
                @forgot-password="authStore.forgotPassword()"
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
import { useAuthStore } from '../stores/auth'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()

authStore.verify()
</script>

<style lang="sass" scoped>
.index-auth-view
  &__auth-icon-space
    height: 100vh

    @media screen and (max-width: 768px)
      height: 50vh
      overflow: hidden
      margin-bottom: 3em

  &__auth-rights
    position: absolute
    bottom: 1em
    width: 100%
    left: 50%
    transform: translateX(-50%)

  aside
    overflow-y: hidden
    position: relative
    padding-top: 30px
    background-color: var(--primary)
    height: 100vh
    padding: 2rem
    margin-right: -15px

    @media screen and (max-width: 768px)
      height: unset
      overflow: hidden
      margin-right: -15px
      margin-left: -15px
      width: calc(100% + 30px)
</style>
