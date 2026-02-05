import { Text, TextVariant } from "@/components/common";
import { Routes } from "@/navigation/routes";
import { DateUtils } from "@/utils/dateUtils/dateUtils";
import Link from "next/link";

const footer = () => {
  const { year } = DateUtils();
  return (
    <footer className=" flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8">
      <div className="container mx-auto flex items-center justify-between flex-auto">
        <Text as="span" variant={TextVariant.bodySm} className="text-outline">
          {`Copyright © ${year} `}
          <Text as="span" className="font-medium">{` Fynancial `}</Text>
          {`All rights reserved.`}
        </Text>
        <div className="text-outline font-noraml">
          <Link className="" href={Routes.noRedirection}>
            Term &amp; Conditions
          </Link>
          <span className="mx-2 "> | </span>
          <Link className="" href={Routes.noRedirection}>
            Privacy &amp; Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default footer;
