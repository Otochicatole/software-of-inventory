import { getQuotations } from "@/core/services/http/quotations/get.quotations";
import QuotationsPage from "@/features/quotations/ui/quotations-page";

export const dynamic = 'force-dynamic';

export default async function Quotations() {
    const quotations = await getQuotations();

    return <QuotationsPage initialQuotations={quotations} />;
}

