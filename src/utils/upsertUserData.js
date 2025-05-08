import { supabase } from '../Api/supabaseClient';

export async function upsertUserData(gmailId, responseText, suggestions, commandsObject) {
  const { data, error } = await supabase
    .from('user_resume_data')
    .upsert([
      {
        gmail_id: gmailId,
        response_text: responseText,
        suggestions: suggestions,
        commands: commandsObject,
        updated_at: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error('Upsert failed:', error);
  } else {
    console.log('Upserted data:', data);
  }
}
