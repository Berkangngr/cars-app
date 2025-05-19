/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField, Button, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from "react";

interface AddTodoProps {
    onAdd: (text: string) => void;
}

export const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <Box display = "flex" gap = {1} mb={3}>
            <TextField
             fullWidth
             variant="outlined"
             placeholder="Yeni görev ekle"
             value={text}
             onChange= {(e) => setText(e.target.value)}
             />
             <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                >
                Ekle
            </Button>
            </Box>
        </form>
  )

};