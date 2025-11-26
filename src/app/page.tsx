import StockPage from "@/features/stock/ui/stock-page";
import { getProducts } from "@/core/services/http/products/get.products";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stock = await getProducts();
  
  return (
    <>
      <StockPage stock={stock} />
    </>
  );
}
