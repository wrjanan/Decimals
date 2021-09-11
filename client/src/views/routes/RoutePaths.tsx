import Main from "../MainApp";

export const routePaths: { [path: string]: RoutePath } = {
  "home": { name: "Home", path: "/", container: Main, isExact: true },
};

export const defaultRouteKey = "home";

export type RoutePath = {
  name: string;
  path: string;
  container: React.ComponentType<any>;
  isExact?: boolean;
  onSideMenu?: boolean;
};
