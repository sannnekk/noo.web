<template>
  <ul class="auth-rights">
    <li>
      <a
        href="https://no-os.ru/confidentiality"
        target="_blank"
        rel="noopener noreferrer"
      >
        Политика конфиденциальности
      </a>
    </li>
    <li>
      <a
        href="https://drive.google.com/file/d/1L1iOZgPN1LPgdjPiD_EE3VFJ2_BRsgYq/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        Договор публичной оферты
      </a>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
.auth-rights
  display: flex
  flex-direction: column
  align-items: center
  gap: 0.25rem
  margin: 0
  padding: 0
  list-style: none
  text-align: center
  font-size: 0.9rem
  font-weight: 500

  a
    color: var(--text-light)
    text-decoration: none

    &:hover
      text-decoration: underline
</style>
