import Link from "next/link";
import { useRouter } from "next/router";

export const Navbar = () => {
  const { pathname } = useRouter();

  const links = [
    {
      route: "/",
      label: "Home",
    },
    {
      route: "/stored/orders-symbols",
      label: "Orders & Symbols",
    },
    {
      route: "/stored/anaucements",
      label: "Anaucements",
    },
  ];

  return (
    <div className="bg-white h-16 w-full flex justify-center items-center shadow">
      <div className="max-w-7xl w-full p-3 flex justify-between items-center">
        <h3 className="text-xl text-blue-900">Exchange APP</h3>
        <div className="flex space-x-1 items-center transition-all duration-300 ease-in-out">
          {links.map(({ route, label }, index) => (
            <Link
              key={"navbar-link-" + index}
              href={route}
              className={`hover:bg-gray-100 p-3 rounded-lg hover:text-blue-600 ${
                pathname == route ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
