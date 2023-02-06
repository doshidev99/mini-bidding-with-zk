import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreProfile } from "@store/useStoreProfile";
import { LocalStorage } from "@utils/newLocalstorage";
import { keyBy, keys } from "lodash-es";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
});

const ModalJoinRoom = ({ open, toggle, roomId }: any) => {
  const { query } = useRouter();
  const [joining, onJoining] = useState(false);
  const { updateProofId } = useStoreDataRoom();
  const { profile } = useStoreProfile();
  const { updateDetailInRoom } = useStoreDataInRoom();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<{
    code: string;
    email: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
      email: "",
    },
    mode: "onChange",
  });

  const emailByProfile = useMemo(() => {
    if (profile) {
      setValue("email", profile?.email);
      return profile?.email;
    }
    return "";
  }, [profile, setValue]);

  const room_id = roomId || (query?.id as string);
  const onSubmit = async (formValues) => {
    onJoining(true);
    const payload = {
      room_id: +room_id,
      email: formValues.email,
      private_code: formValues.code,
    };
    try {
      const proofId = await zkApi.joinRoom(payload);

      updateProofId(proofId);
      const dataSaveToStorage = {
        [profile.id + room_id]: {
          proofId,
          payload,
        },
      };

      const viewRoom = await zkApi.viewRoomWithProof({
        room_id: +room_id,
        inputs: proofId.inputs,
        proof: proofId.proof,
      });

      updateDetailInRoom(viewRoom);
      if (viewRoom.status == "open") {
        const myBid = await zkApi.getBiddingUserInRoom(roomId);
        if (myBid) {
          const keyByMyBid = keyBy(myBid, "room_id");
          const isBided = keys(keyByMyBid).includes(roomId + "");
          viewRoom.isBided = isBided;
          updateDetailInRoom({ ...viewRoom });
        }
      }

      LocalStorage.set("proofInRoom", dataSaveToStorage);
      toast.success("Join room successfully");
      toggle();
    } catch (e) {
      toast.error(e.message);
    } finally {
      onJoining(false);
    }

    // Promise.all([
    //   zkApi.joinRoom(payload),
    //   // zkApi.joinBidding({
    //   //   ...payload,
    //   //   bid_value: +formValues.bidValue,
    //   // }),
    // ])
    //   .then(async ([proofId, bid_data]) => {
    //     console.log("proofId", proofId);

    //     // updateBidData(bid_data);
    //     // const payload = {
    //     //   room_id: roomId,
    //     //   proof_id: proofId.proof,
    //     //   bid_data: {
    //     //     inputs: bid_data.inputs,
    //     //     proof: bid_data.proof,
    //     //   },
    //     //   encrypted_data: bid_data.fake_encrypted_data,
    //     // };
    //     // await zkApi.bidding(payload);
    //     toast.success("Join room successfully");
    //     // toggle();
    //   })
    //   .catch((e) => {
    //     toast.error(e.message);
    //   })
    //   .finally(() => {
    //     onJoining(false);
    //   });
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
              value={emailByProfile}
              disabled
              placeholder="Enter your email"
              rules={{ required: true }}
              error={errors.email}
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
                disabled={joining}
                onClick={handleSubmit(onSubmit)}
              >
                Join
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

export const ModalBidding = ({ open, toggle }) => {
  const { query } = useRouter();

  const [isBidding, setIsBidding] = useState(false);
  const { refetch } = useDetailInRoom();
  const { currentRoom, updateDetailInRoom } = useStoreDataInRoom();
  const { profile } = useStoreProfile();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    bidValue: number;
  }>({
    resolver: yupResolver(
      yup.object().shape({
        bidValue: yup.number().required(),
      })
    ),
    defaultValues: {},
    mode: "onChange",
  });

  const onBidding = async (formValues) => {
    if (!query.id) return;
    setIsBidding(true);
    try {
      const prevPayload = LocalStorage.get("proofInRoom");
      const _dataJoinRoomByProfile = prevPayload[profile.id + query.id];
      const bid_data = await zkApi.joinBidding({
        ..._dataJoinRoomByProfile.payload,
        bid_value: +formValues.bidValue,
      });
      const payload = {
        room_id: +query.id,
        proof_id: _dataJoinRoomByProfile.proofId.proof,
        bid_data: {
          inputs: bid_data.inputs,
          proof: bid_data.proof,
        },
        encrypted_data: bid_data.fake_encrypted_data,
      };
      await zkApi.bidding(payload);
      const myBid = await zkApi.getBiddingUserInRoom(+query.id);

      const keyByMyBid = keyBy(myBid, "room_id");
      const isBided = keys(keyByMyBid).includes(+query.id + "");
      currentRoom.isBided = isBided;
      console.log("currentRoom", currentRoom);

      updateDetailInRoom({ ...currentRoom });

      refetch();
      toast.success("Bidding successfully");
      toggle();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <Modal open={open} onClose={toggle}>
      <Box>
        <Box sx={style}>
          <Typography variant="subtitle1">Bidding room:</Typography>

          <BamInput
            control={control}
            label="Value bid"
            name="bidValue"
            placeholder="Enter your value bid"
            rules={{ required: true }}
            error={errors.bidValue}
            autoFocus={true}
          />

          <Box textAlign={"center"} mt={3}>
            <Button
              startIcon={
                isBidding && <CircularProgress size={20} color="secondary" />
              }
              disabled={isBidding}
              variant="contained"
              type="submit"
              onClick={handleSubmit(onBidding)}
            >
              Bidding
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalJoinRoom;
