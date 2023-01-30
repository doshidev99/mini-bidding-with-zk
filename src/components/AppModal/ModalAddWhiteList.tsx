import { zkApi } from "@api/zkApi";
import AppInputSelect from "@components/Form/AppInputSelect";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useDetailInRoom, useRoomService } from "@services/roomService";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const ModalAddWhiteList = ({ open, toggle }) => {
  const { data: roomList, isLoading } = useRoomService();
  const [submitting, onSubmitting] = useState(false);
  const { updateDetailRoom } = useStoreDataRoom();
  const { refetch } = useDetailInRoom();

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
      refetch();
      toast.success("Import whitelist success");
      const _data = await zkApi.getRoomById(formValues.roomId);
      updateDetailRoom(_data);
    } catch (e) {
      console.log(e);
    } finally {
      onSubmitting(false);
      toggle();
    }
  };

  const onChange = (value) => {
    setValue("roomId", value);
  };

  const optionRoomList = roomList
    ?.filter((r) => r.tree_id == 0)
    ?.map((room) => ({
      value: room.id,
      label: room.name + "room ID: " + room.id,
    }));

  if (isLoading) return <CircularProgress />;

  return (
    <Modal
      open={open}
      onClose={toggle}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
            <Box
              key={index}
              display="flex"
              alignItems={"center"}
              gap={2}
              pt={2}
            >
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
              +
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
              Add to whitelist
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#fff",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};
export default ModalAddWhiteList;
