import React from "react";
import { DrugInfo } from "../../../models/types/DrugInfo";

const MedicationInfoList = ({
  infoType,
  headerText,
  medicationInfo,
}: DrugInfo) => {
  const getClassName = (lineType: number) => {
    switch (lineType) {
      case 1:
        return "med-info-header bold";
      case 2:
        return "med-info-subheader bold small";
      case 3:
        return "med-info-item";
      default:
        return "";
    }
  };
  return (
    <div>
      <h3 className="section-title">{headerText}</h3>
      <ul data-testid={`drugInfo-${headerText}`} className="med-info-list">
        {medicationInfo?.drugInfo?.map((info: IDrugInfo, index: number) => {
          if (info?.infoType === infoType) {
            const className = getClassName(info?.lineType);
            if (className !== "") {
              return (
                <li
                  key={`med-info-${index}-${info.infoType}`}
                  className={className}
                >
                  {info?.lineText}
                </li>
              );
            }
          }
        })}
      </ul>
    </div>
  );
};

export default MedicationInfoList;
