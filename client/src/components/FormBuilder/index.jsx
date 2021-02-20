import React from "react";
import Input from "components/Ui/input";

const Forms = (props) => {
  let formDataElementArray = [];

  for (let key in props.formDetails) {
    formDataElementArray.push({
      id: key,
      config: props.formDetails[key],
    });
  }
  let form = (
    <form>
      {formDataElementArray.map((data, index) => {
        return (
          <Input
            key={index}
            inputType={data.config.elementType}
            elementConfig={data.config.elementConfig}
            value={
              props.value[data.config.elementConfig.name] !== undefined
                ? props.value[data.config.elementConfig.name]
                : ""
            }
            changed={props.changed}
            icon={data.config.icon}
            maxLength={data.config.maxLength}
            handelChange={props.handelChange}
            isValid={data.config.isValid}
            errorMessage={data.config.errorMessage}
            handelDateChange={props.handelDateChange}
            selectFiledName={data.config.selectFiledName}
            selectFiledValue={data.config.selectFiledValue}
          />
        );
      })}
    </form>
  );
  return <div>{form}</div>;
};

export default Forms;
