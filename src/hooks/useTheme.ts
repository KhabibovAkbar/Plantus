import { useAppStore } from '../store/appStore';
import { COLORS, DARK_COLORS } from '../utils/theme';

export default function useTheme() {
  const darkMode = useAppStore((s) => s.darkMode);
  const theme = darkMode ? DARK_COLORS : COLORS;
  return { theme, isDark: darkMode };
}
