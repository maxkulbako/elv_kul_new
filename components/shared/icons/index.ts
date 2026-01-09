import Telegram from "./Telegram";
import Instagram from "./Instagram";
import Facebook from "./Facebook";
import Viber from "./Viber";
import Sparkles from "./Sparkles";

import { type IconProps, type IconName } from "./Icon";

export const Icons: Record<IconName, React.FC<IconProps>> = {
  telegram: Telegram,
  instagram: Instagram,
  facebook: Facebook,
  viber: Viber,
  sparkles: Sparkles,
};

// Export individual icons and types
export { type IconName, type IconProps };
