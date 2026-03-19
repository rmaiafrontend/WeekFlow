import { supabase } from '@/lib/supabase';

export const habitService = {
    async list() {
        const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async create(habitData) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('habits').insert([{ ...habitData, user_id: user.id }]).select();
        if (error) throw error;
        return data[0];
    },

    async update(id, updateData) {
        const { data, error } = await supabase.from('habits').update(updateData).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async delete(id) {
        const { error } = await supabase.from('habits').delete().eq('id', id);
        if (error) throw error;
    },
};

export const habitLogService = {
    async list() {
        const { data, error } = await supabase.from('habit_logs').select('*');
        if (error) throw error;
        return data;
    },

    async addBatch(items) {
        const { data: { user } } = await supabase.auth.getUser();
        const rows = items.map(({ habitId, date }) => ({
            habit_id: habitId,
            date,
            user_id: user.id,
        }));
        const { error } = await supabase
            .from('habit_logs')
            .upsert(rows, { onConflict: 'habit_id,date' });
        if (error) throw error;
    },

    async removeBatch(items) {
        const filter = items
            .map(({ habitId, date }) => `and(habit_id.eq.${habitId},date.eq.${date})`)
            .join(',');
        const { error } = await supabase
            .from('habit_logs')
            .delete()
            .or(filter);
        if (error) throw error;
    },
};
