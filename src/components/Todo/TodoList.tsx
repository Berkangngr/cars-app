/* eslint-disable @typescript-eslint/no-unused-vars */
import {Todo} from '../../types/Todo';
import { 
  List, 
  ListItem, 
  Checkbox, 
  Typography, 
  IconButton,
  Paper,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TodoListProps { 
    todos: Todo[];
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export const TodoList = ({ todos, onDelete, onToggle }: TodoListProps) => {
    if (todos.length === 0) {
        return (
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6">Henüz görev yok</Typography>
            </Paper>
        );
    }

        return (
             <Paper elevation={3} style={{ padding: '16px' }}>
      <List>
        {todos.map(todo => (
          <ListItem 
            key={todo.id} 
            divider
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => onDelete(todo.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography
      variant="body1"
      style={{
        textDecoration: todo.completed ? 'line-through' : 'none',
        opacity: todo.completed ? 0.7 : 1,
      }}
    >
      {todo.text}
    </Typography>
    <Typography 
      variant="caption" 
      color="text.secondary"
    >
      {new Date(todo.createdAt).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}
    </Typography>
  </Box>

          </ListItem>
        ))}
      </List>
    </Paper>
        );  
    };