import { Header, Sidebar } from "@/components/template";
import { LayoutTypes } from "@/services/types";
import ProtectedRoute from "./(protectedProvider)/protectedRoute";

const layout = ({ children }: LayoutTypes) => {
  return (
    <div className="flex gap-5 px-5 xl:px-8 w-full">
      <ProtectedRoute>
        <Sidebar fromLayout={true} />
        <div className="grow flex flex-col h-dvh">
          <Header />
          <main className="flex flex-col grow p-5 bg-background rounded-2xl ">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default layout;
