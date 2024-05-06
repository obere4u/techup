
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput, useRecordContext } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
export const PostIcon = BookIcon;

export default function EditTalent() {
  const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;

};
  return (
    <Edit title={<PostTitle />}>
      <SimpleForm>
        <TextInput
          disabled
          source="id"
        />
        <TextInput source="title" />
        <TextInput
          source="teaser"
          options={{ multiline: true }}
        />
        <TextInput
          multiline
          source="body"
        />
        <DateInput
          label="Publication date"
          source="published_at"
        />
        <TextInput source="average_note" />
        <TextInput
          disabled
          label="Nb views"
          source="views"
        />
      </SimpleForm>
    </Edit>
  );

}
