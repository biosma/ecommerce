import User from '@/models/User';
import { Inngest } from 'inngest';

import connect from './db';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'ecommerce-next' });

// inngest function to save user data in the database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await connect();
    await User.create(userData);
  },
);

export const syncUserUpdate = inngest.createFunction(
  {
    id: 'update-user-from-clerk',
  },
  {
    event: 'clerk/user.updated',
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await connect();
    await User.findOneAndUpdate(id, userData);
  },
);

export const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-from-clerk',
  },
  {
    event: 'clerk/user.deleted',
  },
  async ({ event }) => {
    const { id } = event.data;
    await connect();
    await User.findOneAndDelete(id);
  },
);
