import { ApprovalType, type OperatorNote as OperatorNoteModel } from '@/models/report';
import { useMemo } from 'react';

function OperatorNote({ note, status }: {
    note: OperatorNoteModel
    status: ApprovalType
}) {
    const titlePrefix = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return 'APPROVED & DISPATCHED';
            case ApprovalType.REJECTED:
                return 'REJECTED';
            default:
                return 'PENDING';
        }
    }, [status]);
    const boxVariantClass = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return 'bg-emerald-50/40 border-emerald-200'
            case ApprovalType.REJECTED:
                return 'bg-red-50/40 border-red-200'
            default:
                return 'bg-amber-50/40 border-amber-200'
        }
    }, [status]);
    const titleClass = useMemo(() => {
        switch (status) {
            case ApprovalType.APPROVED:
                return 'text-emerald-800';
            case ApprovalType.REJECTED:
                return 'text-red-800';
            default:
                return 'text-amber-800';
        }
    }, [status])
    return (
        <div className={`p-4 rounded-xl border ${boxVariantClass}`} >
            <p className={`text-xs font-bold leading-relaxed mb-1 ${titleClass}`}>
                DECISION: {titlePrefix} - {note.operatorVerdict}
            </p>
            <p className="text-xs text-slate-650 leading-relaxed font-serif">
                <strong>Operator Note:</strong> {note.notes}
            </p>
        </ div >
    )
}

export default OperatorNote;