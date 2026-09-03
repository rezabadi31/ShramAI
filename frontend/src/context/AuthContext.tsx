import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role, name: string, token: string) => void;
  logout: () => void;
  switchPersona: (role: Role) => void;
}

const DEMO_PROFILES: Record<Role, UserProfile> = {
  inspector: {
    id: "USR-INSP-01",
    email: "inspector@shram.gov.in",
    name: "S. K. Sharma",
    role: "inspector",
    designation: "Assistant Labour Commissioner (Central)",
    jurisdiction: "Delhi & NCR Region",
  },
  employer: {
    id: "USR-EMP-01",
    email: "employer@abcindustries.com",
    name: "Rajiv Mehra",
    role: "employer",
    designation: "Compliance Officer & Factory Manager",
    establishment_id: "EST-001",
  },
  admin: {
    id: "USR-ADM-01",
    email: "admin@shram.gov.in",
    name: "Dr. V. Ramanathan",
    role: "admin",
    designation: "Chief Labour Intelligence Administrator",
    jurisdiction: "National Enforcement Sphere",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('shram_user');
    return saved ? JSON.parse(saved) : DEMO_PROFILES.inspector;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shram_token') || 'demo-jwt-token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shram_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shram_user');
    }
  }, [user]);

  const login = (email: string, role: Role, name: string, tokenStr: string) => {
    const profile = DEMO_PROFILES[role] || {
      id: `USR-${role.toUpperCase()}`,
      email,
      name,
      role,
      designation: role.toUpperCase(),
    };
    setUser(profile);
    setToken(tokenStr);
    localStorage.setItem('shram_token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shram_user');
    localStorage.removeItem('shram_token');
  };

  const switchPersona = (role: Role) => {
    const profile = DEMO_PROFILES[role];
    setUser(profile);
    setToken(`demo-jwt-${role}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
