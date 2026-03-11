import { supabase } from '@/lib/supabase';

export const taskService = {
    async list() {
        const { data, error } = await supabase.from('tasks').select('*').order('position', { ascending: true });
        if (error) throw error;
        return data;
    },

    async create(taskData) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('tasks').insert([{ ...taskData, user_id: user.id }]).select();
        if (error) throw error;
        return data[0];
    },

    async update(id, updateData) {
        const { data, error } = await supabase.from('tasks').update(updateData).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async delete(id) {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
    },

    async reorder(updates) {
        const promises = updates.map(({ id, position }) =>
            supabase.from('tasks').update({ position }).eq('id', id)
        );
        const results = await Promise.all(promises);
        const failed = results.find((r) => r.error);
        if (failed) throw failed.error;
    },
};
