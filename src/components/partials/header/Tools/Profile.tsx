import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { MenuItem } from "@headlessui/react";
import { useNavigate } from "react-router";

const ProfileLabel: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-2.5 rtl:ml-2.5">
        <Icon
          icon="heroicons-outline:user-circle"
          className="block w-7 h-7 object-cover rounded-full"
        />
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="text-base inline-block ltr:ml-2.5 rtl:mr-2.5">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = {
    id: "00000000-0000-0000-0000-000000000001",
    firstName: "Demo",
    lastName: "Admin",
  };

  const ProfileMenu = [
    // Show Company Profile only in fleet view and only for non-super admins

    {
      label: "User Profile",
      icon: "heroicons-outline:user",
      action: () => {
        navigate(`/user/profile/${user.id}`);
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        navigate("/");
      },
    },
  ].filter(Boolean); // Filter out undefined items

  return (
    <Dropdown label={<ProfileLabel />} classMenuItems="w-[180px] top-[58px]">
      {/* Profile Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center">
          <span className="block text-xl ltr:mr-3 rtl:ml-3">
            <Icon icon="heroicons-outline:user-circle" />
          </span>
          <span className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            {user ? `${user.firstName} ${user.lastName}` : "System User"}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      {ProfileMenu.map((item: any, index: number) => (
        <MenuItem key={index}>
          {({ focus }) => (
            <div
              onClick={() => item.action()}
              className={`${
                focus
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${item.hasDivider ? "border-t border-slate-100 dark:border-slate-700" : ""}`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </MenuItem>
      ))}
    </Dropdown>
  );
};

export default Profile;
