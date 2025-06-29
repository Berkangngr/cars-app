/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Paper, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../config/AxiosConfig";
import { Reminder } from "../../types/Reminder";
import { ReminderForm } from "./ReminderForm";
import { ReminderList } from "./ReminderList";




export const ReminderApp = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [openForm, setOpenForm] = useState(false);
   const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

    





    const addReminder = async (newReminder: Reminder) =>  {
        
        try {
        const reminderTosend = { // Burada post atarken attığımız anın tarihini de oluşturuyoruz.
            ...newReminder,
            CreatedAt : new Date().toISOString().split('T')[0],
            DueDate : newReminder.DueDate.toISOString().split('T')[0],
            Completed : newReminder.Completed || false
        };
         console.log("Sending Reminder: ", reminderTosend);
         await axios.post('/api/Animsatici/CreateAnimsat/',reminderTosend, {
           
        headers: {
          'Content-Type': 'application/json'
        }
      });
        toast.success("Randevu başarı ile eklendi.")
        fetchGetReminders()
       
        } catch(error) {
            console.error("Reminder eklenirken hata oluştu:", error);
        }
        
    };

    const fetchGetReminders = async () => {
        try {
            let targetDate;
            if (selectedDate) {
                targetDate = selectedDate.format('YYYY-MM-DD');
                console.log("Seçilen tarih:", targetDate);
            } else {
                targetDate = new Date().toISOString().split('T')[0];
                console.log("Bugünün tarihi:", targetDate);
            }

            const response = await axios.get(`/api/Animsatici/GetAnimsatici?animTarih=${targetDate}`)
            setReminders(response.data);
            console.log("Apiden gelen veri:", response.data);
            if (response.data.length > 0) {
                console.log("ilk reminder id'si:", response.data[0]?.ID);
            } else {
                console.log("Bu tarihte anımsatıcı bulunamadı");
            }
        } catch (error) {
            console.error("Reminderları çekerken hata oluştu:", error);
        }
    };

    useEffect(() => {
        fetchGetReminders();

        //Selected yoksa tetiklenecek olan olan gün boyu yenileme
        
        let interval: any;
        if (!selectedDate) {
            interval = setInterval(fetchGetReminders, 3600000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [selectedDate]);

 
     

         //Reset Form





 
    const deleteReminder = async (ID: string) => {
        console.log("Silinecek verinin idsi:", ID)
        const isConfirmed = confirm("Bu randevu bilgisini silmek istediğinize emin misiniz?");
        if (!isConfirmed) return;

        try {
              await axios.post(`/api/Animsatici/AnimPasif?id=${ID}`);
             fetchGetReminders();
             toast.success("Randevu başarı ile silindi.")
        } catch (error) {
           console.log("Randevu bilgisi kayıt ederken bir hata oluştu:",error);
        }
       
    }

   




 

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Anımsatıcılar
            </Typography>
            <div style={{display:'flex'}}>

                <div style={{justifyContent:'space-between'}}>
            <Button 
                variant="contained" 
                onClick={() => setOpenForm(true)}
                sx={{ mb: 3, padding: 2 }}
            >
                Yeni Anımsatıcı Ekle
            </Button>
            </div>

            <div style={{justifyContent:'space-between'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Tarih Seçin"
                    value={selectedDate}
                    onChange={(newValue, _context) => {
                        setSelectedDate(newValue as Dayjs | null);
                    }}
                    sx={{mb: 3, marginLeft: 5}}
                    />
                 </LocalizationProvider>
             </div>
            </div>
            {/* FORM'a onDelete prop'unu SİLİYORUZ */}
            <ReminderForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={addReminder}
            />

            {/* Listeye doğru prop'u geçiriyoruz */}
            <ReminderList 
                reminders={reminders} 
                onDelete={deleteReminder} 
            />
        </Paper>
    );
};