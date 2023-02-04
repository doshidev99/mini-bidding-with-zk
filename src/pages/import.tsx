import React from "react";
import AppFormHandleRoom from "@components/Form/AppFormHandleRoom";
import { useRouter } from "next/router";

interface ImportProps {}

const Import = (props: ImportProps) => {
  const router = useRouter();

  console.log(router, "data");

  return <AppFormHandleRoom.AppFormGeneratorPrivateCode />;
};
export default Import;
