import { TableCell, TableRow } from "@heroui/react";

export default function AppointmentsRow({ item }: { item: any }) {
  return (
    <TableRow key={item.id}>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.service}</TableCell>
      <TableCell>{item.time}</TableCell>
      <TableCell>{item.staff}</TableCell>
      <TableCell>{item.status}</TableCell>
    </TableRow>
  );
}
