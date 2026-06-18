import { LucideProps, Search } from 'lucide-react';

function SearchIcon({ ...props }: Omit<LucideProps, "ref">) {
    return <Search {...props} size='1rem' />
}

export default SearchIcon;