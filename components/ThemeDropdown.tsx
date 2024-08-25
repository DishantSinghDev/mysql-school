import React from "react";
import Select, { SingleValue } from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../constants/customStyles";

// Define the types for the options
interface ThemeOption {
  label: string;
  value: string;
}

interface ThemeDropdownProps {
  handleThemeChange: (selectedOption: SingleValue<ThemeOption>) => void;
  theme: string;
}

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ handleThemeChange, theme }) => {
  // Transform monacoThemes into the appropriate format for react-select options
  const options: ThemeOption[] = Object.entries(monacoThemes).map(([themeId, themeName]) => ({
    label: themeName,
    value: themeId,
  }));

  // Find the selected theme object
  const selectedTheme = options.find(option => option.value === theme) || null;

  return (
    <Select
      placeholder="Select Theme"
      options={options}
      value={selectedTheme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropdown;
