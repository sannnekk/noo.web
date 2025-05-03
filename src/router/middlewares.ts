import { useGlobalUIStore } from '@/core/stores/global-ui'
import type { RouteLocationNormalized } from 'vue-router'

function setPageTitleMiddleware(to: RouteLocationNormalized) {
  if (to.meta && to.meta.pageTitle) {
    const globalUiStore = useGlobalUIStore()

    globalUiStore.setPageTitle(to.meta.pageTitle)
  }
}

function setTabTitleMiddleware(to: RouteLocationNormalized) {
  if (to.meta && to.meta.tabTitle) {
    document.title = to.meta.tabTitle
  }
}

export { setPageTitleMiddleware, setTabTitleMiddleware }
