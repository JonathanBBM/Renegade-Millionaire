export type Quote = {
  author: string | null;
  id: string;
  source: 'course' | 'external';
  text: string;
};
