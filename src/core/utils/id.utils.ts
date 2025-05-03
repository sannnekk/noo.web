import _ from 'lodash'

function uid(): string {
  return _.uniqueId()
}

export { uid }
