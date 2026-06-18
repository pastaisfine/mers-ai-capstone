'use client'
import { ReleaseType, SupervisingReleaseInfo } from '@/models/report';
import { useMemo } from 'react';

function SupervisingCorner({ supervisingRelease }: { supervisingRelease: SupervisingReleaseInfo }) {
    const statusText = useMemo(() => {
        switch (supervisingRelease.status) {
            case ReleaseType.CONFIRMED:
                return 'CONFIRMED DIRECT RELEASE'
            case ReleaseType.NON_CONFIRMED:
                return 'REJECTED DIRECT RELEASE'
        }
    }, [supervisingRelease.status]);
    return <div className="text-left sm:text-right">
        <span className="font-bold text-slate-700 block uppercase">{supervisingRelease.inspector}</span>
        <span className="text-slate-600 font-bold">STATUS: {statusText}</span>
    </div>
}

export default SupervisingCorner;