import React, { useState } from "react";
import { Menu, MenuItemProps } from "react-native-paper";

type Props = {
  children: ({ openMenu }: { openMenu: () => void }) => React.ReactNode;
  menuItems: MenuItemProps[];
};

const CustomMenu = ({ children, menuItems }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <Menu
      visible={isOpen}
      onDismiss={closeMenu}
      anchor={children({ openMenu })}
    >
      {menuItems.map(
        ({ onPress: onPressMenuIcon, ...restOfMenuItemProps }, index) => (
          <Menu.Item
            key={index}
            {...restOfMenuItemProps}
            onPress={(e) => {
              closeMenu();
              onPressMenuIcon && onPressMenuIcon(e);
            }}
          />
        ),
      )}
      {menuItems.length === 0 && <Menu.Item disabled title="No options" />}
    </Menu>
  );
};

export default CustomMenu;
