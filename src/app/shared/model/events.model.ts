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
  createdDate: string;
  lastModifiedDate: string;
  activityTypes: string[];
  registrations: number;
  isOwnedByUser: boolean;
}

export interface WTPEventDetailed extends WTPEvent {
  isRegistered: boolean;
  organizerUsername: string;
}
