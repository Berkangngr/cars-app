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
        title: '',
        dueDate: new Date(),
        priority:'medium',
        repeat: 'none',
        completed: false,
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
              value={reminder.title}
              onChange={(e) => setReminder({...reminder, title: e.target.value})}
            />
            
            <TextField
              label="Açıklama"
              multiline
              rows={3}
              value={reminder.description}
              onChange={(e) => setReminder({...reminder, description: e.target.value})}
            />

            <DateTimePicker
              label="Tarih & Saat"
              value={reminder.dueDate}
              onChange={(newValue) => {
                if (newValue !== null) {
                  setReminder({ ...reminder, dueDate: newValue });
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={reminder.priority}
                onChange={(e) => setReminder({...reminder, priority: e.target.value as 'low' | 'medium' | 'high'})}
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tekrar</InputLabel>
              <Select
                value={reminder.repeat}
                onChange={(e) => setReminder({...reminder, repeat: e.target.value as 'daily' | 'weekly' | 'monthly' | 'none'})}
              >
                <MenuItem value="none">Tek Seferlik</MenuItem>
                <MenuItem value="daily">Günlük</MenuItem>
                <MenuItem value="weekly">Haftalık</MenuItem>
                <MenuItem value="monthly">Aylık</MenuItem>
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