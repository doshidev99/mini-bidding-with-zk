import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { LocalStorage } from "@utils/newLocalstorage";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
  bidValue: yup.number().required(),
});

const ModalJoinRoom = ({ open, toggle, roomId }) => {
  const [joining, onJoining] = useState(false);
  const router = useRouter();
  const { updateProofId, updateBidData } = useStoreDataRoom();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    code: string;
    email: string;
    bidValue: number;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = (formValues) => {
    onJoining(true);
    const payload = {
      room_id: roomId,
      email: formValues.email,
      private_code: formValues.code,
    };

    Promise.all([
      zkApi.joinRoom(payload),
      zkApi.joinBidding({
        ...payload,
        bid_value: +formValues.bidValue,
      }),
    ])
      .then(async ([proofId, bid_data]) => {
        updateProofId(proofId);
        updateBidData(bid_data);
        const payload = {
          room_id: roomId,
          proof_id: proofId.proof,
          bid_data: {
            inputs: bid_data.inputs,
            proof: bid_data.proof,
          },
          encrypted_data: bid_data.fake_encrypted_data,
        };
        await zkApi.bidding(payload);
        toast.success("Join room and bidding successfully");
        toggle();
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setTimeout(() => {
          onJoining(false);
        }, 2000);
      });
  };
  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box>
          <Box sx={style}>
            <Typography variant="subtitle1">
              Please enter private code to join the room:
              {roomId}
            </Typography>
            <BamInput
              control={control}
              label="Email"
              name="email"
              placeholder="Enter your email"
              rules={{ required: true }}
              error={errors.email}
              autoFocus={true}
            />

            <BamInput
              control={control}
              label="Value bid"
              name="bidValue"
              placeholder="Enter your value bid"
              rules={{ required: true }}
              error={errors.bidValue}
              autoFocus={true}
            />
            <BamInput
              control={control}
              label="Code"
              name="code"
              placeholder="Enter code"
              rules={{ required: true }}
              error={errors.code}
              autoFocus={true}
            />

            <Box textAlign={"center"} mt={3}>
              <Button
                startIcon={
                  joining && <CircularProgress size={20} color="secondary" />
                }
                variant="contained"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Bid
              </Button>
            </Box>
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

export default ModalJoinRoom;
