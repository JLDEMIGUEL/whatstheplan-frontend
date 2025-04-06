export interface WTPReview {
  id: string;
  raterUsername: string;
  username: string;
  rating: number;
  text: string;
  createdAt: string;
  isOwnedByUser: boolean;
}
