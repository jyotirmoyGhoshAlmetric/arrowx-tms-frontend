import { handleSidebarCollapsed } from "@/store/slices/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/store";

type UseSidebarReturn = [boolean, (val: boolean) => void];

const useSidebar = (): UseSidebarReturn => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.layout.isSidebarCollapsed);
  const setMenuCollapsed = (val: boolean) => dispatch(handleSidebarCollapsed(val));
  return [collapsed, setMenuCollapsed];
};

export default useSidebar;