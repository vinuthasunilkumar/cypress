export // Custom styles for Async Paginate Control
    const customStyles = {
        menuOptStyle: (provided: any) => ({
            ...provided,
            overflowY: "auto",
            maxHeight: "400px",
        }),
        control: (provided: any, state: { isFocused: any }) => ({
            ...provided,
            borderRadius: "5px",
            border: "2px solid #ccc",
            boxShadow: state.isFocused ? "0 0 0 2px #D3E3F8" : null,
        }),
        option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
            ...provided,
            backgroundColor: state.isFocused || state.isSelected
                ? "#D3E3F8"
                :
                null,
            color: state.isFocused ? "black" : null,
        }),
        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)",
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            paddingLeft: 24,
        }),
    };