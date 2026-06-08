import { ArchivedReport } from '@/models/report';
import ReportDocs from './ReportDocs';
import ReportExportSection from './ReportExportSection';

function ReportContainer({ report }: { report: ArchivedReport }) {
    return <div className="flex flex-col gap-4 p-6 md:p-8 max-w-3xl mx-auto">
        <ReportExportSection />
        <ReportDocs report={report} />
    </div>;
}

export default ReportContainer;