insert into public.affirmations (category, text, is_custom, user_id) values
  ('Identity', 'I am disciplined, focused, and relentless in my pursuit of excellence.', false, null),
  ('Identity', 'Every challenge makes me stronger, sharper, and wiser.', false, null),
  ('Relationships', 'I build strong relationships based on honor, respect, and loyalty.', false, null),
  ('Relationships', 'I lead with integrity, strength, and wisdom.', false, null),
  ('Occupation', 'I approach my work with purpose, discipline, and excellence.', false, null),
  ('Occupation', 'I create massive value and opportunities follow me.', false, null),
  ('Spirituality', 'I walk in faith, purpose, and gratitude.', false, null),
  ('Spirituality', 'I am called to something greater, and I rise to the challenge.', false, null),
  ('Physical Health', 'My body is strong, powerful, and built for endurance.', false, null),
  ('Physical Health', 'I fuel my body with discipline through training, nutrition, and rest.', false, null),
  ('Emotional Mastery', 'I control my emotions. No fear, no doubt, only focus and action.', false, null),
  ('Emotional Mastery', 'I overcome obstacles with strategy, strength, and patience.', false, null),
  ('Financial Resources', 'I create wealth through discipline, focus, and wisdom.', false, null),
  ('Financial Resources', 'I use money as a tool for freedom, growth, and impact.', false, null)
on conflict do nothing;
