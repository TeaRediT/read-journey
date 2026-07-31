import Container from "@/components/common/Container/Container";
import RecommendedClient from "./recommended.client";

const Recommended = async () => {
  return (
    <main>
      <Container>
        <h1 className="sr-only">Recommended Books Page</h1>
        <RecommendedClient />
      </Container>
    </main>
  );
};

export default Recommended;
