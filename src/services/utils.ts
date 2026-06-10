import { runtimeConfig } from '../config/runtime'

function delay<T>(value: T, ms = runtimeConfig.requestDelayMs) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })
}

export { delay }
