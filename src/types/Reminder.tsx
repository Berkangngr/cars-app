export interface Reminder {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    dueDate: Date; // Hatırlatıcı için son tarih
    priority: 'low' | 'medium' | 'high';
    repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
}