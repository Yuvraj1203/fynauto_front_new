import { Screen } from "@/components/template";
import ReleaseTable from "./(components)/releaseTable";

const ReleaseTablePage = () => {
  return (
    <Screen
      defaultPadding={false}
      className="bg-background flex flex-col gap-2 lg:gap-4"
    >
      <ReleaseTable />
    </Screen>
  );
};

export default ReleaseTablePage;
