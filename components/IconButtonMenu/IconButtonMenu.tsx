import React, { useState } from "react";
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuItemProps,
  MenuProps,
} from "react-native-paper";

type Props = {
  menuItems: MenuItemProps[];
  iconButtonProps: IconButtonProps;
} & Omit<MenuProps, "visible" | "anchor" | "theme" | "children">;

const IconButtonMenu = ({
  menuItems,
  iconButtonProps: { onPress, ...restOfIconButtonProps },
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Menu
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      anchor={
        <IconButton
          {...restOfIconButtonProps}
          onPress={(e) => {
            setIsVisible(true);
            onPress && onPress(e);
          }}
        />
      }
    >
      {menuItems.map(
        ({ onPress: onPressMenuIcon, ...restOfMenuItemProps }, index) => (
          <Menu.Item
            key={index}
            {...restOfMenuItemProps}
            onPress={(e) => {
              setIsVisible(false);
              onPressMenuIcon && onPressMenuIcon(e);
            }}
          />
        ),
      )}
      {menuItems.length === 0 && <Menu.Item disabled title="No options" />}
    </Menu>
  );
};

export default IconButtonMenu;
