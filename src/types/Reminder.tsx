export interface Reminder {
    ID: string;
    Title: string;  //RF
    Description: string; //RF
    Completed: boolean; //RF
    CreatedAt: Date;
     DueDate: Date; // Hatırlatıcı için son tarih RF
    Priority: 'low' | 'medium' | 'high'; //RF
    
}



//Reminder form'a description eklendi on submit ile gönderiliyor

