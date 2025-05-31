import { Box, Chip, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Reminder } from "../../types/Reminder";

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (ID: string) => void;
}

export const ReminderList = ({ reminders, onDelete }: ReminderListProps) => {
  return (
    <List>
      {reminders.map((reminder) => (
        <ListItem 
          key={reminder.ID}
          secondaryAction={
            <IconButton 
              edge="end" 
              onClick={() => onDelete(reminder.ID)} // onDelete burada kullanılıyor
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
                <Typography  fontWeight="bold">{reminder.Title}</Typography>
                <Chip 
                  label={reminder.Priority} 
                  size="small"
                  color={
                    reminder.Priority === 'high' ? 'error' :
                    reminder.Priority === 'medium' ? 'warning' : 'success'
                  }
                />
              </Box>
            }
            secondary={
              <>
                <Typography>{reminder.Description}</Typography>
                <Typography variant="caption">
                  {new Date(reminder.DueDate).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
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