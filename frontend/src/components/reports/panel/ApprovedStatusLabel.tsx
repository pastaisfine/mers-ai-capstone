import { ApprovalType } from '@/models/report';
import { useMemo } from 'react';

function ApprovedStatusLabel({ status }: { status: ApprovalType }) {
    const variantClass = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return 'bg-emerald-500 ';
            case ApprovalType.REJECTED:
                return 'bg-red-500';
        }
    }, [status]);
    //
    return <span className={`${variantClass} text-white py-0.5 px-1.5 text-[8px] font-extrabold rounded`}>{status}</span>
}

export default ApprovedStatusLabel