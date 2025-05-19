/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Reminder } from "../../types/Reminder";
import { Box, Typography, Paper, Button } from '@mui/material';
import { ReminderForm } from "./ReminderForm";
import { ReminderList } from "./ReminderList";


export const ReminderApp = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [openForm, setOpenForm] = useState(false);

    const addReminder = (newReminder: Reminder) => {
        setReminders([...reminders, {
            ...newReminder,
            id: Date.now().toString(),
        }]);
    };

     const deleteReminder = (id: string) => {
        console.log('Silinecek ID:', id); // DEBUG
        setReminders(prev => {
            const newReminders = prev.filter(r => r.id !== id);
            console.log('Yeni liste:', newReminders); // DEBUG
            return newReminders;
        });
    };

    useEffect(() => {
        const savedReminders = localStorage.getItem('reminders');
        if (savedReminders) {
            setReminders(JSON.parse(savedReminders));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }, [reminders]);

 

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