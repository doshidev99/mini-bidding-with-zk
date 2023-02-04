import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDetailInRoom } from "@services/roomService";

export default function ListUserBidding({ currentResult }) {
  // const { data } = useDetailInRoom();

  // const userBiddingInRoom = React.useMemo(() => {
  //   return data && data.userBiddingInRoom;
  // }, [data, data?.userBiddingInRoom?.length]);

  if (!currentResult?.length) return null;
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650, background: "rgb(19, 32, 61)" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Bidder</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentResult?.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.bidder}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.user}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
