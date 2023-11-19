import { ActionItem } from "../components/action/ActionMenuButton";

export interface BrowserTabItem {
  key: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
  loading: boolean;
  actions?: ActionItem<{ tab: BrowserTabItem }>[];
}
