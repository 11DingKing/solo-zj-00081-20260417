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
  });
}

export function initializeApollo(initialState?: NormalizedCacheObject) {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const freshClient = createApolloClient();
    if (initialState) {
      freshClient.cache.restore(initialState);
    }
    return freshClient;
  }

  if (!apolloClient) {
    apolloClient = createApolloClient();
  }

  if (initialState) {
    const existingCache = apolloClient.extract();
    apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  return apolloClient;
}

export function useApollo(initialState?: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
