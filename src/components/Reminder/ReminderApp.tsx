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
            CreatedAt : new Date().toISOString(),
            DueDate : newReminder.DueDate.toISOString(),
            Completed : newReminder.Completed || false
        };
         console.log("Sending Reminder: ", reminderTosend);
        const response = await axios.post('/api/Animsatici/CreateAnimsat',reminderTosend, {
           
        headers: {
          'Content-Type': 'application/json'
        }
      });
        toast.success("Randevu başarı ile eklendi.")
        //setReminders([...reminders, response.data]);
        resetForm()
        } catch(error) {
            console.error("Reminder eklenirken hata oluştu:", error);
        }
        
    };

    //Reset form
    const resetForm = () => {
        setReminders([]);
    }

  
     const deleteReminder = (id: string) => {
        console.log('Silinecek ID:', id); // DEBUG
        setReminders(prev => {
            const newReminders = prev.filter(r => r.id !== id);
            console.log('Yeni liste:', newReminders); // DEBUG
            return newReminders;
        });
    };

    // useEffect(() => {
    //     const savedReminders = localStorage.getItem('reminders');
    //     if (savedReminders) {
    //         setReminders(JSON.parse(savedReminders));
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem('reminders', JSON.stringify(reminders));
    // }, [reminders]);

 

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