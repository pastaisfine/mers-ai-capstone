import { ArchivedReport } from '@/models/report';
import ApprovalStatusLabel from './docs/ApprovalStatusLabel';
import OperatorNote from './docs/OperatorNote';
import SupervisingCorner from './docs/SupervisingCorner';
import SynopsisSection from './docs/SynopsisSection';
import { locale } from '@/constants/common';

function ReportDocs({ report }: { report: ArchivedReport }) {
    return <div id="printing" className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl border border-slate-300 text-left relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] rotate-12 text-slate-950 font-black text-7xl tracking-widest uppercase text-center leading-none">
            CONFIDENTIAL<br />MERS999 DISPATCH
        </div>
        <div className="border-b-2 border-slate-950 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
                <span
                    className="bg-[#E63946] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider"
                >CONFIDENTIAL COGNITIVE RECORD</span>
                <h2 className="text-xl font-black text-slate-950 mt-1.5 tracking-tight">
                    {report.title}
                </h2>
                <div
                    className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider"
                >
                    <span>RECORD TOKEN: {report.id}</span><span>•</span><span>DATETIME: {report.createAt.toLocaleString(locale)}</span>
                </div>
            </div>
            <ApprovalStatusLabel status={report.approvedStatus} />
        </div>
        <div className="space-y-6 text-sm relative z-10">
            <SynopsisSection report={report} />
            <section>
                <h3
                    className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2"
                >
                    2. ARTIFICIAL COGNITIVE REASONING REPORT
                </h3>
                <p
                    className="text-slate-800 leading-relaxed font-serif text-base text-justify mb-3"
                >
                    {report.reasoningReport.content}
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span
                        className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5"
                    >Applicable SOP Protocol Directive</span>
                    {
                        report.reasoningReport.sopUsed.map((sop, index) => {
                            return (<span key={`${index}-${sop}`}
                                className="text-xs font-bold font-mono text-slate-800 uppercase block"
                            >${sop}</span>)
                        })
                    }
                </div>
            </section>
            <section>
                <h3
                    className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2"
                >
                    3. DEPLOYED RESPONDER SOP ACTIONS
                </h3>
                <div className="space-y-2">
                    {report.sopActions.map((action, index) => (
                        <div key={`${action}-${index}`} className="flex gap-2 text-xs">
                            <span className="font-bold text-[#E63946]">{index + 1}.</span>
                            <span className="text-slate-805 font-medium"
                            >{action}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section>
                <h3
                    className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2"
                >
                    4. OPERATOR FINAL VERDICT SUMMARY
                </h3>
                <OperatorNote note={{
                    notes: report.notes,
                    operatorVerdict: report.operatorVerdict
                }} status={report.approvedStatus} />
            </section>
        </div>
        <div className="border-t border-slate-200 mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
            <div>
                <span className="font-bold text-slate-700 block uppercase" >SECURE COGNITIVE SESSION SHA</span>
                <span>{report.incidentSHA}</span>
            </div>
            <SupervisingCorner supervisingRelease={report.supervisingRelease} />
        </div>
    </div>
}

export default ReportDocs;