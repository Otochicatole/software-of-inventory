import { getSales } from "@/core/services/http/sales/get.sales";
import SalesPage from "@/features/sales/ui/sales-page";

export default async function Sales() {
    const sales = await getSales();

    return <SalesPage initialSales={sales} />;
}