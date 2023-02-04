import CloseRoom from "@components/AppModal/CloseRoom";
import ModalAddWhiteList from "@components/AppModal/ModalAddWhiteList";
import ModalCreateRoom from "@components/AppModal/ModalCreateRoom";
import ModalJoinRoom, {
  ModalBidding,
} from "@components/AppModal/ModalJoinRoom";
import OpenRoom from "@components/AppModal/OpenRoom";
import UpdateDuration from "@components/AppModal/UpdateDuration";
import { useStoreModal } from "@store/useStoreModal";

const GlobalModal = () => {
  const {
    isOpenCreate,
    toggleOpenCreate,
    isOpenAddWhiteList,
    toggleOpenAddWhiteList,

    isOpenUpdateDurationTime,
    toggleOpenUpdateDurationTime,

    isOpenRoom,
    toggleOpenRoom,

    isCloseRoom,
    toggleCloseRoom,

    isOpenJoinRoom,
    toggleOpenJoinRoom,
    isOpenBidding,
    toggleOpenBidding,
  } = useStoreModal();
  return (
    <div>
      <ModalCreateRoom open={isOpenCreate} toggle={toggleOpenCreate} />
      <ModalAddWhiteList
        open={isOpenAddWhiteList}
        toggle={toggleOpenAddWhiteList}
      />

      <UpdateDuration
        open={isOpenUpdateDurationTime}
        toggle={toggleOpenUpdateDurationTime}
      />

      <OpenRoom open={isOpenRoom} toggle={toggleOpenRoom} />
      <CloseRoom open={isCloseRoom} toggle={toggleCloseRoom} />
      <ModalJoinRoom open={isOpenJoinRoom} toggle={toggleOpenJoinRoom} />
      <ModalBidding open={isOpenBidding} toggle={toggleOpenBidding} />
      {/* <ModalUserJoinRoom open={openJoinRoom} toggle={toggleJoinRoom} /> */}
    </div>
  );
};
export default GlobalModal;
