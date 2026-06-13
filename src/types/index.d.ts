export interface User {
  name: any;
  id: number;
  email: string;
  role: "admin" | "customer";
}