import React, { memo } from "react";

import { css } from "@emotion/react";
import Head from "next/head";
import { Container, Header } from "semantic-ui-react";

import { TaskList } from "@/components/TaskList";
import { initializeApollo } from "@/graphql/client";
import { CategoriesDocument, TasksDocument, useTasksQuery } from "@/graphql/generated";

export const getServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await Promise.all([
    apolloClient.query({
      query: TasksDocument,
    }),
    apolloClient.query({
      query: CategoriesDocument,
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

const IndexPage = memo(() => {
  const { data, refetch } = useTasksQuery();

  return (
    <div>
      <Head>
        <title>Nest Next TODO Sample</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        css={css`
          padding-top: 20px;
          min-height: 100vh;
        `}
      >
        <Header as="h1">Nest Next TODO Sample</Header>
        <TaskList tasksData={data?.tasks ?? []} refetchTasks={refetch} />
      </Container>
    </div>
  );
});

IndexPage.displayName = "IndexPage";

export default IndexPage;
