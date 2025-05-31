/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Reminder } from "../../types/Reminder";
import { Box, Typography, Paper, Button } from '@mui/material';
import { ReminderForm } from "./ReminderForm";
import { ReminderList } from "./ReminderList";
import axios from "../../config/AxiosConfig";
import { columnGroupsStateInitializer } from "@mui/x-data-grid/internals";
import { toast } from "react-toastify";




export const ReminderApp = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [openForm, setOpenForm] = useState(false);





    const addReminder = async (newReminder: Reminder) =>  {
         console.log(newReminder)
        
        try {
        const reminderTosend = { // Burada post atarken attığımız anın tarihini de oluşturuyoruz.
            ...newReminder,
            CreatedAt : new Date().toISOString().split('T')[0],
            DueDate : newReminder.DueDate.toISOString().split('T')[0],
            Completed : newReminder.Completed || false
        };
         console.log("Sending Reminder: ", reminderTosend);
        const response = await axios.post('/api/Animsatici/CreateAnimsat/',reminderTosend, {
           
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
                const currentDate = new Date().toISOString().split('T')[0]; // Bulunduğumuz tarihi verir
                console.log(currentDate);
                const response = await axios.get(`/api/Animsatici/GetAnimsatici?animTarih=${currentDate}`)
                setReminders(response.data);
                console.log("API'den gelen ham veri:", response.data); // Ham veriyi loglayın
                console.log("İlk reminder ID'si:", response.data[0]?.ID); // ID kontrolü
            } catch (error) {
                console.log("Reminderları çekerken hata oluştu:", error);
            }
        };

          useEffect(() => {
        fetchGetReminders();
        
    
    // Gün boyunca otomatik yenileme (opsiyonel)
        const interval = setInterval(fetchGetReminders, 3600000); // Her saat başı
        return () => clearInterval(interval);
         }, []);



  
    //  const deleteReminder = (id: string) => {
    //     console.log('Silinecek ID:', id); // DEBUG
    //     setReminders(prev => {
    //         const newReminders = prev.filter(r => r.id !== id);
    //         console.log('Yeni liste:', newReminders); // DEBUG
    //         return newReminders;
    //     });
    // };

 
    const deleteReminder = async (ID: string) => {
        console.log("Silinecek verinin idsi:", ID)
        const isConfirmed = confirm("Bu randevu bilgisini silmek istediğinize emin misiniz?");
        if (!isConfirmed) return;

        try {
             const response = await axios.post(`/api/Animsatici/AnimPasif?id=${ID}`);
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
            <Button 
                variant="contained" 
                onClick={() => setOpenForm(true)}
                sx={{ mb: 3 }}
            >
                Yeni Anımsatıcı Ekle
            </Button>

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