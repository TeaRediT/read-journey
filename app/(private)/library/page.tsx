import Container from "@/components/common/Container/Container";
import { Dashboard } from "@/components/Dashboard/DashBoard";
import { AddBook } from "@/components/Library/AddBook/AddBook";
import { MyLibraryBooks } from "@/components/Library/MyLibraryBooks";
import { RecommendedWidget } from "@/components/Library/RecommendedWidget";

const Library = () => {
  return (
    <main>
      <Container>
        <div className="flex flex-col ds:flex-row ds:justify-between ds:pt-4 ds:pb-6.75">
          <Dashboard className="ds:justify-between ds:gap-0">
            <AddBook />
            <RecommendedWidget />
          </Dashboard>

          <MyLibraryBooks />
        </div>
      </Container>
    </main>
  );
};

export default Library;
