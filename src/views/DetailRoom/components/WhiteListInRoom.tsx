import WhiteListTable from "@components/WhiteListTable";
import { Box } from "@mui/material";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";

const WhiteListInRoom = () => {
  const { currentRoom, isOwner } = useStoreDataInRoom();

  if (!currentRoom?.whitelist?.length || !isOwner) return null;
  return (
    <Box className="box-app" mt={2}>
      {currentRoom?.tree_id != 0 && (
        <>
          <div className="box-vault-flex">
            <div>
              <Box>
                <WhiteListTable whiteList={currentRoom?.whitelist || []} />
              </Box>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};
export default WhiteListInRoom;
