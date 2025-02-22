export interface WTPEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  duration: string;
  location: string;
  capacity: number;
  imageKey: string;
  organizerId: string;
  organizerUsername: string;
  organizerEmail: string;
  createdDate: string;
  lastModifiedDate: string;
  activityTypes: string[];
  registrations: number;
}
