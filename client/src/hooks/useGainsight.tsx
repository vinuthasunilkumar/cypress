import { useEffect } from "react";
import { HostContext } from "../types";

declare global {
  interface Window {
    aptrinsic: any;
  }
}

let gainsightPXInitialized = false;

const useGainsight = (hostContext: HostContext) => {
  const gainsightPXKey = getGainsightPXKey(hostContext.remoteMfeUrl);

  useEffect(() => {
    if (!gainsightPXInitialized) {
      window.aptrinsic =
        window.aptrinsic ||
        function () {
          (window.aptrinsic.q = window.aptrinsic.q || []).push(arguments);
        };
      window.aptrinsic.p = gainsightPXKey;
      window.aptrinsic("config", {
        espProxyDomain: "https://px-esp.matrixcare.com",
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://web-sdk.aptrinsic.com/api/aptrinsic.js?a=${gainsightPXKey}`;
      script.onload = () => {
        gainsightPXInitialized = true;

        if (typeof window.aptrinsic === "function") {
          const clientName = getClientName(window.location.hostname);

          window.aptrinsic(
            "identify",
            {
              id: hostContext.userId,
              facilityType: hostContext.facilityCareLevel,
              facilityName: hostContext.facilityName,
              facilityState: hostContext.facilityState,
            },
            {
              id: hostContext.parentId,    
              name: clientName,
            }
          );
        } else {
          console.error("Gainsight PX is not initialized properly.");
        }
      };

      script.onerror = (error) => {
        console.error("Error loading Gainsight PX script:", error);
      };

      document.head.appendChild(script);
    }
  }, [hostContext]);

  function getGainsightPXKey(remoteMfeUrl: string): string {
    switch (remoteMfeUrl) {
      case "https://orders.matrixcare.com":
        return "AP-OIEYOW2BIZRA-2";
      case "https://orders-qa.matrixcare.me":
        return "AP-OIEYOW2BIZRA-2-3";
      default:
        return "AP-OIEYOW2BIZRA-2-4"; // Development key
    }
  }

  function getClientName(hostname: string): string {
    if (!hostname) return "";
    if (
      hostname.includes("matrixcare.com") ||
      hostname.includes("mdiachieve.com")
    ) {
      return hostname.split(".")[0];
    }
    return "";
  }
};

export default useGainsight;
