import React, { useState, ChangeEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface AutoCompleteOption {
  _id: string;
  htsno: string;
  description: string;
}

interface IHSNCompProps {
  onSelectHSN: (description: string, hsnCode: string) => void;
}

const AutoCompleteComponent: React.FC<IHSNCompProps> = ({ onSelectHSN }) => {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [inputValue, setInputValue] = useState("");

  const fetchOptions = async (input: string) => {
    try {
      const response = await fetch(`/api/hsnAuto?query=${input}`);
      const result = await response.json();

      if (Array.isArray(result)) {
        setOptions(result);
      } else {
        console.error("API response is not an array:", result);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    fetchOptions(newInputValue);
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.description} (${option.htsno})`}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search HSN"
          variant="outlined"
          fullWidth
          onChange={handleInputChange}
          value={inputValue}
          InputLabelProps={{
            shrink: false,
            style: { transform: "translate(14px, 12px) scale(1)" },
          }}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                boxShadow: "0 0 0 2px black",
                borderColor: "transparent",
              },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              borderColor: "lightgray",
            },
            "& .MuiInputBase-input": {
              padding: "8px",
              fontSize: "14px",
              height: "10px",
            },
          }}
        />
      )}
      onChange={(_, selectedOption) => {
        if (selectedOption) {
          onSelectHSN(selectedOption.description, selectedOption.htsno);
        }
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <p>
            {option.description}({option.htsno})
          </p>
        </li>
      )}
    />
  );
};

export default AutoCompleteComponent;
