// Firebase configuration - replace with your actual config
export const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-domain.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Note: In production, initialize Firebase with actual config
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// Demo auth service for development
class MockAuthService {
  private currentUser: any = null;

  async signUp(email: string, password: string, displayName: string) {
    // Simulate signup
    this.currentUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName,
      createdAt: new Date()
    };
    return { user: this.currentUser };
  }

  async signIn(email: string, password: string) {
    // Simulate signin
    this.currentUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      createdAt: new Date()
    };
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    callback(this.currentUser);
    return () => {};
  }
}

export const auth = new MockAuthService();