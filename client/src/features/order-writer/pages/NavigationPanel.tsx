import React from "react";

type NavigationProps = {
  activeIndex: number;
  nextStep: any;
  prevStep: any;
};

const NavigationPanel = ({
  activeIndex,
  nextStep,
  prevStep,
}: NavigationProps) => {
  const steps: ISteps[] = [
    {
      label: "Order Details",
      isRequired: true,
      isCustomLine: true,
    },
    {
      label: "ICD-10 Diagnosis",
      isRequired: true,
      isCustomLine: true,
    },
    {
      label: "Administration Tasks",
      isRequired: false,
      isCustomLine: true,
    },
    {
      label: "Additional Detail",
      isRequired: false,
      isCustomLine: false,
    },
  ];

  const createIdFromLabel = (label: string, index: number): string => {
    return `navigation-step-${index}-${label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;
  };

  return (
    <div
      className="sticky-top stickynavigation-panel"
      id="stickynavigation-panel"
    >
      <div className="cutom-panel ml-n2">
        <div className="row custom-row">
          {steps.map((step: ISteps, index: number) => {
            return (
              <div key={step.label} className="col-3">
                <div className="row">
                  <div
                    className="col-md-12"
                    onClick={() =>
                      activeIndex < index
                        ? nextStep(index)
                        : activeIndex > index
                        ? prevStep(index)
                        : ""
                    }
                    id={createIdFromLabel(step.label, index)}
                  >
                    <div className="row">
                      <div className="col-2">
                        <div>
                          {activeIndex === index ? (
                            <i className="fa-regular fa-pen-circle navigation"></i>
                          ) : activeIndex < index ? (
                            <i className="fa-regular fa-circle-dashed dashCircle"></i>
                          ) : (
                            <i className="fa-solid fa-circle-check checked"></i>
                          )}
                        </div>
                      </div>
                      <div className="custom-span col-6">
                        <p className={activeIndex === index ? "bold" : ""}>
                          {step.isRequired ? (
                            <span className="required-field"></span>
                          ) : (
                            <></>
                          )}
                          {step.label}
                        </p>
                      </div>
                      {step.isCustomLine ? (
                        <div
                          className={`col-4 ${
                            activeIndex - 1 < index
                              ? " panel-line"
                              : " panel-line-blue"
                          }`}
                        ></div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <hr className="horizontal-line" />
    </div>
  );
};
export default NavigationPanel;
