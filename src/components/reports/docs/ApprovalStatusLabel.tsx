'use client'
import { ApprovalType } from '@/models/report';
import { useMemo } from 'react';

function ApprovalStatusLabel({ status }: { status: ApprovalType }) {
    const variantClass = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return 'bg-emerald-50 text-emerald-700 border-success';
            case ApprovalType.REJECTED:
                return 'bg-red-50 text-red-700 border-red-400';
            default:
                return '';
        }
    }, [status])

    const statusText = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return '✓ APPROVED OUTCOME';
            case ApprovalType.REJECTED:
                return '✗ DISPATCH REJECTED';
            default:
                return '';
        }
    }, [status]);
    return <div className="text-right shrink-0">
        <span
            className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border-2 ${variantClass}`}
        >{statusText}</span>
    </div>
}

export default ApprovalStatusLabel;