import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';
import NetInfo from '@react-native-community/netinfo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-application-name': 'ntc-mobile' }
  }
});

// Initialize database schema
export const initializeSchema = async () => {
  try {
    // Initialize the complaint system using our new function
    const { error } = await supabase.rpc('initialize_complaint_system');
    return { success: !error, error };
  } catch (error) {
    console.error('Error initializing schema:', error);
    return { success: false, error };
  }
};

// Add network state check helper
export const checkNetworkAndRetry = async (operation: () => Promise<any>, retries = 3): Promise<any> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection available');
    }
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.message === 'Network request failed' || error.message === 'No internet connection available')) {
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return checkNetworkAndRetry(operation, retries - 1);
    }
    throw error;
  }
};

// Profile functions
export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

export const getCurrentProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
};

// Balance functions
export const getBalance = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('balance, data_balance')
    .eq('id', userId)
    .single();
};

// Data pack functions
export const getDataPacks = async () => {
  return await supabase
    .from('data_packs')
    .select('*')
    .eq('active', true);
};

export const purchaseDataPack = async (userId: string, packId: string) => {
  return await supabase.rpc('purchase_data_pack', {
    user_id: userId,
    pack_id: packId
  });
};

// Transfer balance
export const transferBalance = async (senderId: string, receiverId: string, amount: number) => {
  return await supabase.rpc('transfer_balance', {
    sender_id: senderId,
    receiver_id: receiverId,
    transfer_amount: amount
  });
};

// Recharge balance
export const rechargeBalance = async (userId: string, amount: number, pinCode: string) => {
  return await supabase.rpc('recharge_balance', {
    user_id: userId,
    recharge_amount: amount,
    pin_code: pinCode
  });
};

// Complaint functions
export const submitComplaint = async (userId: string, subject: string, description: string) => {
  return await supabase.rpc('submit_complaint', {
    p_subject: subject,
    p_description: description
  });
};

export const getComplaints = async (userId: string) => {
  return await supabase.rpc('get_my_complaints');
};

export const getComplaintDetails = async (complaintId: string) => {
  return await supabase.rpc('get_complaint_details', {
    p_complaint_id: parseInt(complaintId)
  });
};

export const updateComplaintStatus = async (complaintId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
  return await supabase.rpc('update_complaint_status', {
    p_complaint_id: parseInt(complaintId),
    p_new_status: newStatus
  });
};

// Subscribe to real-time updates
export const subscribeToComplaintUpdates = (complaintId: string, onUpdate: () => void) => {
  return supabase
    .channel(`complaint:${complaintId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'complaints',
        filter: `id=eq.${complaintId}`,
      },
      () => onUpdate()
    )
    .subscribe();
};