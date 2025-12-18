import { supabase } from '$lib/supabaseClient';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async ({ params }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect(303, '/login');

    const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single();

    if (fetchError || !project) {
        throw error(404, 'Prosjektet ble ikke funnet');
    }

    return {
        project: project as unknown as Project
    };
};

