import { ListCheck, BadgeDollarSign } from "lucide-react";
import { Item } from "../types/dashboard-types";

export const dataDashboard: Item[] = [
  {
    title: "Stock",
    path: "/stock",
    icon: <ListCheck />,
  },
  {
    title: "Sales",
    path: "/sales",
    icon: <BadgeDollarSign />,
  }
];
