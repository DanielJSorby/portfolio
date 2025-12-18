import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const [experience, education] = await Promise.all([
        supabase.from('experience').select('*').order('placement', { ascending: true }),
        supabase.from('education').select('*').order('placement', { ascending: true })
    ]);

    return {
        experience: experience.data ?? [],
        education: education.data ?? []
    };
};

