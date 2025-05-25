export interface Reminder {
     id: string;
    Title: string;
    Description: string;
    Completed: boolean;
    CreatedAt: Date;
     DueDate: Date; // Hatırlatıcı için son tarih
    Priority: 'low' | 'medium' | 'high';
    
}



