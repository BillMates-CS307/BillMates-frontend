import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'

export const createBaseApiSlice =
  (
    baseQuery: BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      Record<string, unknown>,
      FetchBaseQueryMeta
    >
  ) =>
  (reducerPath: string) => createApi({
      reducerPath,
      baseQuery,
      endpoints() {
        return {}
      },
    })
