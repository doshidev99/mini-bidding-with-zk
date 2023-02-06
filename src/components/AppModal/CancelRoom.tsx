import { zkApi } from "@api/zkApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useDetailInRoom } from "@services/roomService";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({});

const CancelRoom = ({ open, toggle }) => {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useDetailInRoom();

  const { handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (formValues) => {
    try {
      setIsLoading(true);

      await zkApi.cancelRoom({
        room_id: +query.id,
      });

      toast.success("Room cancel successfully");
      refetch();
      toggle();
    } catch (e) {
      toast.error(e.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box sx={style}>
          <Typography textAlign={"center"} pb={2} variant="subtitle1">
            You are about to cancel this room. Are you sure?
          </Typography>

          <Box pt={2} textAlign="right">
            <Button
              variant="outlined"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              <Typography>Yes</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
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

export default CancelRoom;
