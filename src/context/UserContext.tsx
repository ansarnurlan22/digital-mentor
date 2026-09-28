'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  role: 'Ученик' | 'Ментор';
  grade: string;
  subject: string;
  email: string;
  avatarText: string;
  volunteerHours?: number;
  rating?: number;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'Ансар Нурлан',
  role: 'Ментор',
  grade: '11 класс',
  subject: 'SAT Math',
  email: 'ansarnurlan2@gmail.com',
  avatarText: 'АН',
  volunteerHours: 14.5,
  rating: 4.98,
};

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  updateUser: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('digitalMentor_userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser((prev) => ({
          ...prev,
          ...parsed,
          avatarText: (parsed.name || prev.name).slice(0, 2).toUpperCase(),
        }));
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('digitalMentor_userProfile', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const logout = () => {
    try {
      localStorage.removeItem('digitalMentor_userProfile');
      sessionStorage.removeItem('mentorProfile');
    } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
