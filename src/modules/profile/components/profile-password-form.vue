<template>
  <div class="profile-password-form">
    <div class="profile-password-form__header">
      <h3 class="profile-password-form__header__title">Смена пароля</h3>
    </div>
    <div class="profile-password-form__form">
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Старый пароль"
        />
      </div>
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Новый пароль"
        />
      </div>
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Повторите новый пароль"
        />
      </div>
      <div class="profile-password-form__form__field">
        <common-button alignment="center">Сменить пароль</common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
.profile-password-form
  text-align: center

  &__form
    &__field
      margin-bottom: 1em

      input
        text-align: center
</style>
