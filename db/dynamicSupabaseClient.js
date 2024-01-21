import { createClient } from '@supabase/supabase-js';

// Directorio de credenciales para los proyectos
const credentialsDirectory = {
    '3fbadbf4-2d13-48b8-8cc5-661dbd65a987': {
        url: 'https://wurdxmrnpdfgvgkzystf.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cmR4bXJucGRmZ3Zna3p5c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MzcwNDcsImV4cCI6MTk5NjIxMzA0N30.q_4k7QKuXgYQRcDxxNqx01C58HB9JLMNR_Y9pFGfhgU',
    },
    'ff695616-1f26-46e2-b95d-b92b76a3f89f': {
        url: 'https://phnpalffthkimmhufuuq.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnBhbGZmdGhraW1taHVmdXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0MDg3MzgsImV4cCI6MTk4ODk4NDczOH0.7Kr1nJddHT87KJU0MabsgeZcIb4wal5-KabW5_Y4J0k'
    },
    '0e26f1cb-5aa3-4f1b-8284-c0f0c6c408d2': {
        url: 'https://phnpalffthkimmhufuuq.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnBhbGZmdGhraW1taHVmdXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0MDg3MzgsImV4cCI6MTk4ODk4NDczOH0.7Kr1nJddHT87KJU0MabsgeZcIb4wal5-KabW5_Y4J0k'
    }

};

export function createDynamicSupabaseClient(projectID) {
    if (credentialsDirectory[projectID]) {
        const { url, anonKey } = credentialsDirectory[projectID];
        console.log(`Creando cliente Supabase para projectID: ${projectID}`);
        return createClient(url, anonKey);
    } else {
        console.error('Project ID no encontrado o inválido:', projectID);
        return null;
    }

}
