import { SeverityType } from '@/models/report'

function SynopsisSection({ report }: {
    report: {
        createAt: Date
        caller: string
        location: string
        spokenDialects: string[]
        dispatchConfindece: number
        severity: SeverityType
    }
}) {
    const { createAt, caller, location, spokenDialects, dispatchConfindece, severity } = report
    return <section>
        <h3
            className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2"
        >
            1. CHRONOLOGICAL SYNOPSIS &amp; VERBAL TELEMETRY
        </h3>
        <p
            className="text-slate-800 leading-relaxed font-serif text-base text-justify"
        >
            The MERS-AI cognitive center ingested an incoming crisis stream logged at <strong>{createAt.toLocaleString()}</strong>. The caller identified as <strong>{caller}</strong> articulated high levels of distress corresponding to coordinates mapped to <strong>{location}</strong>. Transcript flags identified spoken dialect vectors in <strong>{spokenDialects.join(' / ')}</strong>, mapping semantic intent with cognitive dispatch confidence calculated at <strong>{(dispatchConfindece * 100).toFixed(2)}%</strong>. Target emergency level classified as <strong>{severity}</strong>.
        </p>
    </section>
}

export default SynopsisSection;