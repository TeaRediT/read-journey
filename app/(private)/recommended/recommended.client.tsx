"use client";

import { Dashboard } from "@/components/Dashboard/DashBoard";
import { Filters } from "@/components/Recommended/Filters/Filters";
import { Quote } from "@/components/Recommended/Quote";
import RecommendedBooks from "@/components/Recommended/RecommendedBooks/RecommendedBooks";
import { WorkoutInfo } from "@/components/Recommended/WorkoutInfo";
import { useState } from "react";

const RecommendedClient = () => {
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);
  const [author, setAuthor] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <>
      <Dashboard>
        <Filters setAuthor={setAuthor} setTitle={setTitle} setPage={setPage} />
        <WorkoutInfo />
        <Quote />
      </Dashboard>
      <RecommendedBooks
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        title={title}
        author={author}
      />
    </>
  );
};

export default RecommendedClient;
