import Select, { components } from "react-select";
import React from "react";

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    onChange,
    selectedOption,
}) => {
    const customOption = (props: any) => (
        <components.Option {...props}>
            {props.data.label}{" "}
            {props.data.isActive ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    Active
                </span>
            ) : (
                ""
            )}
        </components.Option>
    );

    const CustomSingleValue = (props: any) => (
        <components.SingleValue
            {...props}
            className="flex items-center justify-between"
        >
            {props.data.label}{" "}
            {props.data.isActive ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    Active
                </span>
            ) : (
                ""
            )}
        </components.SingleValue>
    );

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={(selectedOption) => onChange(selectedOption?.value || "")}
            components={{
                Option: customOption,
                SingleValue: CustomSingleValue,
            }}
            className="rounded p-2"
        />
    );
};

export default CustomSelect;
