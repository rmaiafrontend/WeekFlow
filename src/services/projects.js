import { supabase } from '@/lib/supabase';

export const projectService = {
    async list() {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        return data;
    },

    async create(projectData) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('projects').insert([{ ...projectData, user_id: user.id }]).select();
        if (error) throw error;
        return data[0];
    },

    async update(id, updateData) {
        const { data, error } = await supabase.from('projects').update(updateData).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async delete(id) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
    },
};
