## Modules Architecture

![NOTE] The ready-to-code template of a module is in the `__template__` folder

The structure is as follows:

```
[module-name in kebab-case]
├── components
│   ├── your-local-component-1.vue
│   ├── your-local-component-2.vue
│   └── ...
├── stores
│   ├── store1.ts
│   └── ...
├── types
│   ├── type1.ts
│   └── ...
├── views
│   ├── index-view.vue
│   ├── another-view-1.vue
│   ├── another-view.vue
│   └── ...
├── index.ts
├── module-root.vue
└── router.ts
```

Every store must have id in the following format: `[your-module-name]-module:[store-name]`

Every module consists of `index.ts` file. Its the main module's file and exports all the module parts to register them in your app automatically, no need to import it anywhere. It has the following structure:

```ts
import router from './router'

export default {
  name: '[your-module-name]',
  router
}
```

The `router.ts` file is just router of your module. It is important to add only one router per module and add all the necessary pages as children to its route, like this:

```ts
import module from './module.vue'
import IndexView from './views/index-view.vue'

export default {
  path: '/[your-module-name]',
  name: '[your-module-name]',
  component: module,
  meta: {
    layout: 'div' // <-- your layout, paneLayout if it is not set
  },
  children: [
    {
      path: '',
      name: '...',
      component: IndexView
    }
  ]
}
```

And the `module-root.vue` file. Its a wrapper for your `router-view` to display the nested routes:

```vue
<template>
  <div class="module-wrapper">
    <router-view></router-view>
  </div>
</template>
```

The directory `components` is only for local components that you are sure don't need to be reused across the app.

![NOTE] If you dont have routes, just dont export them. All the parts are optional except for the `index.ts` file. Everything else is of your choice.
