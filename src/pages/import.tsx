import React from "react";
import AppFormHandleRoom from "@components/Form/AppFormHandleRoom";

interface ImportProps {}

const Import: React.FC = (props: ImportProps) => {
  return (
    <div>
      <AppFormHandleRoom.AppFormGeneratorPrivateCode />
    </div>
  );
};
export default Import;
