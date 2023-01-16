import { zkApi } from "@api/zkApi";
import AppInputSelect from "@components/Form/AppInputSelect";
import BamInput from "@components/Form/BamInput";
import UnstyledInputBasic from "@components/Form/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useRoomService } from "@services/roomService";
import { generateNumber } from "@utils/generatorNumber";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

interface WhitelistProps {}

const Whitelist = (props: WhitelistProps) => {
  const { data: roomList, isLoading } = useRoomService();
  const [submitting, onSubmitting] = useState(false);

  const schema = yup.object().shape({
    store: yup.array().of(
      yup.object().shape({
        user: yup.string().email().required(),
        code: yup.string().required("code is required"),
      })
    ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<{
    roomId: string;
    store: Array<{
      user: string;
      code: string;
    }>;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      roomId: "",
      store: [{ user: "", code: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "store",
    control,
  });

  const onSubmit = async (formValues) => {
    onSubmitting(true);
    const payload = {
      contents: formValues.store,
      room: formValues.roomId,
      name: roomList.find((room) => room.id == formValues.roomId).name,
    };
    try {
      await zkApi.importWhiteList(payload);
      toast.success("Import whitelist success");
    } catch (e) {
      console.log(e);
    } finally {
      onSubmitting(false);
    }
  };

  const onChange = (value) => {
    setValue("roomId", value);
  };

  const optionRoomList = roomList?.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  if (isLoading) return <CircularProgress />;

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
        <AppInputSelect
          options={optionRoomList}
          label="Room Select"
          onChange={onChange}
        />

        {fields.map((_, index) => (
          <Box key={index} display="flex" alignItems={"center"} gap={2} pt={2}>
            <BamInput
              name={`store.${index}.user`}
              control={control}
              placeholder="abc@gmail.com"
              label="User"
              error={errors.store?.[index]?.user}
            />
            <BamInput
              name={`store.${index}.code`}
              control={control}
              label="Code"
              placeholder="1234"
              error={errors.store?.[index]?.code}
            />
          </Box>
        ))}

        <Box pt={2}>
          <Button
            variant="outlined"
            onClick={() =>
              append({
                user: "",
                code: "",
              })
            }
          >
            Add more
          </Button>
        </Box>
        <Box display={"flex"} gap={3} textAlign={"center"} mt={3}>
          <Button
            startIcon={
              submitting && <CircularProgress size={20} color="secondary" />
            }
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default Whitelist;
