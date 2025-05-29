/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale/tr';
import { useState } from 'react';
import { Reminder } from '../../types/Reminder';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reminder: Reminder) => void;
}


export const ReminderForm = ({open , onClose, onSubmit}: ReminderFormProps) => {
    const [reminder, setReminder] = useState<Partial<Reminder>>({
        Title: '',
        DueDate: new Date(),
        Priority:'medium',
        Completed: false,
        Description: '',
    });

     const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reminder as Reminder);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Yeni Anımsatıcı</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Başlık"
              required
              value={reminder.Title}
              onChange={(e) => setReminder({...reminder, Title: e.target.value})}
            />
            
            <TextField
              label="Açıklama"
              multiline
              rows={3}
              value={reminder.Description}
              onChange={(e) => setReminder({...reminder, Description: e.target.value})}
            />

            <DateTimePicker
              label="Tarih & Saat"
              value={reminder.DueDate}
              onChange={(newValue) => {
                if (newValue !== null) {
                  setReminder({ ...reminder, DueDate: newValue });
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="priority-label">Öncelik</InputLabel>
              <Select
               
                labelId="priority-label"
                value={reminder.Priority}
                onChange={(e) => setReminder({...reminder, Priority: e.target.value as 'low' | 'medium' | 'high'})}
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>İptal</Button>
            <Button type="submit" variant="contained">Kaydet</Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}