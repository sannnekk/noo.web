import _ from 'lodash'

function deepCopy<T extends {}>(object: T): T {
  return _.cloneDeep(object)
}

function deepMerge<T extends {}, U extends {}>(target: T, source: U): T & U {
  return _.merge(target, source)
}

export { deepCopy, deepMerge }
