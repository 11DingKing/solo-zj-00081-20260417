import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import getConfig from "next/config";
import { useMemo } from "react";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient() {
  const isServer = typeof window === "undefined";
  const APOLLO_URI = isServer
    ? serverRuntimeConfig.APOLLO_URI
    : publicRuntimeConfig.APOLLO_URI;

  return new ApolloClient({
    ssrMode: isServer,
    uri: `${APOLLO_URI}/graphql`,
    cache: new InMemoryCache(),
    defaultOptions: isServer
      ? {
          watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore",
          },
          query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
          },
        }
      : undefined,
  });
}

export function initializeApollo(initialState?: NormalizedCacheObject) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === "undefined") {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function useApollo(initialState?: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
