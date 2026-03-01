import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface UserDoc {
  id: string;
  codename: string;
}

export const userConverter = {
  toFirestore: (data: UserDoc): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): UserDoc => ({
    id: snapshot.id,
    ...snapshot.data(),
  } as UserDoc),
};
