"use client";
import { ReactIcons } from "@/public";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import { useCurrentTenantInfoStore } from "@/store/zustandStore";
import { useEffect, useState } from "react";

const Timeline = () => {
  const currentStepFromStore = useCurrentTenantInfoStore(
    (state) => state.currentStep,
  );
  const timelineDataFromStore = useCurrentTenantInfoStore(
    (state) => state.currentTenantInfo,
  );
  const [currentStep, setCurrentStep] = useState(currentStepFromStore);
  const [timelineData, setTimelineData] = useState(timelineDataFromStore);

  useEffect(() => {
    setCurrentStep(currentStepFromStore);
  }, [currentStepFromStore]);

  useEffect(() => {
    setTimelineData(timelineDataFromStore);
  }, [timelineDataFromStore]);

  const handleStepsClick = (id: number) => {
    if (id > 0) {
      useCurrentTenantInfoStore.getState().setCurrentStep(id);
      setCurrentStep(id);
    }
  };

  // const array = [
  //   {
  //     id: 1,
  //     label: "Tenant Info",
  //     status: TenantStatusEnum.completed,
  //   },
  //   {
  //     id: 2,
  //     label: "File Configs",
  //     status: TenantStatusEnum.ongoing,
  //   },
  //   {
  //     id: 3,
  //     label: "Theme",
  //     status: TenantStatusEnum.pending,
  //   },
  //   {
  //     id: 4,
  //     label: "Font Embeding",
  //     status: TenantStatusEnum.pending,
  //   },
  //   {
  //     id: 5,
  //     label: "Icon Generator",
  //     status: TenantStatusEnum.pending,
  //   },
  // ];

  return (
    <div className="flex items-center justify-center h-full bg-background px-2 py-0.5 w-[50vw] md:w-full rounded-2xl grow gap-2 md:gap-4 duration-400 scrollbar-hide overflow-x-auto">
      {timelineData?.steps?.map((item, index) => {
        return (
          <div
            className="flex items-center grow gap-2 md:gap-4 duration-400 scrollbar-hide"
            key={`${item.id}-${index}`}
          >
            <div
              onClick={() => handleStepsClick(item.id)}
              className="flex justify-center items-center gap-1.5 cursor-pointer duration-400"
            >
              {item.status == TenantStatusEnum.completed ? (
                <span className="size-5 rounded-full text-xs inline-grid place-content-center font-semibold text-success duration-400">
                  <ReactIcons.TickCircle size={20} />
                </span>
              ) : (
                <span
                  className={`${
                    item.id == currentStep
                      ? "border-secondary text-secondary"
                      : "border-surface "
                  } size-5 rounded-full text-xs border-2 inline-grid place-content-center font-semibold text-outline duration-400`}
                >
                  {item.id}
                </span>
              )}
              {
                <span
                  className={`${
                    item.status == TenantStatusEnum.completed
                      ? "text-success"
                      : item.id == currentStep
                        ? "text-secondary"
                        : "text-outline"
                  } font-semibold text-xs duration-400 text-nowrap`}
                >
                  {item.label}
                </span>
              }
            </div>
            {timelineData.steps && index < timelineData.steps.length! - 1 && (
              <span
                className={`grow h-0.5 min-w-8 rounded-full max-md:hidden duration-400 ${
                  item.status == TenantStatusEnum.completed
                    ? " bg-success "
                    : "bg-surface"
                }`}
              ></span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
