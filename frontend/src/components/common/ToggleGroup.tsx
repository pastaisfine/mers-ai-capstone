import { useTheme } from '@/context/theme/useTheme';
import Toggle from './Toggle';
import { useMemo } from 'react';

function ToggleGroup({
    selectedValue,
    values,
    setValue,
    valueActiveColors
}: { selectedValue: string, values: string[], setValue: (v: string) => void, valueActiveColors?: Record<string, string> }) {
    const { theme } = useTheme();
    const toggleGroupBackgroundVariant = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'bg-[#151824]';
            case 'light':
            default:
                return 'bg-slate-100';
        }
    }, [theme]);
    return <div className={`flex justify-between border rounded-md ${toggleGroupBackgroundVariant}`}>
        {
            values.map((v, i) => (<><Toggle key={v} text={v} active={v == selectedValue} activeBackgroundColor={valueActiveColors?.[v]} onClick={() => {
                setValue(v)
            }} />
                {/* {i < values.length - 1 && <span className="text-xs my-auto">|</span>} */}
            </>))
        }
    </div>;
}

export default ToggleGroup;