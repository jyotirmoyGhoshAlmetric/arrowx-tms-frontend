import { handleMobileMenu } from "@/store/slices/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/store";

type UseMobileMenuReturn = [boolean, (val: boolean) => void];

const useMobileMenu = (): UseMobileMenuReturn => {
  const dispatch = useAppDispatch();
  const mobileMenu = useAppSelector((state) => state.layout.mobileMenu);
  const setMobileMenu = (val: boolean) => dispatch(handleMobileMenu(val));
  return [mobileMenu, setMobileMenu];
};

export default useMobileMenu;