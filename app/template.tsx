export default function Template({ children }: { children: React.ReactNode }) {
  // Remount boundary for route segments; page motion uses View Transitions CSS.
  return children;
}
