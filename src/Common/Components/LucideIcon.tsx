// https://github.com/lucide-icons/lucide/tree/main/packages/lucide-react-native#lucide-react-native
// https://feathericons.com/

// INSTALL:
// npm i lucide-react-native react-native-svg

import * as icons from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';

export type LucideIconName = keyof typeof icons

export interface LucideIconProps extends SvgProps {
    /**
     * https://feathericons.com/
     */
    name: LucideIconName,
    
    size?: number,
}

export const LucideIcon = ({
    name,
    size,
    ...otherProps
}: LucideIconProps
) => {
    const Icon = icons[name] as icons.LucideIcon;

    return <Icon {...otherProps} size={size} />;
}