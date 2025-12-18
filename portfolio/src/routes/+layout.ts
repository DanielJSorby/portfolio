import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // We don't redirect here, just return the data if logged in
    const isLoggedIn = !!session;

    const { data: technologies, error } = await supabase
        .from('technologies')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching technologies:', error);
    }

    // Convert array to object for the frontend
    const techColorsObj: Record<string, string> = {};
    if (technologies) {
        technologies.forEach(t => {
            techColorsObj[t.name] = t.color;
        });
    }

    return {
        techColors: techColorsObj,
        technologies: technologies ?? [],
        isLoggedIn
    };
};

