import supabase from '../config/supabase.js';

async function seed() {
  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
    ]);

  if (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }

  console.log('Seed data inserted successfully!');
}

seed();
