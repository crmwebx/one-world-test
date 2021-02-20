import { useEffect } from "react";

const UseScript = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://test-nbe.gateway.mastercard.com/checkout/version/58/checkout.js";
    script.async = true;
    script.dataError = "errorCallback";
    script.dataCancel = "cancelCallback";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default UseScript;
