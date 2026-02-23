<template>
  <calender-view :username="Core.Context.User!.username" />
</template>

<script lang="ts" setup>
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'

setPageTitle('Календарь')
</script>

<style lang="sass" scoped></style>
