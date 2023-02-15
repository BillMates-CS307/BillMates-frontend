import isUndefined from 'lodash/isUndefined'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getRuntimeConfig } from '@lib/utils/runtimeConfig'
import { createBaseApiSlice } from '@lib/store/__helper__/createApiSlice/base'

const host = getRuntimeConfig().HOST
const baseUrl = `${host}`

export const AUTH_API_METHOD_TYPE = 'POST'
const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: headers => {
    const additionalHeaders = {
      accept: 'application/json',
      'content-type': 'application/json',
    }

    Object.entries(additionalHeaders).forEach(([key, value]) => {
      if (!isUndefined(value)) {
        headers.set(key, value)
      }
    })

    return headers
  },
})

export const createAuthApiSliceReducerPathBy = createBaseApiSlice(baseQuery)
