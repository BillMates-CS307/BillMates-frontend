import getConfig from 'next/config'

interface RuntimeConfig {
  HOST: string
  PRODUCTION: string
  IS_TEST_ENV: string
}

export function getRuntimeConfig(): RuntimeConfig {
  const runtimeConfig = getConfig()?.publicRuntimeConfig
  if (runtimeConfig) {
    return runtimeConfig
  }
  // runtimeConfig for storybook, etc.
  return {
    HOST: 'https://us-central1-tada-crm.cloudfunctions.net',
    PRODUCTION: 'false',
    IS_TEST_ENV: 'true',
  }
}
