// authUtils.ts

import admin from './firebaseAdmin'; // Adjust the path as necessary

async function checkPhoneNumber(phoneNumber: string): Promise<boolean> {
 try {
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    console.log('User record found:', userRecord.toJSON());
    return true; // Phone number is associated with a user account
 } catch (error) {
    // TypeScript requires us to check the type of the error before accessing its properties
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/user-not-found') {
            console.log('No user found with this phone number.');
            return false; // No user found with this phone number
        }
    }
    console.error('Error fetching user data:', error);
    return false; // An error occurred
 }
}

export { checkPhoneNumber };
