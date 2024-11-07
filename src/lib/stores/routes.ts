export const ROUTES_STORE = {
	ADMIN: {
		BASE: "/admin",
		CUSTOMER: {
			LIST: "/admin/customer",
			NEW: "/admin/customer/newcustomer",
			EDIT: (id: string) => `/admin/customer/${id}`
		},
		MENU: {
			LIST: "/admin/menu",
			NEW: "/admin/menu/newmenu",
			EDIT: (id: string) => `/admin/menu/${id}`
		},
		ORDER: {
			LIST: "/admin/order",
			NEW: "/admin/order/neworder",
			EDIT: (id: string) => `/admin/order/${id}`
		},
		SETTINGS: "/admin/settings"
	},
	CUSTOMER: {
		HOME: "/",
		MENU: "/jidelnicek",
		CART: "/kosik",
		PROFILE: "/profile",
		CONTACT: "/kontakt",
		LOGIN: "/login",
		SIGNUP: "/signup"
	}
} as const;