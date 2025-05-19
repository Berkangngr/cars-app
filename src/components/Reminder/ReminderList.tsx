import { Box, Chip, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Reminder } from "../../types/Reminder";

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => void;
}

export const ReminderList = ({ reminders, onDelete }: ReminderListProps) => {
  return (
    <List>
      {reminders.map((reminder) => (
        <ListItem 
          key={reminder.id}
          secondaryAction={
            <IconButton 
              edge="end" 
              onClick={() => onDelete(reminder.id)} // onDelete burada kullanılıyor
              color="error"
              aria-label="delete"
            >
              <GridDeleteIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight="bold">{reminder.title}</Typography>
                <Chip 
                  label={reminder.priority} 
                  size="small"
                  color={
                    reminder.priority === 'high' ? 'error' :
                    reminder.priority === 'medium' ? 'warning' : 'success'
                  }
                />
              </Box>
            }
            secondary={
              <>
                <Typography>{reminder.description}</Typography>
                <Typography variant="caption">
                  {new Date(reminder.dueDate).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};