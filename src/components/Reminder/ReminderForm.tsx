/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
    resetForm();
    onClose();
  };

  const resetForm = () => {
  setReminder({
    Title: '',
    Description: '',
    DueDate: new Date(),
    Priority: 'medium',
    Completed: false,
  });
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

                 

                                <DatePicker
                label="Tarih Seçin"
                value={reminder.DueDate ?? null}
                onChange={(newValue) => {
                  if (newValue) {
                    const dateOnly = newValue instanceof Date ? newValue : new Date(newValue.toDate());
                    setReminder({ ...reminder, DueDate: dateOnly });
                  }
                }}
                format="dd/MM/yyyy"
                slots={{ textField: TextField }}
                enableAccessibleFieldDOMStructure={false}
                slotProps={{ textField: { required: true } }}
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