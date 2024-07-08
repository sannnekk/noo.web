<template>
  <footer class="the-footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="the-footer__logo">
            <h1>
              <img
                src="/img/logo-circled.svg"
                alt="НОО логотип"
              />
              <a href="https://noo-school.ru"> <b>НОО.</b>Платформа </a>
            </h1>
          </div>
        </div>
        <div class="col-md-8">
          <div class="the-footer__links">
            <a
              href="https://no-os.ru"
              target="_blank"
            >
              &copy; {{ new Date().getFullYear() }} НОО-Школа
            </a>
            &bullet;
            <a
              href="https://no-os.ru/confidentiality"
              target="_blank"
            >
              Политика конфиденциальности
            </a>
            &bullet;
            <a
              href="https://no-os.ru/oferta"
              target="_blank"
            >
              Договор публичной оферты
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
.the-footer
	margin-top: 1em

	&__logo
		margin: 0
		padding: 0
		height: 3rem
		display: flex
		justify-content: flex-start
		align-items: center

		h1
			margin: 0
			margin-top: -0.6rem
			padding: 0

		img
			height: 2rem
			margin-right: 0.5rem
			position: relative
			top: 0.6rem

		a
			color: var(--text-light)
			text-decoration: none
			font-size: 1rem
			font-weight: normal
			transition: color 0.2s

			&:hover
				color: var(--lila)

	&__links
		height: 3rem
		display: flex
		justify-content: flex-end
		gap: 0.3rem
		align-items: center
		color: var(--text-light)

		a
			font-size: 0.9rem
			color: var(--text-light)
			text-decoration: none
			transition: color 0.2s

			&:hover
				color: var(--lila)
</style>
