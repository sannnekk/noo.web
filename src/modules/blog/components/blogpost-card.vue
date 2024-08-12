<template>
  <div class="blogpost-card">
    <div class="blogpost-card__header">
      <div class="blogpost-card__header__title">
        <h2>{{ post.title }}</h2>
      </div>
      <div class="blogpost-card__header__date">
        {{ useDate(post.createdAt, { precision: 'day' }).toBeautiful() }}
      </div>
      <div class="blogpost-card__header__actions">
        <more-widget :items="actions" />
      </div>
    </div>
    <div class="blogpost-card__info">
      <div class="blogpost-card__info__tags">
        <status-tag
          v-for="tag in post.tags"
          :key="tag"
          type="info"
          mode="background"
        >
          #{{ tag }}
        </status-tag>
      </div>
    </div>
    <div class="blogpost-card__content">
      <div class="blogpost-card__content__richtext">
        <rich-text-container :content="sliceTop(post.content)" />
      </div>
      <div class="blogpost-card__content__actions">
        <common-button :to="`/blog/post/${post.id}`">
          Читать далее
        </common-button>
        <common-button
          v-if="canVote()"
          :to="`/poll/${post.pollId}`"
          design="warning"
        >
          Пройти опрос
        </common-button>
      </div>
      <div
        class="blogpost-card__content__poll-count"
        v-if="post.poll"
      >
        <p>{{ post.poll.votedCount || 0 }} человек приняли участие в опросе</p>
      </div>
    </div>
    <div class="blogpost-card__footer">
      <div class="blogpost-card__footer__author">
        <div class="blogpost-card__footer__author__avatar">
          <user-avatar
            :name="post.author.name"
            :telegram-avatar-url="post.author.telegramAvatarUrl"
            :avatar-type="post.author.avatarType"
            :avatar-media="post.author.avatar"
          />
        </div>
        <div class="blogpost-card__footer__author__name">
          <user-link
            :username="post.author.username"
            :name="post.author.name"
          />
        </div>
      </div>
      <div class="blogpost-card__footer__reactions">
        <blogpost-reactions
          :my-reaction="post.myReaction"
          :reactions="post.reactionCounts"
          :loading="isReactionLoading"
          @react="($event) => emits('react', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Core } from '@/core/Core'
import blogpostReactions from './blogpost-reactions.vue'
import { useDate } from '@/composables/useDate'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { reactive } from 'vue'
import { copyText } from '@/core/device/Clipboard'
import { useRouter } from 'vue-router'
import type { MenuItem } from '@/components/widgets/more-widget.vue'

interface Props {
  post: BlogPost
  reaction?: Reaction
  isReactionLoading?: boolean
}

interface Emits {
  (e: 'react', value: Reaction): void
  (e: 'delete', value: BlogPost['id']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()

const actions = reactive<MenuItem[]>([
  {
    title: 'Редактировать',
    icon: 'edit',
    if: Core.Context.roleIs(['teacher', 'admin']),
    action: () => {
      router.push(`/blog/post/create${props.post.id}`)
    }
  },
  {
    title: 'Результаты опроса',
    icon: 'info',
    if: canSeeResults(),
    action: () => {
      router.push(`/poll/${props.post.pollId}/results`)
    }
  },
  {
    title: 'Скопировать ссылку на опрос',
    icon: 'copy',
    if: !!(canSeeResults() && props.post.pollId),
    stayOpened: true,
    action: function (selfRef: any) {
      copyPollLink(selfRef, props.post.pollId!)
    }
  },
  {
    title: 'Удалить пост',
    icon: 'delete',
    if: Core.Context.roleIs(['teacher', 'admin']),
    action: () => {
      onPostDelete()
    }
  }
])

function sliceTop(content: DeltaContentType, length = 5) {
  if (content.ops.length <= length) {
    return content
  }

  const sliced = content.ops
    .slice(0, length)
    .filter((op) => (op.insert as any)?.image === undefined)
  const image = content.ops.find((op) => (op.insert as any)?.image)

  if (image) {
    return {
      ops: [image, ...sliced, { insert: '\n...' }]
    }
  }

  return {
    ops: [...sliced, { insert: '\n...' }]
  }
}

function onPostDelete() {
  emits('delete', props.post.id)
}

function canVote() {
  const role = Core.Context.User?.role

  if (!props.post.poll || !role) {
    return false
  }

  return (
    props.post.poll.canVote.includes(role) ||
    props.post.poll.canVote.includes('everyone')
  )
}

function canSeeResults() {
  const role = Core.Context.User?.role

  if (!props.post.poll || !role) {
    return false
  }

  return (
    props.post.poll.canSeeResults.includes(role) ||
    props.post.poll.canSeeResults.includes('everyone')
  )
}

function copyPollLink(thisRef: any, pollId: string) {
  copyText(`${Core.Constants.POLL_URL}/${pollId}`)

  thisRef.title = 'Скопировано!'
  thisRef.icon = 'check-green'

  setTimeout(() => {
    thisRef.title = 'Скопировать ссылку на опрос'
    thisRef.icon = 'copy'
  }, 2000)
}
</script>

<style lang="sass" scoped>
.blogpost-card
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border-radius: 0.5em
  padding: 1em
  margin-bottom: 1em

  &__header
    padding: 0 0.5em
    display: flex
    align-items: center
    gap: 1em

    &__title
      flex: 1
      overflow: hidden
      text-overflow: ellipsis

    &__date
      font-size: 0.8rem
      color: var(--text-light)

  &__info
    &__tags
      display: flex
      gap: 0.5em
      margin: 0.5em
      flex-wrap: wrap

  &__content
    margin-bottom: 1em

    &__richtext
      margin-bottom: 1em

    &__actions
      display: flex
      flex-wrap: wrap
      gap: 1em
      padding: 0 0.5em
      justify-content: flex-start
      font-size: 0.8em

      > *
        display: block
        width: unset !important

    &__poll-count
      color: var(--text-light)
      padding: 0 0.5em
      font-size: 0.8em
      margin-top: 0.5em

      p
        margin: 0

  &__footer
    padding: 0.5em

    &__author
      display: flex
      align-items: center
      gap: 0.5em
      margin-bottom: 1em

      &__avatar
        font-size: 2em

    &__reactions
      margin-top: 1em
</style>
