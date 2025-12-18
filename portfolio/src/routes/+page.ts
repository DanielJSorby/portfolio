import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';

export const load: PageLoad = async () => {
    // Fetch all projects. In a real app, you might have a 'featured' column.
    // For now, we'll fetch them and let the component decide or just take the first few.
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('placement', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        return {
            projects: []
        };
    }

    return {
        projects: (projects as unknown as Project[]) ?? []
    };
};

