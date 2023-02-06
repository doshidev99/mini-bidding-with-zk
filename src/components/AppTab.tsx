import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";

export default function AppTab({ firstComponent, secondComponent }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderComponent = () => {
    if (value === 0) {
      return firstComponent;
    }
    return secondComponent;
  };
  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        <Tab label="All Rooms" />
        <Tab label="My Room" />
      </Tabs>
      {renderComponent()}
    </>
  );
}
