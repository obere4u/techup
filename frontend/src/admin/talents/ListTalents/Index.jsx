
import { List, Datagrid, DateField, TextField, EditButton } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
export const PostIcon = BookIcon;

export default function ListTalents() {
 
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <DateField source="published_at" />
        <TextField source="average_note" />
        <TextField source="views" />
        <EditButton />
      </Datagrid>
    </List>
  );

}
