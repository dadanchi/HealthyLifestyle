export interface Workout {
    id: number;
    title: string;
    author: string;
    createdOn: Date;
    image: string;
    description: string;
    text: string;
    comments: Array<string>;
}