import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { generateNumber } from "@utils/generatorNumber";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useToggle } from "../../hooks/useToggle";
import BamInput from "./BamInput";
import UnstyledInputBasic from "./CustomInput";

const AppFormCreateRoom = ({ handleNext }) => {
  const schema = yup.object().shape({
    roomName: yup.string().required(),
    roomId: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    roomName: string;
    roomId: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      roomName: "",
      roomId: "",
    },
    mode: "onChange",
  });

  const [isLoading, toggle, onClose] = useToggle();
  const onSubmit = (formValues) => {
    console.log({ formValues });
    handleNext();
  };

  console.log({ errors });

  return (
    <Box
      sx={{
        color: "white",
        margin: "0 auto",
        width: 400,
        background: "#001E3C",
        borderRadius: 5,
        padding: 5,
      }}
    >
      <Typography variant="subtitle1" textAlign={"center"}>
        Information in room
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BamInput
          control={control}
          label="Room name"
          name="roomName"
          rules={{ required: true }}
          error={errors.roomName}
          autoFocus={true}
        />

        <BamInput
          control={control}
          label="Id Room"
          name="roomId"
          type="text"
          rules={{ required: true }}
          error={errors.roomId}
          autoFocus={true}
        />

        <Box textAlign={"center"} mt={3}>
          <Button
            startIcon={
              isLoading && <CircularProgress size={20} color="secondary" />
            }
            disabled={isLoading}
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Next Step
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const AppFormAddWhitelist = ({ handleNext, handleBack }) => {
  const schema = yup.object().shape({
    email: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    email: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const [isLoading, toggle, onClose] = useToggle();
  const onSubmit = (formValues) => {
    console.log({ formValues });
    handleNext();
  };

  console.log({ errors });

  return (
    <Box
      sx={{
        color: "white",
        margin: "0 auto",
        width: 400,
        background: "#001E3C",
        borderRadius: 5,
        padding: 5,
      }}
    >
      <Typography variant="subtitle1" textAlign={"center"}>
        Add whitelist
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BamInput
          control={control}
          label="Email"
          name="email"
          type="text"
          rules={{ required: true }}
          error={errors.email}
          autoFocus={true}
        />

        <Box display={"flex"} gap={3} textAlign={"center"} mt={3}>
          <Button
            startIcon={
              isLoading && <CircularProgress size={20} color="secondary" />
            }
            variant="contained"
            type="submit"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            startIcon={
              isLoading && <CircularProgress size={20} color="secondary" />
            }
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const AppFormGeneratorPrivateCode = () => {
  const schema = yup.object().shape({
    email: yup.string().required(),
    // .test(
    //   "email",
    //   "List email match abc@gmail.com, cde@gmail.com",
    //   (value) => {
    //     return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    //   }
    // ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<{
    email: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const [dataGenerate, setDataGenerate] = useState<any>([]);
  const [isLoading, toggle, onClose] = useToggle();
  const onSubmit = (formValues) => {
    const emailList = formValues.email.split(",");
    const newData = emailList.map((email) => {
      const code = generateNumber(6);
      return {
        email,
        code,
        text: `${email} | ${code}`,
      };
    });
    setDataGenerate(newData);
  };

  return (
    <Box
      sx={{
        color: "white",
        margin: "0 auto",
        width: 400,
        background: "#001E3C",
        borderRadius: 5,
        padding: 5,
      }}
    >
      <Typography variant="subtitle1" textAlign={"center"} pb={1}>
        Add Email to send private code
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <UnstyledInputBasic
          name="email"
          // control={control}
          onChange={(e) => setValue("email", e.target.value)}
        />

        <Typography>{errors.email && errors.email.message}</Typography>

        <Box display={"flex"} gap={3} textAlign={"center"} mt={3}>
          <Button
            startIcon={
              isLoading && <CircularProgress size={20} color="secondary" />
            }
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Generator
          </Button>
        </Box>
        <Box>
          {dataGenerate &&
            dataGenerate.map((item, idx) => (
              <Box key={idx}>
                <Typography>{item.text}</Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

const AppFormHandleRoom = {
  AppFormCreateRoom,
  AppFormAddWhitelist,
  AppFormGeneratorPrivateCode,
};

export default AppFormHandleRoom;
