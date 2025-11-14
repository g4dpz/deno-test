// Helper function to check if user has a role
export const hasRole = (user: any, role: string) => {
  return user?.roles?.includes(role) || false;
};
