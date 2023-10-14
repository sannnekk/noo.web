<template>
  <div class="index-view">
    <div class="row">
      <div class="col-md-4">
        <div class="course-card">
          <div class="course-card__img">
            <router-link
              class="router-link"
              to="/materials/chemistry"
            >
              <img
                src="https://lh5.googleusercontent.com/ZcBEcelc0i46Hk1Xp1Sns4b6anLG1kxk_BlvcPnR_0OsLP_584ZcwColRqWRR0G7T4__JuHfnuWL4RYFhvqc_Qk7mHtcJfCf0dVXjG5klWL1hqyZNYuIDP47JA704OJRxsYF5cat"
                alt="Chemistry"
              />
            </router-link>
          </div>
          <div class="course-card__title">
            <router-link to="/materials/1">Курс по химии</router-link>
          </div>
          <div class="course-card__author">
            <div class="course-card__author__avatar">
              <user-avatar name="Олекасндр Петрушин" />
            </div>
            <div class="course-card__author__name">
              <router-link to="/users/1">Олександр Петрушин</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="course-card">
          <div class="course-card__img">
            <router-link
              class="router-link"
              to="/materials/chemistry"
            >
              <img
                src="https://api.new.buki.kz/news_image/Va/mX/VamXj9Uu7SwEHpKYIhHuD3cIID0A7Vcx5zPKbQhc.jpg"
                alt="Chemistry"
              />
            </router-link>
          </div>
          <div class="course-card__title">
            <router-link to="/materials/1">Курс по биологии</router-link>
          </div>
          <div class="course-card__author">
            <div class="course-card__author__avatar">
              <user-avatar name="Олекасндр Петрушин" />
            </div>
            <div class="course-card__author__name">
              <router-link to="/users/1">Олександр Петрушин</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
.index-view
  padding: 1rem

.course-card
  border-radius: var(--border-radius)
  border: 1px solid var(--border-color)
  padding: 1rem
  margin-bottom: 1rem
  transition: box-shadow 0.3s ease

  &:hover
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1)

  &__img
    width: 100%
    height: 200px
    overflow: hidden
    border-radius: var(--border-radius)
    margin-bottom: 1rem

    a
      display: block
      text-decoration: none
      width: 100%
      height: 100%

      img
        width: 100%
        height: 100%
        object-fit: cover
        object-position: center

  &__title
    font-size: 1.2rem
    font-weight: bold
    margin-bottom: 0.5rem

    a
      color: var(--text-dark)
      text-decoration: none

      &:hover
        color: var(--secondary)

  &__author
    display: flex
    flex-direction: row
    align-items: center

    &__avatar
      margin-right: 0.5rem

    &__name
      font-size: 0.8rem

      a
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)
</style>
