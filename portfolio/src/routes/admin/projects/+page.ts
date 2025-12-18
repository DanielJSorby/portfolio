import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw redirect(303, '/login');
    }

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('placement', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
    }

    return {
        projects: (projects as unknown as Project[]) ?? []
    };
};

