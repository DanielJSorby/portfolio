import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw redirect(303, '/login');
    }

    // Load top 4 projects for quick management
    const { data: topProjects } = await supabase
        .from('projects')
        .select('*')
        .order('placement', { ascending: true })
        .limit(4);

    // Load technologies for quick color adding
    const { data: technologies } = await supabase
        .from('technologies')
        .select('*')
        .order('name');

    return {
        topProjects: (topProjects as unknown as Project[]) ?? [],
        technologies: technologies ?? []
    };
};
